import { Component, inject, input } from '@angular/core';
import { IsMobileService } from '../../../services/is-mobile.service';
import { PageHeaderComponent } from './page-header/page-header.component';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {
  scroll = input<boolean>(true)
  header = input<string>()

  isMobileService = inject(IsMobileService)
}
