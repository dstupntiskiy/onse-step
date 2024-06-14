import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { GroupService } from './group.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Group } from '../shared/models/group-model';
import { GroupDialogService } from './group-dialog/group-dialog.service';

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
  GroupService,
  GroupDialogService]
})
export class GroupsComponent {
  displayedColumns: string[] = ['name', 'style']
  dataSource: Group[]

  constructor(
    private groupService: GroupService,
    private groupDialogService: GroupDialogService
  ){}

  handleAddGroupClick(){
    this.groupDialogService.showGroupDialog()
    .afterClosed().subscribe((result : Group) => {
      if (result){
        const newData = [...this.dataSource]
        newData.push(result)
        this.dataSource = newData;
      }
    });
  }

  ngOnInit(){
    this.groupService.getGoups().subscribe({
      next: (groups: Group[]) =>{
      this.dataSource = groups
    }});
  }

  handleRowClick(row: Group){
    this.groupDialogService.showGroupDialog(row.name, row)
      .afterClosed().subscribe((result: Group) =>{
        if(result){
          var index = this.dataSource.findIndex(x => x.id === row.id)
          this.dataSource[index] = result;
          this.dataSource = Object.assign([], this.dataSource);
        }
      })
  }

}
