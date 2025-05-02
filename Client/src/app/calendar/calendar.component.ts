import { Component, OutputRefSubscription, ViewChild, computed, inject, signal } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarApi, CalendarOptions, EventApi, EventClickArg, EventInput, EventSourceInput } from '@fullcalendar/core';
import interationPlugin, { DateClickArg } from '@fullcalendar/interaction'
import timeGridWeek from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import rrulePlugin from '@fullcalendar/rrule'
import { EventComponent } from './event/event.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventDialogComponent } from './event-dialog/event-dialog.component';
import { SnackBarService } from '../services/snack-bar.service';
import { EventService } from './event/event.service';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { finalize, forkJoin, map } from 'rxjs';
import { ResizeService } from '../shared/services/resize.service';
import { DialogService } from '../services/dialog.service';
import { EventDutyModel, EventModel } from './event/event.model';
import { PageComponent } from '../shared/components/page/page.component';
import { DutyDialogComponent } from './duty-dialog/duty-dialog.component';
import { DutyComponent } from './duty/duty.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export enum CalendarEventType {
   Event = 'event', 
   Duty = 'duty'
}

@Component({
  selector: 'app-calendar',
  standalone: true,
    imports: [
      FullCalendarModule,
      EventComponent, 
      MatDialogModule,
      PageComponent,
      DutyComponent,
      MatButtonModule,
      MatIconModule
    ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})

export class CalendarComponent {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  resizeService = inject(ResizeService)
  dialogService = inject(DialogService)

  private initialLoadCompleted: boolean = false
  calendarModeView = signal<boolean>(false)

  calendarOptions: CalendarOptions = {
    buttonText:{
      today: 'Сегодня',
      month: 'Месяц',
      week: 'Неделя',
      day: 'День',
      list: 'Список'
    },
    scrollTime: '10:00',
    locale: 'ru-RU',
    timeZone: 'local',
    slotLabelFormat:{
      hour12: false ,
      hour: 'numeric',
      minute:'2-digit',
      omitZeroMinute: false
    },
    dayHeaderFormat: {
      weekday: 'short',
      month: 'short',
      day: 'numeric'},
    titleFormat:{
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    headerToolbar: false,
    eventResizableFromStart: false, 
    eventDurationEditable: false,
    eventOrder: (a, b) => {
      // now a and b are EventApi
      const aFirst = (a as { classNames?: string[] }).classNames?.includes('event-base') ? 0 : 1;
      const bFirst = (b as { classNames?: string[] }).classNames?.includes('event-base') ? 0 : 1;
      return aFirst - bFirst;
    },
    allDaySlot: false,
    initialView: 'timeGridWeek',
    eventStartEditable: false,
    plugins: [rrulePlugin, dayGridPlugin, timeGridWeek, interationPlugin],
    selectable: true,
    editable: true,
    firstDay: 1,
    height: 'calc(100vh - 32px)',
    datesSet: this.handleDateSet.bind(this),
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  }
  events = computed(() => [...this.eventsBase(),...this.eventsDuty()])
  eventsBase = signal<EventInput[]>([])
  eventsDuty = signal<EventInput[]>([])

  calendarApi: CalendarApi;

  constructor(
    private snackBarService: SnackBarService,
    public dialog: MatDialog,
    private eventService: EventService,
    private spinnerService: SpinnerService 
  ){}

  toggleCalendarMode(){
    this.calendarModeView.update(() => !this.calendarModeView())

    const docs = document.querySelectorAll('.fc-event')
    docs.forEach((el: Element) =>{
      el.classList.contains('event-short') ? el.classList.remove('event-short') : el.classList.add('event-short')
    })
  }

  handleDateClick(info: DateClickArg) {
    this.calendarModeView()
      ? this.openDutyDialog(undefined, info.date)
      : this.openEventDialog(undefined, info.date)
  };

  handleDateSet(dateInfo: any){
    if (this.initialLoadCompleted){
      this.spinnerService.loadingOn();
      const events$ = this.eventService.getEventsByPeriod(dateInfo.startStr, dateInfo.endStr)
        .pipe(
          map((events: EventModel[]) => events.map(event => this.getEvent(event)))
        )
      const eventsDuty$ = this.eventService.getEventsDutyByPeriod(dateInfo.startStr, dateInfo.endStr)
        .pipe(
          map((events: EventDutyModel[]) => events.map(event => this.getDutyEvent(event)))
        )
      
      forkJoin({events: events$, eventsDuty: eventsDuty$})
        .pipe(finalize(() => this.spinnerService.loadingOff()))
        .subscribe((result) =>{
          this.eventsBase.set(result.events)
          this.eventsDuty.set(result.eventsDuty)
        })
    }
    this.initialLoadCompleted = true
  }

  handleEventClick(info: EventClickArg){
    info.event.extendedProps['calendarEventType'] == CalendarEventType.Event.toString()
    ? this.openEventDialog(info.event.id)
    : this.openDutyDialog(info.event.id, info.event.start!)
  }

  ngAfterViewInit(){
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.refetchEvents()
    this.resizeService.resize$.subscribe((result: boolean) =>{
      result ?
        this.calendarApi.changeView('timeGrid')
        : this.calendarApi.changeView('timeGridWeek')
    })
  }

  clickNext(){
    this.calendarApi.next()
  }
  clickPrev(){
    this.calendarApi.prev()
  }
  clickToday(){
    this.calendarApi.today()
  }

  private openDutyDialog(eventId?: string, startDateTime?: Date){
    const dialogRef = this.dialogService.showDialog(DutyDialogComponent, {id: eventId, startDateTime: startDateTime})

    const subscriptions: OutputRefSubscription[] = []
    dialogRef.afterOpened().subscribe(() =>{
      const eventComponent = dialogRef.componentInstance.componentRef.instance
      subscriptions.push(eventComponent.eventDutyDeleted.subscribe((result: string) =>{
        this.deleteEvent(result)
        this.calendarApi.refetchEvents()
      }))
    })
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        var ev = this.calendarApi.getEventById(result.id)
        ev?.remove()
        this.calendarApi.addEvent(this.getDutyEvent(result))
      }
      subscriptions.forEach(x => x.unsubscribe())
    })
  }



  private openEventDialog(id?: string, startDateTime?: Date){
    const dialogRef = this.dialogService.showDialog(EventDialogComponent,
      { 
        startDateTime: startDateTime,
        id: id 
      })
  
      const subscriptions: OutputRefSubscription[] = []
      dialogRef.afterOpened().subscribe(() => {
        const eventComponent = dialogRef.componentInstance.componentRef.instance
        subscriptions.push(eventComponent.eventSaved.subscribe((events: EventModel[]) =>{
          events.forEach(event => this.saveEvent(event))
          this.snackBarService.success('Событие сохранено')
          this.calendarApi.refetchEvents()
      }))
  
      subscriptions.push(eventComponent.eventDeleted.subscribe((ids: string[]) => {
        ids.forEach(id => this.deleteEvent(id))
        this.snackBarService.success('Событие удалено')
        this.calendarApi.refetchEvents()
      }))
      })
      
  
      dialogRef.afterClosed().subscribe(() => subscriptions.forEach((sub) => sub.unsubscribe()))
  }

  private saveEvent(event: EventModel){
    var ev = this.calendarApi.getEventById(event.id)
    ev?.remove()
    this.calendarApi.addEvent(this.getEvent(event))
  }

  private deleteEvent(id: string){
    var ev = this.calendarApi.getEventById(id)
    ev?.remove()
  }

  private getEvent(eventData: EventModel) : EventInput{
    var event: EventInput = {}
    event.title = eventData.name
    event.extendedProps =  { 
      groupId: eventData.group?.id,
      groupName: eventData.group?.name,
      coachId: eventData.coach?.id,
      coachName: eventData.coach?.name,
      exceptDates: eventData.recurrence?.exceptdates,
      recurrencyStartDate: eventData.recurrence?.startDate,
      recurrencyEndDate: eventData.recurrence?.endDate,
      daysOfWeek: eventData.recurrence?.daysOfWeek, 
      recurrenceId: eventData.recurrence?.id,
      color: eventData.color,
      eventType: eventData.eventType,
      calendarEventType: CalendarEventType.Event,
    }
    event.id = eventData.id
    event.color = 'transparent'
    event.start = eventData.startDateTime
    event.end = eventData.endDateTime,
    event.className = 'event-base'
    return event
  }

  private getDutyEvent(eventDuty: EventDutyModel) : EventInput{
    var event: EventInput = {}
    event.title = eventDuty.name
    event.id = eventDuty.id
    event.color = 'transparent'
    event.start = eventDuty.startDateTime
    event.end = eventDuty.endDateTime
    event.classNames = ['event-duty', this.calendarModeView() == false ? 'event-short' : '']
    event.extendedProps = {
      calendarEventType: CalendarEventType.Duty,
      color: eventDuty.color
    }

    return event
  }
}
