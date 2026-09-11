import { Component, Inject, input, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DynamicComponent } from '../base-dialog/base-dialog.component';

export interface ConfirmationDialogData{
  message: string;
} 
@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './confirmation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent implements DynamicComponent {
  data = input<ConfirmationDialogData>()

  constructor(private dialogRef: MatDialogRef<ConfirmationDialogComponent>)
    {    }

    onCloseClick(){
      this.dialogRef.close();
    }

    onOkClick(){
      this.dialogRef.close(true)
    }
}
