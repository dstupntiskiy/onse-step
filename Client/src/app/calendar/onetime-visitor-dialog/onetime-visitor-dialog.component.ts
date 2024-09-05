import { Component, Inject, Input, OutputRefSubscription, Signal, effect, inject, input, signal, viewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../event/event.service';
import { CommonModule } from '@angular/common';
import { OnetimeVisitorComponent } from './onetime-visitor/onetime-visitor.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Client } from '../../shared/models/client-model';
import { AddClientComponent } from '../../shared/components/add-client/add-client.component';
import { MatIconModule } from '@angular/material/icon';
import { OnetimeVisitorModel } from '../../shared/models/onetime-visitor-model';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { DynamicComponent } from '../../shared/dialog/base-dialog/base-dialog.component';

export interface OnetimeVisitorDialogData{
  eventId: string
}

@Component({
  selector: 'app-onetime-visitor-dialog',
  standalone: true,
  imports: [CommonModule,
    OnetimeVisitorComponent,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AddClientComponent,
    MatButtonModule
  ],
  providers: [EventService
  ],
  templateUrl: './onetime-visitor-dialog.component.html',
  styleUrl: './onetime-visitor-dialog.component.scss'
})
export class OnetimeVisitorDialogComponent implements DynamicComponent {
  title = signal<string>('Разовые посещения')
  eventService = inject(EventService)
  spinnerService = inject(SpinnerService)

  data = input<OnetimeVisitorDialogData>()

  onetimeVisitors: OnetimeVisitorModel[] = []
  clearControlSubject = new BehaviorSubject<boolean>(false)
  
  private subscriptions: OutputRefSubscription[] = []
  visitorRefs: Signal<readonly OnetimeVisitorComponent[]> = viewChildren(OnetimeVisitorComponent)

  constructor(
    private dialogRef: MatDialogRef<OnetimeVisitorDialogComponent>)
  {
    effect(() => {
      
      this.subscriptions.forEach(s => s.unsubscribe())
      this.subscriptions = []

      this.visitorRefs().forEach(visitorRef => {
        const sub = visitorRef.removeVisitorOutput.subscribe((removedVisitor: OnetimeVisitorModel) =>{
          this.spinnerService.loadingOn();
          this.eventService.removeOnetimeVisitor(removedVisitor.id)
          .pipe(
            finalize(() => this.spinnerService.loadingOff())
          )
          .subscribe(() =>{
            var visitor = this.onetimeVisitors.find(x => x.id == removedVisitor.id) as OnetimeVisitorModel
            var index = this.onetimeVisitors.indexOf(visitor)
            this.onetimeVisitors.splice(index, 1)
          })
        })
        this.subscriptions.push(sub)
      })
    })
  }

  ngOnInit(){
    if (this.data() && this.data()?.eventId)
      this.eventService.getOneTimeVisitors(this.data()?.eventId as string).subscribe((result: OnetimeVisitorModel[]) =>{
        this.onetimeVisitors = result
      })
  }

  public onClientSelect(client: Client){
    this.eventService.saveOnetimeVisitor(this.data()?.eventId as string, client.id as string)
      .pipe(finalize(() => this.clearControlSubject.next(true)))
      .subscribe((result: OnetimeVisitorModel) =>{
        this.onetimeVisitors.unshift(result)
      })
  }

  onClose(){
    this.dialogRef.close()
  }
}
