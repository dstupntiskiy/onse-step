import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/dialog/confirmation-dialog/confirmation-dialog.component';
import { EventResult } from '../add-event-dialog/add-event-dialog.component';

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
export class DeleteDialogComponent {

  constructor(private dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, eventName: string },
    public dialog: MatDialog,){
    }

    onCloseClick(){
      this.dialogRef.close();
    }

    onDeleteAllClick(){
      var confirmationDialogRef= this.openConfirmationDialog({ delete: 'all'})
      confirmationDialogRef.afterClosed().subscribe((result) =>{
        if(result == true){
          this.dialogRef.close({ delete: 'all'})
        }
      })
    }

    onDeleteOneClick(){
      var confirmationDialogRef= this.openConfirmationDialog({ delete: 'one'})
      confirmationDialogRef.afterClosed().subscribe((result) =>{
        if(result == true){
          this.dialogRef.close({ delete: 'one'})
        }
      })
    }

    private openConfirmationDialog(result: DeleteResult): MatDialogRef<ConfirmationDialogComponent>{
      var confDialogRef = this.dialog.open(ConfirmationDialogComponent, {data: {message: 'Вы уверены что хотите удалить событие: ' + this.data.eventName}})
      confDialogRef.afterClosed().subscribe((result) => {
        if (result == true){
          var action : DeleteResult = {delete : result}
          this.dialogRef.close(action)
        }
      })
      return confDialogRef
    }
}
