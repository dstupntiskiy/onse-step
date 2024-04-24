import { Injectable } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { Observable, of } from 'rxjs';
import { datetime, RRule, RRuleSet, rrulestr } from 'rrule'

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }

  getEvents(): Observable<EventInput[]>{
    return of([
      {
        id: '1',
        title: 'event 1', 
        start: '2024-04-24T11:00:00.000', 
        end: '2024-04-24T13:00:00.000',
        extendedProps: { groupId: '1'}
      },
      {
        id: '2',
        title: 'event 2', 
        start: '2024-04-25T12:00:00.000', 
        end: '2024-04-25T12:30:00.000',
        extendedProps: { groupId: '2'}
      },
      {
        id: '3',
        title: 'event reoccuring',
        rrule:{
          freq: RRule.WEEKLY,
          byweekday: [1,4],
          dtstart: '2024-04-22T10:30:00',
          until: '2024-04-30T23:59:59',
        },
        duration: '01:00',
        extendedProps: { groupId: '5'}
      }
    ])
  }
}
