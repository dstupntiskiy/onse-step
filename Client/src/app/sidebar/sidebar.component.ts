import { Component, inject } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { IsMobileService } from '../services/is-mobile.service';

export interface navItem{
  name: string,
  link: string,
  icon: string,
  customIcon: boolean
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isMobileService = inject(IsMobileService)

  navigationList: navItem[] = [
    { name: 'Календарь', link: "", icon: 'event', customIcon: false}, 
    { name: 'Группы', link:'groups', icon: 'group', customIcon: false},
    { name: 'Клиенты', link:'clients', icon: 'person', customIcon: false},
    { name: 'Тренеры', link:'coaches', icon: 'dance_icon', customIcon: true},
    { name: 'Направления', link:'styles', icon: 'fairy-dance', customIcon: true}
  ]
}
