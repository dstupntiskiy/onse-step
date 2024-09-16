import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ReportService } from '../report.service';
import { AmountComponent } from '../shared/amount/amount.component';
import { MembershipStyle } from '../models/membership-style.model';
import { AmountsByStyleComponent } from './amounts-by-style/amounts-by-style.component';

export interface DateRange{
  startDate: Date,
  endDate: Date
}

@Component({
  selector: 'app-memberships-report',
  standalone: true,
  imports: [AmountComponent,
    AmountsByStyleComponent
  ],
  templateUrl: './memberships-report.component.html',
  styleUrl: './memberships-report.component.scss'
})
export class MembershipsReportComponent {
  dateRange = input.required<DateRange>()

  reportService = inject(ReportService)

  membershipsTotalAmount = signal<number | undefined>(undefined)
  membershipStyles = signal<MembershipStyle[]>([])

  constructor(){
    effect(() =>{
      if(this.dateRange().startDate && this.dateRange().endDate)
      {
        this.reportService.getMembershipsAmountByPeriod(this.dateRange().startDate, this.dateRange().endDate)
          .subscribe((result : number) =>{
            this.membershipsTotalAmount.update(() => result)
            })
        
            this.reportService.getMembershipsStylesByPeriod(this.dateRange().startDate, this.dateRange().endDate)
              .subscribe((result) => {
                this.membershipStyles.update(() => result)
              })
      }
    })
    
  }
}
