import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarApi, CalendarOptions, EventInput } from '@fullcalendar/core';
import { CalendarService } from './calendar.service';
import interationPlugin, { DateClickArg } from '@fullcalendar/interaction'
import timeGridWeek from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import { EventComponent } from './event/event.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';
import { AddEventData } from './add-event-dialog/add-event-dialog.component';


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

  id: number = 0;
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
    plugins: [dayGridPlugin, timeGridWeek, interationPlugin],
    selectable: true,
    editable: true,
    dateClick: this.handleDateClick.bind(this),
    eventContent: this.handleEventContent.bind(this)
  }
  events: EventInput[]

  calendarApi: CalendarApi;

  constructor(private calendarService: CalendarService,
    public dialog: MatDialog
  ){}

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }

  handleDateClick(info: DateClickArg) {
    this.id += 1;

    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      data: { title: 'Add Event', data: {startTime: info.date}}
    });

    dialogRef.afterClosed().subscribe((result: AddEventData) => {
      if (result){
        const event: EventInput = {
          start: result.startTime,
          end: result.endTime,
          title: result.eventName,
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          extendedProps:{
            id: this.id
          }
        }
      

        this.calendarApi.addEvent(event);
      }
  });

  }

  handleEventContent(arg: any){

  }



  handleSelect(info: any){
    console.log(info)
  }
  ngOnInit(){
    this.calendarService.getEvents().subscribe(x => this.events = x)
  }

  ngAfterViewInit(){
    this.calendarApi = this.calendarComponent.getApi();

  }
}
