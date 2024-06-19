import { ComponentType } from '@angular/cdk/portal';
import { Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseDialogService<TDialogComponent> {

  protected component: ComponentType<TDialogComponent>;
  protected dialogData: any;

  constructor(
    public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    }

  protected showDialog(): MatDialogRef<TDialogComponent, any>{
    return this.dialog.open(this.component, { data: this.dialogData })
  }
}
