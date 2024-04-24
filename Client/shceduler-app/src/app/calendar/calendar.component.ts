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
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';
import { AddEventData } from './add-event-dialog/add-event-dialog.component';
import { SnackBarService } from '../services/snack-bar.service';
import { RRule } from 'rrule'


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
    eventDrop: this.handleDrop,
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
      data: { title: 'Новое Событие', event: {startTime: info.date}}
    });

    dialogRef.afterClosed().subscribe((result: AddEventData) => {
      if (result){
        const event: EventInput = {
          start: result.startTime,
          end: result.endTime,
          title: result.eventName,
          extendedProps: { groupId: result.groupId },
          borderColor: 'transparent',
          backgroundColor: 'transparent',
        }
        this.calendarApi.addEvent(event);
        this.snackBarService.success('Событие ' + result.eventName + ' создано')
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
          groupId: info.event.extendedProps['groupId']
        }}
    
    })
    
    dialogRef.afterClosed().subscribe((result: AddEventData) => {
      const event = this.calendarApi.getEventById(info.event.id);
      if (result && event){
        event.setStart(result.startTime),
        event.setEnd(result.endTime),
        event.setProp('title', result.eventName)
        event.setExtendedProp('groupId',result.groupId)
        this.calendarApi.refetchEvents();
        this.snackBarService.success('Событие ' + result.eventName + ' обновлено')
      }
    });
  }

  handleDrop(){
  }

  handleSelect(info: any){
    console.log(info)
  }
  ngOnInit(){
    this.calendarService.getEvents().subscribe(x => this.events = x)
    console.log(this.events);
  }

  ngAfterViewInit(){
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.refetchEvents()
  }  
}
