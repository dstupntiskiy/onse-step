import { Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupDialogComponent } from '../shared/dialog/group-dialog/group-dialog.component';
import { Group } from '../shared/models/group-model';
import { Observable, of } from 'rxjs';

export interface GroupData{
  title: string
}

const GROUPS: Group[] = [
  { id: '1', name: 'High heels pro', style: 'High heels'},
  { id: '2', name: 'High heels начинающие', style: 'High heels'},
  { id: '3', name: 'Contemp', style: 'Contemporary'},
]

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    public dialogRef: MatDialogRef<GroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string},
    public dialog: MatDialog) 
    { }

    showGroupDialog(): MatDialogRef<GroupDialogComponent, any>{
      return this.dialog.open(GroupDialogComponent, {data: {title: 'Группа'}})
    }

    getGoups(): Observable<Group[]>{
      return of(GROUPS);
    }
}
