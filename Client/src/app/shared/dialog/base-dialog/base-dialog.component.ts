import { Component, Inject, OnInit, Signal, ViewChild, ViewContainerRef, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DynamicComponent{
  data: Signal<any>
}

@Component({
  selector: 'app-base-dialog',
  standalone: true,
  imports: [],
  templateUrl: './base-dialog.component.html',
  styleUrl: './base-dialog.component.scss'
})
export class BaseDialogComponent implements OnInit {
  @ViewChild('dynamicComponent', { read: ViewContainerRef, static: true }) dynamicComponent!: ViewContainerRef;

  constructor(
    private dialogRef: MatDialogRef<BaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    const component = this.dynamicComponent.createComponent(this.data.component);
    (component.instance as DynamicComponent).data = signal(this.data.customData)
  }
}
