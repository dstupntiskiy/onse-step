import { Component, Input, OnInit } from '@angular/core';

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
    this.eventStart = this.getFormattedTime(this.start)
    this.eventEnd = this.getFormattedTime(this.end)
  }

  private getFormattedTime(date: Date):string{
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }
}
