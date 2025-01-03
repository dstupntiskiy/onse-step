import { Component, input, output } from '@angular/core';
import { OnetimeVisitorModel } from '../../../shared/models/onetime-visitor-model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PaymentType } from '../../../shared/components/payment/payment.service';
import { PaymentComponent } from '../../../shared/components/payment/payment.component';
import { ClientNameComponent } from '../../../shared/components/client-name/client-name.component';
import { StyleModel } from '../../../shared/models/style-model';

@Component({
  selector: 'app-onetime-visitor',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    PaymentComponent,
    ClientNameComponent
  ],
  templateUrl: './onetime-visitor.component.html',
  styleUrl: './onetime-visitor.component.scss'
})
export class OnetimeVisitorComponent {
  visitor = input<OnetimeVisitorModel>(new OnetimeVisitorModel)
  style = input.required<StyleModel>()
  removeVisitorOutput = output<OnetimeVisitorModel>()
  paymentType: PaymentType = PaymentType.Onetime

  removeVisitor(){
    this.removeVisitorOutput.emit(this.visitor() as OnetimeVisitorModel)
  }
}
