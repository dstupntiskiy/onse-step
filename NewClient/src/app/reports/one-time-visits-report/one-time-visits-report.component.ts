import { Component, effect, inject, input, signal } from '@angular/core';
import { DateRange } from '../reports.component';
import { ReportService } from '../report.service';
import { OnetimeVisitStyle } from '../models/style-report.model';
import { AmountComponent } from '../shared/amount/amount.component';
import { OnetimeVisitsAmountsComponent } from './onetime-visits-amounts/onetime-visits-amounts.component';

@Component({
  selector: 'app-one-time-visits-report',
  standalone: true,
  imports: [
    AmountComponent, 
    OnetimeVisitsAmountsComponent ],
  templateUrl: './one-time-visits-report.component.html',
  styleUrl: './one-time-visits-report.component.scss'
})
export class OneTimeVisitsReportComponent {
  dateRange = input.required<DateRange>()

  reportService = inject(ReportService)

  onetimeVisits = signal<OnetimeVisitStyle[]>([])
  onetimeVisitsTotalAmount = signal<number>(0)

  constructor(){
    effect(() =>{
      if(this.dateRange().startDate && this.dateRange().endDate)
        {
          this.reportService.getOnetimeVisitsStylesByPeriod(this.dateRange().startDate, this.dateRange().endDate)
              .subscribe((result : OnetimeVisitStyle[]) => {
                this.onetimeVisits.update(() => result)
  
                const totalAmount = result.reduce((sum, item) => sum + item.totalAmount, 0)
                this.onetimeVisitsTotalAmount.update(() => totalAmount)
              })
        }
    })
  }
}
