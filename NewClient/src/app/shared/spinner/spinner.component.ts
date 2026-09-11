import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  providers:[
  ],
  templateUrl: './spinner.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  isLoading$$ = input.required<boolean>()
  size = input<'small' | 'large'>('large')
  diameter = computed<number>(() => this.size() == 'small' ? 30 : 50)
}
