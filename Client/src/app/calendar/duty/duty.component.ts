import { Component, input } from '@angular/core';

@Component({
  selector: 'app-duty',
  imports: [],
  templateUrl: './duty.component.html',
  styleUrl: './duty.component.scss'
})
export class DutyComponent {
  title = input<string>()
  color = input<string>('yellow')
  start = input('')
  end = input('')
  isCompactView = input<boolean>(true)
}
