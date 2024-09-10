import { Component, effect, inject, input, output, signal } from '@angular/core';
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
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from '../../shared/dialog/confirmation-dialog/confirmation-dialog.component';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import { CustomDateAdapter } from '../../shared/adapters/custom.date.adapter';
import { DeleteDialogComponent, DeleteResult } from '../delete-dialog/delete-dialog.component';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { finalize, forkJoin, Observable, of } from 'rxjs';
import { EventRequestModel, EventService } from '../event/event.service';
import { Guid } from 'typescript-guid';
import {OverlayModule} from '@angular/cdk/overlay';
import { PaletteComponent } from '../../shared/components/palette/palette.component';
import { RecurrenceService } from '../recurrence/recurrence.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { CoachModel } from '../../shared/models/coach-model';
import { CoachService } from '../../coaches/coach.service';
import { DialogService } from '../../services/dialog.service';
import { ParticipantsDialogComponent } from '../participants-dialog/participants-dialog.component';
import { GroupDialogComponent } from '../../groups/group-dialog/group-dialog.component';
import { OnetimeVisitorDialogComponent } from '../onetime-visitor-dialog/onetime-visitor-dialog.component';
import { EventCoachSubstitutionModel, EventModel, EventType } from '../event/event.model';
import { RentClientComponent } from './rent-client/rent-client.component';
import { OnetimeVisitorModel } from '../../shared/models/onetime-visitor-model';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CoachSubstitutionComponent } from './coach-substitution/coach-substitution.component';

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
    DatePipe,
    MatButtonToggleModule,
    SpinnerComponent,
    RentClientComponent,
    CoachSubstitutionComponent,
    AsyncPipe ],
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
  title = signal<string>('Новое событие')
  coach : CoachModel | undefined

  timeOptions: string[] = getHalfHourIntervals();
  weekDaysList: Weekday[] = WEEKDAYS;
  groups: Group[];
  disableRecur: boolean;
  pickerStart: Date;
  pickerEnd: Date;
  color: string;
  isColorSelectorOpen: boolean = false;
  

  groupParticipantsCount: number = 0;
  participantsCount: number = 0;
  onetimeVisitorsCount: number = 0;

  initialEvent: EventModel | null;

  name = new FormControl<string>('', [Validators.required])
  start =  new FormControl<string>('', [Validators.required])
  end = new FormControl<string>('', [Validators.required])
  group = new FormControl<string | null>(null)
  weekdays = new FormControl<Weekday[]>([])
  isRecur = new FormControl<boolean>(false)
  recurStart = new FormControl<Date | null>(null)
  recurEnd = new FormControl<Date | null>(null)

  eventType = new FormControl<EventType>(EventType.Event)
  eventTypes = EventType

  substitution$ : Observable<EventCoachSubstitutionModel> 
  coaches$: Observable<CoachModel[]>
  coachId: string

  dialogService = inject(DialogService)
  eventService = inject(EventService)
  coachService = inject(CoachService)

  data = input.required<EventDialogData>()

  date: Date;

  eventSaved = output<EventModel[]>()
  eventDeleted = output<string[]>()

  isLoading : boolean = true


  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    private groupService: GroupService,
    private spinnerService: SpinnerService,
    private recurrenceService: RecurrenceService,
  ){

    effect(() => {
      var request = this.data()?.id ? this.eventService.getEventById(this.data()?.id) : of(new EventModel)
      request
        .pipe(
          finalize(() => {
            this.init()
            this.isLoading = false
        }))
        .subscribe(result => {
          if(result){
            this.initialEvent = result
        }})
    })
  }

  init(){
    if(this.initialEvent?.name){
      this.title.set(this.initialEvent?.name as string)
    }

    this.coach = this.initialEvent?.coach
    this.substitution$ = this.eventService.getCoachSubstitution(this.initialEvent?.id as string)
    this.coaches$ = this.coachService.getCoaches()

    this.color = this.initialEvent?.color ?? 'teal';
    this.eventType.setValue(this.initialEvent?.eventType ?? EventType.Event)
    if(this.initialEvent?.id){
      this.eventType.disable()
    }    

    this.groupService.getGoups(true).subscribe((options) => {
      this.groups = options
      const value = options.find(o => o.id == this.initialEvent?.group?.id)?.id
      this.group.setValue(value as string)
      if(this.group.value){
        this.group.disable()
        this.refetchGroupMembersCount()
      }
    })

  if(this.initialEvent?.id)
  {
    this.refetchOnetimeVisitorsCount()
    this.refetchParticipantsCount()
  }

  this.date = this.initialEvent?.startDateTime ?? new Date(this.data().startDateTime)

  this.name.setValue(this.initialEvent?.name as string)
  this.start?.setValue(getFormattedTime(this.initialEvent?.startDateTime as Date ?? this.data().startDateTime))
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
    if (this.validateDates() && this.validateWeekdaysNotEmpty() && this.name.valid)
    {
      const data: EventRequestModel = {
        id: this.initialEvent?.id as string,
        startDateTime: setTimeFromStringToDate(this.date, this.start?.value as string),
        endDateTime: setTimeFromStringToDate(this.date, this.end?.value as string),
        name: this.name?.value as string,
        groupId: this.group.value as string,
        color: this.color,
        coachId: this.coachId ?? this.initialEvent?.coach?.id,
        eventType: this.eventType.value as EventType,
        isRecurrent: this.isRecur.value as boolean
      }
      if (this.isRecur?.value){
          data.daysOfWeek = (this.weekdays?.value as Weekday[]).map((x : Weekday) => x.number),
          data.exceptDates = this.initialEvent?.recurrence?.exceptdates,
          data.recurrencyStartDate = this.recurStart?.value as Date,
          data.recurrencyEndDate = this.recurEnd?.value as Date,
          data.recurrenceId = this.initialEvent?.recurrence?.id ?? Guid.EMPTY.toString()
        }
      
      this.spinnerService.loadingOn();
      this.eventService.saveEvent(data)
        .pipe(
          finalize(() => this.spinnerService.loadingOff())
        )
        .subscribe((events: EventModel[]) => {
          if(events){
            this.eventSaved.emit(events)
            if(events.length == 1){
              this.initialEvent = events[0]
              this.init()
            }
            else {
              this.dialogRef.close()
            }
          }
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
      var deleteDialog = this.dialogService.showDialog(DeleteDialogComponent, 
        { 
          message: 'Удалить все повторения или экземпляр?', 
          eventName: this.initialEvent?.name
        })
      deleteDialog.afterClosed().subscribe((result: DeleteResult) =>{
          if (result?.delete == 'all'){
            var recurrToDelete = this.initialEvent?.recurrence?.id ?? '';
            this.recurrenceService.deleteRecurrence(recurrToDelete).subscribe((eventIdsToDelete: string[]) => {
              this.eventDeleted.emit(eventIdsToDelete)
              this.dialogRef.close()
            })
          }
          if (result?.delete == 'one'){
            var event = this.initialEvent as EventModel
            this.eventService.deleteEvent(event).subscribe(() => {
              this.eventDeleted.emit([event.id])
              this.dialogRef.close()
            })
            
          }
      })
    }
    else{
      var confDialogRef = this.dialogService.showDialog(ConfirmationDialogComponent,
        {
          message: 'Вы уверены что хотите удалить событие: ' + this.initialEvent?.name
        })
      confDialogRef.afterClosed().subscribe((result) => {
        if (result == true){
          this.eventService.deleteEvent(this.initialEvent as EventModel).subscribe(() =>{
            this.eventDeleted.emit([this.initialEvent?.id as string])
            this.dialogRef.close()
          })
        }
      })
    }
  }

  onParticipantsClick(){
    this.dialogService.showDialog(ParticipantsDialogComponent, {
      eventId: this.initialEvent?.id,
      eventDate: this.initialEvent?.startDateTime,
      group: this.group.value}
    )
      .afterClosed().subscribe(() => this.refetchParticipantsCount())
  }

  colorSelected(color: string){
    this.color = color;
    this.isColorSelectorOpen = false;
  }

  onEditGroupClick(){
    this.dialogService.showDialog(GroupDialogComponent, { id: this.initialEvent?.group?.id as string })
      .afterClosed().subscribe(() => this.refetchGroupMembersCount())
  }

  onOnetimeVisitorsClick(){
    this.dialogService.showDialog(OnetimeVisitorDialogComponent, { eventId: this.initialEvent?.id })
      .afterClosed().subscribe(() => this.refetchOnetimeVisitorsCount())
  }

  onCoachChange(coachId: string){
    this.coachId = coachId
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

  private refetchParticipantsCount(){
    this.eventService.getParticipantsCount(this.initialEvent?.id as string).subscribe(
      (result: number) =>{
        this.participantsCount = result;
      }
    );
  }

  private refetchGroupMembersCount(){
    this.groupService.getGroupMembersCount(this.group?.value as string)
      .subscribe((result: number) =>{
        this.groupParticipantsCount = result;
      })
  }

  private refetchOnetimeVisitorsCount(){
    this.eventService.getOnetimeVisitorsCount(this.initialEvent?.id as string)
      .subscribe((result: number) =>{
        this.onetimeVisitorsCount = result;
      })
  }
}
