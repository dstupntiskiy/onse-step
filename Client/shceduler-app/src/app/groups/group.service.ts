import { Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupDialogComponent } from '../shared/dialog/group-dialog/group-dialog.component';

export interface GroupData{
  title: string
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    public dialogRef: MatDialogRef<GroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string},
    public dialog: MatDialog) 
    { }

    showGroupDialog(){
      this.dialog.open(GroupDialogComponent, {data: {title: 'Группа'}})
    }
}
