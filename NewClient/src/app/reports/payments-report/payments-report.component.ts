import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ReportService } from '../report.service';
import { DateRange } from '../reports.component';
import { PaymentsReport } from '../models/payments-report.model';

@Component({
  selector: 'app-payments-report',
  standalone: true,
  imports: [DecimalPipe, DatePipe, MatButtonModule],
  templateUrl: './payments-report.component.html',
  styleUrl: './payments-report.component.scss'
})
export class PaymentsReportComponent {
  readonly dateRange = input.required<DateRange>();
  private readonly reportService = inject(ReportService);
  private readonly reload = signal(0);
  readonly report = signal<PaymentsReport | null>(null);
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly styles = computed(() => [...(this.report()?.byStyle ?? [])].sort((a, b) => b.totalAmount - a.totalAmount));
  readonly countStyles = computed(() => [...this.styles()].sort((a, b) => b.totalCount - a.totalCount));
  readonly dates = computed(() => [...(this.report()?.byDate ?? [])].sort((a, b) => a.date.localeCompare(b.date)));
  readonly maximumAmount = computed(() => Math.max(1, ...this.styles().map(row => row.totalAmount)));
  readonly maximumCount = computed(() => Math.max(1, ...this.countStyles().map(row => row.totalCount)));
  readonly maximumDateAmount = computed(() => Math.max(1, ...this.dates().map(row => row.totalAmount)));

  constructor() {
    effect(onCleanup => {
      const range = this.dateRange();
      this.reload();
      this.loading.set(true);
      this.failed.set(false);
      this.report.set(null);
      const subscription = this.reportService.getPaymentsReportByPeriod(range.startDate, range.endDate).subscribe({
        next: report => { this.report.set(report); this.loading.set(false); },
        error: () => { this.failed.set(true); this.loading.set(false); }
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }

  retry(): void { this.reload.update(value => value + 1); }
}
