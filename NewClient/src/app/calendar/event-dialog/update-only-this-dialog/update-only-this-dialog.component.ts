import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-only-this-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './update-only-this-dialog.component.html',
  styleUrl: './update-only-this-dialog.component.scss'
})
export class UpdateOnlyThisDialogComponent {

  constructor(private dialogRef: MatDialogRef<UpdateOnlyThisDialogComponent>)
  {}

  onCloseClick(){
    this.dialogRef.close()
  }

  onAllClick(){
    this.dialogRef.close('all')
  }

  onYesClick(){
    this.dialogRef.close('one')
  }
}
