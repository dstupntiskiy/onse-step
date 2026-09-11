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
  entityId: string;
}

export enum PaymentType{
  Group,
  Onetime
}


@Injectable({
  providedIn: 'root'
})
export class PaymentService extends BaseHttpService{

  protected route: string = 'Payment'

  constructor(http: HttpClient, snackbarService: SnackBarService) {
    super(http, snackbarService)
   }

   savePayment(payment: PaymentModel, entityId: string, paymentType: PaymentType): Observable<PaymentModel>{
    var data: PaymentRequest = {
      amount: payment.amount,
      id: payment.id,
      comment: payment.comment,
      entityId: entityId
    }

    switch (paymentType){
      case PaymentType.Group:
        return this.post<PaymentModel>('GroupPaymentSave', data)
      case PaymentType.Onetime:
        return this.post<PaymentModel>('OnetimePaymentSave', data)

    }
   }

   deletePayment(paymentId: string, paymentType: PaymentType){
    var options: IAngularHttpRequestOptions = {
      params: {paymentId: paymentId}
    }

    switch (paymentType){
      case PaymentType.Group:
        return this.delete('GroupPaymentDelete', options)
      case PaymentType.Onetime:
        return this.delete('OnwetimePaymentDelete', options)
    }
   }
}
