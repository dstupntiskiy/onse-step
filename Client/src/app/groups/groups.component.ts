import { Component, inject, signal } from '@angular/core';
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
import { GroupCardComponent } from './group-card/group-card.component';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    GroupCardComponent
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
  dialogService = inject(DialogService)
  spinnerService = inject(SpinnerService)

  onlyActive = new FormControl<boolean>(true)

  groups = signal<GroupWithDetails[]>([])

  constructor(
    private groupService: GroupService,
  ){}

  handleAddGroupClick(){
    this.dialogService.showDialog(GroupDialogComponent)
    .afterClosed()
    .subscribe((result : GroupWithDetails) => {
      if (result){
        this.groups().unshift(result)
      }
    });
  }

  ngOnInit(){
    this.refetchGroups()

    this.onlyActive.valueChanges.subscribe(() =>{
      this.refetchGroups();
    })
  }

  private refetchGroups(){
    this.spinnerService.loadingOn()
    this.groupService.getGoupsWithDetails(this.onlyActive.value as boolean)
    .pipe(
      finalize(() => this.spinnerService.loadingOff())
    )
    .subscribe( (groups) => {
      this.groups.set(groups)
    });
  }

}