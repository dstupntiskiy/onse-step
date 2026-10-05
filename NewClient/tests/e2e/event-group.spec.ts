import { test, expect, Page } from '@playwright/test';

const groups = [
  { id: 'g1', name: 'Прежняя группа', active: true, style: { id: 's1', name: 'Bachata' } },
  { id: 'g2', name: 'Новая группа', active: true, style: { id: 's2', name: 'Salsa' } }
];

async function openEvent(page: Page, recurrent: boolean, reject = false) {
  await page.clock.install({ time: new Date('2026-10-05T10:00:00+02:00') });
  await page.addInitScript(() => localStorage.setItem('jwtToken', 'isolated-test-token'));
  const recurrence = recurrent ? { id: 'r1', startDate: '2026-10-01', endDate: '2026-10-31', daysOfWeek: [1] } : null;
  let event = { id: 'e1', name: 'Занятие', startDateTime: '2026-10-05T10:00:00Z',
    endDateTime: '2026-10-05T11:00:00Z', group: groups[0], recurrence, eventType: 0, color: 'teal',
    coach: { id: 'c1', name: 'Тренер' } };
  const writes: { path: string; body: any }[] = [];
  await page.route('**/api/**', async route => {
    const request = route.request(), url = new URL(request.url()), path = url.pathname.toLowerCase();
    let body: unknown = [];
    if (request.method() !== 'GET') writes.push({ path, body: request.postDataJSON() });
    if (path.endsWith('/user/issuperadminaccess')) body = true;
    else if (path.endsWith('/event/geteventsbyperiod')) body = [event];
    else if (path.includes('/event/geteventbyid/')) body = event;
    else if (path.includes('/event/getcoachsubstitution/')) body = null;
    else if (path.endsWith('/coach/getall')) body = [event.coach];
    else if (path.endsWith('/group/getall')) body = groups;
    else if (path.endsWith('/group/getgroupmemberscount')) body = url.searchParams.get('groupId') === 'g2' ? 5 : 3;
    else if (path.endsWith('/event/getparticipantscount')) body = 0;
    else if (path.endsWith('/event/getonetimevisitorscount')) body = 2;
    else if (path.endsWith('/event/changegroup')) {
      if (reject) {
        await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({
          message: 'Нельзя изменить группу: в занятии или его повторениях есть посещения предыдущей группы'
        }) });
        return;
      }
      event = { ...event, group: groups.find(group => group.id === request.postDataJSON().groupId)! };
      body = recurrent ? [event, { ...event, id: 'e2', startDateTime: '2026-10-12T10:00:00Z' }] : [event];
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  await page.goto('/');
  await page.locator('.calendar-event[data-kind="event"]').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).not.toHaveClass(/mdc-dialog--opening/);
  await expect(dialog.getByRole('combobox', { name: 'Группа', exact: true })).toContainText(groups[0].name);
  return { dialog, writes };
}

for (const width of [1536, 320]) {
  for (const recurrent of [false, true]) {
    test(`change group preserves edits and one-time visits (${recurrent ? 'series' : 'single'}, ${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const { dialog, writes } = await openEvent(page, recurrent);
      const group = dialog.getByRole('combobox', { name: 'Группа', exact: true });
      const change = dialog.getByRole('button', { name: 'Заменить группу', exact: true });
      const save = dialog.getByRole('button', { name: 'Сохранить замену группы', exact: true });
      await expect(group).toBeDisabled();
      await expect(change.locator('mat-icon')).toHaveText('loop');
      await expect(dialog.getByRole('button', { name: 'Заменить тренера' }).locator('mat-icon')).toHaveText('loop');
      await change.click();
      await expect(group).toBeEnabled();
      await expect(save.locator('mat-icon')).toHaveText('done');
      await group.click();
      await page.getByRole('option', { name: groups[1].name, exact: true }).click();
      expect(writes).toEqual([]);
      await expect(dialog.getByRole('button', { name: 'Сохранить', exact: true })).toBeDisabled();
      await save.click();
      await expect(group).toBeDisabled();
      await expect(group).toContainText(groups[1].name);
      await expect(change).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Сохранить', exact: true })).toBeDisabled();
      await expect(dialog.getByRole('button', { name: 'Разовые: 2' })).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Группа: 0 / 5' })).toBeVisible();
      expect(writes).toEqual([{ path: '/api/event/changegroup', body: { eventId: 'e1', groupId: 'g2' } }]);

      // Confirming an unchanged selection does not send another request.
      await change.click();
      await save.click();
      expect(writes).toHaveLength(1);

      // Independent name edits survive a subsequent group change.
      await dialog.getByRole('textbox', { name: 'Название', exact: true }).fill('Несохранённое название');
      await change.click();
      await group.click();
      await page.getByRole('option', { name: groups[0].name, exact: true }).click();
      await save.click();
      await expect(group).toBeDisabled();
      await expect(dialog.getByRole('textbox', { name: 'Название', exact: true })).toHaveValue('Несохранённое название');
      await expect(dialog.getByRole('button', { name: 'Сохранить', exact: true })).toBeEnabled();
      expect(writes).toHaveLength(2);
      expect(await dialog.locator('.drawer-body').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
      await page.screenshot({ path: `test-results/event-group-${recurrent}-${width}.png`, animations: 'disabled' });
    });
  }
}

test('attendance rejection keeps the existing group and lets the user correct the selection', async ({ page }) => {
  const { dialog, writes } = await openEvent(page, true, true);
  const group = dialog.getByRole('combobox', { name: 'Группа', exact: true });
  await dialog.getByRole('button', { name: 'Заменить группу', exact: true }).click();
  await group.click();
  await page.getByRole('option', { name: groups[1].name, exact: true }).click();
  const save = dialog.getByRole('button', { name: 'Сохранить замену группы', exact: true });
  await save.click();
  await expect(page.getByText('Нельзя изменить группу: в занятии или его повторениях есть посещения предыдущей группы')).toBeVisible();
  await expect(group).toBeEnabled();
  await expect(dialog.getByRole('button', { name: 'Группа: 0 / 3' })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Разовые: 2' })).toBeVisible();
  await group.click();
  await page.getByRole('option', { name: groups[0].name, exact: true }).click();
  await save.click();
  await expect(group).toBeDisabled();
  await expect(dialog.getByRole('button', { name: 'Сохранить', exact: true })).toBeDisabled();
  expect(writes).toHaveLength(1);
});
