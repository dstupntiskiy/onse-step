import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { EventService } from '../../event/event.service';
import { GroupService } from '../../../groups/group.service';
import { ParticipantsDialogComponent } from '../../participants-dialog/participants-dialog.component';
import { DialogService } from '../../../services/dialog.service';
import { Group } from '../../../shared/models/group-model';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-event-participants',
  standalone: true,
  imports: [
    MatButtonModule,
    SpinnerComponent
  ],
  templateUrl: './event-participants.component.html',
  styleUrl: './event-participants.component.scss'
})
export class EventParticipantsComponent {
  eventId = input.required<string>()
  groupId = input.required<string>()
  eventDate = input.required<Date>()
  group = input.required<Group>()

  isLoading = computed(() => this.participantsLoading() || this.groupMembersCountLoading())
  participantsLoading = signal<boolean>(false)
  groupMembersCountLoading = signal<boolean>(false)

  triggerUpdateGroupMembersCount = input.required<{}>()

  participantsCount = signal<number>(0)
  groupParticipantsCount = signal<number>(0)

  eventService = inject(EventService)
  groupService = inject(GroupService)
  dialogService = inject(DialogService)

  constructor() {
    effect(() => {
      this.refetchParticipantsCount()
    }, {allowSignalWrites: true})
    effect(() =>{
      const _ = this.triggerUpdateGroupMembersCount();
      this.refetchGroupMembersCount()
    }, {allowSignalWrites: true})
  }

  onClick(){
    this.dialogService.showDialog(ParticipantsDialogComponent, {
      eventId: this.eventId(),
      group: this.group(),
      eventDate: this.eventDate()}
    )
      .afterClosed().subscribe(() => this.refetchParticipantsCount())
  }

  private refetchParticipantsCount(){
    this.participantsLoading.update(() => true)
    this.eventService.getParticipantsCount(this.eventId())
      .pipe(finalize(() => this.participantsLoading.update(() => false)))
      .subscribe(
      (result: number) =>{
        this.participantsCount.set(result);
      }
    );
  }

  private refetchGroupMembersCount(){
    this.groupMembersCountLoading.update(() => true)
    this.groupService.getGroupMembersCount(this.groupId())
      .pipe(finalize(() => this.groupMembersCountLoading.update(() => false)))
      .subscribe((result: number) =>{
        this.groupParticipantsCount.set(result);
      })
  }

}
