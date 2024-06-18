import { Component, Inject, OutputRefSubscription, Signal, effect, inject, viewChildren } from '@angular/core';
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
import { BehaviorSubject, finalize } from 'rxjs';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SpinnerService } from '../../shared/spinner/spinner.service';

@Component({
  selector: 'app-onetime-visitor-dialog',
  standalone: true,
  imports: [CommonModule,
    OnetimeVisitorComponent,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AddClientComponent,
    MatIconModule
  ],
  providers: [EventService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    }
  ],
  templateUrl: './onetime-visitor-dialog.component.html',
  styleUrl: './onetime-visitor-dialog.component.scss'
})
export class OnetimeVisitorDialogComponent {
  eventService = inject(EventService)
  spinnerService = inject(SpinnerService)
  onetimeVisitors: OnetimeVisitorModel[] = []
  private onetimeVisitors$ = this.eventService.getOneTimeVisitors(this.data.eventId)
  clearControlSubject = new BehaviorSubject<boolean>(false)
  
  selectedClient?: Client;

  private subscriptions: OutputRefSubscription[] = []
  visitorRefs: Signal<readonly OnetimeVisitorComponent[]> = viewChildren(OnetimeVisitorComponent)

  constructor(
    private dialogRef: MatDialogRef<OnetimeVisitorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {
      eventId: string,
      title: string
    })
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
    this.onetimeVisitors$.subscribe((result: OnetimeVisitorModel[]) =>{
      this.onetimeVisitors = result
    })
  }

  public onClientSelect(client: Client){
    console.log(client)
    this.selectedClient = client
  }

  public addVisitor(){
    this.eventService.saveOnetimeVisitor(this.data.eventId, this.selectedClient?.id as string)
      .subscribe((result: OnetimeVisitorModel) =>{
        this.onetimeVisitors.unshift(result)
        this.clearControlSubject.next(true)
        this.selectedClient = undefined
      })
  }

  onClose(){
    this.dialogRef.close()
  }
}
