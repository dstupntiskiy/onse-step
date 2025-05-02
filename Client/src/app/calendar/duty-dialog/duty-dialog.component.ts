import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { DynamicComponent } from '../../shared/dialog/base-dialog/base-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTimepickerModule} from '@angular/material/timepicker';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../event/event.service';
import { EventDutyModel } from '../event/event.model';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { finalize } from 'rxjs';
import { SnackBarService } from '../../services/snack-bar.service';
import { Duty, DutyListComponent } from './duty-list/duty-list.component';
import { DialogService } from '../../services/dialog.service';
import { ConfirmationDialogComponent } from '../../shared/dialog/confirmation-dialog/confirmation-dialog.component';

export interface DutyDialogData{
  id: string,
  startDateTime: Date
}

@Component({
  selector: 'app-duty-dialog',
  standalone: true,
  imports: [
    MatIcon,
    MatTimepickerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    DutyListComponent,
    
  ],
  templateUrl: './duty-dialog.component.html',
  styleUrl: './duty-dialog.component.scss'
})
export class DutyDialogComponent implements DynamicComponent {
  data = input<DutyDialogData>()
  evenDuty = signal<EventDutyModel| undefined >(undefined)
  selectedDuty = signal<Duty|undefined>(undefined)

  eventDutyDeleted = output<string>()

  start = new FormControl<Date | null>(null)
  end = new FormControl<Date | null>(null)

  eventService = inject(EventService)
  spinnerService = inject(SpinnerService)
  snackbarService = inject(SnackBarService)
  dialogService = inject(DialogService)

  constructor(public dialog: MatDialogRef<DutyDialogComponent>){
    effect(() => {
      const startDate = this.data()?.startDateTime
      if(startDate){
        this.start.setValue(startDate)
        var endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
        this.end.setValue(endDate)
      }
    })
    effect(() => {
      if(this.data()?.id){
        this.spinnerService.loadingOn()
        this.eventService.GetEventDutyById(this.data()?.id!)
          .pipe(finalize(() => this.spinnerService.loadingOff()))
          .subscribe(result => {
            this.evenDuty.set(result)
            this.start.setValue(this.evenDuty()?.startDateTime!)
            this.end.setValue(this.evenDuty()?.endDateTime!)
            this.selectedDuty.set({ name: this.evenDuty()?.name!, color: this.evenDuty()?.color! })
          })
      }
    })  
  }

  onClose(){
    this.dialog.close()
  }

  onSave(){
    const eventDuty = new EventDutyModel
    eventDuty.id = this.data()?.id as string
    eventDuty.startDateTime = this.start.value as Date
    eventDuty.endDateTime = this.end.value as Date
    eventDuty.color = this.selectedDuty()?.color as string
    eventDuty.name = this.selectedDuty()?.name as string

    this.spinnerService.loadingOn()
    this.eventService.saveEventDuty(eventDuty)
      .pipe(finalize(() => this.spinnerService.loadingOff()))
      .subscribe((result: EventDutyModel) => {
        if(result){
          this.snackbarService.success('Дежурство сохранено')
          this.dialog.close(result)
        }
      })
  }

  onDelete(){
    this.dialogService.showDialog(ConfirmationDialogComponent, {message: 'Вы уверены, что хотите удалить дежурство?'})
      .afterClosed().subscribe((result) =>{
        if(result == true){
          this.spinnerService.loadingOn()
          this.eventService.deleteEventDutyById(this.data()?.id as string)
            .pipe(finalize(() => this.spinnerService.loadingOff()))
            .subscribe((deleteResult) => {
              if(deleteResult){
                this.eventDutyDeleted.emit(this.data()?.id as string)
                this.dialog.close()
              }
            })
        }
      })
  }
}
