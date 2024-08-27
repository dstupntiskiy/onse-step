import { Component, inject, input, model } from '@angular/core';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { catchError, of, switchMap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Attendence } from '../../../shared/models/attendence-model';
import { EventService } from '../../event/event.service';
import { SnackBarService } from '../../../services/snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientNameComponent } from '../../../shared/components/client-name/client-name.component';
import { MembershipDetailsComponent } from '../../../shared/components/membership-details/membership-details.component';
import { StyleModel } from '../../../shared/models/style-model';
import { MembershipService } from '../../../membership/membership.service';

@Component({
  selector: 'app-participant',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    ReactiveFormsModule,
    ClientNameComponent,
    MembershipDetailsComponent
  ],
  templateUrl: './participant.component.html',
  styleUrl: './participant.component.scss'
})
export class ParticipantComponent {
  attendy = model.required<Attendence>()
  eventId = input<string>('')
  eventDate = input<Date>()
  style = input<StyleModel>()
  isAttendant = new FormControl<boolean>(false)

  membershipService = inject(MembershipService)

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
                catchError(() =>{
                  this.snackBarService.error("Не удалось отметить участника")
                  this.isAttendant.setValue(false, {emitEvent: false})
                  this.updateMembership()
                  return of(false)
                })
              )
          }
          else{
            return this.eventService.removeAttendy(this.eventId(), this.attendy().client.id)
              .pipe(
                catchError((error: HttpErrorResponse) => {
                  if(error.status != 200)
                  this.snackBarService.error("Не удалось удалить участника")
                  this.isAttendant.setValue(true, {emitEvent: false})
                  this.updateMembership()
                  return of(true)
                })
              )
          }
        })
    ).subscribe()
  }

  onClientChange(){
    this.updateMembership()
  }

  private updateMembership(){
    this.membershipService.getActualMembership(this.attendy().client.id, this.style()?.id, this.eventDate())
      .subscribe(result =>{
        this.attendy().membership = result
      })
  }
  
}

