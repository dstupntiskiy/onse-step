import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-duty',
  imports: [
    DatePipe
  ],
  templateUrl: './duty.component.html',
  styleUrl: './duty.component.scss'
})
export class DutyComponent {
  title = input<string>()
  color = input<string>('yellow')
  start = input('')
  end = input('')
  isCompactView = input<boolean>(false)

  diff = computed(() => {
    var start = new Date(this.start())
    var end = new Date(this.end())

    var diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return diff
  })
}
