import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Group } from '../../models/group-model';

@Component({
  selector: 'app-group-dialog',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './group-dialog.component.html',
  styleUrl: './group-dialog.component.scss'
})
export class GroupDialogComponent {
  public form: FormGroup; 
  public get name() { return this.form.get('name')}
  public get style() { return this.form.get('style')}


  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {title: string},
    private dialogRef: MatDialogRef<GroupDialogComponent>
  ){
  }

  ngOnInit(){
    this.form = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      style: new FormControl(null, [Validators.required])
    })
  }

  onCloseClick(){
    this.dialogRef.close();
  }

  submit(){
    if (this.form.valid){
      const group: Group = {
        id: '4',
        name: this.name?.value,
        style: this.style?.value
      }
      this.dialogRef.close(group);
    }
  }
}
