import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { addHours, getFormattedTime, getHalfHourIntervalFromDate, getHalfHourIntervals, setTimeFromStringToDate } from '../../shared/helpers/time-helper';
import { Group } from '../../shared/models/group-model';
import { GroupService } from '../../groups/group.service';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from '../../shared/dialog/confirmation-dialog/confirmation-dialog.component';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from '../../shared/adapters/custom.date.adapter';
import { DeleteDialogComponent, DeleteResult } from '../delete-dialog/delete-dialog.component';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { finalize, Observable, of } from 'rxjs';
import { EventRequestModel, EventService } from '../event/event.service';
import { Guid } from 'typescript-guid';
import { OverlayModule } from '@angular/cdk/overlay';
import { PaletteComponent } from '../../shared/components/palette/palette.component';
import { RecurrenceService } from '../recurrence/recurrence.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { CoachModel } from '../../shared/models/coach-model';
import { CoachService } from '../../coaches/coach.service';
import { DialogService } from '../../services/dialog.service';
import { GroupDialogComponent } from '../../groups/group-dialog/group-dialog.component';
import { EventCoachSubstitutionModel, EventModel, EventType } from '../event/event.model';
import { RentClientComponent } from './rent-client/rent-client.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CoachSubstitutionComponent } from './coach-substitution/coach-substitution.component';
import { DynamicComponent } from '../../shared/dialog/base-dialog/base-dialog.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { UpdateOnlyThisDialogComponent } from './update-only-this-dialog/update-only-this-dialog.component';
import { EventParticipantsComponent } from './event-participants/event-participants.component';
import { EventOnetimeVisitsComponent } from './event-onetime-visits/event-onetime-visits.component';

export interface EventDialogData {
  id: string
  startDateTime: string
}

export interface Recurrence {
  exceptdates?: string[];
  startDate: Date;
  endDate: Date;
  daysOfWeek: number[];
  id: string;
}

export interface Weekday {
  number: number;
  name: string;
}

