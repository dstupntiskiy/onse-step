import { Component, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { CalendarService } from './calendar.service';
import interationPlugin, { DateClickArg } from '@fullcalendar/interaction'
import timeGridWeek from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'

@Component({
  selector: 'app-calendar',
  standalone: true,
    imports: [FullCalendarModule],
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
    plugins: [dayGridPlugin, timeGridWeek, interationPlugin],
    selectable: true,
    editable: true,
    dateClick: this.handleDateClick.bind(this)
  }
  events: EventInput[]

  constructor(private calendarService: CalendarService
  ){}

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }

  handleDateClick(info: DateClickArg) {
    var start = info.date;
    const hoursToAdd = 1 * 60 * 60 * 1000;
    var end = new Date(hoursToAdd + start.getTime())
    var event: EventInput = {
      start: start,
      end: end,
      title: 'New Event',
      borderColor: 'red'
    }
    console.log(event);
    var api = this.calendarComponent.getApi();
    api.addEvent(event);
  }



  handleSelect(info: any){
    console.log(info)
  }
  ngOnInit(){
    this.calendarService.getEvents().subscribe(x => this.events = x)
  }
}
