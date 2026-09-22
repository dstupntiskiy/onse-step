import { test, expect, Page } from '@playwright/test';

const report = {
  totalAmount: 18000, membershipAmount: 15000, onetimeAmount: 3000, membershipCount: 3, onetimeCount: 2,
  byStyle: [
    {key:'rental', styleId:null, styleName:'Аренда', totalAmount:2000, membershipAmount:0, onetimeAmount:2000, membershipCount:0, onetimeCount:1, totalCount:1},
    {key:'bachata', styleId:'bachata', styleName:'Bachata', totalAmount:7000, membershipAmount:6000, onetimeAmount:1000, membershipCount:2, onetimeCount:1, totalCount:3},
    {key:'unlimited', styleId:null, styleName:'Безлимит', totalAmount:9000, membershipAmount:9000, onetimeAmount:0, membershipCount:1, onetimeCount:0, totalCount:1}
  ],
  byDate: [
    {date:'2026-09-30', totalAmount:11000, membershipAmount:9000, onetimeAmount:2000},
    {date:'2026-09-01', totalAmount:6700, membershipAmount:6000, onetimeAmount:700},
    {date:'2026-09-02', totalAmount:300, membershipAmount:0, onetimeAmount:300}
  ]
};
const empty = {totalAmount:0, membershipAmount:0, onetimeAmount:0, membershipCount:0, onetimeCount:0, byStyle:[], byDate:[]};

async function setup(page: Page) {
  await page.clock.install({time:new Date('2026-09-10T12:00:00+02:00')});
  await page.addInitScript(() => localStorage.setItem('jwtToken', 'isolated-test-token'));
  await page.route('**/api/**', route => route.fulfill({json:route.request().url().toLowerCase().includes('issuperadminaccess') ? true : []}));
}

