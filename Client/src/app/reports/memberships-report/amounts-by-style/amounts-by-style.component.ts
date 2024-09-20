import { Component, computed, input } from '@angular/core';
import { MembershipStyle } from '../../models/style-report.model';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BarChartComponent, ChartData } from '../../shared/bar-chart/bar-chart.component';


@Component({
  selector: 'app-amounts-by-style',
  standalone: true,
  imports: [
    BarChartComponent
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
}
