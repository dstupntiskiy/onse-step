import { test, expect, Page } from '@playwright/test';

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

test('desktop calendar, filters, views, dates and creation', async ({page}) => {
  const errors:string[]=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.setViewportSize({width:1536,height:1080}); await mockApi(page); await page.goto('/');
  await expect(page.locator('.calendar-event')).toHaveCount(19);
  await page.screenshot({path:'test-results/calendar-desktop.png',fullPage:true});
  await page.getByLabel('Поиск занятий').fill('High Heels'); await expect(page.locator('.calendar-event')).toHaveCount(3);
  await page.getByLabel('Сбросить фильтры').click();
  await page.getByLabel('Фильтр по типу события').selectOption('1'); await expect(page.locator('.calendar-event')).toHaveCount(3);
  await page.getByLabel('Сбросить фильтры').click();
  await page.getByRole('button',{name:'Месяц',exact:true}).click(); await expect(page.locator('.month-cell')).toHaveCount(42);
  await page.getByRole('button',{name:'Список',exact:true}).click(); await expect(page.locator('.agenda-event')).toHaveCount(19);
  await page.getByRole('button',{name:'День',exact:true}).click(); await expect(page.locator('.calendar-event')).toHaveCount(5);
  await page.getByRole('button',{name:'Дежурства',exact:true}).click(); await expect(page.locator('.calendar-event')).toHaveCount(5);
  await page.getByRole('button',{name:'Занятия и события',exact:true}).click();
  await page.getByRole('button',{name:'Добавить занятие',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('textbox',{name:'Название',exact:true}).fill('Новое занятие');
  await page.screenshot({path:'test-results/event-dialog-desktop.png',fullPage:true});
  const saved = page.waitForRequest(r=>r.method()==='POST' && r.url().endsWith('/api/Event/'));
  await page.getByRole('button',{name:'Сохранить',exact:true}).click();
  expect((await saved).postDataJSON().name).toBe('Новое занятие');
  await page.getByRole('button',{name:'Закрыть окно',exact:true}).click();
  await expect(page.locator('.calendar-event')).toHaveCount(6);
  expect(errors).toEqual([]);
});

test('mobile navigation, dialogs, memberships and no page overflow', async ({page}) => {
  const errors:string[]=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.setViewportSize({width:390,height:844}); await mockApi(page); await page.goto('/');
  await expect(page.locator('.calendar-event')).toHaveCount(5);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path:'test-results/calendar-mobile.png',fullPage:true});
  await page.locator('.calendar-event').first().click(); await expect(page.getByRole('dialog')).toBeVisible();
  await page.screenshot({path:'test-results/event-dialog-mobile.png',fullPage:true});
  const dialog = await page.getByRole('dialog').boundingBox(); expect(dialog!.width).toBeLessThanOrEqual(390);
  await page.getByRole('button',{name:'Закрыть окно',exact:true}).click();
  await page.locator('.mobile-nav').getByRole('link',{name:'Клиенты'}).click();
  await expect(page.locator('app-client-card')).toHaveCount(2);
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
  await page.getByRole('button',{name:'Добавить дежурство',exact:true}).click();
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
  for(const route of ['/', '/clients','/groups','/coaches','/styles','/reports']) {
    await page.goto(route); await expect(page.locator('h1').first()).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),route).toBe(true);
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
    await page.getByRole('button',{name:'День',exact:true}).click();
    const lessons = page.locator('.calendar-event[data-kind="event"]');
    const duty = page.locator('.calendar-event[data-kind="duty"]');
    await expect(lessons).toHaveCount(4);
    await expect(duty).toHaveCount(1);
    await expect(page.locator('.hour-label').first()).toHaveText('07:00');
    await expect(page.locator('.hour-label').last()).toHaveText('22:00');
    const originalTimeGeometry = await page.locator('.calendar-event').evaluateAll(elements => elements.map(element => ({top:(element as HTMLElement).style.top,height:(element as HTMLElement).style.height})));
    for (const mode of ['event', 'duty'] as const) {
      await page.getByRole('button',{name:mode === 'event' ? 'Занятия и события' : 'Дежурства',exact:true}).click();
      await expect(lessons).toHaveCount(4);
      await expect(duty).toHaveCount(1);
      await expect(page.locator('.calendar-event.context-event')).toHaveCount(mode === 'event' ? 1 : 4);
      expect(await page.locator('.calendar-event.context-event').allTextContents()).toEqual(Array(mode === 'event' ? 1 : 4).fill(''));
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

test('calendar filters preserve the other kind as context', async ({page}) => {
  await page.setViewportSize({width:1536,height:1080});
  await mockApi(page); await page.goto('/');
  await page.getByLabel('Фильтр по тренеру').selectOption('coach1');
  await expect(page.locator('.calendar-event[data-kind="duty"]')).toHaveCount(1);
  await page.getByLabel('Поиск занятий').fill('Нет совпадений');
  await expect(page.locator('.calendar-event[data-kind="event"]')).toHaveCount(0);
  await expect(page.locator('.calendar-event[data-kind="duty"]')).toHaveCount(1);
  await expect(page.getByText('По этим фильтрам ничего не найдено.',{exact:true})).toBeVisible();
  await page.getByLabel('Сбросить фильтры').click();
  await page.getByRole('button',{name:'Дежурства',exact:true}).click();
  await page.getByLabel('Поиск дежурств').fill('Нет совпадений');
  await expect(page.locator('.calendar-event[data-kind="duty"]')).toHaveCount(0);
  await expect(page.locator('.calendar-event[data-kind="event"]')).toHaveCount(18);
  await page.getByLabel('Поиск дежурств').fill('Анна');
  await expect(page.locator('.calendar-event[data-kind="duty"]')).toHaveCount(1);
  await expect(page.locator('.calendar-event[data-kind="event"]')).toHaveCount(18);
});

test('month and list views retain separate areas and hide only the secondary content', async ({page}) => {
  await page.setViewportSize({width:1536,height:1080});
  await mockApi(page); await page.goto('/');
  for (const view of [{name:'Месяц',selector:'.month-event'}, {name:'Список',selector:'.agenda-event'}]) {
    await page.getByRole('button',{name:view.name,exact:true}).click();
    for (const mode of ['event', 'duty'] as const) {
      await page.getByRole('button',{name:mode === 'event' ? 'Занятия и события' : 'Дежурства',exact:true}).click();
      await expect(page.locator(`${view.selector}[data-kind="duty"]`)).toHaveCount(1);
      expect(await page.locator(`${view.selector}[data-kind="event"]`).count()).toBeGreaterThan(0);
      const hiddenContent = await page.locator(`${view.selector}.context-event`).allTextContents();
      expect(hiddenContent.every(text => !text.trim())).toBe(true);
      await expect(page.locator(`${view.selector}:not(.context-event)`).first()).not.toBeEmpty();
      await page.locator('.entry-lanes').evaluateAll(elements => Promise.all(elements.flatMap(element => element.getAnimations()).map(animation => animation.finished)));
      const areas = await page.locator('.entry-lanes').evaluateAll(elements => elements.map(element => {
        const box = element.getBoundingClientRect();
        const left = element.children[0].getBoundingClientRect(), right = element.children[1].getBoundingClientRect();
        return {width:box.width,leftWidth:left.width,rightWidth:right.width,rightStart:right.left-box.left};
      }));
      for (const area of areas) {
        expect(Math.abs(area.leftWidth - area.width * (mode === 'event' ? .9 : .1))).toBeLessThan(1);
        expect(Math.abs(area.rightStart - area.leftWidth)).toBeLessThan(1);
        expect(Math.abs(area.leftWidth + area.rightWidth - area.width)).toBeLessThan(1);
      }
    }
  }
});
