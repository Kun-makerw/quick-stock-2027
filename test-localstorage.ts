import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  
  await page.waitForSelector('button');
  const buttons = await page.$$('button');
  let adminBtn;
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text === 'Admin Credential Login') adminBtn = b;
  }
  
  if (adminBtn) {
    await adminBtn.click();
    await page.waitForSelector('input[placeholder="Username or Email"]');
    await page.type('input[placeholder="Username or Email"]', 'admin@example.com');
    await page.type('input[placeholder="Password"]', 'password');
    await page.click('button[type="submit"]');
  }

  await page.waitForSelector('h1');
  
  await page.goto('http://localhost:3000/classes');
  
  await page.waitForSelector('button');
  const classBtns = await page.$$('button');
  let addClassBtn;
  for (const b of classBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text?.includes('Add Class')) addClassBtn = b;
  }
  
  if (addClassBtn) {
    await addClassBtn.click();
    await page.waitForSelector('input[placeholder="e.g. Lab 302, Library..."]');
    await page.type('input[placeholder="e.g. Lab 302, Library..."]', 'New Class 123');
    
    const saveBtns = await page.$$('button');
    let saveBtn;
    for (const b of saveBtns) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text?.includes('Save')) saveBtn = b;
    }
    if (saveBtn) await saveBtn.click();
    
    await new Promise(r => setTimeout(r, 2000));
  }
  
  const storage = await page.evaluate(() => {
    return {
      store: localStorage.getItem('quickStock_sheet_store_admin_local_spreadsheet_id')
    };
  });
  
  console.log(JSON.stringify(JSON.parse(storage.store || '{}'), null, 2));
  
  await browser.close();
})();
