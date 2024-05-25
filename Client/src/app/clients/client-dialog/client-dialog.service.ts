import { Inject, Injectable } from '@angular/core';
import { BaseDialogService } from '../../services/base-dialog.service';
import { ClientDialogComponent } from './client-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Client } from '../../shared/models/client-model';

@Injectable({
  providedIn: 'root'
})
export class ClientDialogService extends BaseDialogService<ClientDialogComponent> {

  constructor(dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any
  ) { 
    super(dialog, data)
    this.component = ClientDialogComponent
  }

  showClientDialog(title: string = 'Клиент', client?: Client | undefined) : MatDialogRef<ClientDialogComponent, any>{
    this.dialogData = {
      title: title,
      client: client
    }

    return this.showDialog()
  }
}
