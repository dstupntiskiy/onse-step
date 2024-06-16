import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SnackBarService } from '../services/snack-bar.service';
import { BaseHttpService, IAngularHttpRequestOptions } from '../services/base-http.service';
import { Observable } from 'rxjs';
import { CoachModel } from '../shared/models/coach-model';

@Injectable({
  providedIn: 'root'
})
export class CoachService extends BaseHttpService{

  protected route: string = 'Coach';

  constructor(http: HttpClient, snackbarService: SnackBarService) {
    super(http, snackbarService)
   }

   getCoaches(onlyActive: boolean = false): Observable<CoachModel[]>{
    var options: IAngularHttpRequestOptions = {
      params: { onlyActive: String(onlyActive) }
    }
    return this.get<CoachModel[]>('GetAll', options)
   }

   SaveCoach(coach: CoachModel): Observable<CoachModel>{
    return this.post<CoachModel>('', coach)
   }
}
