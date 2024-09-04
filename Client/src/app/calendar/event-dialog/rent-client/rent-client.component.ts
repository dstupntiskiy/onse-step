import { Component, effect, inject, input, model, signal } from '@angular/core';
import { AddClientComponent } from '../../../shared/components/add-client/add-client.component';
import { Client } from '../../../shared/models/client-model';
import { EventService } from '../../event/event.service';
import { OnetimeVisitorModel } from '../../../shared/models/onetime-visitor-model';
import { PaymentComponent } from '../../../shared/components/payment/payment.component';
import { PaymentType } from '../../../shared/components/payment/payment.service';
import { ClientNameComponent } from '../../../shared/components/client-name/client-name.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize, map } from 'rxjs';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-rent-client',
  standalone: true,
  imports: [
    AddClientComponent,
    PaymentComponent,
    ClientNameComponent,
    MatButtonModule,
    MatIconModule,
    SpinnerComponent
  ],
  templateUrl: './rent-client.component.html',
  styleUrl: './rent-client.component.scss'
})
export class RentClientComponent {
  eventId = input.required<string>()

  oneTimeVisitor = signal<OnetimeVisitorModel | null>(null)
  eventService = inject(EventService)
  
  paymentTypes = PaymentType

  isLoading : boolean = true

  constructor(){
    effect(() =>{
      this.eventService.getOneTimeVisitors(this.eventId())
      .pipe(
        map(result => result[0]),
        finalize( () => this.isLoading = false)
      )
      .subscribe((result) =>{
        this.oneTimeVisitor.set(result)
      })
    })
  }

  onClientSelect(client: Client){
    this.isLoading = true
    this.eventService.saveOnetimeVisitor(this.eventId(), client.id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((result: OnetimeVisitorModel) =>{
        this.oneTimeVisitor.set(result)
      })
  }

  onDeleteClick(){
    this.isLoading = true
    this.eventService.removeOnetimeVisitor(this.oneTimeVisitor()!.id)
    .pipe(finalize(() => this.isLoading = false))
      .subscribe( (result) => this.oneTimeVisitor.set(null))
  }
  
}
