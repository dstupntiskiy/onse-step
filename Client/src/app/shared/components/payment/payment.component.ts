import { Component, input, model } from '@angular/core';
import { PaymentModel } from '../../models/payment-model';
import { MatIconModule } from '@angular/material/icon';
import { PaymentDialogService } from './payment-dialog/payment-dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaymentType } from './payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers:[
    PaymentDialogService
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  payment = model<PaymentModel>()
  memberId = input.required<string>()
  paymentType = input.required<PaymentType>()

  constructor(private paymentDialogService: PaymentDialogService)
  {}

  onEditClick(){
    this.paymentDialogService.showPaymentDialog(this.memberId(), this.paymentType(), this.payment())
      .afterClosed().subscribe((result) =>{
        if(result == true){
          this.payment.set(undefined)
        }
      })
  }

  onAddPaymentClick(){
    this.paymentDialogService.showPaymentDialog(this.memberId(), this.paymentType())
      .afterClosed().subscribe((result: PaymentModel) =>{
        if(result){
          this.payment.set(result)
        }
      })
  }
}
