import { Component, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { EventWithParticipantsDto } from '../../models/coaches-report.model';

@Component({
  selector: 'tr[app-event-report-item]',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './event-report-item.component.html',
  styleUrl: './event-report-item.component.scss'
})
export class EventReportItemComponent {
  readonly item = input.required<EventWithParticipantsDto>();
}
