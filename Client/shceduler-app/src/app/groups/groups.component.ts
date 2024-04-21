import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { GroupService } from './group.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface group{
  name: string;
  style: string;
  id: string;
}

const GROUPS: group[] = [
  { id: '1', name: 'High heels pro', style: 'High heels'},
  { id: '2', name: 'High heels начинающие', style: 'High heels'},
  { id: '3', name: 'Contemp', style: 'Contemporary'},
]

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
  providers:[{
    provide: MatDialogRef,
    useValue: {}
  },
  {
    provide: MAT_DIALOG_DATA,
    useValue: {}
  },
  GroupService]
})
export class GroupsComponent {
  displayedColumns: string[] = ['id', 'name', 'style']
  dataSource = GROUPS

  constructor(
    private groupService: GroupService
  ){}

  handleAddGroupClick(){
    this.groupService.showGroupDialog()
  }

}
