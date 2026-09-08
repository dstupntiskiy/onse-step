import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, of, switchMap, catchError, distinctUntilChanged } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from './shared/services/user.service';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { SpinnerService } from './shared/spinner/spinner.service';

@Component({
  selector: 'app-root', standalone: true,
  imports: [AsyncPipe, RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, SpinnerComponent],
  templateUrl: './app.component.html', styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly user = inject(UserService);
  readonly spinner = inject(SpinnerService);
  readonly router = inject(Router);
  readonly menuOpen = signal(false);
  readonly admin = signal(false);
  readonly today = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'long', weekday: 'long' }).format(new Date());
  readonly navigation = [
    { name: 'Расписание', link: '/', icon: 'calendar_today' },
    { name: 'Клиенты', link: '/clients', icon: 'people_outline' },
    { name: 'Группы', link: '/groups', icon: 'workspaces' },
    { name: 'Тренеры', link: '/coaches', icon: 'sports_gymnastics' },
    { name: 'Направления', link: '/styles', icon: 'auto_awesome' }
  ];
  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd), takeUntilDestroyed()).subscribe(() => {
      this.menuOpen.set(false);
      this.user.isAuthenticated(!!localStorage.getItem('jwtToken'));
    });
    this.user.isAuthenticated$.pipe(
      distinctUntilChanged(),
      switchMap(auth => auth ? this.user.isSuperAdmin().pipe(catchError(() => of(false))) : of(false)),
      takeUntilDestroyed()
    ).subscribe(value => this.admin.set(value));
    this.user.isAuthenticated(!!localStorage.getItem('jwtToken'));
  }
  logout() {
    localStorage.removeItem('jwtToken');
    this.user.isAuthenticated(false);
    this.router.navigateByUrl('/login');
  }
}
