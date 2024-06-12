import { Inject, Injectable } from '@angular/core';
import { BaseDialogService } from '../../../../services/base-dialog.service';
import { PaymentDialogComponent } from './payment-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaymentModel } from '../../../models/payment-model';

@Injectable({
  providedIn: 'root'
})
export class PaymentDialogService extends BaseDialogService<PaymentDialogComponent> {

  constructor(dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    super(dialog,data)
    this.component = PaymentDialogComponent
   }

   showPaymentDialog(memberId: string, payment?: PaymentModel, title: string = 'Оплата') : MatDialogRef<PaymentDialogComponent>{
    this.dialogData = {
      title: title,
      payment: payment,
      memberId: memberId
    }

    return this.showDialog();
   }
}
