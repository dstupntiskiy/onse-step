import { Component, inject, input, model, output } from '@angular/core';
import { Client } from '../../models/client-model';
import { DialogService } from '../../../services/dialog.service';
import { ClientDialogComponent } from '../../../clients/client-dialog/client-dialog.component';

@Component({
  selector: 'app-client-name',
  standalone: true,
  imports: [],
  templateUrl: './client-name.component.html',
  styleUrl: './client-name.component.scss'
})
export class ClientNameComponent {
  client = model.required<Client>()
  clientUpdate = output<Client>()
  dialogService = inject(DialogService)

  onClick(){
    this.dialogService.showDialog(ClientDialogComponent, this.client.name, {
      id: this.client().id
    })
    .afterClosed().subscribe(result =>{
      if(result){
        this.client.set(result)
      }
      this.clientUpdate.emit(this.client())
    })
  }
}
