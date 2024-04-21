import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';

export interface group{
  name: string;
  style: string;
  id: string;
}

const GROUPS: group[] = [
  { id: '1', name: 'High heels pro', style: 'High heels'},
  { id: '2', name: 'High heels начинающие', style: 'High heels'},
  { id: '3', name: 'Contemp', style: 'Contemporaty'},
]

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    MatTableModule
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {
  displayedColumns: string[] = ['id', 'name', 'style']
  dataSource = GROUPS

}
