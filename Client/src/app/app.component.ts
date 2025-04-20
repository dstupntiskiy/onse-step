import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { UserService } from './shared/services/user.service';
import { SpinnerService } from './shared/spinner/spinner.service';
import { BottomNavComponent } from './navigation/bottom-nav/bottom-nav.component';
import { IsMobileService } from './services/is-mobile.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SidebarComponent,
    SpinnerComponent,
    BottomNavComponent],
  providers:[
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  userService = inject(UserService)
  spinnerService = inject(SpinnerService)
  isMobileService = inject(IsMobileService)

  router = inject(Router)

  ngOnInit(){
    var token = localStorage.getItem('jwtToken')
    if(token)
      this.userService.isAuthenticated(true)
    else
    {  
      this.userService.isAuthenticated(false)
      this.router.navigate(['/login'])
    } 
  }
}

