import { Component, Inject, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/dialog/confirmation-dialog/confirmation-dialog.component';
import { DynamicComponent } from '../../shared/dialog/base-dialog/base-dialog.component';
import { DialogService } from '../../services/dialog.service';

export interface DeleteDialogData{
  message: string
  eventName: string
}
export interface DeleteResult{
  delete: 'all' | 'one'
}
@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent implements DynamicComponent {

  data = input<DeleteDialogData>()
  dialogService = inject(DialogService)

  constructor(private dialogRef: MatDialogRef<DeleteDialogComponent>){
    }

    onCloseClick(){
      this.dialogRef.close();
    }

    onDeleteAllClick(){
      var confirmationDialogRef= this.openConfirmationDialog()
      confirmationDialogRef.afterClosed().subscribe((result) =>{
        if(result == true){
          this.dialogRef.close({ delete: 'all'})
        }
      })
    }

    onDeleteOneClick(){
      var confirmationDialogRef= this.openConfirmationDialog()
      confirmationDialogRef.afterClosed().subscribe((result) =>{
        if(result == true){
          this.dialogRef.close({ delete: 'one'})
        }
      })
    }

    private openConfirmationDialog(){
      var confDialogRef = this.dialogService.showDialog(ConfirmationDialogComponent, 'Подтверждение',
        {
            message: 'Вы уверены что хотите удалить событие: ' + this.data()?.eventName
        })
      confDialogRef.afterClosed().subscribe((result) => {
        if (result == true){
          this.dialogRef.close(true)
        }
      })
      return confDialogRef
    }
}
