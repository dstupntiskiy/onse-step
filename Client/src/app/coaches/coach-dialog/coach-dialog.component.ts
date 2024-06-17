import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SnackBarService } from '../../services/snack-bar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoachModel } from '../../shared/models/coach-model';
import { CoachService } from '../coach.service';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-coach-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers:[
    SpinnerService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    }
  ],
  templateUrl: './coach-dialog.component.html',
  styleUrl: './coach-dialog.component.scss'
})
export class CoachDialogComponent {

  constructor(private dialogRef: MatDialogRef<CoachDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : { title : string, coach: CoachModel}
  ){ }

  coachService = inject(CoachService)
  spinnerService = inject(SpinnerService)

  name = new FormControl<string>('', [Validators.required, Validators.maxLength(50)])
  style = new FormControl<string>('', [Validators.maxLength(50)])
  active = new FormControl<boolean>(true)

  ngOnInit(){
    this.name.setValue(this.data.coach?.name as string)
    this.style.setValue(this.data.coach?.style as string)
    this.active.setValue(this.data.coach?.active as boolean)
  }

  onCloseClick(){
    this.dialogRef.close()
  }

  onSaveClick(){
    if(this.name.valid && this.style.valid){
      const coach: CoachModel = {
        id: this.data.coach?.id,
        name: this.name?.value as string,
        style: this.style?.value as string,
        active: this.active?.value as boolean
      }

      this.spinnerService.loadingOn()
      this.coachService.SaveCoach(coach)
        .pipe(
          finalize(() => this.spinnerService.loadingOff())
        )
        .subscribe((result: CoachModel) => this.dialogRef.close(result))
    }
  }
}