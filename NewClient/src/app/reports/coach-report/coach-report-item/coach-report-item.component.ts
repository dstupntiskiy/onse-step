import { Component, input } from '@angular/core';
import { CoachWithEventsDto } from '../../models/coaches-report.model';
import { CardComponent } from '../../../shared/components/card/card.component';
import { MatButtonModule } from '@angular/material/button';
import { EventReportItemComponent } from '../event-report-item/event-report-item.component';

@Component({
  selector: 'app-coach-report-item',
  standalone: true,
  imports: [CardComponent,
    MatButtonModule,
    EventReportItemComponent
  ],
  templateUrl: './coach-report-item.component.html',
  styleUrl: './coach-report-item.component.scss'
})
export class CoachReportItemComponent {
  item = input.required<CoachWithEventsDto>()

  showDetailes: boolean = false

  toggleDetails(){
    this.showDetailes = !this.showDetailes
  }
}
