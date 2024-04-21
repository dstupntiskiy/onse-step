import { Component, Input } from '@angular/core';
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
  @Input() start: Date;
  @Input() end: Date;

  eventStart: string;
  eventEnd: string;

  ngOnInit(){
    this.eventStart = getFormattedTime(this.start)
    this.eventEnd = getFormattedTime(this.end)
  }
}
