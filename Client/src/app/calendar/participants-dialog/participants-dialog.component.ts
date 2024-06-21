import { ChangeDetectorRef, Component, Inject, effect, inject, input, model } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Group } from '../../shared/models/group-model';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { finalize, startWith } from 'rxjs';
import { EventService } from '../event/event.service';
import { Attendence } from '../../shared/models/attendence-model';
import { MatButtonModule } from '@angular/material/button';
import { ParticipantComponent } from './participant/participant.component';
import { DynamicComponent } from '../../shared/dialog/base-dialog/base-dialog.component';

export interface ParticipantsDialogData{
  eventId: string,
  group?: Group
}

@Component({
  selector: 'app-participants-dialog',
  standalone: true,
  imports: [
    ParticipantComponent,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './participants-dialog.component.html',
  styleUrl: './participants-dialog.component.scss'
})
export class ParticipantsDialogComponent implements DynamicComponent {
  attendants = model<Attendence[]>()
  spinnerService = inject(SpinnerService)
  data = input.required<ParticipantsDialogData>()

  constructor(
    private eventService: EventService,
    public dialogRef: MatDialogRef<ParticipantsDialogComponent>,
  ){
    effect(() =>{
      this.spinnerService.loadingOn();    
    this.eventService.getAttendents(this.data().eventId)
      .pipe(
        finalize(() => {
          this.spinnerService.loadingOff()
        }),
      )
      .subscribe(result => {
        this.attendants.set(result)
      })
    })
  }

  onClose(){
    this.dialogRef.close();
  }
}
