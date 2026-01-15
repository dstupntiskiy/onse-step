import { Component, ComponentRef, Inject, OnInit, Signal, ViewChild, ViewContainerRef, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DynamicComponent {
  data: Signal<any>
  title?: Signal<string>
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
  title: Signal<string | undefined>

  constructor(
    private dialogRef: MatDialogRef<BaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.componentRef = this.dynamicComponent.createComponent(this.data.component);
    const instance = this.componentRef.instance as DynamicComponent
    instance.data = signal(this.data.customData)

    instance.title ? this.title = instance.title : this.title = signal(undefined)

  }
}
