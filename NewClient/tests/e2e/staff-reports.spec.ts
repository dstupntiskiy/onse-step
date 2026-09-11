import { test, expect, Page } from '@playwright/test';

const coachEndpoint = 'GetAllCoachesEventsWithParticipantsByPeriod';
const dutyEndpoint = 'GetEventDutiesReportByPeriod';
const coaches = [{
  coach: {id:'coach-1', name:'Александра Константинопольская'}, totalEvents:2, totalSalary:3250,
  eventWithParticipants: [
    {name:'Bachata — продолжающая группа с длинным названием', startDate:'2026-09-30T19:00:00+02:00', membersCount:8, onetimeVisitsCount:2, participantsCount:9, baseSalary:1000, bonusSalary:750, totalSalary:1750},
    {name:'Salsa', startDate:'2026-09-01T18:00:00+02:00', membersCount:6, onetimeVisitsCount:1, participantsCount:7, baseSalary:1000, bonusSalary:500, totalSalary:1500}
  ]
}];
const duties = [{name:'Александра Константинопольская', totalHours:5.5, eventDutyDetails:[
  {startDate:'2026-09-30T22:00:00+02:00', endDate:'2026-10-01T00:30:00+02:00'},
  {startDate:'2026-09-01T17:00:00+02:00', endDate:'2026-09-01T20:00:00+02:00'}
]}, {name:'Михаил', totalHours:3, eventDutyDetails:[
  {startDate:'2026-09-02T17:00:00+02:00', endDate:'2026-09-02T20:00:00+02:00'}
]}];

async function setup(page: Page) {
  await page.clock.install({time:new Date('2026-09-10T12:00:00+02:00')});
  await page.addInitScript(() => localStorage.setItem('jwtToken', 'isolated-test-token'));
  await page.route('**/api/**', route => route.fulfill({json:route.request().url().toLowerCase().includes('issuperadminaccess') ? true : []}));
  await page.route(`**/api/Report/${coachEndpoint}?**`, route => route.fulfill({json:coaches}));
  await page.route(`**/api/Report/${dutyEndpoint}?**`, route => route.fulfill({json:duties}));
}

