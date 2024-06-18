import { Component, Inject, inject, output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addHours, getFormattedTime, getHalfHourIntervals, setTimeFromStringToDate } from '../../shared/helpers/time-helper';
import { Group } from '../../shared/models/group-model';
import { GroupService } from '../../groups/group.service';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from '../../shared/dialog/confirmation-dialog/confirmation-dialog.component';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import { CustomDateAdapter } from '../../shared/adapters/custom.date.adapter';
import { DeleteDialogComponent, DeleteResult } from '../delete-dialog/delete-dialog.component';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { finalize } from 'rxjs';
import { EventService } from '../event/event.service';
import { Guid } from 'typescript-guid';
import {OverlayModule} from '@angular/cdk/overlay';
import { PaletteComponent } from '../../shared/components/palette/palette.component';
import { RecurrenceService } from '../recurrence/recurrence.service';
import { ParticipantsDialogService } from '../participants-dialog/participants-dialog.service';
import { MatIconModule } from '@angular/material/icon';
import { GroupDialogService } from '../../groups/group-dialog/group-dialog.service';
import { OnetimeVisitorDialogService } from '../onetime-visitor-dialog/onetime-visitor-dialog.service';
import { CoachModel } from '../../shared/models/coach-model';
import { CoachService } from '../../coaches/coach.service';

export interface EventModel{
  id: string,
  startDateTime: Date;
  endDateTime: Date;
  name: string;
  color?: string;
  group?: Group;
  recurrence?: Recurrence
  coach?: CoachModel
}

export interface Recurrence{
  exceptdates?: string[];
  startDate: Date;
  endDate: Date;
  daysOfWeek: number[];
  id: string; 
}

export interface EventResult{
  action?: 'save'| 'delete' | 'deleteOne'
  events?: EventModel[] | string[]
}

export interface Weekday{
  number: number;
  name: string;
}

const WEEKDAYS: Weekday[] = [
  { number: 1, name: 'Понедельник'},
  { number: 2, name: 'Вторник'},
  { number: 3, name: 'Среда'},
  { number: 4, name: 'Четверг'},
  { number: 5, name: 'Пятница'},
  { number: 6, name: 'Суббота'},
  { number: 0, name: 'Воскресенье'},
]

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, 
    MatDialogModule, 
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    ConfirmationDialogComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    OverlayModule,
    PaletteComponent,
    MatIconModule ],
  templateUrl: './event-dialog.component.html',
  styleUrl: './event-dialog.component.scss',
  providers:[
    GroupService,
    ParticipantsDialogService,
    OnetimeVisitorDialogService,
    GroupDialogService,
    CoachService,
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: CustomDateAdapter}
  ]
})
export class EventDialogComponent {
  timeOptions: string[] = getHalfHourIntervals();
  weekDaysList: Weekday[] = WEEKDAYS;
  groups: Group[];
  coaches: CoachModel[]
  day: string;
  disableRecur: boolean;
  isNew: boolean = false;
  pickerStart: Date;
  pickerEnd: Date;
  color: string;
  isColorSelectorOpen: boolean = false;

  groupParticipantsCount: number = 0;
  participantsCount: number = 0;
  onetimeVisitorsCount: number = 0;

  onetimeVisitorDialogService = inject(OnetimeVisitorDialogService)

  private initialEvent: EventModel;

  public eventForm: FormGroup; 
  public get name() { return this.eventForm.get('name')}
  public get start() { return this.eventForm.get('start')}
  public get end() { return this.eventForm.get('end')}
  public get group() { return this.eventForm.get('group') }
  public get weekdays() { return this.eventForm.get('weekdays')}
  public get isRecur() { return this.eventForm.get('isRecur')}
  public get recurStart() { return this.eventForm.get('recurStart')}
  public get recurEnd() { return this.eventForm.get('recurEnd')}
  public get coach() { return this.eventForm.get('coach')}

