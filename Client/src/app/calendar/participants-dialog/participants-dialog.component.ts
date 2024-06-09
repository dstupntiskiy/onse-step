import { Component, Inject, input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from '../../shared/models/group-model';
import { GroupService } from '../../groups/group.service';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { finalize, map } from 'rxjs';
import { ParticipantComponent } from '../participant/participant.component';
import { EventService } from '../event/event.service';
import { Attendence } from '../../shared/models/attendence-model';

@Component({
  selector: 'app-participants-dialog',
  standalone: true,
  imports: [
    ParticipantComponent
  ],
  templateUrl: './participants-dialog.component.html',
  styleUrl: './participants-dialog.component.scss'
})
export class ParticipantsDialogComponent {

  public attendants: Attendence[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {title: string, eventId: string, group?: Group},
    private groupService: GroupService,
    private spinnerService: SpinnerService,
    private eventService: EventService
  ){}

  ngOnInit(){
    this.spinnerService.loadingOn();
    this.eventService.getAttendents(this.data.eventId)
      .pipe(
        finalize(() => this.spinnerService.loadingOff()),
        
      )
      .subscribe(result => {
        this.attendants = result
      })
  }
}
