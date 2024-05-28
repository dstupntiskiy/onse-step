import { Injectable } from '@angular/core';
import { Client } from '../shared/models/client-model';
import { Observable, of } from 'rxjs';
import { BaseHttpService, IAngularHttpRequestOptions } from '../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../services/snack-bar.service';


@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseHttpService{

  protected route: string = 'Client';

  constructor(http: HttpClient, snackbarService: SnackBarService) {
    super(http, snackbarService)
   }

  getClients():Observable<Client[]>{
    return this.get<Client[]>('GetAll')
  }

  getClientsByQuery(query: string):Observable<Client[]>{
    var options: IAngularHttpRequestOptions = {
      params: { query: query }
    }
    return this.get('GetAllByQuery', options)
  }

  saveClient(client: Client): Observable<Client>{
    return this.post<Client>('', client)
  }
}
