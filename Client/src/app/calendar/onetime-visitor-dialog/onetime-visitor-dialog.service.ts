import { Inject, Injectable } from '@angular/core';
import { OnetimeVisitorDialogComponent } from './onetime-visitor-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseDialogService } from '../../services/base-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class OnetimeVisitorDialogService extends BaseDialogService<OnetimeVisitorDialogComponent>{

  constructor(dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any
  ) { 
    super(dialog, data)
    this.component = OnetimeVisitorDialogComponent
  }

  showOnetimeVisitorsDialog(eventId: string, title: string = 'Разовые посещения'): MatDialogRef<OnetimeVisitorDialogComponent>{
    this.dialogData = {
      title: title,
      eventId: eventId
    }

    return this.showDialog()
  }
}
