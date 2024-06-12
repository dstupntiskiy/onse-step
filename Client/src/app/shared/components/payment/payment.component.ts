import { Component, input, model } from '@angular/core';
import { PaymentModel } from '../../models/payment-model';
import { MatIconModule } from '@angular/material/icon';
import { PaymentDialogService } from './payment-dialog/payment-dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  memberId = input<string>('')

  constructor(private paymentDialogService: PaymentDialogService)
  {}

  onEditClick(){
    this.paymentDialogService.showPaymentDialog(this.memberId(), this.payment())
      .afterClosed().subscribe((result) =>{
        if(result == true){
          this.payment.set(undefined)
        }
      })
  }

  onAddPaymentClick(){
    this.paymentDialogService.showPaymentDialog(this.memberId())
      .afterClosed().subscribe((result: PaymentModel) =>{
        if(result){
          this.payment.set(result)
        }
      })
  }
}
