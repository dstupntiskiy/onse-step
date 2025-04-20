import { Component, ElementRef, HostListener, input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

export interface ChartData{
  name: string,
  value: number
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [
    NgxChartsModule
  ],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent {
  chartData = input.required<ChartData[]>()
  xLabel = input<string>('')
  yLabel = input<string>('')
  view: [number,number] = [350,300]

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  showGridLines = false

  constructor(private elRef: ElementRef){

  }

  ngOnInit(){
    this.updateChartSize()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void{
    this.updateChartSize()
  }

  updateChartSize(){
    const parent = this.elRef.nativeElement.querySelector('#chartContainer');
    if(parent){
      this.view = [parent.clientWidth, 300]
    }
  }
}
