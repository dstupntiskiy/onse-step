import { Component, Input, input } from '@angular/core';
import { getFormattedTime } from '../../shared/helpers/time-helper';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent {
  @Input() title: string;
  borderColor = input('teal')
  start = input('');
  end = input('');
  groupName = input('');
  coachName = input<string>('')
}
