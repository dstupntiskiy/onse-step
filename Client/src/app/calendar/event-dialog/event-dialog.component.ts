import { Component, Inject, effect, inject, input, output } from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import { CoachModel } from '../../shared/models/coach-model';
import { CoachService } from '../../coaches/coach.service';
import { DialogService } from '../../services/dialog.service';
import { ParticipantsDialogComponent } from '../participants-dialog/participants-dialog.component';
import { GroupDialogComponent } from '../../groups/group-dialog/group-dialog.component';
import { OnetimeVisitorDialogComponent } from '../onetime-visitor-dialog/onetime-visitor-dialog.component';
import { StyleModel } from '../../shared/models/style-model';

export interface EventDialogData{
  event: EventModel
}

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

  private initialEvent: EventModel;

  name = new FormControl<string>('', [Validators.required])
  start =  new FormControl<string>('', [Validators.required])
  end = new FormControl<string>('', [Validators.required])
  group = new FormControl<Group | null>(null)
  weekdays = new FormControl<Weekday[]>([])
  isRecur = new FormControl<boolean>(false)
  recurStart = new FormControl<Date | null>(null)
  recurEnd = new FormControl<Date | null>(null)
  coach = new FormControl<CoachModel | null>(null)

  coachService = inject(CoachService)
  dialogService = inject(DialogService)
  data = input.required<EventDialogData>()

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    private groupService: GroupService,
    private spinnerService: SpinnerService,
    private eventService: EventService,
    private recurrenceService: RecurrenceService,
  ){
    effect(() => {
      this.init()
    })
  }

  init(){
    this.initialEvent = this.data().event;
    this.color = this.data().event.color ?? 'teal';
    this.isNew = !Guid.isGuid(this.initialEvent.id)

    if(this.data().event.group?.id){
      this.groupService.getGroupById(this.data().event.group?.id as string)
        .subscribe((result: Group) => {
          if(result){
            this.groups = [result]
            this.group.setValue(result)
            this.group.disable()
            this.refetchGroupMembersCount();
            this.refetchParticipants();
          }
        })
    }
    else{
      this.groupService.getGoups(true)
      .subscribe((groups: Group[]) =>{
        this.groups = groups
      })
    }

  this.coachService.getCoaches()
    .subscribe((coaches: CoachModel[]) => {
      this.coaches = coaches
      this.coach?.setValue(this.coaches.find(x => x.id === this.data().event.coach?.id) as CoachModel)
    })

  if(!this.isNew)
    this.refetchOnetimeVisitorsCount()

  this.data().event.name ? this.name?.setValue(this.data().event.name) : ''
  this.start?.setValue(getFormattedTime(this.data().event.startDateTime))
  this.data().event.endDateTime
    ? this.end?.setValue(getFormattedTime(this.data().event.endDateTime))
    :  this.end?.setValue(getFormattedTime(addHours(this.data().event.startDateTime, 1)))

  this.day = this.data().event.startDateTime.toLocaleDateString('ru-RU');
  this.isRecur?.setValue(!!(this.data().event.recurrence?.startDate));
  if (this.isRecur?.value || !this.isNew){
    this.isRecur?.disable();

    this.recurStart?.disable();
    this.recurEnd?.disable();
    this.weekdays?.disable();
    this.recurStart?.setValue(this.data().event.recurrence?.startDate as Date)
    this.recurEnd?.setValue(this.data().event.recurrence?.endDate as Date)
    this.weekdays?.setValue(this.data().event.recurrence?.daysOfWeek?.map(x => WEEKDAYS.find(y => y.number == x)) as Weekday[])
    }
  }

  submit(): void{
    if (this.validateDates() && this.validateWeekdaysNotEmpty())
    {
      var start = new Date(this.data().event.startDateTime);
      var end = new Date(this.data().event.startDateTime);

      var result: EventResult = {action: 'save'}
      const data: EventModel = {
        id: this.initialEvent.id ?? Guid.EMPTY.toString(),
        startDateTime: setTimeFromStringToDate(start, this.start?.value as string),
        endDateTime: setTimeFromStringToDate(end, this.end?.value as string),
        name: this.name?.value as string,
        group: { id: (this.group?.value as Group)?.id, active: true, name: '', style: new StyleModel() },
        color: this.color,
        coach: { id: (this.coach?.value as CoachModel)?.id as string }
      }
      if (this.isRecur?.value){
        data.recurrence = {
          daysOfWeek: (this.weekdays?.value as Weekday[]).map((x : Weekday) => x.number),
          exceptdates: this.initialEvent.recurrence?.exceptdates,
          startDate: this.recurStart?.value as Date,
          endDate: this.recurEnd?.value as Date,
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
      var deleteDialog = this.dialogService.showDialog(DeleteDialogComponent, 'Удаление', 
        { 
          message: 'Удалить все повторения или экземпляр?', 
          eventName: this.data().event.name
        })
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
      var confDialogRef = this.dialogService.showDialog(ConfirmationDialogComponent, 'Удаление',
        {
          message: 'Вы уверены что хотите удалить событие: ' + this.data().event.name
        })
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
    this.dialogService.showDialog(ParticipantsDialogComponent, 'Участники', {
      eventId: this.initialEvent.id, 
      group: this.initialEvent.group}
    )
      .afterClosed().subscribe(() => this.refetchParticipants())
  }

  colorSelected(color: string){
    this.color = color;
    this.isColorSelectorOpen = false;
  }

  onEditGroupClick(){
    this.dialogService.showDialog(GroupDialogComponent, (this.group?.value?.name), { id: this.group?.value?.id as string })
      .afterClosed().subscribe(() => this.refetchGroupMembersCount())
  }

  onOnetimeVisitorsClick(){
    this.dialogService.showDialog(OnetimeVisitorDialogComponent, 'Разовые посещения', { eventId: this.initialEvent.id })
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
    this.eventService.getParticipantsCount(this.data().event.id).subscribe(
      (result: number) =>{
        this.participantsCount = result;
      }
    );
  }

  private refetchGroupMembersCount(){
    this.groupService.getGroupMembersCount(this.group?.value?.id as string)
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
