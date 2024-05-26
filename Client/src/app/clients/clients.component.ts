import { Component } from '@angular/core';
import { Client } from '../shared/models/client-model';
import { ClientService } from './client.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ClientDialogService } from './client-dialog/client-dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

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
    ClientDialogService,
    ClientService
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  public clients: Client[]
  public displayedColumns: string[] = ['createDate', 'name', 'phone', 'socialMediaLink']
  

  constructor(private clientService: ClientService,
    private clientDialogService: ClientDialogService,
  ){}

  ngOnInit(){
    
    this.clientService.getClients().subscribe((result: Client[]) =>{
      this.clients = result
    })
  }

  handleAddClientClick(){
    this.clientDialogService.showClientDialog()
    .afterClosed().subscribe((result: Client) => {
      if(result){
        const newData = [...this.clients]
        newData.unshift(result)
        this.clients = newData;
      }
    })
  }

  handleRowClick(row: Client){

    this.clientDialogService.showClientDialog(row.name, row)
      .afterClosed().subscribe((result: Client) =>{
        if(result){
          var index = this.clients.findIndex(x => x.id === row.id);
          this.clients[index] = result;
          this.clients = Object.assign([], this.clients);
        }
      })
  }
}
