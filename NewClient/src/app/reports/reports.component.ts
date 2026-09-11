import { Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { PaymentsReportComponent } from './payments-report/payments-report.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { A11yModule } from '@angular/cdk/a11y';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { CoachReportComponent } from "./coach-report/coach-report.component";
import { PageComponent } from '../shared/components/page/page.component';
import { DutyReportComponent } from './duty-report/duty-report.component'

export interface DateRange{
  startDate: Date,
  endDate: Date
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    A11yModule,
    OverlayModule,
    ReactiveFormsModule,
    MatTabsModule,
    PaymentsReportComponent,
    MatButtonModule,
    CoachReportComponent,
    PageComponent,
    DutyReportComponent
],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  defaultStartDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  defaultEndDate: Date = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1, 0, 0, -1)
  
  periodStartDate = signal<Date>(this.defaultStartDate)
  periodEndDate = signal<Date>(this.defaultEndDate)
  dateRange = computed<DateRange>(() => ({ startDate: this.periodStartDate(), endDate: this.periodEndDate() }))

  startDateFormControl = new FormControl<Date>(this.defaultStartDate)
  endDateFormControl = new FormControl<Date>(this.defaultEndDate)

  readonly months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сент', 'Окт', 'Ноя', 'Дек'];
  readonly monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  readonly monthPickerOpen = signal(false);
  readonly pickerYear = signal(this.defaultStartDate.getFullYear());
  readonly monthPickerPositions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8 }
  ];
  initialMonth = this.defaultStartDate.getMonth();

  get monthLabel(): string {
    const selected = this.selectedMonth;
    return selected ? `${this.months[Number(selected.slice(5)) - 1]} ${selected.slice(0, 4)}` : 'Выбрать месяц';
  }

  monthKey(month: number): string {
    return `${String(this.pickerYear()).padStart(4, '0')}-${String(month + 1).padStart(2, '0')}`;
  }

  get selectedMonth(): string {
    if (this.invalidPeriod) return '';
    const start = this.startDateFormControl.value!;
    const end = this.endDateFormControl.value!;
    const lastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    return start.getDate() === 1 && end.getFullYear() === start.getFullYear() &&
      end.getMonth() === start.getMonth() && end.getDate() === lastDay
      ? `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}` : '';
  }

  selectMonth(value: string): void {
    if (!/^\d{4}-\d{2}$/.test(value)) return;
    const [year, month] = value.split('-').map(Number);
    if (year < 100 || month < 1 || month > 12) return;
    this.startDateFormControl.setValue(new Date(year, month - 1, 1));
    this.endDateFormControl.setValue(new Date(year, month, 0));
    this.onRecalculate();
    this.monthPickerOpen.set(false);
  }

  toggleMonthPicker(): void {
    const start = this.startDateFormControl.value;
    const date = start && Number.isFinite(start.getTime()) ? start : new Date();
    this.pickerYear.set(date.getFullYear());
    this.initialMonth = date.getMonth();
    this.monthPickerOpen.update(open => !open);
  }

  selectCurrentMonth(): void {
    const today = new Date();
    this.pickerYear.set(today.getFullYear());
    this.selectMonth(this.monthKey(today.getMonth()));
  }

  get invalidPeriod(): boolean {
    const start = this.startDateFormControl.value;
    const end = this.endDateFormControl.value;
    return this.startDateFormControl.invalid || this.endDateFormControl.invalid || !start || !end ||
      !Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || start > end;
  }

  onRecalculate(){
    if (this.invalidPeriod) return;
    this.periodStartDate.update(() => {
      if(this.startDateFormControl.value)
        return this.startDateFormControl.value
      return this.defaultStartDate
    })
    this.periodEndDate.update(() =>{
      if(this.endDateFormControl.value)
        return this.endDateFormControl.value
      return this.defaultEndDate
    })
  }
}
