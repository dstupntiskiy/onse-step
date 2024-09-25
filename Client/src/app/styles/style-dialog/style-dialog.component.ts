import { Component, effect, inject, input, output, signal } from '@angular/core';
import { DynamicComponent } from '../../shared/dialog/base-dialog/base-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StyleModel } from '../../shared/models/style-model';
import { StyleService } from '../style.service';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

export interface StyleDialogData{
  style: StyleModel
}

@Component({
  selector: 'app-style-dialog',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers:[
  ],
  templateUrl: './style-dialog.component.html',
  styleUrl: './style-dialog.component.scss'
})
export class StyleDialogComponent implements DynamicComponent {
  title = signal<string>('Направление')

  data = input<StyleDialogData>()

  styleService = inject(StyleService)
  spinnerService = inject(SpinnerService)

  name = new FormControl<string>('', [Validators.required])
  basePrice = new FormControl<number>(0, [Validators.required])
  secondaryPrice = new FormControl<number>(0, [Validators.required])
  onetimeVisitPrice = new FormControl<number>(0, [Validators.required])

  constructor(private dialogRef: MatDialogRef<StyleDialogComponent>){
    effect(() =>{
      if(this.data()?.style){
        this.name.setValue(this.data()?.style.name as string)
        if(this.data()?.style){
          this.basePrice.setValue(this.data()?.style.basePrice as number)
          this.secondaryPrice.setValue(this.data()?.style.secondaryPrice as number)
          this.onetimeVisitPrice.setValue(this.data()?.style.onetimeVisitPrice as number)
        }
      }
    })
  }

  onClose(){
    this.dialogRef.close()
  }

  onSave(){
    if(this.name.valid && this.basePrice.valid && this.secondaryPrice.valid){
      const style: StyleModel = {
        id: this.data()?.style?.id as string,
        name: this.name.value as string,
        basePrice: this.basePrice.value as number,
        secondaryPrice: this.secondaryPrice.value as number,
        onetimeVisitPrice: this.onetimeVisitPrice.value as number
      }

      this.spinnerService.loadingOn()
      this.styleService.saveStyle(style)
        .pipe(
          finalize(() => this.spinnerService.loadingOff())
        )
        .subscribe((result: StyleModel) => 
          {
            this.dialogRef.close(result)
          })
    }
  }
}
