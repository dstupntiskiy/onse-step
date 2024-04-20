import { Component, Inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { Observable, of } from 'rxjs';
import { options } from '../calendar/calendarCustomOptions'
import { DOCUMENT } from '@angular/common';

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

  constructor(@Inject(DOCUMENT) private document: Document){}

  getEvents(): Observable<EventInput[]>{
    return of([{title: 'event 1', start: '2024-04-10T11:00:00.000', end: '2024-04-10T13:00:00.000'},
    {title: 'event 2', start: '2024-04-10T12:00:00.000', end: '2024-04-10T14:00:00.000'}
    ])
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }

  ngOnInit(){
    //this.getEvents().subscribe(x => this.events = x)
  }
}