for (const width of [1440, 390, 320]) {
  test(`staff report details and totals fit at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height:1000});
    await setup(page);
    await page.goto('/reports');
    await page.getByRole('tab', {name:'Тренеры', exact:true}).click();
    const monthTrigger = page.getByRole('button', {name:'Месяц отчёта: Сент 2026', exact:true});
    expect((await monthTrigger.boundingBox())!.width).toBeLessThan(180);
    await monthTrigger.click();
    const picker = page.getByRole('dialog', {name:'Выбор месяца'});
    await expect(picker.getByRole('button', {name:'Сентябрь 2026'})).toHaveAttribute('aria-pressed', 'true');
    await expect(picker.getByRole('button', {name:'Сентябрь 2026'})).toBeFocused();
    await expect(picker.locator('.month-grid button')).toHaveCount(12);
    const pickerBounds = await picker.boundingBox();
    expect(pickerBounds!.x).toBeGreaterThanOrEqual(0);
    expect(pickerBounds!.x + pickerBounds!.width).toBeLessThanOrEqual(width);
    await page.screenshot({path:`test-results/month-picker-${width}.png`, fullPage:true});
    await page.keyboard.press('Escape');
    await expect(picker).toHaveCount(0);
    await expect(monthTrigger).toBeFocused();
    await monthTrigger.click();
    await page.locator('.cdk-overlay-backdrop').click({position:{x:2, y:2}});
    await expect(picker).toHaveCount(0);
    await expect(page.locator('app-coach-report .summary-card').first()).toContainText('3 250');
    const toggle = page.getByRole('button', {name:'Показать детали', exact:true});
    await toggle.click();
    await expect(page.getByRole('button', {name:'Скрыть детали'})).toHaveAttribute('aria-expanded', 'true');
    const rows = page.locator('tr[app-event-report-item]');
    await expect(rows).toHaveCount(2);
    await expect(rows.first().locator('.lesson')).toContainText('Salsa');
    await expect(rows.first().locator('time')).toHaveText('01.09.2026 · 18:00');
    await expect(rows.last().locator('td')).toHaveText([
      /Bachata.*30.09.2026 · 19:00/s, '8', '2', '9', '1 000', '750', '1 750'
    ]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('.event-items').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.screenshot({path:`test-results/coaches-${width}.png`, fullPage:true});
    await page.getByRole('button', {name:'Скрыть детали'}).click();
    await expect(rows).toHaveCount(0);
    await page.getByRole('tab', {name:'Дежурства', exact:true}).click();
    await expect(page.locator('app-duty-report .summary-card strong')).toHaveText(['8,5 ч','3','2']);
    const card = page.locator('.duty-card').first();
    await card.locator('summary').click();
    await expect(card.locator('.duty-details li').first()).toHaveText('01.09.202617:00 — 20:00');
    await expect(card.locator('.duty-details li').last()).toContainText('01.10.2026');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({path:`test-results/duties-${width}.png`, fullPage:true});
  });
}

for (const [tab, endpoint] of [['Тренеры', coachEndpoint], ['Дежурства', dutyEndpoint]]) {
  test(`${tab}: month selection covers leap years, year changes and daylight saving`, async ({page}) => {
    await setup(page);
    const queries: URLSearchParams[] = [];
    await page.route(`**/api/Report/${endpoint}?**`, async route => {
      queries.push(new URL(route.request().url()).searchParams);
      await route.fulfill({json:[]});
    });
    await page.goto('/reports');
    await page.getByRole('tab', {name:tab, exact:true}).click();
    await expect.poll(() => queries.length).toBe(1);
    const month = page.locator('.month-trigger');
    await expect(month).toContainText('Сент 2026');
    for (const [index, year, name, start, end] of [
      [2, 2024, 'Февраль', '2024-01-31T23:00:00.000Z', '2024-02-29T22:59:59.999Z'],
      [3, 2025, 'Декабрь', '2025-11-30T23:00:00.000Z', '2025-12-31T22:59:59.999Z'],
      [4, 2026, 'Март', '2026-02-28T23:00:00.000Z', '2026-03-31T21:59:59.999Z']
    ] as const) {
      await month.click();
      const picker = page.getByRole('dialog', {name:'Выбор месяца'});
      let displayedYear = Number(await picker.locator('.month-popover-header strong').innerText());
      while (displayedYear !== year) {
        await picker.getByRole('button', {name:displayedYear > year ? 'Предыдущий год' : 'Следующий год'}).click();
        displayedYear = Number(await picker.locator('.month-popover-header strong').innerText());
      }
      await picker.getByRole('button', {name:`${name} ${year}`, exact:true}).click();
      await expect(picker).toHaveCount(0);
      await expect(month).toBeFocused();
      await expect.poll(() => queries.length).toBe(index);
      expect(queries[index - 1].get('startDate')).toBe(start);
      expect(queries[index - 1].get('endDate')).toBe(end);
    }
    await page.getByRole('textbox', {name:'Начало', exact:true}).fill('03/10/2026');
    await page.getByRole('textbox', {name:'Конец', exact:true}).fill('03/10/2026');
    await expect(month).toContainText('Выбрать месяц');
    await page.getByRole('button', {name:'Построить'}).click();
    await expect.poll(() => queries.length).toBe(5);
    expect(queries[4].get('startDate')).toBe('2026-03-09T23:00:00.000Z');
    expect(queries[4].get('endDate')).toBe('2026-03-10T22:59:59.999Z');
    await page.getByRole('textbox', {name:'Начало', exact:true}).fill('03/11/2026');
    await expect(page.getByRole('button', {name:'Построить'})).toBeDisabled();
    await month.click();
    await page.getByRole('button', {name:'Текущий месяц', exact:true}).click();
    await expect(month).toContainText('Сент 2026');
    await expect.poll(() => queries.length).toBe(6);
    expect(queries[5].get('startDate')).toBe('2026-08-31T22:00:00.000Z');
    expect(queries[5].get('endDate')).toBe('2026-09-30T21:59:59.999Z');
  });

  test(`${tab}: failed requests can be retried and empty periods are clear`, async ({page}) => {
    await setup(page);
    let fail = true;
    await page.route(`**/api/Report/${endpoint}?**`, route => route.fulfill(fail ? {status:500, json:{}} : {json:[]}));
    await page.goto('/reports');
    await page.getByRole('tab', {name:tab, exact:true}).click();
    await expect(page.getByRole('alert')).toContainText('Не удалось загрузить отчёт');
    fail = false;
    await page.getByRole('button', {name:'Повторить', exact:true}).click();
    await expect(page.locator('.report-state')).toContainText('Выберите другой месяц');
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
}
