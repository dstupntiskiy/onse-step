import { Component, OutputRefSubscription, ViewChild, inject } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarApi, CalendarOptions, DateInput, DateRangeInput, EventClickArg, EventInput } from '@fullcalendar/core';
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
import { finalize, map } from 'rxjs';
import { ResizeService } from '../shared/services/resize.service';
import { DialogService } from '../services/dialog.service';
import { EventModel } from './event/event.model';
import { PageComponent } from '../shared/components/page/page.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
    imports: [
      FullCalendarModule,
      EventComponent, 
      MatDialogModule,
      PageComponent
    ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})

export class CalendarComponent {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  resizeService = inject(ResizeService)
  dialogService = inject(DialogService)

  private initialLoadCompleted: boolean = false

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
  events: EventInput[]

  calendarApi: CalendarApi;

  constructor(
    private snackBarService: SnackBarService,
    public dialog: MatDialog,
    private eventService: EventService,
    private spinnerService: SpinnerService 
  ){}

  handleDateClick(info: DateClickArg) {
    this.openEventDialog(undefined, info.date)
  };

  handleDateSet(dateInfo: any){
    if (this.initialLoadCompleted){
      this.spinnerService.loadingOn();
      this.eventService.getEventsByPeriod(dateInfo.startStr, dateInfo.endStr)
      .pipe(
        finalize(() => this.spinnerService.loadingOff()),
        map((events: EventModel[]) => events.map(event => this.getEvent(event)))
      )
      .subscribe(x => this.events = x)
    }
    this.initialLoadCompleted = true
  }

  handleEventClick(info: EventClickArg){
    this.openEventDialog(info.event.id)
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
      eventType: eventData.eventType
    }
    event.id = eventData.id
    event.color = 'white'
    event.start = eventData.startDateTime
    event.end = eventData.endDateTime

    return event
  }
}
