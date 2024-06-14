import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { GroupsComponent } from './groups/groups.component';
import { ClientsComponent } from './clients/clients.component';
import { CoachesComponent } from './coaches/coaches.component';

export const routes: Routes = [
    { path: '', component: CalendarComponent},
    { path: 'clients', component: ClientsComponent},
    { path: 'groups', component: GroupsComponent},
    { path: 'coaches', component: CoachesComponent},
    { path: '**', redirectTo: ''}
];
