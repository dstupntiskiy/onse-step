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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StyleService } from '../../styles/style.service';
import { StyleModel } from '../../shared/models/style-model';
import { MatSelectModule } from '@angular/material/select';

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
    MatSlideToggleModule,
    GroupMembersComponent,
    MatSelectModule
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
  style = new FormControl<StyleModel| null>(null, [Validators.required])
  active = new FormControl<boolean>(true)

  public isNew: boolean = false;
  styles: StyleModel[] = []

  data = input.required<GroupDialogData>() 
  groupService = inject(GroupService)
  spinnerService = inject(SpinnerService)
  styleService = inject(StyleService)

  constructor(private dialogRef: MatDialogRef<GroupDialogComponent>,
  ){
    effect(()=>{
      this.styleService.getAllStyles()
        .subscribe((styles: StyleModel[]) =>{
          this.styles = styles
          if(this.data()?.group.style)
            this.style.setValue(this.styles.find(x => x.id === this.data().group.style?.id) as StyleModel)
        })

      this.name?.setValue(this.data()?.group?.name as string);

      if(this.data())
        this.active?.setValue(this.data().group.active)
    })
  }

  ngOnInit(){
  }

  onCloseClick(){
    this.dialogRef.close();
  }

  submit(){
    if (this.name.valid && this.style.valid){
      const group: Group = {
        id: this.data()?.group?.id,
        name: this.name?.value as string,
        style: this.style?.value as StyleModel,
        active: this.active.value as boolean
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
