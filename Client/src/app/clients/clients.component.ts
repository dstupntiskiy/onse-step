import { Component, inject } from '@angular/core';
import { Client } from '../shared/models/client-model';
import { ClientService } from './client.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DialogService } from '../services/dialog.service';
import { ClientDialogComponent } from './client-dialog/client-dialog.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    DatePipe
  ],
  providers:[
    {provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    },
    ClientService
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  public clients: Client[]
  public displayedColumns: string[] = ['createDate', 'name', 'phone', 'socialMediaLink']
  dialogService = inject(DialogService)
  clientService = inject(ClientService)

  constructor(){}

  ngOnInit(){
    
    this.clientService.getClients().subscribe((result: Client[]) =>{
      this.clients = result
    })
  }

  handleAddClientClick(){
    this.dialogService.showDialog(ClientDialogComponent, 'Клиент')
    .afterClosed().subscribe((result: Client) => {
      if(result){
        const newData = [...this.clients]
        newData.unshift(result)
        this.clients = newData;
      }
    })
  }

  handleRowClick(row: Client){
    this.dialogService.showDialog(ClientDialogComponent, row.name, { client: row })
      .afterClosed().subscribe((result: Client) =>{
        if(result){
          var index = this.clients.findIndex(x => x.id === row.id);
          this.clients[index] = result;
          this.clients = Object.assign([], this.clients);
        }
      })
  }
}
