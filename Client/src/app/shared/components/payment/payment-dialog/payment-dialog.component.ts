import { Component, inject, input, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PaymentModel } from '../../../models/payment-model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PaymentService, PaymentType } from '../payment.service';
import { catchError, finalize, of } from 'rxjs';
import { SpinnerService } from '../../../spinner/spinner.service';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { SnackBarService } from '../../../../services/snack-bar.service';
import { DynamicComponent } from '../../../dialog/base-dialog/base-dialog.component';
import { DialogService } from '../../../../services/dialog.service';

export interface PaymentDialogData{
  payment: PaymentModel,
  memberId: string, 
  title: string,
  paymentType: PaymentType
}
@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  providers:[
  ],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss'
})
export class PaymentDialogComponent implements DynamicComponent {
  title = signal<string>('Оплата')
  
  amount = new FormControl<number>(0, 
    [Validators.required, 
      Validators.min(1),
      Validators.max(100000), 
      Validators.nullValidator])
  comment = new FormControl<string>('')

  paymentService = inject(PaymentService)
  spinnerService = inject(SpinnerService)
  snackbarService = inject(SnackBarService)
  dialogservice = inject(DialogService)
  data = input.required<PaymentDialogData>()

  constructor(private dialogRef: MatDialogRef<PaymentDialogComponent>,
  ){}

  ngOnInit(){
    this.amount.setValue(this.data().payment?.amount)
    this.comment.setValue(this.data().payment?.comment as string)
  }

  onClose(){
    this.dialogRef.close();
  }

  onSave(){
    if(this.amount.valid){
      var payment = this.data().payment
      if(!payment){
        payment = new PaymentModel
      }
      payment.amount = this.amount.value as number
      payment.comment = this.comment.value as string
      
      this.spinnerService.loadingOn()
      this.paymentService.savePayment(payment, this.data().memberId, this.data().paymentType)
        .pipe(
          finalize(() => this.spinnerService.loadingOff())
        )
        .subscribe((result: PaymentModel) =>{
          this.dialogRef.close(result)
        })
    }
  }

  onDelete(){
    var confDialogRef = this.dialogservice.showDialog(ConfirmationDialogComponent, {message: 'Удалить оплату?'})
    confDialogRef.afterClosed().subscribe((result) =>{
      if(result == true){
        this.spinnerService.loadingOn()
        this.paymentService.deletePayment(this.data().payment.id, this.data().paymentType)
        .pipe(
          finalize(() => this.spinnerService.loadingOff()),
          catchError(() => {
            this.snackbarService.error('Не удалось удалить оплату')
            return of()
          })
        )
          .subscribe(() =>{
            this.snackbarService.success("Оплата удалена")
            this.dialogRef.close(true)
          })
      }
    })
  }
}
