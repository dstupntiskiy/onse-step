import { Component, effect, inject, input, signal } from '@angular/core';
import { DateRange } from '../reports.component';
import { ReportService } from '../report.service';
import { CoachWithEventsDto } from '../models/coaches-report.model';
import { CoachReportItemComponent } from './coach-report-item/coach-report-item.component';

@Component({
  selector: 'app-coach-report',
  standalone: true,
  imports: [
    CoachReportItemComponent
  ],
  templateUrl: './coach-report.component.html',
  styleUrl: './coach-report.component.scss'
})
export class CoachReportComponent {
  dateRange = input.required<DateRange>()

  reportService = inject(ReportService)
  coachesWithEvents = signal<CoachWithEventsDto[]>([])

  constructor(){
    effect(() =>{
      if(this.dateRange().startDate && this.dateRange().endDate){
        this.reportService.getAllCoachesEventsWithParticipantsByPeriod(this.dateRange().startDate, this.dateRange().endDate)
          .subscribe((result: CoachWithEventsDto[]) =>{
            this.coachesWithEvents.set(result)
          })
      }
    })
  }
}
