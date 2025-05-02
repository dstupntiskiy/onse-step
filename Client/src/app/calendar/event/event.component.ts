import { Component, computed, Input, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventType } from './event.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})

export class EventComponent {
  title = input<string>();
  borderColor = input('teal')
  start = input('');
  end = input('');
  groupName = input('');
  coachName = input<string>('')
  eventType = input<EventType>()
  isCompactView = input<boolean>(false)

  icon = computed(() =>{
    switch(this.eventType()){
      
      case(EventType.Rent):{
        return 'home'
      }
      case(EventType.SpecialEvent):{
        return 'people'
      }
      default: {
        return 'event'
      }
    }
  })
}
