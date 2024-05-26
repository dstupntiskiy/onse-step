import { Injectable } from '@angular/core';
import { Group } from '../shared/models/group-model';
import { Observable } from 'rxjs';
import { BaseHttpService, IAngularHttpRequestOptions } from '../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../services/snack-bar.service';
import { Client } from '../shared/models/client-model';
import { GroupMembers } from '../shared/models/group-members';

export interface GroupData{
  title: string
}
@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseHttpService{

  protected route: string = 'Group';

  constructor(http: HttpClient, snackbarService: SnackBarService) 
    { super(http, snackbarService)}

    getGoups(): Observable<Group[]>{
      return this.get<Group[]>('GetAll');
    }

    saveGroup(group: Group): Observable<Group>{
      return this.post<Group>('', group)
    }

    getGroupMembers(groupId: string): Observable<GroupMembers>{
      var options: IAngularHttpRequestOptions = {
        params: { groupId: groupId }
      }
      return this.get<GroupMembers>('GetGroupMembers', options)
    }
}
