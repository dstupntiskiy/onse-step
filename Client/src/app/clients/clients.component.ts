import { Component, inject } from '@angular/core';
import { Client } from '../shared/models/client-model';
import { ClientService } from './client.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DialogService } from '../services/dialog.service';
import { ClientDialogComponent } from './client-dialog/client-dialog.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SnackBarService } from '../services/snack-bar.service';
import { MatInputModule } from '@angular/material/input';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { debounceTime, finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    DatePipe,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule
  ],
  providers:[
    
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
  spinnerService = inject(SpinnerService)

  nameFilter = new FormControl<string>('')
  private debounceTime = 300

  constructor(){}

  ngOnInit(){
    this.refetchClients()

    this.nameFilter.valueChanges
      .pipe(
        debounceTime(this.debounceTime)
      )
      .subscribe((value) =>{
        if(value){
          this.spinnerService.loadingOn()
          this.clientService.getClientsByQuery(value)
            .pipe(
              finalize(() => this.spinnerService.loadingOff())
            )
            .subscribe((result: Client[]) =>{
              this.clients = result
            })
        }
        else{
          this.refetchClients()
        }
      })
  }

  private refetchClients(){
    this.spinnerService.loadingOn()
    this.clientService.getClients()
      .pipe(
        finalize(() => this.spinnerService.loadingOff())
      )
      .subscribe((result: Client[]) =>{
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
    this.dialogService.showDialog(ClientDialogComponent, row.name, { id: row.id })
      .afterClosed().subscribe((result: Client) =>{
        if(result){
          var index = this.clients.findIndex(x => x.id === row.id);
          this.clients[index] = result;
          this.clients = Object.assign([], this.clients);
        }
      })
  }


}
