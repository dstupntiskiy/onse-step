import { Component, Inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { Observable, of } from 'rxjs';
import { options } from './calendarCustomOptions'
import { DOCUMENT } from '@angular/common';
import { CalendarService } from './calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
    imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = options
  events: EventInput[]

  constructor(private calendarService: CalendarService){}

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }

  ngOnInit(){
    this.calendarService.getEvents().subscribe(x => this.events = x)
  }
}
