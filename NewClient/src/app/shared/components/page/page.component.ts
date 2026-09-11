import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-page',
  standalone: true,
  templateUrl: './page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './page.component.scss'
})
export class PageComponent {
  scroll = input<boolean>(true)
}
