import { Component, effect, inject, input, signal } from '@angular/core';
import { ReportService } from '../report.service';
import { AmountComponent } from '../shared/amount/amount.component';
import { MembershipStyle } from '../models/style-report.model';
import { AmountsByStyleComponent } from './amounts-by-style/amounts-by-style.component';
import { DateRange } from '../reports.component';
import { AmountByDate } from '../models/amount-by-date.model';
import { AmountsByDateComponent } from './amounts-by-date/amounts-by-date.component';



@Component({
  selector: 'app-memberships-report',
  standalone: true,
  imports: [AmountComponent,
    AmountsByStyleComponent,
    AmountsByDateComponent
  ],
  templateUrl: './memberships-report.component.html',
  styleUrl: './memberships-report.component.scss'
})
export class MembershipsReportComponent {
  dateRange = input.required<DateRange>()

  reportService = inject(ReportService)

  membershipsTotalAmount = signal<number>(0)
  membershipStyles = signal<MembershipStyle[]>([])
  amountsByDate = signal<AmountByDate[]>([])

  constructor(){
    effect(() =>{
      if(this.dateRange().startDate && this.dateRange().endDate)
      {
        this.reportService.getMembershipsStylesByPeriod(this.dateRange().startDate, this.dateRange().endDate)
            .subscribe((result : MembershipStyle[]) => {
              this.membershipStyles.update(() => result)

              const totalAmount = result.reduce((sum, item) => sum + item.totalAmount, 0)
              this.membershipsTotalAmount.update(() => totalAmount)
            })

        this.reportService.getPaymentsAmountByDate(this.dateRange().startDate, this.dateRange().endDate)
            .subscribe((result : AmountByDate[]) => {
              this.amountsByDate.update(() => result)
            })
      }
    })
    
  }
}
