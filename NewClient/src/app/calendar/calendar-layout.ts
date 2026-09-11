/** Local calendar dates; end boundaries are exclusive. */
export function dayStart(value: Date): Date { return new Date(value.getFullYear(), value.getMonth(), value.getDate()); }
export function addDays(value: Date, days: number): Date { const result = new Date(value); result.setDate(result.getDate() + days); return result; }
export function weekStart(value: Date): Date { return addDays(dayStart(value), -((value.getDay() + 6) % 7)); }
export function dateKey(value: Date): string { return [value.getFullYear(), String(value.getMonth() + 1).padStart(2, '0'), String(value.getDate()).padStart(2, '0')].join('-'); }
export function parseDateKey(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const result = new Date(+match[1], +match[2] - 1, +match[3]);
  return dateKey(result) === value ? result : null;
}
export function monthDays(value: Date): Date[] { const first = weekStart(new Date(value.getFullYear(), value.getMonth(), 1)); return Array.from({length: 42}, (_, i) => addDays(first, i)); }
export function moveMonth(value: Date, delta: number): Date {
  const target = new Date(value.getFullYear(), value.getMonth() + delta, 1);
  target.setDate(Math.min(value.getDate(), new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()));
  return target;
}
export interface CalendarEntry {
  id: string; kind: 'event' | 'duty'; title: string; start: Date; end: Date;
  color: string; coach: string; coachId: string; group: string; eventType: number; recurrent: boolean; substituted: boolean;
}
export interface PositionedEntry { entry: CalendarEntry; top: number; height: number; left: number; width: number; }
/** Split at local midnight, then allocate lanes per connected overlap group. */
export function layoutDay(entries: CalendarEntry[], day: Date, firstHour: number, lastHour: number, hourHeight = 76): PositionedEntry[] {
  const start = dayStart(day), end = addDays(start, 1);
  const visible = entries.filter(e => e.start < end && e.end > start && e.end > e.start).map(entry => {
    const from = entry.start < start ? 0 : entry.start.getHours() * 60 + entry.start.getMinutes();
    const to = entry.end >= end ? 1440 : entry.end.getHours() * 60 + entry.end.getMinutes();
    return { entry, from: Math.max(firstHour * 60, from), to: Math.min(lastHour * 60, to), lane: 0 };
  }).filter(e => e.to > e.from).sort((a, b) => a.from - b.from || b.to - a.to || a.entry.id.localeCompare(b.entry.id));
  const result: PositionedEntry[] = [];
  let cluster: typeof visible = [], clusterEnd = -1;
  const flush = () => {
    const lanes: number[] = [];
    for (const item of cluster) {
      let lane = lanes.findIndex(endMinute => endMinute <= item.from);
      if (lane < 0) lane = lanes.length;
      lanes[lane] = item.to;
      item.lane = lane;
    }
    for (const item of cluster) result.push({ entry: item.entry, top: (item.from / 60 - firstHour) * hourHeight, height: (item.to - item.from) / 60 * hourHeight, left: item.lane * 100 / lanes.length, width: 100 / lanes.length });
  };
  for (const item of visible) {
    if (item.from >= clusterEnd && cluster.length) { flush(); cluster = []; clusterEnd = -1; }
    cluster.push(item); clusterEnd = Math.max(clusterEnd, item.to);
  }
  if (cluster.length) flush();
  return result;
}

/** Events stay on the left, duties on the right; overlaps share only their own area. */
export function layoutScheduleDay(entries: CalendarEntry[], day: Date, firstHour: number, lastHour: number, mode: CalendarEntry['kind'], hourHeight = 76): PositionedEntry[] {
  const eventWidth = mode === 'event' ? 90 : 10;
  return (['event', 'duty'] as const).flatMap(kind => {
    const width = kind === 'event' ? eventWidth : 100 - eventWidth;
    const left = kind === 'event' ? 0 : eventWidth;
    return layoutDay(entries.filter(entry => entry.kind === kind), day, firstHour, lastHour, hourHeight)
      .map(item => ({ ...item, left: left + item.left * width / 100, width: item.width * width / 100 }));
  });
}
