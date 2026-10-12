import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('dialog', async dialog => {
    console.log('DIALOG:', dialog.message());
    await dialog.accept();
  });

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
  
  await page.waitForSelector('h3'); // Assuming classes are h3 or something similar
  const pageText = await page.evaluate(() => document.body.innerText);
  console.log('Contains New Class 123?', pageText.includes('New Class 123'));
  
  // Try to create another class and see if there is an alert
  const classBtns = await page.$$('button');
  let addClassBtn;
  for (const b of classBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text?.includes('Add Class')) addClassBtn = b;
  }
  
  if (addClassBtn) {
    await addClassBtn.click();
    await page.waitForSelector('input[placeholder="e.g. Lab 302, Library..."]');
    await page.type('input[placeholder="e.g. Lab 302, Library..."]', 'New Class 456');
    
    const saveBtns = await page.$$('button');
    let saveBtn;
    for (const b of saveBtns) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text?.includes('Save')) saveBtn = b;
    }
    if (saveBtn) await saveBtn.click();
    
    await new Promise(r => setTimeout(r, 2000));
  }
  
  const pageText2 = await page.evaluate(() => document.body.innerText);
  console.log('Contains New Class 456?', pageText2.includes('New Class 456'));
  
  await browser.close();
})();