for (const width of [1440, 390, 320]) {
  test(`combined report totals, stacked charts and dates at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height:1000});
    await setup(page);
    await page.route('**/api/Report/GetPaymentsReportByPeriod?**', async route => {
      const params = new URL(route.request().url()).searchParams;
      expect(params.get('startDate')).toBe('2026-08-31T22:00:00.000Z');
      expect(params.get('endDate')).toBe('2026-09-30T22:00:00.000Z');
      expect(params.get('timeZoneId')).toBe('Europe/Belgrade');
      await route.fulfill({json:report});
    });
    await page.goto('/reports');
    await expect(page.getByRole('tab', {name:'Абонементы и разовые', exact:true})).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', {name:'Разовые', exact:true})).toHaveCount(0);
    await expect(page.locator('.total-amount')).toHaveText('18 000 RSD');
    await expect(page.locator('.total-breakdown')).toContainText('15 000 RSD');
    await expect(page.locator('.total-breakdown')).toContainText('3 000 RSD');
    await expect(page.locator('.unlimited-note')).toHaveText('В том числе безлимитных абонементов: 1');
    const panels = page.locator('app-payments-report .chart-panel');
    await expect(panels.locator('h3')).toHaveText(['Сумма, RSD по направлениям', 'Количество по направлениям', 'Сумма по датам RSD']);
    await expect(panels.nth(0).locator('.row-label > span')).toHaveText(['Безлимит', 'Bachata', 'Аренда']);
    await expect(panels.nth(0).locator('.chart-row').filter({hasText:'Безлимит'}).locator('.row-label strong')).toHaveText('9 000');
    await expect(panels.nth(1).locator('.chart-row').filter({hasText:'Безлимит'}).locator('.row-label strong')).toHaveText('1');
    await expect(panels.nth(1).locator('.chart-row').first()).toContainText('Абонементы: 2');
    await expect(panels.nth(1).locator('.chart-row').first()).toContainText('Разовые: 1');
    const bars = panels.nth(0).locator('.chart-row').nth(1).locator('.segment');
    const membershipBar = await bars.nth(0).boundingBox();
    const onetimeBar = await bars.nth(1).boundingBox();
    expect(membershipBar!.width / onetimeBar!.width).toBeCloseTo(6, 1);
    expect(await bars.nth(0).evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(await bars.nth(1).evaluate(el => getComputedStyle(el).backgroundColor));
    await expect(page.locator('.date-label')).toHaveText(['01.09', '02.09', '30.09']);
    const firstDay = page.locator('.date-column').first();
    await firstDay.focus();
    await expect(firstDay.locator('.column-details')).toHaveCSS('opacity','1');
    await expect(firstDay.locator('.column-details')).toContainText('Разовые: 700 RSD');
    const stack = await firstDay.locator('.column-stack').boundingBox();
    expect(stack!.height).toBeCloseTo(200 * 6700 / 11000, 0);
    await page.getByRole('button', {name:'Построить'}).focus();
    if (width <= 400) {
      const inputs = page.locator('.date-range input');
      const startBounds = await inputs.nth(0).boundingBox();
      const endBounds = await inputs.nth(1).boundingBox();
      expect(endBounds!.y).toBeGreaterThan(startBounds!.y + startBounds!.height);
      expect(startBounds!.width).toBeGreaterThan(140);
    }
    await page.locator('.total-panel').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({path:`test-results/reports-${width}.png`, fullPage:true});
  });
}

test('a full month fits the chart width after resizing, including day details at both edges', async ({page}) => {
  await setup(page);
  const byDate = Array.from({length:31}, (_, index) => ({
    date:`2026-08-${String(index + 1).padStart(2, '0')}`,
    membershipAmount: (index % 7 + 1) * 1000,
    onetimeAmount: (index % 3 + 1) * 400,
    totalAmount: (index % 7 + 1) * 1000 + (index % 3 + 1) * 400
  }));
  await page.route('**/api/Report/GetPaymentsReportByPeriod?**', route => route.fulfill({json:{...report, byDate}}));
  await page.goto('/reports');
  await page.getByRole('button', {name:'Месяц отчёта: Сент 2026'}).click();
  await page.getByRole('button', {name:'Август 2026', exact:true}).click();
  const chart = page.locator('.date-chart');
  const columns = chart.locator('.date-column');
  await expect(columns).toHaveCount(31);
  for (const width of [1440, 900, 390, 320, 1440]) {
    await page.setViewportSize({width, height:1000});
    await expect.poll(() => chart.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    const bounds = (await chart.boundingBox())!;
    const first = (await columns.first().boundingBox())!;
    const last = (await columns.last().boundingBox())!;
    expect(first.y).toBe(last.y);
    expect(first.x).toBeCloseTo(bounds.x, 0);
    expect(last.x + last.width).toBeCloseTo(bounds.x + bounds.width, 0);
    expect(first.width).toBeCloseTo(bounds.width / 31, 0);
    await expect(columns.first().locator('.date-label')).toBeVisible();
    await expect(columns.last().locator('.date-label')).toBeVisible();
    for (const index of [0, 15, 30]) {
      await columns.nth(index).focus();
      const tooltip = columns.nth(index).locator('.column-details');
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toContainText(`${String(index + 1).padStart(2, '0')}.08.2026`);
      const tooltipBounds = (await tooltip.boundingBox())!;
      expect(tooltipBounds.x).toBeGreaterThanOrEqual(bounds.x);
      expect(tooltipBounds.x + tooltipBounds.width).toBeLessThanOrEqual(bounds.x + bounds.width + 1);
      expect(await chart.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    }
    await page.getByRole('button', {name:'Построить'}).focus();
    await page.locator('.chart-panel').last().screenshot({path:`test-results/date-chart-full-month-${width}.png`});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('report handles failures, retry, empty periods and the entire selected final day', async ({page}) => {
  await setup(page);
  let fail = true;
  const queries: URLSearchParams[] = [];
  await page.route('**/api/Report/GetPaymentsReportByPeriod?**', async route => {
    queries.push(new URL(route.request().url()).searchParams);
    await route.fulfill(fail ? {status:500,json:{}} : {json:empty});
  });
  await page.goto('/reports');
  await expect(page.getByRole('alert')).toContainText('Не удалось загрузить отчет');
  fail = false;
  await page.getByRole('button', {name:'Повторить', exact:true}).click();
  await expect(page.locator('.total-amount')).toHaveText('0 RSD');
  await expect(page.locator('.unlimited-note')).toHaveText('В том числе безлимитных абонементов: 0');
  await expect(page.locator('.empty')).toHaveCount(3);
  await page.getByRole('textbox', {name:'Начало', exact:true}).fill('09/10/2026');
  await page.getByRole('textbox', {name:'Конец', exact:true}).fill('09/10/2026');
  await page.getByRole('button', {name:'Построить'}).click();
  await expect.poll(() => queries.length).toBe(3);
  expect(queries[2].get('startDate')).toBe('2026-09-09T22:00:00.000Z');
  expect(queries[2].get('endDate')).toBe('2026-09-10T22:00:00.000Z');
  await page.getByRole('textbox', {name:'Начало', exact:true}).fill('09/11/2026');
  await expect(page.getByRole('button', {name:'Построить'})).toBeDisabled();
});

test('changing the period cancels an older report and handles a single payment type', async ({page}) => {
  await setup(page);
  let releaseFirst!: () => void;
  const firstResponse = new Promise<void>(resolve => releaseFirst = resolve);
  let requests = 0;
  await page.route('**/api/Report/GetPaymentsReportByPeriod?**', async route => {
    requests++;
    if (requests === 1) {
      await firstResponse;
      await route.fulfill({json:report}).catch(() => {});
    } else {
      await route.fulfill({json:{
        totalAmount:2000, membershipAmount:0, onetimeAmount:2000, membershipCount:0, onetimeCount:1,
        byStyle:[report.byStyle[0]],
        byDate:[{date:'2026-09-10', totalAmount:2000, membershipAmount:0, onetimeAmount:2000}]
      }});
    }
  });
  await page.goto('/reports');
  await expect(page.getByRole('status')).toHaveText('Загружаем отчет…');
  await expect.poll(() => requests).toBe(1);
  const aborted = page.waitForEvent('requestfailed', request => request.url().includes('GetPaymentsReportByPeriod'));
  await page.getByRole('textbox', {name:'Начало', exact:true}).fill('09/10/2026');
  await page.getByRole('button', {name:'Построить'}).click();
  await aborted;
  await expect(page.locator('.total-amount')).toHaveText('2 000 RSD');
  releaseFirst();
  await expect(page.locator('.date-label')).toHaveText(['10.09']);
  const membershipSegment = await page.locator('.column-stack .membership').boundingBox();
  const onetimeSegment = await page.locator('.column-stack .onetime').boundingBox();
  expect(membershipSegment!.height).toBe(0);
  expect(onetimeSegment!.height).toBe(200);
});
