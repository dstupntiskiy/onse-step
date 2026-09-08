import { Component, input } from '@angular/core';
import { EventWithParticipantsDto } from '../../models/coaches-report.model';
import { CardComponent } from '../../../shared/components/card/card.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-report-item',
  standalone: true,
  imports: [CardComponent, DatePipe
  ],
  templateUrl: './event-report-item.component.html',
  styleUrl: './event-report-item.component.scss'
})
export class EventReportItemComponent {
  item = input.required<EventWithParticipantsDto>()
}
