import { Injectable } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { Observable, of } from 'rxjs';

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
      }
    ])
  }
}
