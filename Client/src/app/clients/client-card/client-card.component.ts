import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Client } from '../../shared/models/client-model';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [
    DatePipe,
    CardComponent
  ],
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.scss'
})
export class ClientCardComponent {
  client = input.required<Client>()
  clientClicked = output<Client>()
}
