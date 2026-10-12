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
  
  await new Promise(r => setTimeout(r, 2000));
  
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log(html);
  
  await browser.close();
})();
