import { Component, inject } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { GroupService } from './group.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Group, GroupWithDetails } from '../shared/models/group-model';
import { DialogService } from '../services/dialog.service';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    ReactiveFormsModule
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
  displayedColumns: string[] = ['active','name', 'style', 'counts']
  dataSource: GroupWithDetails[]
  dialogService = inject(DialogService)
  spinnerService = inject(SpinnerService)

  onlyActive = new FormControl<boolean>(true)

  constructor(
    private groupService: GroupService,
  ){}

  handleAddGroupClick(){
    this.dialogService.showDialog(GroupDialogComponent)
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
    this.refetchGroups()

    this.onlyActive.valueChanges.subscribe(() =>{
      this.refetchGroups();
    })
  }

  handleRowClick(row: GroupWithDetails){
    this.dialogService.showDialog(GroupDialogComponent, { id: row.id })
      .afterClosed().subscribe((result: Group) =>{
        if(result){
          this.groupService.getGoupWithDetails(result.id)
            .subscribe((groupWithDetails: GroupWithDetails) =>{
              var index = this.dataSource.findIndex(x => x.id === result.id)
            this.dataSource[index] = groupWithDetails;
            this.dataSource = Object.assign([], this.dataSource);
            })
          }
      })
  }

  toggleOnlyActive(){

  }

  private refetchGroups(){
    this.spinnerService.loadingOn()
    this.groupService.getGoupsWithDetails(this.onlyActive.value as boolean)
    .pipe(
      finalize(() => this.spinnerService.loadingOff())
    )
    .subscribe( (groups) => {
      this.dataSource = groups
    });
  }

}