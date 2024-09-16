import { Injectable } from '@angular/core';
import { BaseHttpService, IAngularHttpRequestOptions } from '../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../services/snack-bar.service';
import { Observable } from 'rxjs';
import { MembershipStyle } from './models/membership-style.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseHttpService {

  protected route: string = 'Report';

  constructor(http: HttpClient, snackbarService: SnackBarService) {
    super(http, snackbarService)
   }

   getMembershipsAmountByPeriod(startDate: Date, endDate: Date) : Observable<number>{ 
    var options: IAngularHttpRequestOptions = {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    }
    
    return this.get<number>("GetMembershipsAmountByPeriod", options)
   }

   getMembershipsStylesByPeriod(startDate: Date, endDate: Date) : Observable<MembershipStyle[]>{ 
    var options: IAngularHttpRequestOptions = {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    }
    
    return this.get<MembershipStyle[]>("GetMembershipsStylesByPeriod", options)
   }
}
