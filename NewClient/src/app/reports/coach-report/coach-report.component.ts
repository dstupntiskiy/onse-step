import { Component, effect, inject, input, signal } from '@angular/core';
import { DateRange } from '../reports.component';
import { ReportService } from '../report.service';
import { CoachWithEventsDto } from '../models/coaches-report.model';
import { CoachReportItemComponent } from './coach-report-item/coach-report-item.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-coach-report',
  standalone: true,
  imports: [
    CoachReportItemComponent,
    SpinnerComponent
  ],
  templateUrl: './coach-report.component.html',
  styleUrl: './coach-report.component.scss'
})
export class CoachReportComponent {
  dateRange = input.required<DateRange>()
  isLoading: boolean = true

  reportService = inject(ReportService)
  coachesWithEvents = signal<CoachWithEventsDto[]>([])

  constructor(){
    effect(() =>{
      if(this.dateRange().startDate && this.dateRange().endDate){
        this.isLoading = true
        this.reportService.getAllCoachesEventsWithParticipantsByPeriod(this.dateRange().startDate, this.dateRange().endDate)
          .pipe(
            finalize(() => this.isLoading = false)
          )
          .subscribe((result: CoachWithEventsDto[]) =>{
            this.coachesWithEvents.set(result)
          })
      }
    })
  }
}
