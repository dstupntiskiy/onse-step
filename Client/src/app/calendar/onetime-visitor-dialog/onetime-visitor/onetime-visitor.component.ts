import { Component, input, output } from '@angular/core';
import { OnetimeVisitorModel } from '../../../shared/models/onetime-visitor-model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PaymentType } from '../../../shared/components/payment/payment.service';
import { PaymentComponent } from '../../../shared/components/payment/payment.component';

@Component({
  selector: 'app-onetime-visitor',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    PaymentComponent
  ],
  templateUrl: './onetime-visitor.component.html',
  styleUrl: './onetime-visitor.component.scss'
})
export class OnetimeVisitorComponent {
  visitor = input<OnetimeVisitorModel>(new OnetimeVisitorModel)
  removeVisitorOutput = output<OnetimeVisitorModel>()
  paymentType: PaymentType = PaymentType.Onetime

  removeVisitor(){
    this.removeVisitorOutput.emit(this.visitor() as OnetimeVisitorModel)
  }
}
