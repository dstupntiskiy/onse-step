import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { FormsModule } from '@angular/forms';
import { addHours, getFormattedTime, getHalfHourIntervals, setTimeFromStringToDate } from '../../shared/helpers/time-helper';

export interface AddEventData{
  startTime: Date;
  endTime: Date;
  eventName: string;
}

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
  timeOptions: string[] = getHalfHourIntervals();
  startSelectedValue: string;
  endSelectedValue: string;

  constructor(
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, data: AddEventData}
  ){}

  onSaveClick(): void{
    var start = new Date(this.data.data.startTime);
    var end = new Date(this.data.data.startTime); 
    const data: AddEventData = {
      startTime: setTimeFromStringToDate(start, this.startSelectedValue),
      endTime: setTimeFromStringToDate(end, this.endSelectedValue),
      eventName: 'NEW'
    }
    this.dialogRef.close(data)
  }

  onCloseClick(): void{
    this.dialogRef.close()
  }

  ngOnInit(){
    this.startSelectedValue = getFormattedTime(this.data.data.startTime)
    this.endSelectedValue = getFormattedTime(addHours(this.data.data.startTime, 1))
  }
}
