import { Inject, Injectable } from '@angular/core';
import { BaseDialogService } from '../../services/base-dialog.service';
import { CoachDialogComponent } from './coach-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CoachModel } from '../../shared/models/coach-model';

@Injectable({
  providedIn: 'root'
})
export class CoachDialogService extends BaseDialogService<CoachDialogComponent>{

  constructor(dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    super(dialog, data)
    this.component = CoachDialogComponent
   }

   showCoachDialog(title: string = 'Тренер', coach?: CoachModel) : MatDialogRef<CoachDialogComponent, any>{
    this.dialogData = {
      title: title,
      coach: coach
    }

    return this.showDialog();
   }
}
