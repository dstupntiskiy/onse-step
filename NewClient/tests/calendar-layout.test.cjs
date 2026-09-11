const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../src/app/calendar/calendar-layout.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const context = { exports: {}, Date };
vm.runInNewContext(compiled, context);
const { dateKey, parseDateKey, weekStart, monthDays, moveMonth, layoutDay, layoutScheduleDay, addDays } = context.exports;
const day = new Date(2026, 8, 8);
function event(id, hour, minute, endHour, endMinute = 0) { return { id, kind: 'event', title: id, start: new Date(2026, 8, 8, hour, minute), end: new Date(2026, 8, 8, endHour, endMinute) }; }
test('Monday-first week crosses year boundary correctly', () => assert.equal(dateKey(weekStart(new Date(2026, 0, 1))), '2025-12-29'));
test('date-only values stay local and invalid dates are rejected', () => { assert.equal(dateKey(parseDateKey('2026-09-08')), '2026-09-08'); assert.equal(parseDateKey('2026-02-30'), null); assert.equal(parseDateKey('2026-13-01'), null); });
test('month navigation clamps the 31st, including leap years', () => { assert.equal(dateKey(moveMonth(new Date(2026, 0, 31), 1)), '2026-02-28'); assert.equal(dateKey(moveMonth(new Date(2024, 0, 31), 1)), '2024-02-29'); });
test('month includes 42 local days from Monday', () => { const days = monthDays(day); assert.equal(days.length, 42); assert.equal(days[0].getDay(), 1); assert.equal(dateKey(days[41]), dateKey(addDays(days[0], 41))); });
test('adjacent events use full width', () => { const items = layoutDay([event('a',10,0,11),event('b',11,0,12)],day,9,22); assert.ok(items.every(e => e.width === 100)); assert.equal(items[0].top,76); assert.equal(items[0].height,76); });
test('overlaps share lanes without colliding, including chained overlaps', () => { const items = layoutDay([event('a',10,0,12),event('b',10,30,11),event('c',11,0,13)],day,9,22); assert.ok(items.every(e => e.width === 50)); const a = items.find(e=>e.entry.id==='a'),b=items.find(e=>e.entry.id==='b'),c=items.find(e=>e.entry.id==='c'); assert.notEqual(a.left,b.left); assert.equal(b.left,c.left); });
test('three simultaneous events occupy three lanes', () => { const items=layoutDay([event('a',10,0,12),event('b',10,0,12),event('c',10,0,12)],day,9,22); assert.equal(new Set(items.map(e=>e.left)).size,3); assert.ok(items.every(e=>Math.abs(e.width-100/3)<.001)); });
test('overnight events split at midnight and end-exclusive does not duplicate', () => { const overnight={...event('a',23,0,23),end:new Date(2026,8,9,1)}; assert.equal(layoutDay([overnight],day,0,24)[0].height,76); assert.equal(layoutDay([overnight],addDays(day,1),0,24)[0].height,76); assert.equal(layoutDay([{...overnight,end:new Date(2026,8,9)}],addDays(day,1),0,24).length,0); });
test('empty and invalid intervals have no visible entries', () => { assert.equal(layoutDay([],day,9,22).length,0); assert.equal(layoutDay([event('a',12,0,11)],day,9,22).length,0); });
test('calendar day arithmetic survives daylight saving transition', () => { const before=new Date(2026,2,28); assert.equal(dateKey(addDays(before,2)),'2026-03-30'); assert.equal(addDays(before,2).getHours(),0); });

test('both kinds remain visible with the selected kind taking 90 percent', () => {
  const entries = [event('class',10,0,12), {...event('duty',9,0,15), kind:'duty'}];
  for (const mode of ['event', 'duty']) {
    const items = layoutScheduleDay(entries, day, 9, 22, mode);
    assert.equal(items.length, 2);
    const lesson = items.find(item => item.entry.kind === 'event');
    const duty = items.find(item => item.entry.kind === 'duty');
    assert.equal(lesson.left, 0);
    assert.equal(lesson.width, mode === 'event' ? 90 : 10);
    assert.equal(duty.left, lesson.width);
    assert.equal(duty.width, 100 - lesson.width);
    assert.equal(lesson.top, 76);
    assert.equal(duty.height, 456);
  }
});

test('simultaneous events and duties share lanes independently within their own areas', () => {
  const entries = [event('a',10,0,12), event('b',11,0,13), {...event('c',9,0,14),kind:'duty'}, {...event('d',10,0,15),kind:'duty'}];
  for (const mode of ['event', 'duty']) {
    const items = layoutScheduleDay(entries, day, 9, 22, mode);
    const boundary = mode === 'event' ? 90 : 10;
    for (const kind of ['event', 'duty']) {
      const group = items.filter(item => item.entry.kind === kind);
      assert.equal(group.length, 2);
      assert.equal(new Set(group.map(item => item.left)).size, 2);
      for (const item of group) {
        assert.equal(item.width, (kind === 'event' ? boundary : 100 - boundary) / 2);
        assert.ok(item.left >= (kind === 'event' ? 0 : boundary));
        assert.ok(item.left + item.width <= (kind === 'event' ? boundary : 100));
      }
    }
  }
});

test('an empty area stays reserved instead of moving the other kind', () => {
  for (const mode of ['event', 'duty']) {
    const duty = layoutScheduleDay([{...event('duty',10,0,12), kind:'duty'}], day, 9, 22, mode)[0];
    assert.equal(duty.left, mode === 'event' ? 90 : 10);
    assert.equal(duty.left + duty.width, 100);
    const lesson = layoutScheduleDay([event('class',10,0,12)], day, 9, 22, mode)[0];
    assert.equal(lesson.left, 0);
    assert.equal(lesson.width, mode === 'event' ? 90 : 10);
    assert.equal(layoutScheduleDay([], day, 9, 22, mode).length, 0);
  }
});

test('overnight duties keep their side and time geometry when focus switches', () => {
  const duty = {...event('night',23,0,23), kind:'duty', end:new Date(2026,8,9,1)};
  for (const mode of ['event', 'duty']) {
    const first = layoutScheduleDay([duty], day, 0, 24, mode)[0];
    const second = layoutScheduleDay([duty], addDays(day, 1), 0, 24, mode)[0];
    assert.equal(first.top, 23 * 76);
    assert.equal(second.top, 0);
    assert.equal(first.height, 76);
    assert.equal(second.height, 76);
    assert.equal(first.left, second.left);
    assert.equal(first.width, second.width);
    assert.equal(layoutScheduleDay([{...duty, end:addDays(day, 1)}], addDays(day, 1), 0, 24, mode).length, 0);
  }
});
