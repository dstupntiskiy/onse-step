import { Injectable } from '@angular/core';
import { BaseHttpService, IAngularHttpRequestOptions } from '../../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar.service';
import { Observable } from 'rxjs';
import { Attendence } from '../../shared/models/attendence-model';
import { OnetimeVisitorModel } from '../../shared/models/onetime-visitor-model';
import { EventCoachSubstitutionModel, EventModel, EventType } from './event.model';

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
  eventType: number
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

   getEventById(id: string): Observable<EventModel>{
    return this.get<EventModel>('GetEventById/' + id)
   }

   getEventsByPeriod(startDate: string, endDate: string): Observable<EventModel[]>{
    var options: IAngularHttpRequestOptions = {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    }
    return this.get<EventModel[]>('GetEventsByPeriod', options)
   }

   saveEvent(event: EventRequestModel):Observable<EventModel[]>{
    return this.post<EventModel[]>('', event);
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
   
   addCoachSubstitution(eventId: string, coachId: string): Observable<EventCoachSubstitutionModel>{
    var data = {
      eventId: eventId,
      coachId: coachId
    }

    return this.post('AddCoachSubstitution', data)
   }

   removeCoachSubstitution(id: string): Observable<string>{
    var options: IAngularHttpRequestOptions = {
      params: { substitutionId: id }
    }

    return this.delete('RemoveCoachSubstitution', options)
   }

   getCoachSubstitution(eventId: string): Observable<EventCoachSubstitutionModel>{

    return this.get<EventCoachSubstitutionModel>('GetCoachSubstitution/' + eventId)
   }
}