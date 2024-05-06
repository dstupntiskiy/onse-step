import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { GroupsComponent } from './groups/groups.component';
import { ClientsComponent } from './clients/clients.component';

export const routes: Routes = [
    { path: '', component: CalendarComponent},
    { path: 'clients', component: ClientsComponent},
    { path: 'groups', component: GroupsComponent},
    { path: '**', redirectTo: ''}
];
