import { ChangeDetectorRef, Component, computed, input, model, signal } from '@angular/core';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import { Attendence } from '../../shared/models/attendence-model';
import { EventService } from '../event/event.service';
import { catchError, finalize, of } from 'rxjs';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-participant',
  standalone: true,
  imports: [
    MatSlideToggleModule
  ],
  templateUrl: './participant.component.html',
  styleUrl: './participant.component.scss'
})
export class ParticipantComponent {
  attendy = model<Attendence>(new Attendence)
  eventId = input<string>('')
  constructor(private eventService: EventService,
    private snackBarService: SnackBarService,
    private cdr: ChangeDetectorRef
  ){}

  onCheck(event: MatSlideToggleChange){
    if(event.checked){
      this.eventService.addAttendy(this.eventId(), this.attendy().client.id)
        .pipe(
          catchError(() => { 
            this.snackBarService.error("Не удалось отметить участника")
            this.attendy().isAttendant = false
            return of();
        })
        )
        .subscribe(() => {
          this.attendy().isAttendant = true
    })
    }
    else{
      this.eventService.removeAttendy(this.eventId(), this.attendy().client.id)
        .pipe(
          catchError(() => {
            this.snackBarService.error("Не удалось удалить участника")
            this.attendy().isAttendant = true
            return of();
          }))
        .subscribe(() => {
          this.attendy().isAttendant = false
    })
    }
  }
}
