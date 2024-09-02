import { Component, effect, inject, input } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addHours, getFormattedTime, getHalfHourIntervals, setTimeFromStringToDate } from '../../shared/helpers/time-helper';
import { Group } from '../../shared/models/group-model';
import { GroupService } from '../../groups/group.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from '../../shared/dialog/confirmation-dialog/confirmation-dialog.component';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import { CustomDateAdapter } from '../../shared/adapters/custom.date.adapter';
import { DeleteDialogComponent, DeleteResult } from '../delete-dialog/delete-dialog.component';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { finalize, forkJoin, of } from 'rxjs';
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
import { EventModel } from '../event/event.model';

export interface EventDialogData{
  id: string
  startDateTime: string
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
    MatIconModule,
    DatePipe ],
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
  disableRecur: boolean;
  pickerStart: Date;
  pickerEnd: Date;
  color: string;
  isColorSelectorOpen: boolean = false;

  groupParticipantsCount: number = 0;
  participantsCount: number = 0;
  onetimeVisitorsCount: number = 0;

  initialEvent: EventModel;

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

  date: Date;

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    private groupService: GroupService,
    private spinnerService: SpinnerService,
    private eventService: EventService,
    private recurrenceService: RecurrenceService,
  ){
    effect(() => {
      var request = this.data()?.id ? this.eventService.getEventById(this.data()?.id) : of(new EventModel)
      request
        .pipe(
          finalize(() => this.init())
        )
        .subscribe(result => {
          if(result){
            this.initialEvent = result
        }})
    })
  }

  init(){
    this.color = this.initialEvent.color ?? 'teal';

    forkJoin({
      group: this.initialEvent?.group?.id ? this.groupService.getGroupById(this.initialEvent.group?.id as string) : of(null),
      groups: this.groupService.getGoups(true)
    }).subscribe(result =>{
      this.groups = result.groups
      
      if(result.group){
        this.groups = [result.group]
        this.group.setValue(result.group)
        this.group.disable()
        this.refetchGroupMembersCount();
        this.refetchParticipants();
      }
    })
    

  this.coachService.getCoaches()
    .subscribe((coaches: CoachModel[]) => {
      this.coaches = coaches
      this.coach?.setValue(this.coaches.find(x => x.id === this.initialEvent?.coach?.id) as CoachModel)
    })

  if(this.initialEvent?.id)
    this.refetchOnetimeVisitorsCount()

  this.date = this.initialEvent.startDateTime ?? new Date(this.data().startDateTime)

  this.name.setValue(this.initialEvent?.name)
  this.start?.setValue(getFormattedTime(this.initialEvent?.startDateTime ?? this.data().startDateTime))
  this.initialEvent?.endDateTime
    ? this.end?.setValue(getFormattedTime(this.initialEvent?.endDateTime))
    :  this.end?.setValue(getFormattedTime(addHours(this.date, 1)))

  this.isRecur?.setValue(!!(this.initialEvent?.recurrence?.startDate));
  if (this.isRecur?.value || this.initialEvent?.id){
    this.isRecur?.disable();

    this.recurStart?.disable();
    this.recurEnd?.disable();
    this.weekdays?.disable();
    this.recurStart?.setValue(this.initialEvent?.recurrence?.startDate as Date)
    this.recurEnd?.setValue(this.initialEvent?.recurrence?.endDate as Date)
    this.weekdays?.setValue(this.initialEvent?.recurrence?.daysOfWeek?.map(x => WEEKDAYS.find(y => y.number == x)) as Weekday[])
    }
  }

  submit(): void{
    if (this.validateDates() && this.validateWeekdaysNotEmpty())
    {
      var result: EventResult = {action: 'save'}
      var gr = new Group()
      gr.id = this.group.value?.id as string

      const data: EventModel = {
        id: this.initialEvent?.id ,
        startDateTime: setTimeFromStringToDate(this.date, this.start?.value as string),
        endDateTime: setTimeFromStringToDate(this.date, this.end?.value as string),
        name: this.name?.value as string,
        group: gr,
        color: this.color,
        coach: { id: (this.coach?.value as CoachModel)?.id as string },
        eventType: 0
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
          eventName: this.initialEvent?.name
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
          message: 'Вы уверены что хотите удалить событие: ' + this.initialEvent?.name
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
      eventDate: this.initialEvent.startDateTime,
      group: this.group.value}
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
    this.eventService.getParticipantsCount(this.initialEvent?.id).subscribe(
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
