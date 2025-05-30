import { Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MembershipsReportComponent } from './memberships-report/memberships-report.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { OneTimeVisitsReportComponent } from './one-time-visits-report/one-time-visits-report.component';
import { CoachReportComponent } from "./coach-report/coach-report.component";
import { PageComponent } from '../shared/components/page/page.component';
import { DutyReportComponent } from './duty-report/duty-report.component'

export interface DateRange{
  startDate: Date,
  endDate: Date
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTabsModule,
    MembershipsReportComponent,
    MatButtonModule,
    OneTimeVisitsReportComponent,
    CoachReportComponent,
    PageComponent,
    DutyReportComponent
],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  defaultStartDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  defaultEndDate: Date = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1, 0, 0, -1)
  
  periodStartDate = signal<Date>(this.defaultStartDate)
  periodEndDate = signal<Date>(this.defaultEndDate)

  startDateFormControl = new FormControl<Date>(this.defaultStartDate)
  endDateFormControl = new FormControl<Date>(this.defaultEndDate)

  onRecalculate(){
    this.periodStartDate.update(() => {
      if(this.startDateFormControl.value)
        return this.startDateFormControl.value
      return this.defaultStartDate
    })
    this.periodEndDate.update(() =>{
      if(this.endDateFormControl.value)
        return this.endDateFormControl.value
      return this.defaultEndDate
    })
  }
}
