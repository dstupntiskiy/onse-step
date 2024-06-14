import { Injectable } from '@angular/core';
import { BaseHttpService, IAngularHttpRequestOptions } from '../../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar.service';
import { Observable } from 'rxjs';
import { EventModel } from '../event-dialog/event-dialog.component';
import { Participant } from '../../shared/models/participant-model';
import { Attendence } from '../../shared/models/attendence-model';
import { OnetimeVisitorModel } from '../../shared/models/onetime-visitor-model';

export interface EventRequestModel{
  id: string;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  color?: string;
  groupId?: string;
  coachId?: string;
  isRecurrent: boolean;
  recurrencyStartDate?: Date;
  recurrencyEndDate?: Date;
  exceptDates?: string[];
  daysOfWeek?: number[]; 
  recurrenceId?: string;
}

export interface AddParticipantModel{
  clientId: string;
  eventId: string;
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
    var options: IAngularHttpRequestOptions = {
      params: {id: event.id}
    }
    return this.delete('', options)
   }

   getParticipantsCount(eventId: string): Observable<number>{
    var options: IAngularHttpRequestOptions = {
      params: {EventId: eventId}
    }
    return this.get<number>("GetParticipantsCount", options)
   }

   getAttendents(eventId: string): Observable<Attendence[]>{
    var options: IAngularHttpRequestOptions = {
      params: {EventId: eventId}
    }
    return this.get<Attendence[]>("GetEventAttendies", options)
   }

   addAttendy(eventId: string, clientId: string): Observable<void>{
    var data: AddParticipantModel = {
        eventId: eventId,
        clientId: clientId
      }
    return this.post("AddParticipant", data)
   }

   removeAttendy(eventId: string, clientId: string): Observable<void>{
    var options: IAngularHttpRequestOptions = {
      params: {
        eventId: eventId,
        clientId: clientId
      }
    }
    return this.delete("RemoveParticipant", options)
   }

   getOneTimeVisitors(eventId: string): Observable<OnetimeVisitorModel[]>{
    var options: IAngularHttpRequestOptions = {
      params: {eventId: eventId}
    }
    return this.get<OnetimeVisitorModel[]>('GetOneTimeVisitors', options)
   }

   getOnetimeVisitorsCount(eventId: string): Observable<number>{
    var options: IAngularHttpRequestOptions = {
      params: {eventId: eventId}
    }
    return this.get<number>('GetOneTimeVisitorsCount', options)
   }

   saveOnetimeVisitor(eventId: string, clientId: string): Observable<OnetimeVisitorModel>{
    var data = {
      eventId: eventId,
      clientId: clientId
    }

    return this.post('SaveOneTimeVisitor', data)
   }

   removeOnetimeVisitor(visitorId: string): Observable<void>{
    var options: IAngularHttpRequestOptions = {
      params: {visitorId: visitorId}
    }

    return this.delete('RemoveOnetimeVisitor', options)
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
      coachId: event.coach?.id,
      recurrencyStartDate: event.recurrence?.startDate,
      recurrencyEndDate: event.recurrence?.endDate,
      recurrenceId: event.recurrence?.id
    }
    return eventRequestModel; 
  }   
}
