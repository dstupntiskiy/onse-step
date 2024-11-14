import { Component, computed, input, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [
    MatProgressSpinnerModule, 
    CommonModule],
  providers:[
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  isLoading$$ = input.required<boolean>()
  size = input<'small' | 'large'>('large')
  diameter = computed<number>(() => this.size() == 'small' ? 30 : 50)
}
