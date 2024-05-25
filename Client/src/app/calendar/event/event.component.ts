import { Component, Input, input } from '@angular/core';
import { getFormattedTime } from '../../shared/helpers/time-helper';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent {
  @Input() title: string;
  borderColor = input('teal')
  start = input('', {
    transform: (value: Date) => getFormattedTime(value)
  });
  end = input('', {
    transform: (value: Date) => getFormattedTime(value)
  });
  groupName = input('');
}
