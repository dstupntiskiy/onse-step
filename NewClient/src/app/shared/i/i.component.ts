import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-i',
  standalone: true,
  imports: [],
  template: '<div><span>i</span></div>',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './i.component.scss'
})
export class IComponent {

}
