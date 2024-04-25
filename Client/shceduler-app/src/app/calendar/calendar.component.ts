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
import { AddEventDialogComponent, EventModel, EventResult } from './add-event-dialog/add-event-dialog.component';
import { SnackBarService } from '../services/snack-bar.service';

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

  id: number = 2;
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
    private calendarService: CalendarService,
    private snackBarService: SnackBarService,
    public dialog: MatDialog
  ){}

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }

  handleDateClick(info: DateClickArg) {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      data: { title: 'Новое Событие', event: {startTime: info.date, isNew: true}}
    });

    dialogRef.afterClosed().subscribe((result: EventResult) => {
      if (result && result.event){
        this.calendarApi.addEvent(this.getEvent(result.event));
        this.snackBarService.success('Событие ' + result.event.eventName + ' создано')
        this.id +=  1;
      }
  });

  }

  handleEventClick(info: EventClickArg){
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
        data: { title: 'Событие', 
        event: {
          startTime: info.event.start,
          endTime: info.event.end,
          eventName: info.event.title,
          groupId: info.event.extendedProps['groupId'],
          isRecur: !!info.event._def.recurringDef,
          rrule: info.event._def.recurringDef?.typeData.rruleSet
        }}
    
    })
    
    dialogRef.afterClosed().subscribe((result: EventResult) => {
      const event = this.calendarApi.getEventById(info.event.id);
      if (result?.action == 'save' && result.event && event){
        event.remove()
        this.calendarApi.addEvent(this.getEvent(result.event));
        this.calendarApi.refetchEvents();
        this.snackBarService.success('Событие ' + result.event.eventName + ' обновлено')
      }
      if (result?.action == 'delete' && event){
        event.remove()
      }
    });
  }

  ngOnInit(){
    this.calendarService.getEvents().subscribe(x => this.events = x)
  }

  ngAfterViewInit(){
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.refetchEvents()
  }

  private getEvent(eventData: EventModel) : EventInput{
    var event: EventInput = {}
    event.title = eventData.eventName
    event.borderColor = 'transparent'
    event.backgroundColor = 'tranparent'
    event.extendedProps =  { groupId: eventData.groupId }

    if (eventData.isRecur){
      event.rrule = eventData.rrule?._rrule['0'].toString()
      event.duration = { minutes: (eventData.endTime.getTime() - eventData.startTime.getTime())/(1000 * 60)}
    }
    else{
      event.start = eventData.startTime
      event.end = eventData.endTime
    }

    return event
  }
}
