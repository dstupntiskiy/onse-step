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
        start: '2024-05-02T11:00:00.000Z', 
        end: '2024-05-02T13:00:00.000Z',
        extendedProps: { groupId: '1'}
      },
      {
        id: '2',
        title: 'event 2', 
        start: '2024-05-03T12:00:00.000Z', 
        end: '2024-05-03T12:30:00.000Z',
        extendedProps: { groupId: '2'}
      },
      {
        id: '3',
        title: 'event recurring',
        rrule:{
          freq: RRule.WEEKLY,
          byweekday: [1,4],
          dtstart: '2024-04-22T10:30:00Z',
          until: '2024-05-30T23:59:59Z',
        },
        duration: '01:00',
        exdate: ['2024-05-03T10:30:00Z'],
        extendedProps: { groupId: '5'}
      }
    ])
  }
}
