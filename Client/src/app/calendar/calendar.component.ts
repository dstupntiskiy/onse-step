import { Component, ViewChild, inject } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarApi, CalendarOptions, DateInput, DateRangeInput, EventClickArg, EventInput } from '@fullcalendar/core';
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
import { ResizeService } from '../shared/services/resize.service';
import { DialogService } from '../services/dialog.service';

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
    this.dialogService.showDialog(EventDialogComponent, 'Новое событие', 
    { 
      event: {
        startDateTime: info.date, 
        isRecurrent: false},
        id: ''
    })
    .afterClosed().subscribe((result: EventResult) => {
      if (result && result.events){
          result.events?.forEach(ev => {
            var event = this.getEvent(ev as EventModel)
            this.calendarApi.addEvent(event);
          })
        
        this.snackBarService.success('Событие создано')
      }
    })
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
    this.dialogService.showDialog(EventDialogComponent, 'Событие', {
      event: {
        id: info.event.id,
        startDateTime: info.event.start,
        endDateTime: info.event.end,
        name: info.event.title,
        group: { id: info.event.extendedProps['groupId'] },
        coach: { id: info.event.extendedProps['coachId'] },
        color: info.event.extendedProps['color'],
        recurrence: {
          startDate: info.event.extendedProps['recurrencyStartDate'],
          endDate: info.event.extendedProps['recurrencyEndDate'],
          id: info.event.extendedProps['recurrenceId'],
          daysOfWeek: info.event.extendedProps['daysOfWeek'],
          exceptDates: info.event.extendedProps['exceptDates']
        },
      }
     })
    .afterClosed().subscribe((result: EventResult) => {
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

  ngAfterViewInit(){
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.refetchEvents()
    this.resizeService.resize$.subscribe((result: boolean) =>{
      result ?
        this.calendarApi.changeView('dayGrid')
        : this.calendarApi.changeView('timeGridWeek')
    })
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
      color: eventData.color
    }
    event.id = eventData.id
    event.color = 'white'
    event.start = eventData.startDateTime
    event.end = eventData.endDateTime

    return event
  }
}
