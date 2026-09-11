import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CoachWithEventsDto } from '../../models/coaches-report.model';
import { EventReportItemComponent } from '../event-report-item/event-report-item.component';

@Component({
  selector: 'app-coach-report-item',
  standalone: true,
  imports: [DecimalPipe, MatButtonModule, MatIconModule, EventReportItemComponent],
  templateUrl: './coach-report-item.component.html',
  styleUrl: './coach-report-item.component.scss'
})
export class CoachReportItemComponent {
  readonly item = input.required<CoachWithEventsDto>();
  readonly events = computed(() => [...this.item().eventWithParticipants]
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));
  showDetails = false;

  toggleDetails(): void { this.showDetails = !this.showDetails; }
}
