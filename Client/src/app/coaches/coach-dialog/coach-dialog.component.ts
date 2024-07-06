import { Component, effect, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { CoachModel } from '../../shared/models/coach-model';
import { CoachService } from '../coach.service';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { finalize } from 'rxjs';
import { DynamicComponent } from '../../shared/dialog/base-dialog/base-dialog.component';
import { StyleService } from '../../styles/style.service';
import { StyleModel } from '../../shared/models/style-model';
import { MatSelectModule } from '@angular/material/select';

export interface CoachDialogData{
  coach: CoachModel
}

@Component({
  selector: 'app-coach-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  providers:[
    SpinnerService
  ],
  templateUrl: './coach-dialog.component.html',
  styleUrl: './coach-dialog.component.scss'
})
export class CoachDialogComponent implements DynamicComponent {

  data = input<CoachDialogData>()
  styles: StyleModel[] = [];
  
  coachService = inject(CoachService)
  styleService = inject(StyleService)
  spinnerService = inject(SpinnerService)

  constructor(private dialogRef: MatDialogRef<CoachDialogComponent>,
  ){
    effect(() => {
      this.styleService.getAllStyles()
        .subscribe((styles: StyleModel[]) =>{
          this.styles = styles
          this.style.setValue(this.styles.find(x => x.id === this.data()?.coach.style?.id) as StyleModel)
        })

      this.name.setValue(this.data()?.coach?.name as string)
      this.active.setValue(this.data()?.coach?.active as boolean)
    })
   }


  name = new FormControl<string>('', [Validators.required, Validators.maxLength(50)])
  style = new FormControl<StyleModel | null>(null, [Validators.maxLength(50)])
  active = new FormControl<boolean>(true)

  ngOnInit(){
    
  }

  onCloseClick(){
    this.dialogRef.close()
  }

  onSaveClick(){
    if(this.name.valid && this.style.valid){
      const coach: CoachModel = {
        id: this.data()?.coach?.id as string,
        name: this.name?.value as string,
        style: this.style?.value as StyleModel,
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
