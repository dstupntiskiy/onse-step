import { Component, computed, input } from '@angular/core';
import { MembershipStyle } from '../../models/membership-style.model';
import { NgxChartsModule } from '@swimlane/ngx-charts';

export interface ChartData{
  name: string,
  value: number
}
@Component({
  selector: 'app-amounts-by-style',
  standalone: true,
  imports: [
    NgxChartsModule
  ],
  templateUrl: './amounts-by-style.component.html',
  styleUrl: './amounts-by-style.component.scss'
})
export class AmountsByStyleComponent {
 membershipsByStyle = input.required<MembershipStyle[]>()

 chartData = computed<ChartData[]>(() => {
  return this.membershipsByStyle().map(m => ({
    name: m.styleName,
    value: m.totalCount
  }))
 })

 chartDataAmounts = computed<ChartData[]>(() => {
  return this.membershipsByStyle().map(m => ({
    name: m.styleName,
    value: m.totalAmount
  }))
 })

 showXAxis = true;
 showYAxis = true;
 gradient = false;
 showLegend = false;
 showXAxisLabel = true;
 xAxisLabel = 'Направление';
 showYAxisLabel = true;
 showGridLines = false
 yAxisLabel = 'Количество';
}
