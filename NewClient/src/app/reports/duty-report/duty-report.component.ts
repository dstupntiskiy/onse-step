import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DateRange } from '../reports.component';
import { ReportService } from '../report.service';
import { EventDutyReport } from '../models/eventDutyReport.model';

@Component({
  selector: 'app-duty-report',
  imports: [DatePipe, DecimalPipe, MatButtonModule],
  templateUrl: './duty-report.component.html',
  styleUrl: './duty-report.component.scss'
})
export class DutyReportComponent {
  readonly dateRange = input.required<DateRange>();
  private readonly reportService = inject(ReportService);
  private readonly reload = signal(0);
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly eventDutys = signal<EventDutyReport[]>([]);
  readonly totalHours = computed(() => this.eventDutys().reduce((sum, row) => sum + row.totalHours, 0));
  readonly totalDuties = computed(() => this.eventDutys().reduce((sum, row) => sum + row.eventDutyDetails.length, 0));
  readonly maxHours = computed(() => Math.max(1, ...this.eventDutys().map(row => row.totalHours)));

  constructor() {
    effect(onCleanup => {
      const range = this.dateRange();
      this.reload();
      this.loading.set(true);
      this.failed.set(false);
      this.eventDutys.set([]);
      const subscription = this.reportService.getEventDutiesReportByPeriod(range.startDate, range.endDate).subscribe({
        next: rows => {
          this.eventDutys.set(rows.map(row => ({
            ...row,
            eventDutyDetails: [...row.eventDutyDetails].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          })).sort((a, b) => b.totalHours - a.totalHours));
          this.loading.set(false);
        },
        error: () => { this.failed.set(true); this.loading.set(false); }
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }

  retry(): void { this.reload.update(value => value + 1); }
}
