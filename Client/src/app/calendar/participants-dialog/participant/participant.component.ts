import { Component, input, model } from '@angular/core';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { catchError, of, switchMap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Attendence } from '../../../shared/models/attendence-model';
import { EventService } from '../../event/event.service';
import { SnackBarService } from '../../../services/snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';

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


  constructor(private eventService: EventService,
    private snackBarService: SnackBarService,
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
                catchError((error: HttpErrorResponse) =>{
                  if(error.status != 200){
                    this.snackBarService.error("Не удалось удалить участника")
                    this.isAttendant.setValue(true, {emitEvent: false})
                    return of(false)
                  }
                  return of(true)
                })
              )
          }
          else{
            return this.eventService.removeAttendy(this.eventId(), this.attendy().client.id)
              .pipe(
                catchError((error: HttpErrorResponse) => {
                  if(error.status != 200){
                    this.snackBarService.error("Не удалось удалить участника")
                    this.isAttendant.setValue(true, {emitEvent: false})
                    return of(true)
                  }
                  return of(false)
                })
              )
          }
        })
    ).subscribe()
  }
}
