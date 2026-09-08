import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './shared/auth.guard';
export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: '', canActivate: [authGuard], children: [
    { path: '', data: { pageTitle: 'Расписание' }, loadComponent: () => import('./calendar/calendar.component').then(m => m.CalendarComponent) },
    { path: 'clients', data: { pageTitle: 'Клиенты' }, loadComponent: () => import('./clients/clients.component').then(m => m.ClientsComponent) },
    { path: 'groups', data: { pageTitle: 'Группы' }, loadComponent: () => import('./groups/groups.component').then(m => m.GroupsComponent) },
    { path: 'coaches', data: { pageTitle: 'Тренеры' }, loadComponent: () => import('./coaches/coaches.component').then(m => m.CoachesComponent) },
    { path: 'styles', data: { pageTitle: 'Направления' }, loadComponent: () => import('./styles/styles.component').then(m => m.StylesComponent) },
    { path: 'reports', data: { pageTitle: 'Отчёты' }, canActivate: [adminGuard], loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent) }
  ]},
  { path: '**', redirectTo: '' }
];
