import { Component, effect, inject, input, model, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Group } from '../../shared/models/group-model';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { finalize } from 'rxjs';
import { EventService } from '../event/event.service';
import { Attendence } from '../../shared/models/attendence-model';
import { MatButtonModule } from '@angular/material/button';
import { ParticipantComponent } from './participant/participant.component';
import { DynamicComponent } from '../../shared/dialog/base-dialog/base-dialog.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

export interface ParticipantsDialogData{
  eventId: string,
  eventDate: Date,
  group?: Group
}

@Component({
  selector: 'app-participants-dialog',
  standalone: true,
  imports: [
    ParticipantComponent,
    MatButtonModule,
    MatDialogModule,
    SpinnerComponent
  ],
  templateUrl: './participants-dialog.component.html',
  styleUrl: './participants-dialog.component.scss'
})
export class ParticipantsDialogComponent implements DynamicComponent {
  title = signal<string>('Участники')
  
  attendants = model<Attendence[]>()
  spinnerService = inject(SpinnerService)
  data = input.required<ParticipantsDialogData>()
  isLoading : boolean = false

  constructor(
    private eventService: EventService,
    public dialogRef: MatDialogRef<ParticipantsDialogComponent>,
  ){
    effect(() =>{
      this.isLoading = true
      this.eventService.getAttendents(this.data().eventId)
        .pipe(
          finalize(() => {
            this.isLoading = false
        }))
        .subscribe(result => {
          this.attendants.set(result)
        })
      })
  }

  onClose(){
    this.dialogRef.close();
  }
}
