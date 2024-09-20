import { Component, computed, input } from '@angular/core';
import { BarChartComponent, ChartData } from '../../shared/bar-chart/bar-chart.component';
import { OnetimeVisitStyle } from '../../models/style-report.model';

@Component({
  selector: 'app-onetime-visits-amounts',
  standalone: true,
  imports: [BarChartComponent],
  templateUrl: './onetime-visits-amounts.component.html',
  styleUrl: './onetime-visits-amounts.component.scss'
})
export class OnetimeVisitsAmountsComponent {
  onetimeVisits = input.required<OnetimeVisitStyle[]>()

  data = computed<ChartData[]>(() =>{
    return this.onetimeVisits().map(m => ({
      name: m.styleName,
      value: m.totalCount
    }))
  })

  amounts = computed<ChartData[]>(() =>{
    return this.onetimeVisits().map(m => ({
      name: m.styleName,
      value: m.totalAmount
    }))
  })
}
