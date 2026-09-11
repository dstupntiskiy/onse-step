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

  public showDialog(component: Type<any>, data?: any): MatDialogRef<BaseDialogComponent, any> {
    return this.dialog.open(BaseDialogComponent, {
      data: {
        component: component,
        customData: data
      },
      panelClass: 'side-drawer',
      position: { top: '0', right: '0' },
      width: '720px', maxWidth: '100vw',
      height: '100dvh', maxHeight: '100dvh',
      enterAnimationDuration: 240,
      exitAnimationDuration: 180,
      autoFocus: false
    })
  }
}

