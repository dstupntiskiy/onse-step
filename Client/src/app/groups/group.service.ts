import { Injectable } from '@angular/core';
import { Group, GroupWithDetails } from '../shared/models/group-model';
import { Observable } from 'rxjs';
import { BaseHttpService, IAngularHttpRequestOptions } from '../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../services/snack-bar.service';
import { GroupMember } from '../shared/models/group-members';

export interface GroupData{
  title: string
}

export interface GroupSaveModel{
  id: string
  name?: string
  styleId?: string
  active: boolean
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

    getGoupsWithDetails(onlyActive: boolean): Observable<GroupWithDetails[]>{
      var options: IAngularHttpRequestOptions = {
        params: { onlyActive: String(onlyActive) }
      }
      return this.get<GroupWithDetails[]>('GetAllWithDetails', options);
    }

    getGoupWithDetails(groupId: string): Observable<GroupWithDetails>{
      var options: IAngularHttpRequestOptions = {
        params: { groupId: groupId }
      }
      return this.get<GroupWithDetails>('GetGroupWithDetails', options);
    }

    saveGroup(group: Group): Observable<Group>{
      var groupSave: GroupSaveModel = {
        id: group.id,
        active: group.active,
        name: group.name,
        styleId: group.style?.id
      }
      return this.post<Group>('', groupSave)
    }

    getGroupMembersCount(groupId: string): Observable<number>{
      var options: IAngularHttpRequestOptions = {
        params: { groupId: groupId }
      }
      return this.get<number>('GetGroupMembersCount', options)
    }

    getGroupMembers(groupId: string): Observable<GroupMember[]>{
      var options: IAngularHttpRequestOptions = {
        params: { groupId: groupId }
      }
      return this.get<GroupMember[]>('GetGroupMembers', options)
    }

    addClientToGroup(groupId: string, clientId: string): Observable<GroupMember>{
      var data = {
        groupId: groupId,
        clientId: clientId
      }

      return this.post<GroupMember>('AddClientToGroup', data);
    }
    
    removeClientFromGroup(groupMember: GroupMember) : Observable<void>{
        var options: IAngularHttpRequestOptions = {
          params: { 
            groupId: groupMember.group.id,
            clientId: groupMember.member.id
          }
        }
        return this.delete('DeleteClientFromGroup', options)
    }
}
