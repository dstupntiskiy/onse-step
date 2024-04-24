import {  ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addHours, getFormattedTime, getHalfHourIntervals, setTimeFromStringToDate } from '../../shared/helpers/time-helper';
import { Group } from '../../shared/models/group-model';
import { GroupService } from '../../groups/group.service';
import { datetime, RRule, RRuleSet, rrulestr } from 'rrule'
import { CommonModule } from '@angular/common';

export interface AddEventData{
  startTime: Date;
  endTime: Date;
  eventName: string;
  groupId?: string;
  isRecur?: boolean;
}

export interface Weekday{
  number: number;
  name: string;
}

const WEEKDAYS: Weekday[] = [
  { number: 1, name: 'Понедельник'},
  { number: 2, name: 'Вторник'},
  { number: 3, name: 'Среда'},
  { number: 4, name: 'Четверг'},
  { number: 5, name: 'Пятница'},
  { number: 6, name: 'Суббота'},
  { number: 0, name: 'Воскресенье'},
]

@Component({
  selector: 'app-add-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, 
    MatDialogModule, 
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss',
  providers:[
    GroupService
  ]
})
export class AddEventDialogComponent {
  timeOptions: string[] = getHalfHourIntervals();
  weekDays: Weekday[] = WEEKDAYS;
  groups: Group[];
  day: string;
  //isRecur?: boolean;

  public eventForm: FormGroup; 
  public get name() { return this.eventForm.get('name')}
  public get start() { return this.eventForm.get('start')}
  public get end() { return this.eventForm.get('end')}
  public get group() { return this.eventForm.get('group') }
  public get weekdays() { return this.eventForm.get('weekdays')}
  public get isRecur() { return this.eventForm.get('isRecur')}

  constructor(
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    private cdr: ChangeDetectorRef,
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, event: AddEventData}
  ){}

  submit(): void{

    if (this.eventForm.valid)
    {
      var start = new Date(this.data.event.startTime);
      var end = new Date(this.data.event.startTime);
      const data: AddEventData = {
        startTime: setTimeFromStringToDate(start, this.start?.value),
        endTime: setTimeFromStringToDate(end, this.end?.value),
        eventName: this.name?.value,
        groupId: (this.group?.value as Group)?.id
      }
      this.dialogRef.close(data)
    }
  }

  changeIsRecur(isRecur: boolean){
    this.isRecur?.setValue(isRecur);
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
      group: new FormControl(null),
      weekdays: new FormControl(null),
      isRecur: new FormControl(null)
    },
  {
    validators: this.validateForm()
  });
  this.data.event.eventName ? this.name?.setValue(this.data.event.eventName) : ''
  this.group?.setValue(this.groups.find(x => x.id === this.data.event.groupId))
  this.start?.setValue(getFormattedTime(this.data.event.startTime))
  this.data.event.endTime 
    ? this.end?.setValue(getFormattedTime(this.data.event.endTime))
    :  this.end?.setValue(getFormattedTime(addHours(this.data.event.startTime, 1)))

    this.day = this.data.event.startTime.toLocaleDateString('ru-RU');
    this.isRecur?.setValue(this.data.event.isRecur) ;
    this.cdr.detectChanges();
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
