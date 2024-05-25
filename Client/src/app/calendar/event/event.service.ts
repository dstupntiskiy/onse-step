import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar.service';
import { Observable } from 'rxjs';
import { EventModel } from '../event-dialog/event-dialog.component';

export interface EventRequestModel{
  id: string;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  color?: string;
  groupId?: string;
  isRecurrent: boolean;
  recurrencyStartDate?: Date;
  recurrencyEndDate?: Date;
  exceptDates?: string[];
  daysOfWeek?: number[]; 
  recurrenceId?: string;
}
@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseHttpService{

  protected route: string = 'Event';

  constructor(http: HttpClient, snackbarService: SnackBarService) {
    super(http, snackbarService)
   }

   getEvents(): Observable<EventModel[]>{
    return this.get<EventModel[]>('GetAll');
   }

   saveEvent(event: EventModel):Observable<EventModel[]>{
    var eventRequest = this.getEventRequestModel(event)
    return this.post<EventModel[]>('', eventRequest);
   }

   deleteEvent(event: EventModel):Observable<void>{
    return this.delete('', event.id)
   }
   
  private getEventRequestModel(event: EventModel): EventRequestModel{
    const eventRequestModel: EventRequestModel = {
      id: event.id,
      name: event.name,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      isRecurrent: !!event.recurrence,
      color: event.color,
      daysOfWeek: event.recurrence?.daysOfWeek,
      exceptDates: event.recurrence?.exceptdates,
      groupId: event.group?.id,
      recurrencyStartDate: event.recurrence?.startDate,
      recurrencyEndDate: event.recurrence?.endDate,
      recurrenceId: event.recurrence?.id
    }
    return eventRequestModel; 
  }   
}
