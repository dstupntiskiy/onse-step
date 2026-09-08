import { Component, computed, inject, input } from '@angular/core';
import { AmountByDate } from '../../models/amount-by-date.model';
import { BarChartComponent, ChartData } from '../../shared/bar-chart/bar-chart.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-amounts-by-date',
  standalone: true,
  imports: [
    BarChartComponent
  ],
  providers:[
    DatePipe
  ],
  templateUrl: './amounts-by-date.component.html',
  styleUrl: './amounts-by-date.component.scss'
})
export class AmountsByDateComponent {
  amountsByDate = input.required<AmountByDate[]>()

  datePipe = inject(DatePipe)

  chartData = computed<ChartData[]>(() => {
    return this.amountsByDate().map(m => ({
      name: this.datePipe.transform(m.key, 'dd.MM') as string ,
      value: m.value
    }))
   })
}
