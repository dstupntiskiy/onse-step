import { ChangeDetectorRef, Component, Inject, inject, input, model } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Group } from '../../shared/models/group-model';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { finalize, startWith } from 'rxjs';
import { EventService } from '../event/event.service';
import { Attendence } from '../../shared/models/attendence-model';
import { MatButtonModule } from '@angular/material/button';
import { ParticipantComponent } from './participant/participant.component';

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
export class ParticipantsDialogComponent {
  attendants = model<Attendence[]>()
  spinnerService = inject(SpinnerService)

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {title: string, eventId: string, group?: Group},
    private eventService: EventService,
    public dialogRef: MatDialogRef<ParticipantsDialogComponent>,
  ){}

  ngOnInit(){
    this.spinnerService.loadingOn();    
    this.eventService.getAttendents(this.data.eventId)
      .pipe(
        finalize(() => {
          this.spinnerService.loadingOff()
        }),
      )
      .subscribe(result => {
        this.attendants.set(result)
      })
  }

  onClose(){
    this.dialogRef.close();
  }
}
