import { Injectable } from '@angular/core';
import { BaseHttpService, IAngularHttpRequestOptions } from '../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../services/snack-bar.service';
import { MembershipModel, MembershipWithDetails } from '../shared/models/membership-model';
import { Observable } from 'rxjs';

export interface IMembershipSave{
  id: string,
  amount: number,
  startDate: string,
  endDate: string,
  visitsNumber?: number,
  clientId: string,
  styleId?: string,
  comment?: string,
  unlimited: boolean
}
@Injectable({
  providedIn: 'root'
})
export class MembershipService extends BaseHttpService {

  protected route: string = 'membership'

  constructor(http: HttpClient, snackbarService: SnackBarService) {
    super(http, snackbarService)
   }

  saveMembership(membership: IMembershipSave): Observable<MembershipWithDetails>{
    return this.post<MembershipWithDetails>('', membership)
  }

  getMembershipById(id:string): Observable<MembershipModel>{
    return this.get<MembershipModel>('GetById/' + id)
  }

  getMembershipsByClient(clientId: string): Observable<MembershipWithDetails[]>{
    var options: IAngularHttpRequestOptions = {
      params: { clientId: clientId }
    }
    return this.get<MembershipWithDetails[]>('GetMebershipsByClient', options)
  }

  getActualMembership(clientId: string, styleId?: string, date?: Date): Observable<MembershipWithDetails>{
    var options: IAngularHttpRequestOptions = {
      params: {
        clientId: clientId,
        styleId: styleId ?? '',
        date: date ? date.toISOString() : ''
      }
    }
    return this.get<MembershipWithDetails>('GetActualMembership', options)
  }

  deleteMembership(id: string): Observable<string>{
    return this.delete<string>('DeleteMembership/' + id)
  }
}
