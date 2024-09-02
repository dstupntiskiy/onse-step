import { Component, ComponentRef, Inject, OnInit, Signal, ViewChild, ViewContainerRef, signal } from '@angular/core';
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
  componentRef: ComponentRef<any>

  constructor(
    private dialogRef: MatDialogRef<BaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.componentRef = this.dynamicComponent.createComponent(this.data.component);
    (this.componentRef.instance as DynamicComponent).data = signal(this.data.customData)
  }
}
