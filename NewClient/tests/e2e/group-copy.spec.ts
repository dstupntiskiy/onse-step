import { test, expect, Page } from '@playwright/test';

const style = { id: 's1', name: 'Bachata', active: false };
const source = { id: 'g1', name: 'Вечерняя группа', style, active: true,
  startDate: '2026-09-01', endDate: '2026-09-30', membersCount: 2, membershipsCount: 0 };
const clients = [{ id: 'c1', name: 'Анна Иванова' }, { id: 'c2', name: 'Борис Петров' },
  { id: 'c3', name: 'Вера Сидорова' }];

async function mockGroups(page: Page) {
  await page.addInitScript(() => localStorage.setItem('jwtToken', 'isolated-test-token'));
  const writes: { path: string; body: any }[] = [];
  let saved: any;
  await page.route('**/api/**', async route => {
    const request = route.request(), url = new URL(request.url()), path = url.pathname.toLowerCase();
    let body: unknown = [];
    if (request.method() !== 'GET') writes.push({ path, body: request.postDataJSON() });
    if (path.endsWith('/user/issuperadminaccess')) body = true;
    else if (path.endsWith('/group/getallwithdetails')) body = url.searchParams.get('skip') === '0' ? [source] : [];
    else if (path.includes('/group/getbyid/')) body = source;
    else if (path.endsWith('/style/getall')) body = [{ ...style, id: 's2', name: 'Salsa', active: true }];
    else if (path.endsWith('/group/getgroupmembers')) body = clients.slice(0, 2).map((member, i) => ({
      id: `link${i}`, group: source, member
    }));
    else if (path.endsWith('/client/getallbyquery')) body = clients.filter(client =>
      client.name.toLowerCase().includes((url.searchParams.get('query') ?? '').toLowerCase()));
    else if (path.endsWith('/group/') && request.method() === 'POST') {
      const input = request.postDataJSON();
      saved = { ...input, id: input.id ?? 'copy1', style,
        membersCount: input.memberIds?.length ?? 0, membershipsCount: 0 };
      body = saved;
    } else if (path.endsWith('/group/getgroupwithdetails')) body = saved;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  await page.goto('/groups');
  await expect(page.locator('app-group-card')).toHaveCount(1);
  return writes;
}

for (const width of [1536, 320]) {
  test(`copy is a cancellable draft and saves a separate group at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const writes = await mockGroups(page);
    await page.locator('app-group-card').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).not.toHaveClass(/mdc-dialog--opening/);
    await dialog.locator('.mat-mdc-dialog-surface').evaluate(element =>
      Promise.all(element.getAnimations().map(animation => animation.finished)));
    const copy = dialog.getByRole('button', { name: 'Копировать', exact: true });
    await expect(copy).toBeVisible();
    await expect(copy).toHaveCSS('background-color', 'rgb(255, 243, 205)');
    const copyBox = await copy.boundingBox();
    const closeBox = await dialog.getByRole('button', { name: 'Закрыть', exact: true }).boundingBox();
    if (width > 760) expect(copyBox!.x).toBeLessThan(closeBox!.x);
    else {
      expect(copyBox!.x).toBeLessThanOrEqual(closeBox!.x);
      expect(copyBox!.y).toBeLessThan(closeBox!.y);
    }
    await page.screenshot({ path: `test-results/group-edit-${width}.png`, animations: 'disabled' });
    await copy.click();
    await expect(dialog.getByRole('heading', { name: 'Создание группы' })).toBeVisible();
    await expect(dialog.getByRole('textbox', { name: 'Название', exact: true })).toHaveValue('Вечерняя группа - copy');
    await expect(dialog.getByRole('combobox', { name: 'Направление' })).toContainText('Bachata');
    await expect(dialog.getByRole('textbox', { name: 'Начало', exact: true })).toHaveValue('');
    await expect(dialog.getByRole('textbox', { name: 'Конец', exact: true })).toHaveValue('');
    await expect(dialog.locator('.draft-member')).toHaveCount(2);
    await expect(copy).toHaveCount(0);
    expect(writes).toEqual([]);
    await dialog.getByRole('button', { name: 'Закрыть', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    expect(writes).toEqual([]);
    await expect(page.locator('app-group-card')).toHaveCount(1);

    await page.locator('app-group-card').click();
    await copy.click();
    await expect(dialog.locator('.draft-member')).toHaveCount(2);
    await dialog.getByRole('button', { name: 'Сохранить', exact: true }).click();
    await expect(dialog.getByText('Укажите дату начала')).toBeVisible();
    expect(writes).toEqual([]);
    await dialog.getByRole('button', { name: 'Удалить участника Борис Петров', exact: true }).click();
    await dialog.getByPlaceholder('Добавить клиента').fill('Вера');
    await page.getByRole('option', { name: 'Вера Сидорова' }).click();
    await dialog.getByPlaceholder('Добавить клиента').fill('Анна');
    await page.getByRole('option', { name: 'Анна Иванова' }).click();
    await expect(dialog.locator('.draft-member')).toHaveCount(2);
    expect(writes).toEqual([]);
    await dialog.getByRole('textbox', { name: 'Начало', exact: true }).fill('10/01/2026');
    await dialog.getByRole('textbox', { name: 'Название', exact: true }).click();
    await dialog.locator('.drawer-body').evaluate(element => element.scrollTop = element.scrollHeight);
    await page.screenshot({ path: `test-results/group-copy-${width}.png`, animations: 'disabled' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await dialog.getByRole('button', { name: 'Сохранить', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    expect(writes).toHaveLength(1);
    expect(writes[0]).toMatchObject({ path: '/api/group/', body: {
      name: 'Вечерняя группа - copy', styleId: 's1', memberIds: ['c1', 'c3'], active: true
    } });
    expect(writes[0].body.id).toBeUndefined();
    expect(writes[0].body.endDate).toBeUndefined();
    expect(writes[0].body.startDate).toBeTruthy();
    await expect(page.locator('app-group-card')).toHaveCount(2);
    await expect(page.locator('app-group-card').first()).toContainText('Вечерняя группа - copy');
    await expect(page.locator('app-group-card').last().locator('strong')).toHaveText(source.name);
    await expect(page.locator('app-group-card').first().locator('.record-line').first()).toContainText('2');
  });
}

test('ordinary creation has no participant controls and retains its existing defaults', async ({ page }) => {
  const writes = await mockGroups(page);
  await page.getByRole('button', { name: 'Добавить группу' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByPlaceholder('Добавить клиента')).toHaveCount(0);
  await expect(dialog.getByRole('button', { name: 'Копировать', exact: true })).toHaveCount(0);
  await expect(dialog.getByRole('textbox', { name: 'Начало', exact: true })).not.toHaveValue('');
  await dialog.getByRole('textbox', { name: 'Название', exact: true }).fill('Новая группа');
  await dialog.getByRole('combobox', { name: 'Направление' }).click();
  await page.getByRole('option', { name: 'Salsa', exact: true }).click();
  expect(writes).toEqual([]);
  await dialog.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  expect(writes).toHaveLength(1);
  expect(writes[0].body.memberIds).toBeUndefined();
  expect(writes[0].body.id).toBeUndefined();
});

test('copy save failure preserves the draft for correction and retry', async ({ page }) => {
  const writes = await mockGroups(page);
  let fail = true;
  await page.route('**/api/Group/', async route => {
    if (fail) {
      fail = false;
      await route.fulfill({ status: 400, contentType: 'application/json',
        body: JSON.stringify({ message: 'Группа с таким именем уже существует' }) });
    } else await route.fallback();
  });
  await page.locator('app-group-card').click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Копировать', exact: true }).click();
  await expect(dialog.locator('.draft-member')).toHaveCount(2);
  await dialog.getByRole('textbox', { name: 'Начало', exact: true }).fill('10/01/2026');
  await dialog.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.getByText('Группа с таким именем уже существует')).toBeVisible();
  await expect(dialog.locator('.draft-member')).toHaveCount(2);
  await expect(page.locator('app-group-card')).toHaveCount(1);
  await dialog.getByRole('textbox', { name: 'Название', exact: true }).fill('Другая копия');
  await dialog.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  expect(writes).toHaveLength(1);
  expect(writes[0].body.memberIds).toEqual(['c1', 'c2']);
});
