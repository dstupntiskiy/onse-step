import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-amount',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './amount.component.html',
  styleUrl: './amount.component.scss'
})
export class AmountComponent {
  amount = input.required<number>()
  label = input<string>('')
}
