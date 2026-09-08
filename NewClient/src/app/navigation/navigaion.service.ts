import { inject, Injectable } from '@angular/core';
import { UserService } from '../shared/services/user.service';

export interface navItem{
  name: string,
  link: string,
  icon: string,
  customIcon: boolean
}

@Injectable({
  providedIn: 'root'
})

export class NavigaionService {
  userService = inject(UserService)

  navigationList: navItem[] = [
    { name: 'Календарь', link: "", icon: 'event', customIcon: false}, 
    { name: 'Группы', link:'groups', icon: 'group', customIcon: false},
    { name: 'Клиенты', link:'clients', icon: 'person', customIcon: false},
    { name: 'Тренеры', link:'coaches', icon: 'dance_icon', customIcon: true},
    { name: 'Направления', link:'styles', icon: 'fairy-dance', customIcon: true}
  ]

  adminNavigationListItems: navItem[] = [
      { name: 'Отчеты', link: "reports", icon: 'bar_chart', customIcon: false}
    ]

  constructor() { 
    this.userService.isSuperAdmin().subscribe((result: boolean) => {
      if(result === true){
        var navList = [...this.navigationList, ...this.adminNavigationListItems]
        Object.assign(this.navigationList, navList)
      }
    })
  }
}
