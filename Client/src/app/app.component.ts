import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { UserService } from './shared/services/user.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    CalendarComponent,
    SidebarComponent,
    SpinnerComponent],
  providers:[
    UserService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  userService = inject(UserService)
}

