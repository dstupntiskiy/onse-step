import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss'
})
export class AddEventDialogComponent {
  timeOptions: string[] = getHalfHourIntervals();

  public eventForm: FormGroup; 
  public get name() { return this.eventForm.get('name')}
  public get start() { return this.eventForm.get('start')}
  public get end() { return this.eventForm.get('end')}

  constructor(
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, data: AddEventData}
  ){}

  onSaveClick(): void{
    var start = new Date(this.data.data.startTime);
    var end = new Date(this.data.data.startTime);
    if (this.name?.valid && this.name?.value !== null){
    const data: AddEventData = {
      startTime: setTimeFromStringToDate(start, this.start?.value),
      endTime: setTimeFromStringToDate(end, this.end?.value),
      eventName: this.name?.value
    }
    this.dialogRef.close(data)
  }
  }

  submit(): void{
    this.onSaveClick();
  }

  onCloseClick(): void{
    this.dialogRef.close()
  }

  ngOnInit(){
    this.eventForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      start: new FormControl(null, [Validators.required]),
      end: new FormControl(null, [Validators.required])
    });
    this.start?.setValue(getFormattedTime(this.data.data.startTime))
    this.end?.setValue(getFormattedTime(addHours(this.data.data.startTime, 1)))
  }
}
