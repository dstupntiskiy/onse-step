import { test, expect, Page, Locator } from '@playwright/test';

for (const width of [1536, 320]) {
  test.describe(`controls at ${width}px`, () => {
  test.use({hasTouch: width === 320});
  test(`controls preserve keyboard selection and membership pricing at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height:900});
    await mockApi(page);
    await page.goto('/groups');
    await expect(page.locator('app-group-card')).toHaveCount(1);
    const active = page.getByRole('switch', {name:'Только активные'});
    await expect(active).toBeChecked();
    const filtered = page.waitForRequest(r => r.url().includes('GetAllWithDetails') && new URL(r.url()).searchParams.get('onlyActive') === 'false');
    await active.focus();
    await page.keyboard.press('Space');
    await filtered;
    await expect(active).not.toBeChecked();
    await page.screenshot({path:`test-results/controls-switch-${width}.png`, animations:'disabled'});

    await page.goto('/clients');
    await page.locator('app-client-card').first().click();
    await page.locator('app-client-memberships-list').getByRole('button',{name:'Добавить',exact:true}).click();
    const dialog = page.getByRole('dialog').last();
    await expect(dialog).toHaveClass(/mdc-dialog--open/);
    await expect(dialog).not.toHaveClass(/mdc-dialog--opening/);
    const direction = dialog.getByRole('combobox', {name:'Направление'});
    await direction.focus();
    await page.keyboard.press('Tab');
    await expect(direction).toHaveAttribute('aria-invalid','true');
    await direction.focus();
    await page.keyboard.press('Alt+ArrowDown');
    await page.getByRole('option', {name:'Bachata',exact:true}).click();
    await expect(direction).toContainText('Bachata');
    await dialog.getByRole('radio', {name:'4',exact:true}).focus();
    await page.keyboard.press('Space');
    await dialog.getByRole('radio', {name:'20%',exact:true}).click();
    await expect(dialog.getByText('Цена: 2800', {exact:true})).toBeVisible();
    const unlimited = dialog.getByRole('checkbox', {name:'Безлимит',exact:true});
    await unlimited.focus();
    await page.keyboard.press('Space');
    await expect(direction).toHaveCount(0);
    await expect(dialog.getByText('Цена: 20500', {exact:true})).toBeVisible();
    await page.keyboard.press('Space');
    await expect(direction).toBeVisible();
    if (width === 320) {
      await dialog.locator('mat-checkbox .mdc-label').tap();
      await expect(unlimited).toBeChecked();
      await dialog.locator('mat-checkbox .mdc-label').tap();
      await expect(unlimited).not.toBeChecked();
      for (const control of await dialog.locator('button[mat-raised-button], button[mat-button], .mat-button-toggle-button, .mat-mdc-icon-button').all()) {
        const box = await control.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(48);
        expect(box!.width, await control.evaluate(el => el.outerHTML)).toBeGreaterThanOrEqual(48);
      }
    }
    await dialog.getByRole('textbox', {name:'Комментарий'}).fill('Проверка управления');
    await dialog.locator('.drawer-body').evaluate(el => el.scrollTop = 0);
    expect(await dialog.locator('.drawer-body').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.screenshot({path:`test-results/controls-membership-${width}.png`, animations:'disabled'});
    const saved = page.waitForRequest(r => r.method() === 'POST' && r.url().endsWith('/api/membership/'));
    await dialog.getByRole('button', {name:'Сохранить',exact:true}).click();
    expect((await saved).postDataJSON()).toMatchObject({clientId:'client1', styleId:'s1', visitsNumber:4, discount:20, amount:2800, unlimited:false, comment:'Проверка управления'});
  });
  });
}

// All data in this file are isolated test fixtures. Requests never reach the studio API.
const style = { id:'s1', name:'Bachata', basePrice:6000, secondaryPrice:3500, onetimeVisitPrice:1000, baseSalary:2000, bonusSalary:100, active:true };
const coach = {id:'coach1', name:'Анна Смирнова', style, active:true};
const group = {id:'g1',name:'Bachata · начинающие',style,active:true,startDate:'2026-09-01',membersCount:12,membershipsCount:10};
const clients = [{id:'client1',name:'Мария Иванова',phone:'+381 60 123 4567',socialMediaLink:'@maria.dance',createDate:'2026-01-12'},{id:'client2',name:'Александр Петров',phone:'+381 60 555 0123',createDate:'2026-02-18'}];
const makeDate = (offset:number,hour:number,minute=0) => new Date(2026,8,7+offset,hour,minute).toISOString();
const fixtures = [
  [0,10,0,1,'Bachata beginners','#2bb3ba'],[0,13,0,1.5,'High Heels','#b598ce'],[0,17,0,1,'Аренда зала','#d7a66e'],
  [1,10,0,1.5,'Bachata beginners','#2bb3ba'],[1,12,0,1,'Lady Style','#d79a8a'],[1,15,0,1.5,'Contemporary','#9aaacb'],[1,18,0,1.5,'Bachata social','#2bb3ba'],
  [2,11,0,1.5,'Stretching','#9cae80'],[2,14,0,1.5,'High Heels','#b598ce'],[2,18,0,1.5,'Bachata beginners','#2bb3ba'],
  [3,10,0,1.5,'Bachata beginners','#2bb3ba'],[3,13,0,1.5,'Lady Style','#d79a8a'],[3,17,0,1,'Аренда зала','#d7a66e'],
  [4,11,0,1.5,'Stretching','#9cae80'],[4,14,0,1.5,'Contemporary','#9aaacb'],[4,18,0,1.5,'Bachata social','#2bb3ba'],
  [5,12,0,2,'Мастер-класс','#d7a66e'],[6,13,0,1.5,'Свободная практика','#9cae80']
].map((row,i) => ({id:'event'+i,name:row[4],startDateTime:makeDate(Number(row[0]),Number(row[1])),endDateTime:makeDate(Number(row[0]),Number(row[1])+Math.floor(Number(row[3])),Number(row[3])%1*60),color:row[5],coach,group,eventType:row[4]==='Аренда зала'?1:row[4]==='Мастер-класс'?2:0}));

async function mockApi(page:Page, authenticated = true) {
  await page.clock.install({ time:new Date('2026-09-08T10:00:00+02:00') });
  if(authenticated) await page.addInitScript(() => localStorage.setItem('jwtToken','isolated-test-token'));
  const events = [...fixtures];
  await page.route('**/api/**', async route => {
    const request = route.request(), url=new URL(request.url()), path=url.pathname.toLowerCase();
    let body:unknown = [];
    if(path.endsWith('/user/login')) body={login:'admin',jwtToken:'isolated-test-token'};
    else if(path.endsWith('/user/issuperadminaccess')) body=true;
    else if(path.endsWith('/event/geteventsbyperiod')) body=events.filter(e=>new Date(e.startDateTime)<new Date(url.searchParams.get('endDate')!) && new Date(e.endDateTime)>new Date(url.searchParams.get('startDate')!));
    else if(path.includes('/event/geteventbyid/')) body=events.find(e=>e.id===url.pathname.split('/').pop());
    else if(path.endsWith('/event/geteventdutybyperiod')) body=[{id:'duty1',name:'Администратор · Анна',startDateTime:makeDate(1,9),endDateTime:makeDate(1,15),color:'#c18b68'}];
    else if(path.includes('/event/geteventdutybyid/')) body={id:'duty1',name:'Администратор · Анна',startDateTime:makeDate(1,9),endDateTime:makeDate(1,15),color:'#c18b68'};
    else if(path.includes('/event/getcoachsubstitution/')) body=null;
    else if(path.includes('count')) body=0;
    else if(path.endsWith('/event/') && request.method()==='POST') { const saved={...request.postDataJSON(),id:'created-event',group,coach}; events.push(saved); body=[saved]; }
    else if(path.endsWith('/event/saveeventduty')) body={...request.postDataJSON(),id:'created-duty'};
    else if(path.endsWith('/coach/getall')) body=[coach];
    else if(path.endsWith('/style/getall')) body=[style,{...style,id:'s2',name:'High Heels'},{...style,id:'s3',name:'Contemporary'}];
    else if(path.includes('/group/getbyid/')) body=group;
    else if(path.endsWith('/group/getall') || path.endsWith('/group/getallwithdetails')) body=Number(url.searchParams.get('skip')||0)>0?[]:[group];
    else if(path.includes('/client/getbyid/')) body=clients.find(c=>c.id===url.pathname.split('/').pop());
    else if(path.endsWith('/client/getallbyquery')) body=clients.filter(c=>c.name.toLowerCase().includes((url.searchParams.get('query')||'').toLowerCase()));
    else if(path.endsWith('/client/getall')) body=Number(url.searchParams.get('skip')||0)>0?[]:clients;
    else if(path.endsWith('/client/') && request.method()==='POST') body={...request.postDataJSON(),id:'created-client'};
    else if(path.includes('/membership/getmebershipsbyclient')) body=[{id:'membership1',client:clients[0],style,amount:6000,visitsNumber:8,visited:3,startDate:'2026-09-01',endDate:'2026-09-30',unlimited:false,expired:false,discount:0}];
    else if(path.includes('/membership/getbyid/')) body={id:'membership1',client:clients[0],style,amount:6000,visitsNumber:8,visited:3,startDate:'2026-09-01',endDate:'2026-09-30',unlimited:false,expired:false,discount:0};
    else if(path.endsWith('/membership/') && request.method()==='POST') body={...request.postDataJSON(),id:'created-membership',client:clients[0],style,visited:0};
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body??null)});
  });
}

async function expectDrawer(page: Page, dialog: Locator) {
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveClass(/mdc-dialog--open/);
  await expect(dialog).not.toHaveClass(/mdc-dialog--opening/);
  const {width, height} = page.viewportSize()!;
  const bounds = await dialog.boundingBox();
  expect(bounds!.y).toBe(0);
  expect(bounds!.height).toBe(height);
  expect(bounds!.width).toBe(width <= 760 ? width : 720);
  expect(bounds!.x + bounds!.width).toBe(width);
  const body = dialog.locator('.drawer-body');
  const footer = dialog.locator('.drawer-layout > .actions');
  await expect(footer).toBeInViewport({ratio:1});
  for (const button of await footer.getByRole('button').all()) await expect(button).toBeInViewport({ratio:1});
  const before = await footer.boundingBox();
  expect(before!.y + before!.height).toBe(height);
  expect(await body.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await body.evaluate(el => el.scrollTop = el.scrollHeight);
  expect(await footer.boundingBox()).toEqual(before);
  expect(await dialog.locator('.mat-mdc-dialog-surface').evaluate(el => el.scrollTop)).toBe(0);
}

for (const viewport of [{width:1536,height:900}, {width:760,height:600}, {width:390,height:844}, {width:320,height:568}, {width:740,height:390}]) {
  test(`drawers pin actions and preserve nested forms at ${viewport.width}x${viewport.height}`, async ({page}) => {
    await page.setViewportSize(viewport); await mockApi(page);
    for (const [route, card] of [['/styles','app-style-card'], ['/coaches','app-coach-card'], ['/groups','app-group-card'], ['/clients','app-client-card']]) {
      await page.goto(route);
      await page.locator(card).first().click();
      await expectDrawer(page, page.getByRole('dialog').last());
      await page.getByRole('button',{name:'Закрыть окно',exact:true}).click();
      await expect(page.getByRole('dialog')).toHaveCount(0);
    }
    await page.locator('app-client-card').first().click();
    await page.locator('app-client-memberships-list').getByRole('button',{name:'Добавить',exact:true}).click();
    await expect(page.getByRole('dialog')).toHaveCount(2);
    await expectDrawer(page, page.getByRole('dialog').last());
    await page.getByRole('dialog').last().getByRole('button',{name:'Закрыть',exact:true}).click();
    await expect(page.getByRole('dialog')).toHaveCount(1);
    await expectDrawer(page, page.getByRole('dialog'));
    await page.getByRole('dialog').getByRole('button',{name:'Удалить',exact:true}).click();
    await expect(page.getByRole('dialog')).toHaveCount(2);
    await expectDrawer(page, page.getByRole('dialog').last());
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(1);
    await page.getByRole('button',{name:'Закрыть окно',exact:true}).click();
    await page.goto('/');
    await page.locator('.calendar-event[data-kind="event"]').first().click();
    await expectDrawer(page, page.getByRole('dialog'));
    await page.screenshot({path:`test-results/drawer-${viewport.width}x${viewport.height}.png`});
    await page.getByRole('button',{name:'Закрыть окно',exact:true}).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.locator('.time-scroll').evaluate(el => el.scrollTop = 76);
    await page.locator('.calendar-event[data-kind="duty"]').first().click({position:{x:4,y:30}});
    await expectDrawer(page, page.getByRole('dialog'));
  });
}

test('drawer slides from the right and adapts without losing input', async ({page}) => {
  await page.setViewportSize({width:1100,height:800}); await mockApi(page); await page.goto('/clients');
  await page.getByRole('button',{name:'Добавить клиента'}).click();
  const dialog = page.getByRole('dialog');
  // Inspect the transition's start, independent of the frame captured by the test.
  const transforms = await dialog.locator('.mat-mdc-dialog-surface').evaluate(el => el.getAnimations().flatMap(animation =>
    (animation.effect as KeyframeEffect).getKeyframes().map(frame => frame['transform']).filter(Boolean)));
  expect(transforms).toContain('translateX(100%)');
  expect(transforms).toContain('none');
  await expectDrawer(page, dialog);
  const name = dialog.getByRole('textbox',{name:'Имя',exact:true});
  await name.fill('Несохранённое имя');
  await page.setViewportSize({width:760,height:568});
  await expectDrawer(page, dialog);
  await expect(name).toHaveValue('Несохранённое имя');
  await page.setViewportSize({width:761,height:800});
  await expectDrawer(page, dialog);
  await expect(name).toHaveValue('Несохранённое имя');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Добавить клиента'})).toBeFocused();
});

test('desktop calendar, views, dates and creation', async ({page}) => {
  const errors:string[]=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.setViewportSize({width:1536,height:1080}); await mockApi(page); await page.goto('/');
  await expect(page.locator('.calendar-event')).toHaveCount(19);
  await page.screenshot({path:'test-results/calendar-desktop.png',fullPage:true});
  await expect(page.locator('.view-tabs, .filter-bar, .search-field')).toHaveCount(0);
  await expect(page.locator('.topbar h1')).toHaveText('Расписание');
  await expect(page.locator('.schedule .page-heading, .schedule .primary-button')).toHaveCount(0);
  expect(await page.locator('.calendar-panel').evaluate(element => Math.abs(element.getBoundingClientRect().width - element.closest('.schedule')!.getBoundingClientRect().width))).toBeLessThan(1);
  await expect(page.getByText('НА ЗАМЕТКУ',{exact:true})).toHaveCount(0);
  const dateButton = page.getByRole('button',{name:'Выбрать дату',exact:true});
  const datePicker = page.getByRole('dialog',{name:'Выбор даты',exact:true});

  await dateButton.click(); await expect(datePicker).toBeVisible();
  await expect(datePicker.getByRole('button',{name:'8 сентября 2026',exact:true})).toBeFocused();
  await page.keyboard.press('Escape'); await expect(datePicker).not.toBeVisible(); await expect(dateButton).toBeFocused();
  await dateButton.click(); await page.locator('.cdk-overlay-backdrop').click({position:{x:2,y:2}}); await expect(datePicker).not.toBeVisible();
  await dateButton.click();
  await datePicker.getByRole('button',{name:'Следующий месяц',exact:true}).click();
  await datePicker.getByRole('button',{name:'1 октября 2026',exact:true}).click();
  await expect(datePicker).not.toBeVisible(); await expect(dateButton).toBeFocused();
  await expect(page.locator('.day-header')).toHaveCount(7);
  await expect(page.locator('.day-header strong')).toHaveText(['28','29','30','01','02','03','04']);
  await dateButton.click(); await expect(datePicker.getByLabel('Перейти к дате')).toHaveValue('2026-10-01');
  await datePicker.getByLabel('Перейти к дате').fill('2026-09-08');
  await expect(datePicker).not.toBeVisible();
  await page.setViewportSize({width:390,height:844}); await expect(page.locator('.calendar-event')).toHaveCount(5);
  await expect(page.locator('.day-header strong')).toHaveText('08');
  await page.setViewportSize({width:1536,height:1080});
  await expect(page.locator('.day-header')).toHaveCount(7);
  await expect(page.locator('.calendar-event')).toHaveCount(19);
  await page.getByRole('button',{name:'Дежурства',exact:true}).click(); await expect(page.locator('.calendar-event')).toHaveCount(19);
  await page.getByRole('button',{name:'Занятия и события',exact:true}).click();
  await page.getByRole('button',{name:'Добавить: 8 сентября, 19:30',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('textbox',{name:'Название',exact:true}).fill('Новое занятие');
  await page.screenshot({path:'test-results/event-dialog-desktop.png',fullPage:true});
  const saved = page.waitForRequest(r=>r.method()==='POST' && r.url().endsWith('/api/Event/'));
  await page.getByRole('button',{name:'Сохранить',exact:true}).click();
  expect((await saved).postDataJSON().name).toBe('Новое занятие');
  await page.getByRole('button',{name:'Закрыть окно',exact:true}).click();
  await expect(page.locator('.calendar-event')).toHaveCount(20);
  expect(errors).toEqual([]);
});

test('mobile navigation, dialogs, memberships and no page overflow', async ({page}) => {
  const errors:string[]=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.setViewportSize({width:390,height:844}); await mockApi(page); await page.goto('/');
  await expect(page.locator('.calendar-event')).toHaveCount(5);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path:'test-results/calendar-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Выбрать дату',exact:true}).click();
  const datePicker = page.getByRole('dialog',{name:'Выбор даты',exact:true});
  await expect(datePicker).toBeVisible();
  const pickerBox = await datePicker.boundingBox(); expect(pickerBox!.x).toBeGreaterThanOrEqual(0); expect(pickerBox!.x + pickerBox!.width).toBeLessThanOrEqual(390);
  await page.screenshot({path:'test-results/calendar-date-picker-mobile.png',fullPage:true});
  await datePicker.getByRole('button',{name:'9 сентября 2026',exact:true}).click();
  await expect(datePicker).not.toBeVisible();
  await expect(page.locator('.day-header strong')).toHaveText('09');
  await page.getByRole('button',{name:'Сегодня',exact:true}).click(); await expect(page.locator('.calendar-event')).toHaveCount(5);
  await page.locator('.calendar-event').first().click(); await expect(page.getByRole('dialog')).toBeVisible();
  await page.screenshot({path:'test-results/event-dialog-mobile.png',fullPage:true});
  const dialog = await page.getByRole('dialog').boundingBox(); expect(dialog!.width).toBeLessThanOrEqual(390);
  await page.getByRole('button',{name:'Закрыть окно',exact:true}).click();
  await page.locator('.mobile-nav').getByRole('link',{name:'Клиенты'}).click();
  await expect(page.locator('app-client-card')).toHaveCount(2);
  await expect(page.locator('.topbar h1')).toHaveText('Клиенты');
  await page.locator('app-client-card').first().click();
  await expect(page.getByRole('tab',{name:'Абонементы',exact:true})).toBeVisible();
  await expect(page.locator('app-membership')).toHaveCount(1);
  await page.screenshot({path:'test-results/client-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Закрыть окно',exact:true}).click();
  await page.getByRole('button',{name:'Ещё',exact:true}).click();
  await page.locator('.sidebar').getByRole('link',{name:'Тренеры',exact:true}).click();
  await expect(page.locator('app-coach-card')).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('directories, reports and client creation preserve API contracts', async ({page}) => {
  await mockApi(page); await page.goto('/clients');
  await expect(page.locator('app-client-card')).toHaveCount(2);
  await page.getByRole('button',{name:'Добавить клиента'}).click();
  await page.getByRole('textbox',{name:'Имя',exact:true}).fill('Новый клиент');
  const saved=page.waitForRequest(r=>r.method()==='POST' && r.url().endsWith('/api/Client/'));
  await page.getByRole('button',{name:'Сохранить',exact:true}).click();
  expect((await saved).postDataJSON().name).toBe('Новый клиент');
  await page.getByRole('button',{name:'Закрыть окно',exact:true}).click();
  await page.goto('/groups'); await expect(page.locator('app-group-card')).toHaveCount(1);
  await page.goto('/styles'); await expect(page.locator('app-style-card')).toHaveCount(3);
  await page.goto('/reports'); await expect(page.getByRole('tab')).toHaveCount(4);
  await page.screenshot({path:'test-results/reports-desktop.png',fullPage:true});
});

test('login, failed API and expired session states', async ({page}) => {
  await mockApi(page,false); await page.goto('/'); await expect(page).toHaveURL(/login/);
  await page.screenshot({path:'test-results/login-desktop.png',fullPage:true});
  await page.getByLabel('Логин',{exact:true}).fill('admin'); await page.getByLabel('Пароль',{exact:true}).fill('test');
  await page.getByRole('button',{name:'Войти в студию'}).click(); await expect(page.locator('.calendar-event')).toHaveCount(19);
  await page.route('**/api/Event/GetEventsByPeriod*',r=>r.fulfill({status:500,body:'Unavailable'}));
  await page.getByLabel('Следующий период').click(); await expect(page.getByText('Не удалось загрузить расписание',{exact:true})).toBeVisible();
  await page.route('**/api/Event/GetEventsByPeriod*',r=>r.fulfill({status:401,body:'Expired'}));
  await page.getByRole('button',{name:'Повторить',exact:true}).click(); await expect(page).toHaveURL(/login/);
  await expect(page.locator('.sidebar')).toHaveCount(0);
});

test('membership creation and duty creation submit existing API fields', async ({page}) => {
  const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
  await mockApi(page); await page.goto('/clients');
  await page.locator('app-client-card').first().click();
  await page.locator('app-client-memberships-list').getByRole('button',{name:'Добавить',exact:true}).click();
  const membershipDialog=page.getByRole('dialog').last();
  await membershipDialog.getByRole('combobox',{name:'Направление'}).click();
  await page.getByRole('option',{name:'Bachata',exact:true}).click();
  const membershipRequest=page.waitForRequest(r=>r.method()==='POST' && r.url().endsWith('/api/membership/'));
  await membershipDialog.getByRole('button',{name:'Сохранить',exact:true}).click();
  const payload=(await membershipRequest).postDataJSON();
  expect(payload.clientId).toBe('client1'); expect(payload.styleId).toBe('s1'); expect(payload.visitsNumber).toBe(8); expect(payload.amount).toBe(6000);
  await expect(page.locator('app-membership')).toHaveCount(2);
  await page.getByRole('button',{name:'Закрыть окно',exact:true}).click();
  await page.goto('/'); await page.getByRole('button',{name:'Дежурства',exact:true}).click();
  await page.getByRole('button',{name:'Добавить: 8 сентября, 19:30',exact:true}).click();
  await page.getByRole('option',{name:'Оля',exact:true}).click();
  const dutyRequest=page.waitForRequest(r=>r.method()==='POST' && r.url().includes('/api/Event/SaveEventDuty'));
  await page.getByRole('dialog').getByRole('button',{name:'Сохранить',exact:true}).click();
  const duty=(await dutyRequest).postDataJSON(); expect(duty.name).toBe('Оля'); expect(new Date(duty.endDateTime).getTime()).toBeGreaterThan(new Date(duty.startDateTime).getTime());
  expect(errors).toEqual([]);
});

test('320px login and all directory pages remain usable on mobile', async ({page}) => {
  await page.setViewportSize({width:320,height:740}); await mockApi(page,false); await page.goto('/login');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path:'test-results/login-mobile.png',fullPage:true});
  await page.evaluate(()=>localStorage.setItem('jwtToken','isolated-test-token'));
  for(const [route, title] of [['/', 'Расписание'], ['/clients', 'Клиенты'], ['/groups', 'Группы'], ['/coaches', 'Тренеры'], ['/styles', 'Направления'], ['/reports', 'Отчёты']]) {
    await page.goto(route); await expect(page.locator('.topbar h1')).toHaveText(title);
    await expect(page.locator('app-page-header, .page-heading')).toHaveCount(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),route).toBe(true);
    if (route === '/') {
      await page.getByRole('button',{name:'Выбрать дату',exact:true}).click();
      const datePicker = page.getByRole('dialog',{name:'Выбор даты',exact:true});
      await expect(datePicker).toBeVisible();
      const box = await datePicker.boundingBox(); expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(320);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await datePicker.getByRole('button',{name:'Сегодня',exact:true}).click();
      await expect(datePicker).not.toBeVisible();
    }
  }
});

for (const viewport of [{width:1536,height:1080}, {width:390,height:844}]) {
  test(`shared time calendar keeps both kinds in 90/10 areas at ${viewport.width}px`, async ({page}) => {
    await page.setViewportSize(viewport);
    await mockApi(page);
    await page.route('**/api/Event/GetEventDutyByPeriod*', route => route.fulfill({
      status:200, contentType:'application/json',
      body:JSON.stringify([{id:'duty1',name:'Администратор · Анна',startDateTime:makeDate(1,7),endDateTime:makeDate(1,23),color:'#c18b68'}])
    }));
    await page.goto('/');
    await expect(page.locator('.day-column')).toHaveCount(viewport.width <= 760 ? 1 : 7);
    const column = page.locator('.day-column').nth(viewport.width <= 760 ? 0 : 1);
    const lessons = column.locator('.calendar-event[data-kind="event"]');
    const duty = column.locator('.calendar-event[data-kind="duty"]');
    await expect(lessons).toHaveCount(4);
    await expect(duty).toHaveCount(1);
    await expect(page.locator('.hour-label').first()).toHaveText('08:00');
    await expect(page.locator('.hour-label').last()).toHaveText('23:00');
    const originalTimeGeometry = await page.locator('.calendar-event').evaluateAll(elements => elements.map(element => ({top:(element as HTMLElement).style.top,height:(element as HTMLElement).style.height})));
    for (const mode of ['event', 'duty'] as const) {
      await page.getByRole('button',{name:mode === 'event' ? 'Занятия и события' : 'Дежурства',exact:true}).click();
      await expect(lessons).toHaveCount(4);
      await expect(duty).toHaveCount(1);
      await expect(column.locator('.calendar-event.context-event')).toHaveCount(mode === 'event' ? 1 : 4);
      expect(await column.locator('.calendar-event.context-event').allTextContents()).toEqual(Array(mode === 'event' ? 1 : 4).fill(''));
      await expect(page.locator('.calendar-event:not(.context-event) strong').first()).not.toBeEmpty();
      await page.locator('.calendar-event').evaluateAll(elements => Promise.all(elements.flatMap(element => element.getAnimations()).map(animation => animation.finished)));
      const geometry = await page.locator('.calendar-event').evaluateAll(elements => elements.map(element => {
        const column = element.closest('.day-column') as HTMLElement;
        const box = element.getBoundingClientRect(), parent = column.getBoundingClientRect();
        return {kind:element.getAttribute('data-kind'),left:box.left-parent.left-column.clientLeft,width:box.width,available:column.clientWidth};
      }));
      for (const item of geometry) {
        const share = item.kind === mode ? .9 : .1;
        expect(Math.abs(item.width - (item.available * share - Math.min(4,item.available * share / 5)))).toBeLessThan(1);
        expect(Math.abs(item.left - (item.kind === 'event' ? 0 : item.available * (mode === 'event' ? .9 : .1)))).toBeLessThan(1);
      }
      expect(await page.locator('.calendar-event').evaluateAll(elements => elements.map(element => ({top:(element as HTMLElement).style.top,height:(element as HTMLElement).style.height})))).toEqual(originalTimeGeometry);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({path:`test-results/calendar-shared-${mode}-${viewport.width}.png`,fullPage:true});
    }
    // Collapsed entries retain their own editor, regardless of the current mode.
    await lessons.first().click();
    await expect(page.getByRole('dialog').getByRole('textbox',{name:'Название',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Закрыть окно',exact:true}).click();
    await page.getByRole('button',{name:'Занятия и события',exact:true}).click();
    await duty.click();
    await expect(page.getByRole('dialog').getByRole('heading',{name:'Дежурство',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Закрыть окно',exact:true}).click();
  });
}

test('calendar follows viewport breakpoint while preserving selected date and navigation', async ({page}) => {
  await page.setViewportSize({width:760,height:844}); await mockApi(page); await page.goto('/');
  await expect(page.locator('.day-header strong')).toHaveText('08');
  await page.getByLabel('Следующий период', {exact:true}).click();
  await expect(page.locator('.day-header strong')).toHaveText('09');
  await page.setViewportSize({width:761,height:844});
  await expect(page.locator('.day-header')).toHaveCount(7);
  await expect(page.getByLabel('Выбрать дату', {exact:true})).toContainText('9 сент. 2026');
  await page.locator('.day-header').nth(2).click();
  await expect(page.locator('.day-header')).toHaveCount(7);
  await page.getByLabel('Следующий период', {exact:true}).click();
  await expect(page.getByLabel('Выбрать дату', {exact:true})).toContainText('16 сент. 2026');
  await page.setViewportSize({width:320,height:740});
  await expect(page.locator('.day-header strong')).toHaveText('16');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', {name:'Сегодня',exact:true}).click();
  await expect(page.locator('.calendar-event')).toHaveCount(5);
  const grid = await page.locator('.time-scroll').boundingBox();
  const toolbar = await page.locator('.calendar-toolbar').boundingBox();
  expect(Math.abs(grid!.y - toolbar!.y - toolbar!.height)).toBeLessThan(2);
  await page.screenshot({path:'test-results/calendar-compact-320.png',fullPage:true});
});

for (const width of [1536, 390]) {
  test('calendar hours and initial scroll at ' + width + 'px', async ({page}) => {
    await page.setViewportSize({width, height: width > 760 ? 1080 : 844}); await mockApi(page); await page.goto('/');
    await expect(page.locator('.calendar-event')).toHaveCount(width <= 760 ? 5 : 19);
    const scroll = page.locator('.time-scroll');
    await expect(page.locator('.hour-label')).toHaveCount(16);
    await expect(page.locator('.hour-label').first()).toHaveText('08:00');
    await expect(page.locator('.hour-label').last()).toHaveText('23:00');
    await expect(page.locator('.day-column').first().locator('.time-slot')).toHaveCount(32);
    await expect.poll(() => scroll.evaluate(el => el.scrollTop)).toBe(76);
    const header = await page.locator('.day-headers').boundingBox();
    const nine = await page.locator('.hour-label').filter({hasText:'09:00'}).boundingBox();
    expect(Math.abs(nine!.y - header!.y - header!.height)).toBeLessThan(2);
    await scroll.evaluate(el => el.scrollTop = 0);
    await page.getByRole('button', {name:'Следующий период',exact:true}).click();
    await expect(page.locator('.calendar-status')).toHaveCount(0);
    await expect.poll(() => scroll.evaluate(el => el.scrollTop)).toBe(0);
    await page.getByRole('button', {name:'Дежурства',exact:true}).click();
    await expect.poll(() => scroll.evaluate(el => el.scrollTop)).toBe(0);
    await scroll.evaluate(el => el.scrollTop = el.scrollHeight);
    await expect(page.locator('.time-end')).toHaveText('24:00');
    await expect(page.locator('.time-end')).toBeInViewport();
    await expect(page.locator('.day-column').first().locator('.time-slot').last()).toBeInViewport();
  });
}

for (const viewport of [{width:390,height:844}, {width:320,height:568}, {width:740,height:390}]) {
  test('mobile calendar has one scroll at ' + viewport.width + 'x' + viewport.height, async ({page}) => {
    await page.setViewportSize(viewport); await mockApi(page); await page.goto('/');
    await expect(page.locator('.calendar-event')).toHaveCount(5);
    const grid = page.locator('.time-scroll');
    const controls = page.locator('.topbar, .calendar-top, .calendar-toolbar, .mobile-nav');
    const before = await controls.evaluateAll(elements => elements.map(el => el.getBoundingClientRect().y));
    const assertFrame = async () => {
      expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      expect(await controls.evaluateAll(elements => elements.map(el => el.getBoundingClientRect().y))).toEqual(before);
      for (const control of await controls.all()) await expect(control).toBeInViewport({ratio:1});
      const panel = await page.locator('.calendar-panel').boundingBox();
      const nav = await page.locator('.mobile-nav').boundingBox();
      expect(panel!.y + panel!.height).toBeLessThanOrEqual(nav!.y);
    };
    await expect.poll(() => grid.evaluate(el => el.scrollTop)).toBe(76);
    await grid.hover(); await page.mouse.wheel(0, 2000);
    await expect.poll(() => grid.evaluate(el => el.scrollTop)).toBeGreaterThan(76);
    await assertFrame();
    await grid.evaluate(el => el.scrollTop = el.scrollHeight);
    await expect(page.locator('.time-end')).toBeInViewport();
    await page.locator('.topbar').hover(); await page.mouse.wheel(0, 1000);
    await assertFrame();
    await page.getByRole('button', {name:'Выбрать дату',exact:true}).click();
    await expect(page.getByRole('dialog', {name:'Выбор даты',exact:true})).toBeVisible();
    await page.keyboard.press('Escape');
    await page.screenshot({path:'test-results/calendar-single-scroll-' + viewport.width + '.png', animations:'disabled'});
    await page.locator('.mobile-nav').getByRole('link', {name:'Клиенты',exact:true}).click();
    await expect(page.locator('app-client-card')).toHaveCount(2);
    await expect(page.locator('app-root')).not.toHaveClass(/calendar-page/);
    await page.locator('.mobile-nav').getByRole('link', {name:'Расписание',exact:true}).click();
    await expect(page.locator('.calendar-event')).toHaveCount(5);
    await assertFrame();
  });
}
