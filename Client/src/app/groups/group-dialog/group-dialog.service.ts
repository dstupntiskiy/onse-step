import { Inject, Injectable } from '@angular/core';
import { BaseDialogService } from '../../services/base-dialog.service';
import { GroupDialogComponent } from './group-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Group } from '../../shared/models/group-model';

@Injectable({
  providedIn: 'root'
})
export class GroupDialogService extends BaseDialogService<GroupDialogComponent> {

  constructor(dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    super(dialog, data);
    this.component = GroupDialogComponent
  }

  showGroupDialog(title: string = 'Группа', group?: Group | undefined ): MatDialogRef<GroupDialogComponent, any>{
    this.dialogData = {
      title: title,
      group: group
    }

    return this.showDialog();
  }
}
