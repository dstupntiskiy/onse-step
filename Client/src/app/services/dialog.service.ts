import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseDialogComponent } from '../shared/dialog/base-dialog/base-dialog.component';

@Injectable({
  providedIn: 'root'
})
export abstract class DialogService {

  constructor(
    public dialog: MatDialog
  ) {
    }

  public showDialog(component: Type<any>, title: string = 'Title', data?: any): MatDialogRef<BaseDialogComponent, any>{
    return this.dialog.open(BaseDialogComponent, { 
      data: {
        component: component,
        title: title,
        customData: data
      },
      maxWidth: '95vw',
      maxHeight: '95vh',
      autoFocus: false
    })
  }
}
