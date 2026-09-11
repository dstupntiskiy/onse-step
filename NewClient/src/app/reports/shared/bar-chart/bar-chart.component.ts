import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
export interface ChartData { name: string; value: number; }
@Component({selector:'app-bar-chart',standalone:true,imports:[DecimalPipe],templateUrl:'./bar-chart.component.html',styleUrl:'./bar-chart.component.scss'})
export class BarChartComponent {
 chartData = input.required<ChartData[]>();
 xLabel = input(''); yLabel = input('');
 maximum = computed(() => Math.max(1,...this.chartData().map(item=>Math.abs(item.value))));
}