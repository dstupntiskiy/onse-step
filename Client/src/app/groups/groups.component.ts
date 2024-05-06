import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { GroupService } from './group.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Group } from '../shared/models/group-model';

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
  dataSource: Group[]

  constructor(
    private groupService: GroupService
  ){}

  handleAddGroupClick(){
    this.groupService.showGroupDialog()
    .afterClosed().subscribe((result : Group) => {
      
      if (result){
        const newData = [...this.dataSource]
        newData.push(result)
        this.dataSource = newData;
      }
    });
  }

  ngOnInit(){
    this.groupService.getGoups().subscribe((groups: Group[]) =>{
      this.dataSource = groups
    });
  }

}
