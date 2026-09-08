import { Injectable } from '@angular/core';
import { BaseHttpService, IAngularHttpRequestOptions } from '../../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecurrenceService extends BaseHttpService {
  protected route: string = 'Recurrence'
  constructor(http: HttpClient, snackbarService: SnackBarService) {
    super(http, snackbarService)
   }

   deleteRecurrence(id : string): Observable<string[]>{
    var options: IAngularHttpRequestOptions = {
      params: { id: id}
    }
    return this.delete('', options);
   }
}
