import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-palette',
  standalone: true,
  imports: [],
  templateUrl: './palette.component.html',
  styleUrl: './palette.component.scss'
})
export class PaletteComponent {
  @Output() onColorSelect: EventEmitter<string> = new EventEmitter()

  public colors = ['#ffffbe',
  '#ffff99',
  '#ffff4d',
  '#ffff00',
  '#b3b300',
  '#666600',
  '#ffe7be',
  '#ffdb99',
  '#ffc14d',
  '#ffa500',
  '#b37400',
  '#664200',
  '#f6dbc6',
  '#f3c6a5',
  '#ea9a62',
  '#e06f1f',
  '#9d4e15',
  '#70380f',
  '#ffbebe',
  '#ff9999',
  '#ff4d4d',
  '#ff0000',
  '#b30000',
  '#660000',
  '#ffc2ff',
  '#ff99ff',
  '#ff4dff',
  '#ff00ff',
  '#b300b3',
  '#660066',
  '#c2c2ff',
  '#9999ff',
  '#4d4dff',
  '#0000ff',
  '#0000b3',
  '#000066',
  '#c3f6d2',
  '#a2fdb3',
  '#82db9a',
  '#8fdb82',
  '#5bab53',
  '#187f3d']

  onColorClick(color: string){
    this.onColorSelect.emit(color);
  }
}


