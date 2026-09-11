import { A11yModule } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-palette',
  standalone: true,
  imports: [A11yModule],
  templateUrl: './palette.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './palette.component.scss'
})
export class PaletteComponent {
  @Input() selectedColor = '';
  @Output() onColorSelect = new EventEmitter<string>();
  @Output() dismissed = new EventEmitter<void>();

  readonly families = [
    { name: 'Розовый', shades: ['#ffe4e6', '#fda4af', '#fb7185', '#e11d48', '#9f1239'] },
    { name: 'Оранжевый', shades: ['#ffedd5', '#fed7aa', '#fb923c', '#ea580c', '#9a3412'] },
    { name: 'Жёлтый', shades: ['#fef9c3', '#fde68a', '#facc15', '#ca8a04', '#854d0e'] },
    { name: 'Зелёный', shades: ['#dcfce7', '#86efac', '#4ade80', '#16a34a', '#166534'] },
    { name: 'Бирюзовый', shades: ['#ccfbf1', '#99e3db', '#2bb3ba', '#008080', '#115e59'] },
    { name: 'Фиолетовый', shades: ['#ede9fe', '#c4b5fd', '#a78bfa', '#7c3aed', '#5b21b6'] },
    { name: 'Синий', shades: ['#dbeafe', '#93c5fd', '#60a5fa', '#2563eb', '#1e40af'] },
  ];
  readonly tones = ['Очень светлый', 'Светлый', 'Средний', 'Насыщенный', 'Тёмный'];

  get currentColor(): string {
    return this.selectedColor.toLowerCase() === 'teal' ? '#008080' : this.selectedColor;
  }

  isSelected(color: string): boolean {
    return this.currentColor.toLowerCase() === color;
  }

  onColorClick(color: string): void {
    this.onColorSelect.emit(color);
  }
}
