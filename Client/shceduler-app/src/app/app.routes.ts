import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { GroupsComponent } from './groups/groups.component';

export const routes: Routes = [
    { path: '', component: CalendarComponent},
    { path: 'groups', component: GroupsComponent},
    { path: '**', redirectTo: ''}
];
