import { Component, inject, input } from '@angular/core';
import { IsMobileService } from '../../../../services/is-mobile.service';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  header = input<string>()

  isMobilieService = inject(IsMobileService)
}
