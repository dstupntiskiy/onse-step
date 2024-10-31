import { Component, computed, input } from '@angular/core';
import { CoachWithEventsDto } from '../../models/coaches-report.model';
import { MatCardModule } from '@angular/material/card'
@Component({
  selector: 'app-coach-report-item',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './coach-report-item.component.html',
  styleUrl: './coach-report-item.component.scss'
})
export class CoachReportItemComponent {
  item = input.required<CoachWithEventsDto>()

  eventCount = computed(() => this.item().eventWithParticipants.length)
  participantsCount = computed(() => this.item().eventWithParticipants.reduce((acc, cur) => acc + cur.participantsCount, 0))
  onetimeVisitsCount = computed(() => this.item().eventWithParticipants.reduce((acc, cur) => acc + cur.onetimeVisitsCount, 0))
}
