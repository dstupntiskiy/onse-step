import { Component, inject } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { IsMobileService } from '../services/is-mobile.service';
import { UserService } from '../shared/services/user.service';
import { subscribe } from 'diagnostics_channel';
import { MatButtonModule } from '@angular/material/button';

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
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isMobileService = inject(IsMobileService)
  userService = inject(UserService)

  navigationList: navItem[] = [
    { name: 'Календарь', link: "", icon: 'event', customIcon: false}, 
    { name: 'Группы', link:'groups', icon: 'group', customIcon: false},
    { name: 'Клиенты', link:'clients', icon: 'person', customIcon: false},
    { name: 'Тренеры', link:'coaches', icon: 'dance_icon', customIcon: true},
    { name: 'Направления', link:'styles', icon: 'fairy-dance', customIcon: true}
  ]

  adminNavigationListItems: navItem[] = [
    { name: 'Отчеты', link: "reports", icon: 'close', customIcon: false}
  ]

  constructor(){
    this.userService.isSuperAdmin().subscribe((result: boolean) => {
      if(result === true){
        var navList = [...this.navigationList, ...this.adminNavigationListItems]
        Object.assign(this.navigationList, navList)
      }
    })
  }
}
