import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaymentModel } from '../../../models/payment-model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { PaymentService } from '../payment.service';
import { catchError, finalize, of } from 'rxjs';
import { SpinnerService } from '../../../spinner/spinner.service';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { SnackBarService } from '../../../../services/snack-bar.service';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  providers:[
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    }
  ],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss'
})
export class PaymentDialogComponent {
  amount = new FormControl<number>(0, 
    [Validators.required, 
      Validators.min(1),
      Validators.max(100000), 
      Validators.nullValidator])
  comment = new FormControl<string>('')

  paymentService = inject(PaymentService)
  spinnerService = inject(SpinnerService)
  snackbarService = inject(SnackBarService)

  constructor(private dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : { 
      payment: PaymentModel,
      memberId: string, 
      title: string
    },
    public dialog: MatDialog
  ){}

  ngOnInit(){
    this.amount.setValue(this.data.payment?.amount)
    this.comment.setValue(this.data.payment?.comment as string)
  }

  onClose(){
    this.dialogRef.close();
  }

  onSave(){
    if(this.amount.valid){
      var payment = this.data.payment
      if(!payment){
        payment = new PaymentModel
      }
      payment.amount = this.amount.value as number
      payment.comment = this.comment.value as string
      
      this.spinnerService.loadingOn()
      this.paymentService.saveGroupPayment(payment, this.data.memberId)
        .pipe(
          finalize(() => this.spinnerService.loadingOff())
        )
        .subscribe((result: PaymentModel) =>{
          this.dialogRef.close(result)
        })
    }
  }

  onDelete(){
    var confDialogRef = this.dialog.open(ConfirmationDialogComponent, {data:{
      message: 'Удалить оплату?'
    }})
    confDialogRef.afterClosed().subscribe((result) =>{
      if(result == true){
        this.spinnerService.loadingOn()
        this.paymentService.deletePayment(this.data.payment.id)
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
