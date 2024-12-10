import { Injectable } from '@angular/core';
import { BaseHttpService, IAngularHttpRequestOptions } from '../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../services/snack-bar.service';
import { Observable } from 'rxjs';
import { MembershipStyle, OnetimeVisitStyle } from './models/style-report.model';
import { CoachWithEventsDto } from './models/coaches-report.model';
import { AmountByDate } from './models/amount-by-date.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseHttpService {

  protected route: string = 'Report';

  constructor(http: HttpClient, snackbarService: SnackBarService) {
    super(http, snackbarService)
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

   getOnetimeVisitsStylesByPeriod(startDate: Date, endDate: Date) : Observable<OnetimeVisitStyle[]>{ 
    var options: IAngularHttpRequestOptions = {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    }
    
    return this.get<OnetimeVisitStyle[]>("GetOnetimeVisitsStylesByPeriod", options)
   }

   getAllCoachesEventsWithParticipantsByPeriod(startDate: Date, endDate: Date) : Observable<CoachWithEventsDto[]>{
    var options: IAngularHttpRequestOptions = {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    }

    return this.get<CoachWithEventsDto[]>("GetAllCoachesEventsWithParticipantsByPeriod", options)
  }

  getPaymentsAmountByDate(startDate: Date, endDate: Date) : Observable<AmountByDate[]>{
    var options: IAngularHttpRequestOptions = {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    }

    return this.get<AmountByDate[]>("GetPaymentsAmountByPeriod", options)
  }
}
