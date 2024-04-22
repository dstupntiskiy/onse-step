import {  Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addHours, getFormattedTime, getHalfHourIntervals, setTimeFromStringToDate } from '../../shared/helpers/time-helper';
import { Group } from '../../shared/models/group-model';
import { GroupService } from '../../groups/group.service';

export interface AddEventData{
  startTime: Date;
  endTime: Date;
  eventName: string;
  groupId?: string;
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
  styleUrl: './add-event-dialog.component.scss',
  providers:[
    GroupService
  ]
})
export class AddEventDialogComponent {
  timeOptions: string[] = getHalfHourIntervals();
  groups: Group[];
  day: string;

  public eventForm: FormGroup; 
  public get name() { return this.eventForm.get('name')}
  public get start() { return this.eventForm.get('start')}
  public get end() { return this.eventForm.get('end')}
  public get group() { return this.eventForm.get('group') }

  constructor(
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, data: AddEventData}
  ){}

  submit(): void{

    if (this.eventForm.valid)
    {
      var start = new Date(this.data.data.startTime);
      var end = new Date(this.data.data.startTime);
      const data: AddEventData = {
        startTime: setTimeFromStringToDate(start, this.start?.value),
        endTime: setTimeFromStringToDate(end, this.end?.value),
        eventName: this.name?.value,
        groupId: (this.group?.value as Group)?.id
      }
      this.dialogRef.close(data)
    }
  }

  onCloseClick(): void{
    this.dialogRef.close()
  }

  ngOnInit(){
    this.groups = this.groupService.getGoups();

    this.eventForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      start: new FormControl(null, [Validators.required]),
      end: new FormControl(null, [Validators.required]),
      group: new FormControl(null)
    },
  {
    validators: this.validateForm()
  });
  this.data.data.eventName ? this.name?.setValue(this.data.data.eventName) : ''
  this.group?.setValue(this.groups.find(x => x.id === this.data.data.groupId))
  this.start?.setValue(getFormattedTime(this.data.data.startTime))
  this.data.data.endTime 
    ? this.end?.setValue(getFormattedTime(this.data.data.endTime))
    :  this.end?.setValue(getFormattedTime(addHours(this.data.data.startTime, 1)))

    this.day = this.data.data.startTime.toLocaleDateString('ru-RU');
  }

  validateForm(){
    return (form: FormGroup) => {
        const start = form.get('start')?.value;
        const end = form.get('end')?.value;

        var timeArray: string[] = getHalfHourIntervals();

        const startIndex = timeArray.indexOf(start);
        const endIndex = timeArray.indexOf(end);
        
        const error = 
          endIndex > startIndex ? null : { InvalidInput: true }
        
        form.get('end')?.setErrors(error);
        return error;
      }
  }
}
