import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Group } from '../../shared/models/group-model';
import { GroupService } from '../group.service';
import { finalize } from 'rxjs';
import { SnackBarService } from '../../services/snack-bar.service';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { GroupMembersComponent } from '../group-members/group-members.component';

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
export class GroupDialogComponent {
  public form: FormGroup; 
  public get name() { return this.form.get('name')}
  public get style() { return this.form.get('style')}
  public isNew: boolean;


  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<GroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : { title : string, group: Group }, 
    private groupService: GroupService,
    private spinnerService: SpinnerService
  ){
  }

  ngOnInit(){
    this.isNew = !this.data.group?.id 
    this.form = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      style: new FormControl(null)
    })

    this.name?.setValue(this.data.group?.name);
    this.style?.setValue(this.data.group?.style);
  }

  onCloseClick(){
    this.dialogRef.close();
  }

  submit(){
    if (this.form.valid){
      const group: Group = {
        id: this.data.group?.id,
        name: this.name?.value,
        style: this.style?.value
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
