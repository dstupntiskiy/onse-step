import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { GroupService } from './group.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Group, GroupWithDetails } from '../shared/models/group-model';
import { GroupDialogService } from './group-dialog/group-dialog.service';
import { map } from 'rxjs';

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
  displayedColumns: string[] = ['name', 'style', 'counts']
  dataSource: GroupWithDetails[]

  constructor(
    private groupService: GroupService,
    private groupDialogService: GroupDialogService
  ){}

  handleAddGroupClick(){
    this.groupDialogService.showGroupDialog()
    .afterClosed()
    .subscribe((result : Group) => {
      if (result){
        const newData = [...this.dataSource]
        this.groupService.getGoupWithDetails(result.id)
          .subscribe((groupDetails: GroupWithDetails) =>{
            newData.unshift(groupDetails)
            this.dataSource = newData;
          })
      }
    });
  }

  ngOnInit(){
    this.groupService.getGoupsWithDetails().subscribe( (groups) =>
      this.dataSource = groups
    );
  }

  handleRowClick(row: GroupWithDetails){
    this.groupDialogService.showGroupDialog(row.name, row)
      .afterClosed().subscribe(() =>{
        this.groupService.getGoupWithDetails(row.id)
          .subscribe((groupWithDetails: GroupWithDetails) =>{
            var index = this.dataSource.findIndex(x => x.id === row.id)
          this.dataSource[index] = groupWithDetails;
          this.dataSource = Object.assign([], this.dataSource);
          })
      })
  }

}
