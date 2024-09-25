import { Component, inject, input, model } from '@angular/core';
import { PaymentModel } from '../../models/payment-model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaymentType } from './payment.service';
import { DialogService } from '../../../services/dialog.service';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers:[
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  payment = model<PaymentModel>()
  memberId = input.required<string>()
  paymentType = input.required<PaymentType>()
  onetimeVisitPrice = input<number | undefined>(undefined)

  dialogService = inject(DialogService)
  constructor()
  {}

  onEditClick(){
    this.dialogService.showDialog(PaymentDialogComponent, {
        payment: this.payment(),
        memberId: this.memberId(), 
        paymentType: this.paymentType()
       })
      .afterClosed().subscribe((result) =>{
        if(result == true){
          this.payment.set(undefined)
        }
      })
  }

  onAddPaymentClick(){
    this.dialogService.showDialog(PaymentDialogComponent, {
      memberId: this.memberId(), 
      paymentType: this.paymentType(),
      onetimeVisitPrice: this.onetimeVisitPrice()
    })
    .afterClosed().subscribe((result: PaymentModel) =>{
      if(result){
        this.payment.set(result)
      }
    })
  }
}
