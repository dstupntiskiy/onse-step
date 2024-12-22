import { Component, inject, OutputRefSubscription, ViewChild } from '@angular/core';
import { Client } from '../shared/models/client-model';
import { ClientService } from './client.service';
import { MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '../services/dialog.service';
import { ClientDialogComponent } from './client-dialog/client-dialog.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { debounceTime, finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ClientCardComponent } from './client-card/client-card.component';
import { ScrollNearEndDirective } from '../directives/scroll-near-end.directive';
import { PageComponent } from '../shared/components/page/page.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    ClientCardComponent,
    ScrollNearEndDirective,
    PageComponent
  ],
  providers:[
    
    ClientService
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  public clients: Client[] = []
  dialogService = inject(DialogService)
  clientService = inject(ClientService)
  spinnerService = inject(SpinnerService)

  nameFilter = new FormControl<string>('')
  private debounceTime = 300

  @ViewChild(MatTable) clientsTable: MatTable<any>

  constructor(){}

  ngOnInit(){
    this.loadClients()

    this.nameFilter.valueChanges
      .pipe(
        debounceTime(this.debounceTime)
      )
      .subscribe((value) =>{
        this.clientService.reset()
        if(value){
          this.spinnerService.loadingOn()
          this.clients = []
          this.clientService.getClientsByQuery(value)
            .pipe(
              finalize(() => this.spinnerService.loadingOff())
            )
            .subscribe((result: Client[]) =>{
              this.clients = result
            })
        }
        else{
          this.loadClients()
        }
      })
  }

  private loadClients(){
    this.spinnerService.loadingOn()
    this.clientService.loadMoreClients()
      .pipe(
        finalize(() => this.spinnerService.loadingOff())
      )
      .subscribe((result: Client[]) =>{
        this.clients = [...this.clients, ...result]
    })
  }

  handleAddClientClick(){
    this.openClientDialog()
  }

  handleClientCardClick(client: Client){
    this.openClientDialog(client)
  }

  private openClientDialog(client?: Client){
    const dialogRef = this.dialogService.showDialog(ClientDialogComponent, { id: client?.id })
    dialogRef.afterOpened().subscribe( () => {

    const clientDialogComponentRef = <ClientDialogComponent>dialogRef.componentInstance.componentRef.instance
    var subs: OutputRefSubscription[] = []
    subs.push(clientDialogComponentRef.clientSave.subscribe((client: Client) => {
      this.addclient(client)
    }))

    subs.push(clientDialogComponentRef.clientDelete.subscribe((id: string) =>{
      var index = this.clients.findIndex(x => x.id == id)
      this.clients.splice(index, 1)
    }))

    dialogRef.afterClosed().subscribe(() => {
      subs.forEach(x => x.unsubscribe())
    })
  })
  }

  loadOnScroll(){
    if(!this.nameFilter.value){
      this.loadClients()
    }
  }

  private addclient(client: Client){
    var index = this.clients.findIndex(x => x.id == client.id)
    if(index >= 0){
      this.clients[index] = client;
      this.clients = Object.assign([], this.clients);
    }
    else{
      const newData = [...this.clients]
      newData.unshift(client)
      this.clients = newData;
    }
  }
}
