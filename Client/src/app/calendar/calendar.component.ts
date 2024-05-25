import { Component, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarApi, CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import { CalendarService } from './calendar.service';
import interationPlugin, { DateClickArg } from '@fullcalendar/interaction'
import timeGridWeek from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import rrulePlugin from '@fullcalendar/rrule'
import { EventComponent } from './event/event.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventDialogComponent, EventModel, EventResult } from './event-dialog/event-dialog.component';
import { SnackBarService } from '../services/snack-bar.service';
import { EventService } from './event/event.service';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { finalize, map } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
    imports: [FullCalendarModule,
      EventComponent, MatDialogModule
    ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})

export class CalendarComponent {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    buttonText:{
      today: 'Сегодня',
      month: 'Месяц',
      week: 'Неделя',
      day: 'День',
      list: 'Список'
    },
    scrollTime: '08:00',
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
    allDaySlot: false,
    initialView: 'timeGridWeek',
    eventStartEditable: false,
    plugins: [rrulePlugin, dayGridPlugin, timeGridWeek, interationPlugin],
    selectable: true,
    editable: true,
    firstDay: 1,

    height: 'calc(100vh - 32px)',
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
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: { 
        title: 'Новое Событие', 
        event: {
          startDateTime: info.date, 
          isRecurrent: false},
          id: ''}
    });

    dialogRef.afterClosed().subscribe((result: EventResult) => {
      if (result && result.events){
          result.events?.forEach(ev => {
            var event = this.getEvent(ev as EventModel)
            this.calendarApi.addEvent(event);
          })
        
        this.snackBarService.success('Событие создано')
      }
    })
  };

  handleEventClick(info: EventClickArg){
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: { title: 'Событие', 
          event: {
            id: info.event.id,
            startDateTime: info.event.start,
            endDateTime: info.event.end,
            name: info.event.title,
            group: { id: info.event.extendedProps['groupId'] },
            color: info.event.extendedProps['color'],
            recurrence: {
              startDate: info.event.extendedProps['recurrencyStartDate'],
              endDate: info.event.extendedProps['recurrencyEndDate'],
              id: info.event.extendedProps['recurrenceId'],
              daysOfWeek: info.event.extendedProps['daysOfWeek'],
              exceptDates: info.event.extendedProps['exceptDates']
            },
          }
        }
     }); 

    dialogRef.afterClosed().subscribe((result: EventResult) => {
      var event = this.calendarApi.getEventById(info.event.id);
      if(event){
        if (result?.action == 'save' && result.events){
          result.events.forEach((ev) => {
            var e = ev as EventModel;
            event = this.calendarApi.getEventById(e.id);
            event?.remove()
            this.calendarApi.addEvent(this.getEvent(e));
          });
          this.calendarApi.refetchEvents();
          this.calendarApi.refetchEvents();
          this.snackBarService.success('Событие обновлено')
        }
        if (result?.action == 'delete'){
          result.events?.forEach((result) => {
            var eventId = result as string
            var eventToDelete = this.calendarApi.getEventById(eventId);
            eventToDelete?.remove();
          })
          this.calendarApi.refetchEvents();
        }
        if (result?.action == 'deleteOne' && result.events){
          event.remove()
          this.calendarApi.refetchEvents();
          this.snackBarService.success('Событие  удалено')
        }
      }
    });
  }

  ngOnInit(){
    this.spinnerService.loadingOn();
    this.eventService.getEvents()
    .pipe(
      finalize(() => this.spinnerService.loadingOff()),
      map((events: EventModel[]) => events.map(event => this.getEvent(event)))
    )
    .subscribe(x => this.events = x)
  }

  ngAfterViewInit(){
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.refetchEvents()
  }

  private getEvent(eventData: EventModel) : EventInput{
    var event: EventInput = {}
    event.title = eventData.name
    event.extendedProps =  { 
      groupId: eventData.group?.id,
      groupName: eventData.group?.name,
      exceptDates: eventData.recurrence?.exceptdates,
      recurrencyStartDate: eventData.recurrence?.startDate,
      recurrencyEndDate: eventData.recurrence?.endDate,
      daysOfWeek: eventData.recurrence?.daysOfWeek, 
      recurrenceId: eventData.recurrence?.id,
      color: eventData.color
    }
    event.id = eventData.id
    event.color = 'white'
    event.start = eventData.startDateTime
    event.end = eventData.endDateTime

    return event
  }
}
