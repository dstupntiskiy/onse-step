import { Injectable, signal } from '@angular/core';
import { Client, ClientOnetimeVisit } from '../shared/models/client-model';
import { finalize, Observable, of, tap } from 'rxjs';
import { BaseHttpService, IAngularHttpRequestOptions } from '../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../services/snack-bar.service';

const TAKE = 20

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseHttpService{

  protected route: string = 'Client';
  
  isLoading = signal(false)
  skip = signal(0)

  constructor(http: HttpClient, snackbarService: SnackBarService) {
    super(http, snackbarService)
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

  getClientById(id: string): Observable<Client>{
    return this.get<Client>('GetById/' + id)
  }

  deleteClient(id: string): Observable<string>{
    return this.delete<string>('Delete/' + id)
  }

  getClientOnetimeVisits(id: string): Observable<ClientOnetimeVisit[]>{
    return this.get<ClientOnetimeVisit[]>('GetClientOnetimeVisits/' + id)
  }

  loadMoreClients(): Observable<Client[]>{
    if(this.isLoading()){
      return of([])
    }
    this.isLoading.set(true)
    var options: IAngularHttpRequestOptions = {
      params: { 
        take: TAKE.toString(),
        skip: this.skip().toString()
      }
    }
    return this.get<Client[]>('GetAll', options)
            .pipe(
              tap(() =>{
                this.skip.set(this.skip() + TAKE)
              }),
              finalize(() => this.isLoading.set(false))
            )
    
  }

  reset(){
    this.skip.set(0)
  }
}
