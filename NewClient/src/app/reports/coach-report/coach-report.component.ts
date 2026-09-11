import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DateRange } from '../reports.component';
import { ReportService } from '../report.service';
import { CoachWithEventsDto } from '../models/coaches-report.model';
import { CoachReportItemComponent } from './coach-report-item/coach-report-item.component';

@Component({
  selector: 'app-coach-report',
  standalone: true,
  imports: [CoachReportItemComponent, DatePipe, DecimalPipe, MatButtonModule],
  templateUrl: './coach-report.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './coach-report.component.scss'
})
export class CoachReportComponent {
  readonly dateRange = input.required<DateRange>();
  private readonly reportService = inject(ReportService);
  private readonly reload = signal(0);
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly coachesWithEvents = signal<CoachWithEventsDto[]>([]);
  readonly totalEvents = computed(() => this.coachesWithEvents().reduce((sum, row) => sum + row.totalEvents, 0));
  readonly totalSalary = computed(() => this.coachesWithEvents().reduce((sum, row) => sum + row.totalSalary, 0));

  constructor() {
    effect(onCleanup => {
      const range = this.dateRange();
      this.reload();
      this.loading.set(true);
      this.failed.set(false);
      this.coachesWithEvents.set([]);
      const subscription = this.reportService.getAllCoachesEventsWithParticipantsByPeriod(range.startDate, range.endDate).subscribe({
        next: rows => { this.coachesWithEvents.set(rows); this.loading.set(false); },
        error: () => { this.failed.set(true); this.loading.set(false); }
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }

  retry(): void { this.reload.update(value => value + 1); }
}
