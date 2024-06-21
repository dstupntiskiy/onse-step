import { Component, effect, inject, input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Group } from '../../shared/models/group-model';
import { GroupService } from '../group.service';
import { finalize } from 'rxjs';
import { SnackBarService } from '../../services/snack-bar.service';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { GroupMembersComponent } from '../group-members/group-members.component';
import { DynamicComponent } from '../../shared/dialog/base-dialog/base-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

export interface GroupDialogData{
  group: Group
}

@Component({
  selector: 'app-group-dialog',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    GroupMembersComponent
  ],
  providers:[
    GroupService,
    SnackBarService
  ],
  templateUrl: './group-dialog.component.html',
  styleUrl: './group-dialog.component.scss'
})
export class GroupDialogComponent implements DynamicComponent {
  name = new FormControl<string>('', [Validators.required])
  style = new FormControl<string>('')
  public isNew: boolean = false;

  data = input.required<GroupDialogData>() 
  groupService = inject(GroupService)
  spinnerService = inject(SpinnerService)
  constructor(private dialogRef: MatDialogRef<GroupDialogComponent>,
  ){
    effect(()=>{
      this.name?.setValue(this.data()?.group?.name as string);
      this.style?.setValue(this.data()?.group?.style as string);
    })
  }

  ngOnInit(){
  }

  onCloseClick(){
    this.dialogRef.close();
  }

  submit(){
    if (this.name.valid){
      const group: Group = {
        id: this.data()?.group?.id,
        name: this.name?.value as string,
        style: this.style?.value as string
      }
      this.spinnerService.loadingOn();
      this.groupService.saveGroup(group)
      .pipe(
        finalize(() => this.spinnerService.loadingOff()),
      )
      .subscribe(
        (result: Group) =>{
          this.dialogRef.close(result);
        });
      
    }
  }
}
