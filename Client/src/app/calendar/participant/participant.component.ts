import { ChangeDetectorRef, Component, computed, input, model, signal } from '@angular/core';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import { Attendence } from '../../shared/models/attendence-model';
import { EventService } from '../event/event.service';
import { catchError, finalize, of, startWith, switchMap, tap } from 'rxjs';
import { SnackBarService } from '../../services/snack-bar.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-participant',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    ReactiveFormsModule,

  ],
  templateUrl: './participant.component.html',
  styleUrl: './participant.component.scss'
})
export class ParticipantComponent {
  attendy = model.required<Attendence>()
  eventId = input<string>('')

  isAttendant = new FormControl<boolean>(false)

  private prevValue: boolean = false;

  constructor(private eventService: EventService,
    private snackBarService: SnackBarService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(){
    this.isAttendant.setValue(this.attendy().isAttendant)

    this.isAttendant.valueChanges.pipe(
      switchMap((isChecked) => 
        {
          if(isChecked)
          {
            return this.eventService.addAttendy(this.eventId(), this.attendy().client.id)
              .pipe(
                catchError(() =>{
                  this.snackBarService.error("Не удалось отметить участника")
                  this.isAttendant.setValue(false, {emitEvent: false})
                  return of(false)
                })
              )
          }
          else{
            return this.eventService.removeAttendy(this.eventId(), this.attendy().client.id)
              .pipe(
                catchError(() => {
                  this.snackBarService.error("Не удалось удалить участника")
                  this.isAttendant.setValue(true, {emitEvent: false})
                  return of(true)
                })
              )
          }
        })
    ).subscribe()
  }
}
