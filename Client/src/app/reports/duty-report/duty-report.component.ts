import { Component, effect, inject, input, signal } from '@angular/core';
import { DateRange } from '../reports.component';
import { ReportService } from '../report.service';
import { EventDutyReport } from '../models/eventDutyReport.model';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-duty-report',
  imports: [
    CardComponent
  ],
  templateUrl: './duty-report.component.html',
  styleUrl: './duty-report.component.scss'
})
export class DutyReportComponent {
  dateRange = input.required<DateRange>()

  reportService = inject(ReportService)

  eventDutys = signal<EventDutyReport[]>([])


  constructor(){
    effect(() => {
      if(this.dateRange().startDate && this.dateRange().endDate){
        this.reportService.getEventDutiesReportByPeriod(this.dateRange().startDate, this.dateRange().endDate)
          .subscribe((result: EventDutyReport[]) => {
            this.eventDutys.set(result)
          })
      }
    })
  }
}
