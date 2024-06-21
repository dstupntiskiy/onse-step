import { Component, inject } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { GroupService } from './group.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Group, GroupWithDetails } from '../shared/models/group-model';
import { DialogService } from '../services/dialog.service';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';

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
  displayedColumns: string[] = ['name', 'style', 'counts']
  dataSource: GroupWithDetails[]
  dialogService = inject(DialogService)

  constructor(
    private groupService: GroupService,
  ){}

  handleAddGroupClick(){
    this.dialogService.showDialog(GroupDialogComponent, 'Группа')
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
    this.dialogService.showDialog(GroupDialogComponent, row.name, { group: row })
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