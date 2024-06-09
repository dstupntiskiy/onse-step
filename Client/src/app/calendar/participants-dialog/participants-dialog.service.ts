import { Inject, Injectable } from '@angular/core';
import { BaseDialogService } from '../../services/base-dialog.service';
import { ParticipantsDialogComponent } from './participants-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Group } from '../../shared/models/group-model';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsDialogService extends BaseDialogService<ParticipantsDialogComponent> {

  constructor(dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any
  ) { 
    super(dialog, data)
    this.component = ParticipantsDialogComponent
  }

  showParticipantsDialog(eventId: string, group?: Group | null, title: string = "Участники"):MatDialogRef<ParticipantsDialogComponent>{
    this.dialogData = {
      title: title,
      group: group,
      eventId: eventId
    }
    
    return this.showDialog();
  }
}