const WEEKDAYS: Weekday[] = [
  { number: 1, name: 'Понедельник' },
  { number: 2, name: 'Вторник' },
  { number: 3, name: 'Среда' },
  { number: 4, name: 'Четверг' },
  { number: 5, name: 'Пятница' },
  { number: 6, name: 'Суббота' },
  { number: 0, name: 'Воскресенье' },
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
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    OverlayModule,
    PaletteComponent,
    MatIconModule,
    DatePipe,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
    RentClientComponent,
    CoachSubstitutionComponent,
    AsyncPipe,
    EventParticipantsComponent,
    EventOnetimeVisitsComponent],
  templateUrl: './event-dialog.component.html',
  styleUrl: './event-dialog.component.scss',
  providers: [
    GroupService,
    CoachService,
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class EventDialogComponent implements DynamicComponent {
  data = input.required<EventDialogData>()
  title = computed(() => this.initialEvent()?.name ?? 'Новое событие')

  coach: CoachModel | undefined

  timeOptions: string[] = getHalfHourIntervals();
  weekDaysList: Weekday[] = WEEKDAYS;

  groups: Group[];
  disableRecur: boolean;
  pickerStart: Date;
  pickerEnd: Date;
  color = signal<string>('');
  isColorSelectorOpen: boolean = false;
  coachId = signal<string | null>(null)

  onetimeVisitorsCount: number = 0;

  initialEvent = signal<EventModel | null>(null);

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    start: new FormControl<string>('', [Validators.required]),
    end: new FormControl<string>('', [Validators.required]),
    group: new FormControl<string | null>(null),
    weekdays: new FormControl<Weekday[]>([]),
    isRecur: new FormControl<boolean>(false),
    recurStart: new FormControl<Date | null>(null),
    recurEnd: new FormControl<Date | null>(null),
    eventType: new FormControl<EventType>(EventType.Event)
  }, { validators: [this.validateDates(), this.validateWeekdaysNotEmpty()] })

  get name() { return this.form.controls.name as FormControl }
  get start() { return this.form.controls.start as FormControl }
  get end() { return this.form.controls.end as FormControl }
  get group() { return this.form.controls.group as FormControl }
  get weekdays() { return this.form.controls.weekdays as FormControl }
  get isRecur() { return this.form.controls.isRecur as FormControl }
  get recurStart() { return this.form.controls.recurStart as FormControl }
  get recurEnd() { return this.form.controls.recurEnd as FormControl }
  get eventType() { return this.form.controls.eventType as FormControl }

  formValues = toSignal(this.form.valueChanges)

  private initialFormValues: any;
  private initialColor: string;

  dirty = computed(() => {
    this.formValues(); // subscribe to form changes

    if (!this.initialFormValues) return false;

    const currentFormValues = this.form.getRawValue();
    const headersDirty = JSON.stringify(currentFormValues) !== JSON.stringify(this.initialFormValues);

    const currentColor = this.color();
    const colorDirty = currentColor !== this.initialColor;

    const currentCoachId = this.coachId() ?? this.initialEvent()?.coach?.id;
    const initialCoachId = this.initialEvent()?.coach?.id;
    const coachDirty = currentCoachId != initialCoachId;

    return headersDirty || colorDirty || coachDirty;
  })


  eventTypes = EventType

  substitution$: Observable<EventCoachSubstitutionModel>
  coaches$: Observable<CoachModel[]>

  dialogService = inject(DialogService)
  eventService = inject(EventService)
  coachService = inject(CoachService)

  date = computed(() => {
    var dateValue = this.initialEvent()?.startDateTime ?? new Date(this.data().startDateTime)
    var parsedDate = new Date(dateValue)
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }
  )

  eventSaved = output<EventModel[]>()
  eventDeleted = output<string[]>()

  isLoading: boolean = true

  triggerUpdateGroupMembersCount = signal<{}>({})

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    private groupService: GroupService,
    private spinnerService: SpinnerService,
    private recurrenceService: RecurrenceService,
  ) { }

  public ngOnInit() {
    this.loadData()
  }

  private loadData() {
    var request = this.data()?.id ? this.eventService.getEventById(this.data()?.id) : of(new EventModel)
    request
      .pipe(
        finalize(() => {
          this.init()
          this.isLoading = false
        }))
      .subscribe(result => {
        if (result) {
          this.initialEvent.update(() => result)
        }
      })
  }

  init() {
    this.coach = this.initialEvent()?.coach
    this.substitution$ = this.eventService.getCoachSubstitution(this.initialEvent()?.id as string)
    this.coaches$ = this.coachService.getCoaches(true)

    this.color.set(this.initialEvent()?.color ?? 'teal');
    this.eventType.setValue(this.initialEvent()?.eventType ?? EventType.Event)
    if (this.initialEvent()?.id) {
      this.eventType.disable()
    }

    this.groupService.getGroups(true).subscribe((groups) => {
      this.groups = groups;

      const initialGroupId = this.initialEvent()?.group?.id;
      let selectedGroup = groups.find(g => g.id === initialGroupId);

      // Если группы нет в списке, используем из initialEvent и добавляем в список
      if (!selectedGroup && this.initialEvent()?.group) {
        selectedGroup = this.initialEvent()?.group!;
        this.groups.push(selectedGroup);
      }

      // Устанавливаем значение и блокируем поле при необходимости
      this.group.setValue(selectedGroup?.id as string);
      if (this.group.value) {
        this.group.disable();
      }
      this.updateSnapshot();
    });

    this.name.setValue(this.initialEvent()?.name as string)
    this.start?.setValue(getFormattedTime(this.initialEvent()?.startDateTime as Date ?? this.data().startDateTime))
    this.initialEvent()?.endDateTime
      ? this.end?.setValue(getFormattedTime(this.initialEvent()?.endDateTime as Date))
      : this.end?.setValue(getFormattedTime(addHours(this.date(), 1)))

    this.isRecur?.setValue(!!(this.initialEvent()?.recurrence?.startDate));
    if (this.isRecur?.value || this.initialEvent()?.id) {
      this.isRecur?.disable();

      this.recurStart?.disable();
      this.recurEnd?.disable();
      this.weekdays?.disable();
      this.recurStart?.setValue(this.initialEvent()?.recurrence?.startDate as Date)
      this.recurEnd?.setValue(this.initialEvent()?.recurrence?.endDate as Date)
      this.weekdays?.setValue(this.initialEvent()?.recurrence?.daysOfWeek?.map(x => WEEKDAYS.find(y => y.number == x)) as Weekday[])
    }
    this.updateSnapshot();
  }

  private updateSnapshot() {
    this.initialFormValues = this.form.getRawValue();
    this.initialColor = this.color();
  }

  submit(): void {
    if (this.form.valid) {
      const data: EventRequestModel = {
        id: this.initialEvent()?.id as string,
        startDateTime: setTimeFromStringToDate(this.date(), this.start?.value as string),
        endDateTime: setTimeFromStringToDate(this.date(), this.end?.value as string),
        name: this.name.value as string,
        groupId: this.group.value as string,
        color: this.color(),
        coachId: this.coachId() ?? this.initialEvent()?.coach?.id,
        eventType: this.eventType.value as EventType,
        isRecurrent: this.isRecur.value as boolean,
        updateOnlyThis: true
      }
      if (this.isRecur?.value) {
        data.daysOfWeek = (this.weekdays?.value as Weekday[]).map((x: Weekday) => x.number),
          data.exceptDates = this.initialEvent()?.recurrence?.exceptdates,
          data.recurrencyStartDate = this.recurStart?.value as Date,
          data.recurrencyEndDate = this.recurEnd?.value as Date,
          data.recurrenceId = this.initialEvent()?.recurrence?.id ?? Guid.EMPTY.toString()
      }

      if (this.isRecur?.value && this.dirty()) {
        var dialog = this.dialogService.showDialog(UpdateOnlyThisDialogComponent, {})
        dialog.afterClosed().subscribe((result) => {
          if (result == 'all') {
            data.updateOnlyThis = false
          }
          if (!result) {
            return;
          }
          this.saveEvent(data)
        })
      }
      else {
        this.saveEvent(data)
      }

    }
  }

  private saveEvent(event: EventRequestModel) {
    this.spinnerService.loadingOn();
    this.eventService.saveEvent(event)
      .pipe(
        finalize(() => this.spinnerService.loadingOff())
      )
      .subscribe((events: EventModel[]) => {
        if (events) {
          this.eventSaved.emit(events)
          if (events.length == 1) {
            this.initialEvent.update(() => events[0])
            this.init()
          }
          else {
            this.dialogRef.close()
          }
        }
      })
  }

  changeIsRecur(isRecur: boolean) {
    this.isRecur?.setValue(isRecur);
  }

  onCloseClick(): void {
    this.dialogRef.close()
  }

  onDelete(): void {
    if (this.isRecur?.value) {
      var deleteDialog = this.dialogService.showDialog(DeleteDialogComponent,
        {
          message: 'Удалить все повторения или экземпляр?',
          eventName: this.initialEvent()?.name
        })
      deleteDialog.afterClosed().subscribe((result: DeleteResult) => {
        if (result?.delete == 'all') {
          var recurrToDelete = this.initialEvent()?.recurrence?.id ?? '';
          this.recurrenceService.deleteRecurrence(recurrToDelete).subscribe((eventIdsToDelete: string[]) => {
            this.eventDeleted.emit(eventIdsToDelete)
            this.dialogRef.close()
          })
        }
        if (result?.delete == 'one') {
          var event = this.initialEvent() as EventModel
          this.eventService.deleteEvent(event).subscribe(() => {
            this.eventDeleted.emit([event.id])
            this.dialogRef.close()
          })

        }
      })
    }
    else {
      var confDialogRef = this.dialogService.showDialog(ConfirmationDialogComponent,
        {
          message: 'Вы уверены что хотите удалить событие: ' + this.initialEvent()?.name
        })
      confDialogRef.afterClosed().subscribe((result) => {
        if (result == true) {
          this.eventService.deleteEvent(this.initialEvent() as EventModel).subscribe(() => {
            this.eventDeleted.emit([this.initialEvent()?.id as string])
            this.dialogRef.close()
          })
        }
      })
    }
  }

  colorSelected(color: string) {
    this.color.update(() => color);
    this.isColorSelectorOpen = false;
  }

  onEditGroupClick() {
    this.dialogService.showDialog(GroupDialogComponent, { id: this.initialEvent()?.group?.id as string })
      .afterClosed().subscribe(() => {
        this.triggerUpdateGroupMembersCount.set({})
      })
  }

  onCoachChange(coachId: string) {
    this.coachId.update(() => coachId)
  }

  private validateDates(): ValidatorFn {
    return (form: AbstractControl) => {
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

  private validateWeekdaysNotEmpty(): ValidatorFn {
    return (form: AbstractControl) => {
      const isRecur = form.get('isRecur')?.value
      const weekdays = form.get('weekdays')?.value

      const error =
        !isRecur || weekdays?.length > 0 ? null : { InvalidInput: true }
      form.get('weekdays')?.setErrors(error);
      return error;
    }
  }


}
