import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-event-dialog',
  standalone: true,
  imports: [MatButtonModule, 
    MatDialogModule, 
    MatInputModule,
    MatSelectModule,
    FormsModule],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss'
})
export class AddEventDialogComponent {
  timeOptions: string[] = ['10:00', '11:00', '12:00']
  startSelectedValue: string;
  endSelectedValue: string;
  
  constructor(
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  onCloseClick(): void{
    this.dialogRef.close()
  }

  ngOnInit(){
    this.startSelectedValue = '11:00'
  }
}
