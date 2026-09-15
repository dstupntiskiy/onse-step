import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterRenderEffect, computed, effect, inject, signal, viewChild, OutputRefSubscription } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { A11yModule } from '@angular/cdk/a11y';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { forkJoin } from 'rxjs';
import { EventService } from './event/event.service';
import { EventModel, EventDutyModel } from './event/event.model';
import { DialogService } from '../services/dialog.service';
import { EventDialogComponent } from './event-dialog/event-dialog.component';
import { DutyDialogComponent } from './duty-dialog/duty-dialog.component';
import { addDays, CalendarEntry, dateKey, dayStart, layoutScheduleDay, monthDays, moveMonth, parseDateKey, weekStart } from './calendar-layout';
type View = 'week' | 'day';
@Component({
  selector: 'app-calendar', standalone: true, imports: [DatePipe, FormsModule, MatIconModule, A11yModule, OverlayModule],
  templateUrl: './calendar.component.html', styleUrl: './calendar.component.scss', changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent {
  private readonly api = inject(EventService);
  private readonly dialogs = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);
  readonly selected = signal(dayStart(new Date()));
  readonly miniMonth = signal(dayStart(new Date()));
  readonly datePickerOpen = signal(false);
  readonly datePickerPositions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -8 }
  ];
  private readonly mobileViewport = window.matchMedia('(max-width: 760px)');
  private readonly responsiveView = signal<View>(this.mobileViewport.matches ? 'day' : 'week');
  readonly view = this.responsiveView.asReadonly();
  readonly mode = signal<'event' | 'duty'>('event');
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly revision = signal(0);
  readonly entries = signal<CalendarEntry[]>([]);
  readonly now = signal(new Date());
  readonly weekdays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  readonly dateKey = dateKey;
  readonly miniDays = computed(() => monthDays(this.miniMonth()));
  readonly days = computed(() => this.view() === 'day' ? [this.selected()] : Array.from({length: 7}, (_, i) => addDays(weekStart(this.selected()), i)));
  readonly range = computed(() => ({ start: this.days()[0], end: addDays(this.days()[this.days().length - 1], 1) }));
  readonly sortedEntries = computed(() => [...this.entries()].sort((a, b) => +a.start - +b.start));
  readonly focusedEntries = computed(() => this.sortedEntries().filter(entry => entry.kind === this.mode()));
  readonly firstHour = 8;
  readonly lastHour = 24;
  private readonly calendarScroll = viewChild<ElementRef<HTMLDivElement>>('calendarScroll');
  readonly hours = computed(() => Array.from({length: this.lastHour - this.firstHour}, (_, i) => i + this.firstHour));
  readonly slots = computed(() => Array.from({length: this.hours().length * 2}, (_, i) => this.firstHour + i / 2));
  readonly columns = computed(() => this.days().map(day => ({day, items: layoutScheduleDay(this.sortedEntries(), day, this.firstHour, this.lastHour, this.mode())})));
  readonly next = computed(() => this.focusedEntries().find(e => e.end > this.now()));
  constructor() {
    let initializedScroll: HTMLDivElement | undefined;
    afterRenderEffect({ write: () => {
      const scroll = this.calendarScroll()?.nativeElement;
      if (!scroll || this.loading() || scroll === initializedScroll) return;
      // Initialize after loading; later refreshes and clock updates preserve manual scrolling.
      const offset = Math.max(0, new Date().getHours() - this.firstHour) * 76;
      // Leave enough room below late hours to align them with the top of the viewport.
      scroll.style.setProperty('--initial-scroll-padding', `${Math.max(0, offset + scroll.clientHeight - scroll.scrollHeight)}px`);
      scroll.scrollTop = offset;
      initializedScroll = scroll;
    }});
    const updateView = (event: MediaQueryListEvent) => this.responsiveView.set(event.matches ? 'day' : 'week');
    this.mobileViewport.addEventListener('change', updateView);
    this.destroyRef.onDestroy(() => this.mobileViewport.removeEventListener('change', updateView));
    effect(onCleanup => {
      const {start, end} = this.range(); this.revision();
      this.loading.set(true); this.error.set(false);
      const subscription = forkJoin({ events: this.api.getEventsByPeriod(start.toISOString(), end.toISOString()), duties: this.api.getEventsDutyByPeriod(start.toISOString(), end.toISOString()) }).subscribe({
        next: result => { this.entries.set([...result.events.map(e => this.eventEntry(e)), ...result.duties.map(e => this.dutyEntry(e))]); this.loading.set(false); },
        error: () => { this.entries.set([]); this.error.set(true); this.loading.set(false); }
      });
      onCleanup(() => subscription.unsubscribe());
    });
    const timer = window.setInterval(() => this.now.set(new Date()), 60000);
    this.destroyRef.onDestroy(() => window.clearInterval(timer));
  }
  private eventEntry(e: EventModel): CalendarEntry {
    const coach = e.eventCoachSubstitution?.coach ?? e.coach;
    return {id:e.id,kind:'event',title:e.name,start:new Date(e.startDateTime),end:new Date(e.endDateTime),color:e.color || '#2bb3ba',coach:coach?.name || '',coachId:coach?.id || '',group:e.group?.name || '',eventType:e.eventType,recurrent:!!e.recurrence,substituted:!!e.eventCoachSubstitution};
  }
  private dutyEntry(e: EventDutyModel): CalendarEntry { return {id:e.id,kind:'duty',title:e.name,start:new Date(e.startDateTime),end:new Date(e.endDateTime),color:e.color || '#c48950',coach:'',coachId:'',group:'',eventType:-1,recurrent:false,substituted:false}; }
  eventsForDay(day: Date) { const end = addDays(day, 1); return this.sortedEntries().filter(e => e.kind === 'event' && e.start < end && e.end > day); }
  isToday(day: Date) { return dateKey(day) === dateKey(this.now()); }
  navigate(delta: number) { this.selectDate(addDays(this.selected(), delta * (this.view() === 'day' ? 1 : 7))); }
  selectDate(day: Date) { this.selected.set(dayStart(day)); this.miniMonth.set(dayStart(day)); }
  dateInput(value: string) { const day = parseDateKey(value); if (day) this.selectMini(day); }
  today() { this.selectDate(new Date()); }
  moveMini(delta: number) { this.miniMonth.set(moveMonth(this.miniMonth(), delta)); }
  toggleDatePicker() { this.miniMonth.set(this.selected()); this.datePickerOpen.update(open => !open); }
  selectMini(day: Date) { this.selectDate(day); this.datePickerOpen.set(false); }
  setMode(mode: 'event' | 'duty') { this.mode.set(mode); }
  currentLine(day: Date): number | null { if (!this.isToday(day)) return null; const minute = this.now().getHours() * 60 + this.now().getMinutes(); return minute >= this.firstHour * 60 && minute <= this.lastHour * 60 ? (minute / 60 - this.firstHour) * 76 : null; }
  createAt(day = this.selected(), hour = 18) { const date = new Date(day); date.setHours(Math.floor(hour), hour % 1 * 60, 0, 0); this.open(undefined, date); }
  open(entry?: CalendarEntry, start = this.selected()) {
    const duty = entry ? entry.kind === 'duty' : this.mode() === 'duty';
    const ref = this.dialogs.showDialog(duty ? DutyDialogComponent : EventDialogComponent, { id: entry?.id, startDateTime: entry?.start ?? start });
    const subscriptions: OutputRefSubscription[] = [];
    ref.afterOpened().subscribe(() => {
      const component = ref.componentInstance.componentRef.instance;
      if (duty) subscriptions.push(component.eventDutyDeleted.subscribe(() => this.refresh()));
      else { subscriptions.push(component.eventSaved.subscribe(() => this.refresh())); subscriptions.push(component.eventDeleted.subscribe(() => this.refresh())); }
    });
    ref.afterClosed().subscribe(() => { subscriptions.forEach(s => s.unsubscribe()); this.refresh(); });
  }
  refresh() { this.revision.update(v => v + 1); }
  typeName(e: CalendarEntry) { return e.kind === 'duty' ? 'Дежурство' : ['Занятие', 'Аренда', 'Мастер-класс'][e.eventType] || 'Событие'; }
}
