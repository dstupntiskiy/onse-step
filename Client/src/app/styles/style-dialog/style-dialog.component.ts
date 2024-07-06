import { Component, effect, inject, input } from '@angular/core';
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

  data = input<StyleDialogData>()

  styleService = inject(StyleService)
  spinnerService = inject(SpinnerService)

  name = new FormControl<string>('', [Validators.required])
  basePrice = new FormControl<number>(0, [Validators.required])

  constructor(private dialogRef: MatDialogRef<StyleDialogComponent>){
    effect(() =>{
      this.name.setValue(this.data()?.style.name as string)
      if(this.data()?.style.basePrice){
        this.basePrice.setValue(this.data()?.style.basePrice as number)
      }
    })
  }

  onClose(){
    this.dialogRef.close()
  }

  onSave(){
    if(this.name.valid && this.basePrice.valid){
      const style: StyleModel = {
        id: this.data()?.style.id as string,
        name: this.name.value as string,
        basePrice: this.basePrice.value as number
      }

      this.spinnerService.loadingOn()
      this.styleService.saveStyle(style)
        .pipe(
          finalize(() => this.spinnerService.loadingOff())
        )
        .subscribe((result: StyleModel) => this.dialogRef.close(result))
    }
  }
}
