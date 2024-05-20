import { Injectable } from '@angular/core';
import { Group } from '../shared/models/group-model';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../services/snack-bar.service';

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
}