  coachService = inject(CoachService)

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    public dialog: MatDialog,
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    private spinnerService: SpinnerService,
    private eventService: EventService,
    private recurrenceService: RecurrenceService,
    private participantsDialogService: ParticipantsDialogService,
    private groupDialogService: GroupDialogService,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, event: EventModel}
  ){}

  ngOnInit(){
    this.initialEvent = this.data.event;
    this.color = this.data.event.color ?? 'teal';
    this.isNew = !Guid.isGuid(this.initialEvent.id)
    this.eventForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      start: new FormControl(null, [Validators.required]),
      end: new FormControl(null, [Validators.required]),
      group: new FormControl(null),
      weekdays: new FormControl(null),
      isRecur: new FormControl({disabled: true }),
      recurStart: new FormControl(null),
      recurEnd: new FormControl(null),
      coach: new FormControl()
    },
  {
    validators: [
      this.validateDates(), 
      this.validateWeekdaysNotEmpty()]
  });

  this.groupService.getGoups()
    .subscribe((groups: Group[]) =>{
      this.groups = groups
      this.group?.setValue(this.groups.find(x => x.id === this.data.event.group?.id))
  });
  if(this.data.event.group?.id !== undefined){
    this.group?.disable();
    this.refetchGroupMembersCount();
    this.refetchParticipants();
  }

  this.coachService.getCoaches()
    .subscribe((coaches: CoachModel[]) => {
      this.coaches = coaches
      this.coach?.setValue(this.coaches.find(x => x.id === this.data.event.coach?.id))
    })

  if(!this.isNew)
    this.refetchOnetimeVisitorsCount()

  this.data.event.name ? this.name?.setValue(this.data.event.name) : ''
  this.start?.setValue(getFormattedTime(this.data.event.startDateTime))
  this.data.event.endDateTime
    ? this.end?.setValue(getFormattedTime(this.data.event.endDateTime))
    :  this.end?.setValue(getFormattedTime(addHours(this.data.event.startDateTime, 1)))

  this.day = this.data.event.startDateTime.toLocaleDateString('ru-RU');
  this.isRecur?.setValue(!!this.data.event.recurrence?.startDate);
  if (this.isRecur?.value || !this.isNew){
    this.isRecur?.disable();

    this.recurStart?.disable();
    this.recurEnd?.disable();
    this.weekdays?.disable();
    this.recurStart?.setValue(this.data.event.recurrence?.startDate)
    this.recurEnd?.setValue(this.data.event.recurrence?.endDate)
    this.weekdays?.setValue(this.data.event.recurrence?.daysOfWeek?.map(x => WEEKDAYS.find(y => y.number == x)))
    }
  }

  submit(): void{
    if (this.eventForm.valid)
    {
      var start = new Date(this.data.event.startDateTime);
      var end = new Date(this.data.event.startDateTime);

      var result: EventResult = {action: 'save'}
      const data: EventModel = {
        id: this.initialEvent.id ?? Guid.EMPTY.toString(),
        startDateTime: setTimeFromStringToDate(start, this.start?.value),
        endDateTime: setTimeFromStringToDate(end, this.end?.value),
        name: this.name?.value,
        group: { id: (this.group?.value as Group)?.id },
        color: this.color,
        coach: { id: (this.coach?.value as CoachModel)?.id }
      }
      if (this.isRecur?.value){
        data.recurrence = {
          daysOfWeek: this.weekdays?.value.map((x : Weekday) => x.number),
          exceptdates: this.initialEvent.recurrence?.exceptdates,
          startDate: this.recurStart?.value,
          endDate: this.recurEnd?.value,
          id: this.initialEvent.recurrence?.id ?? Guid.EMPTY.toString()
        }
      }
      this.spinnerService.loadingOn();
      this.eventService.saveEvent(data)
        .pipe(
          finalize(() => this.spinnerService.loadingOff())
        )
        .subscribe((events: EventModel[]) => {
          result.events = events
          this.dialogRef.close(result)
        })
    }
  }

  changeIsRecur(isRecur: boolean){
    this.isRecur?.setValue(isRecur);
  }

  onCloseClick(): void{
    this.dialogRef.close()
  }

  onDelete(): void{
    if (this.isRecur?.value){
      var deleteDialog = this.dialog.open(DeleteDialogComponent, {data: { message: 'Удалить все повторения или экземпляр?', eventName: this.data.event.name}})
      deleteDialog.afterClosed().subscribe((result: DeleteResult) =>{
          if (result?.delete == 'all'){
            var recurrToDelete = this.initialEvent.recurrence?.id ?? '';
            this.recurrenceService.deleteRecurrence(recurrToDelete).subscribe((eventIdsToDelete: string[]) => {
              var action : EventResult = {action : 'delete', events: eventIdsToDelete}
              this.dialogRef.close(action)
            })
          }
          if (result?.delete == 'one'){
            var event = this.initialEvent
            this.eventService.deleteEvent(event).subscribe(() => {
              var action : EventResult = {action : 'deleteOne', events: [event.id]}
              this.dialogRef.close(action)
            })
            
          }
      })
    }
    else{
      var confDialogRef = this.dialog.open(ConfirmationDialogComponent, {data: {message: 'Вы уверены что хотите удалить событие: ' + this.data.event.name}})
      confDialogRef.afterClosed().subscribe((result) => {
        if (result == true){
          this.eventService.deleteEvent(this.initialEvent).subscribe(() =>{
            var action : EventResult = {action : 'deleteOne', events: [this.initialEvent]}
            this.dialogRef.close(action)
          })
        }
      })
    }
  }

  onParticipantsClick(){
    this.participantsDialogService.showParticipantsDialog(this.initialEvent.id, this.initialEvent.group)
      .afterClosed().subscribe(() => this.refetchParticipants())
  }

  colorSelected(color: string){
    this.color = color;
    this.isColorSelectorOpen = false;
  }

  onEditGroupClick(){
    this.groupDialogService.showGroupDialog(this.group?.value.name, this.group?.value)
      .afterClosed().subscribe(() => this.refetchGroupMembersCount())
  }

  onOnetimeVisitorsClick(){
    this.onetimeVisitorDialogService.showOnetimeVisitorsDialog(this.initialEvent.id)
      .afterClosed().subscribe(() => this.refetchOnetimeVisitorsCount())
  }

  private validateDates(){
    return (form: FormGroup) => {
        const start = form.get('start')?.value;
        const end = form.get('end')?.value;

        var timeArray: string[] = getHalfHourIntervals();

        const startIndex = timeArray.indexOf(start);
        const endIndex = timeArray.indexOf(end);
        
        const error = 
          endIndex > startIndex ? null : { InvalidInput: true }
        
        form.get('end')?.setErrors(error);
        return error;
      }
  }

  private validateWeekdaysNotEmpty(){
    return (form: FormGroup) => {
      const isRecur = form.get('isRecur')?.value  
      const weekdays = form.get('weekdays')?.value

      const error = 
           !isRecur || weekdays?.length > 0 ? null : { InvalidInput: true }
      form.get('weekdays')?.setErrors(error);
      return error;
      }
  }

  private refetchParticipants(){
    this.eventService.getParticipantsCount(this.data.event.id).subscribe(
      (result: number) =>{
        this.participantsCount = result;
      }
    );
  }

  private refetchGroupMembersCount(){
    this.groupService.getGroupMembersCount(this.initialEvent.group?.id as string)
      .subscribe((result: number) =>{
        this.groupParticipantsCount = result;
      })
  }

  private refetchOnetimeVisitorsCount(){
    this.eventService.getOnetimeVisitorsCount(this.initialEvent.id)
      .subscribe((result: number) =>{
        this.onetimeVisitorsCount = result;
      })
  }
}
