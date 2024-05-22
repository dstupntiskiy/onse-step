import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDatepickerModule} from '@angular/material/datepicker'
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addHours, getFormattedTime, getHalfHourIntervals, setTimeFromStringToDate } from '../../shared/helpers/time-helper';
import { Group } from '../../shared/models/group-model';
import { GroupService } from '../../groups/group.service';
import { RRule, RRuleSet } from 'rrule'
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from '../../shared/dialog/confirmation-dialog/confirmation-dialog.component';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import { CustomDateAdapter } from '../../shared/adapters/custom.date.adapter';
import { DeleteDialogComponent, DeleteResult } from '../delete-dialog/delete-dialog.component';

export interface EventModel{
  id: string,
  startTime: Date;
  endTime: Date;
  eventName: string;
  groupId?: string;
  isRecur: boolean;
  rrule?: RRuleSet;
  isNew?: boolean;
  exdate?: string[]
}

export interface EventResult{
  action?: 'save'| 'delete' | 'deleteOne'
  event?: EventModel
}

export interface Weekday{
  number: number;
  name: string;
}

const WEEKDAYS: Weekday[] = [
  { number: 0, name: 'Понедельник'},
  { number: 1, name: 'Вторник'},
  { number: 2, name: 'Среда'},
  { number: 3, name: 'Четверг'},
  { number: 4, name: 'Пятница'},
  { number: 5, name: 'Суббота'},
  { number: 6, name: 'Воскресенье'},
]

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, 
    MatDialogModule, 
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    ConfirmationDialogComponent,
    MatDatepickerModule,
    MatNativeDateModule ],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss',
  providers:[
    GroupService,
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: CustomDateAdapter}
  ]
})
export class AddEventDialogComponent {
  timeOptions: string[] = getHalfHourIntervals();
  weekDaysList: Weekday[] = WEEKDAYS;
  groups: Group[];
  day: string;
  disableRecur: boolean;
  isNew: boolean = false;
  pickerStart: Date;
  pickerEnd: Date;

  private initialEvent: EventModel;

  public eventForm: FormGroup; 
  public get name() { return this.eventForm.get('name')}
  public get start() { return this.eventForm.get('start')}
  public get end() { return this.eventForm.get('end')}
  public get group() { return this.eventForm.get('group') }
  public get weekdays() { return this.eventForm.get('weekdays')}
  public get isRecur() { return this.eventForm.get('isRecur')}
  public get recurStart() { return this.eventForm.get('recurStart')}
  public get recurEnd() { return this.eventForm.get('recurEnd')}

  constructor(
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    public dialog: MatDialog,
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, event: EventModel}
  ){}

  ngOnInit(){
    this.initialEvent = this.data.event;
    this.isNew = this.data.event.isNew === true ;

    this.eventForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      start: new FormControl(null, [Validators.required]),
      end: new FormControl(null, [Validators.required]),
      group: new FormControl(null),
      weekdays: new FormControl(null),
      isRecur: new FormControl({disabled: true }),
      recurStart: new FormControl(null),
      recurEnd: new FormControl(null)
    },
  {
    validators: [
      this.validateDates(), 
      this.validateWeekdaysNotEmpty()]
  });

  this.groupService.getGoups().subscribe((groups: Group[]) =>{
    this.groups = groups
    this.group?.setValue(this.groups.find(x => x.id === this.data.event.groupId))
    
  });

  this.data.event.eventName ? this.name?.setValue(this.data.event.eventName) : ''
  this.start?.setValue(getFormattedTime(this.data.event.startTime))
  this.data.event.endTime 
    ? this.end?.setValue(getFormattedTime(this.data.event.endTime))
    :  this.end?.setValue(getFormattedTime(addHours(this.data.event.startTime, 1)))

    this.day = this.data.event.startTime.toLocaleDateString('ru-RU');
    
    this.isRecur?.setValue(this.data.event.isRecur);
    if (this.isRecur?.value){
      this.isRecur?.disable();

      this.recurStart?.disable();
      this.recurEnd?.disable();
      this.weekdays?.disable();
      this.recurStart?.setValue(this.data.event.rrule?._rrule[0].options.dtstart)
      this.recurEnd?.setValue(this.data.event.rrule?._rrule[0].options.until)
    }

    this.weekdays?.setValue(this.data.event.rrule?._rrule[0].options.byweekday.map((x) => this.weekDaysList.find(wd => wd.number === x)))
  }

  submit(): void{
    
    if (this.eventForm.valid)
    {
      var start = new Date(this.data.event.startTime);
      var end = new Date(this.data.event.startTime);

      var rruleSet: RRuleSet;
      var result: EventResult = {action: 'save'}

      const data: EventModel = {
        id: (Math.floor(Math.random() * 1000)).toString(),
        startTime: setTimeFromStringToDate(start, this.start?.value),
        endTime: setTimeFromStringToDate(end, this.end?.value),
        eventName: this.name?.value,
        groupId: (this.group?.value as Group)?.id,
        isRecur: this.isRecur?.value
      }
      if (this.isRecur?.value){
        rruleSet = new RRuleSet()
        rruleSet.rrule(new RRule({
          freq: RRule.WEEKLY,
          byweekday: this.weekdays?.value.map((x : Weekday) => x.number),
          dtstart: setTimeFromStringToDate(this.recurStart?.value, this.start?.value),
          until: this.recurEnd?.value,
        }))
        if (this.initialEvent.exdate){
          data.exdate = this.initialEvent.exdate
        }
        data.rrule = rruleSet
      }

      result.event = data
      this.dialogRef.close(result)
    }
  }

  changeIsRecur(isRecur: boolean){
    this.isRecur?.setValue(isRecur);
  }

  onCloseClick(): void{
    this.dialogRef.close()
  }

  onDelete(): void{
    if (this.isRecur?.value){
      var deleteDialog = this.dialog.open(DeleteDialogComponent, {data: { message: 'Удалить все повторения или экземпляр?', eventName: this.data.event.eventName}})
      deleteDialog.afterClosed().subscribe((result: DeleteResult) =>{
          if (result?.delete == 'all'){
            var action : EventResult = {action : 'delete'}
            this.dialogRef.close(action)
          }
          if (result?.delete == 'one'){
            var event = this.initialEvent

            var exdateArr = this.initialEvent.exdate
            exdateArr?.push(new Date(this.initialEvent.startTime).toISOString())
            event.exdate = exdateArr

            var action : EventResult = {action : 'deleteOne', event: event}
            this.dialogRef.close(action)
          }
      })
    }
    else{
      var confDialogRef = this.dialog.open(ConfirmationDialogComponent, {data: {message: 'Вы уверены что хотите удалить событие: ' + this.data.event.eventName}})
      confDialogRef.afterClosed().subscribe((result) => {
        if (result == true){
          var action : EventResult = {action : 'delete'}
          this.dialogRef.close(action)
        }
      })
    }
  }

  private validateDates(){
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

  private validateWeekdaysNotEmpty(){
    return (form: FormGroup) => {
      const isRecur = form.get('isRecur')?.value  
      const weekdays = form.get('weekdays')?.value

      const error = 
           !isRecur || weekdays?.length > 0 ? null : { InvalidInput: true }
      form.get('weekdays')?.setErrors(error);
      return error;
      }
  }
}
