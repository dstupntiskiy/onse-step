import { Injectable } from '@angular/core';
import { Client } from '../shared/models/client-model';
import { Observable, of } from 'rxjs';

const CLIENTS: Client[] = [
    {id: '1', firstName: 'Лиза', lastName: 'Иванова', phone: '123123123', socialMedia: '@test'},
    {id: '2', firstName: 'Настя', lastName: 'Петрова', phone: '123123123', socialMedia: '@test'},
    {id: '3', firstName: 'Катя', lastName: 'Ерохина', phone: '123123123', socialMedia: '@test'},
    {id: '4', firstName: 'Галя', lastName: 'Какая-то', phone: '123123123', socialMedia: '@test'}
]

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor() { }

  getClients():Observable<Client[]>{
    return of(CLIENTS)
  }
}
