import { Injectable } from '@angular/core';
import { BaseHttpService, IAngularHttpRequestOptions } from '../../../services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../../../services/snack-bar.service';
import { PaymentModel } from '../../models/payment-model';
import { Observable } from 'rxjs';

export interface PaymentRequest{
  id: string;
  amount: number;
  comment?: string;
}

export interface GroupPaymentRequest extends PaymentRequest{
  groupMemberLinkId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends BaseHttpService{

  protected route: string = 'Payment'

  constructor(http: HttpClient, snackbarService: SnackBarService) {
    super(http, snackbarService)
   }

   saveGroupPayment(payment: PaymentModel, groupMemberLinkId: string): Observable<PaymentModel>{
    var data: GroupPaymentRequest = {
      amount: payment.amount,
      id: payment.id,
      comment: payment.comment,
      groupMemberLinkId: groupMemberLinkId
    }

    return this.post<PaymentModel>('GroupPaymentSave', data)
   }

   deletePayment(paymentId: string){
    var options: IAngularHttpRequestOptions = {
      params: {paymentId: paymentId}
    }
    return this.delete('', options)
   }
}
