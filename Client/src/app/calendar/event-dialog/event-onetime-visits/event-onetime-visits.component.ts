import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { EventType } from '../../event/event.model';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { DialogService } from '../../../services/dialog.service';
import { OnetimeVisitorDialogComponent } from '../../onetime-visitor-dialog/onetime-visitor-dialog.component';
import { StyleModel } from '../../../shared/models/style-model';
import { EventService } from '../../event/event.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-event-onetime-visits',
  standalone: true,
  imports: [
    MatButtonModule,
    SpinnerComponent
  ],
  templateUrl: './event-onetime-visits.component.html',
  styleUrl: './event-onetime-visits.component.scss'
})
export class EventOnetimeVisitsComponent {
  eventId = input.required<string>()
  eventStyle = input<StyleModel>()
  eventType = input.required<EventType | null>()

  visitorsCount = signal(0)
  isLoading = signal(false)

  dialogService = inject(DialogService)
  eventService = inject(EventService)

  eventTypes = EventType

  constructor(){
    effect(() =>{
      this.refetchOnetimeVisitorsCount()
    }, {allowSignalWrites: true})
  }

  onClick(){
    this.dialogService.showDialog(OnetimeVisitorDialogComponent, { eventId: this.eventId(), style: this.eventStyle })
      .afterClosed().subscribe(() => this.refetchOnetimeVisitorsCount())
  }

  private refetchOnetimeVisitorsCount(){
    this.isLoading.update(() => true)
    this.eventService.getOnetimeVisitorsCount(this.eventId())
      .pipe(finalize(() => this.isLoading.update(() => false)))
      .subscribe((result: number) =>{
        this.visitorsCount.update(() => result);
      })
  }
}
