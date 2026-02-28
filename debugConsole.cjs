const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({args:['--no-sandbox']});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  try {
    await page.goto('http://localhost:8081', {waitUntil:'networkidle0', timeout:30000});
    await page.screenshot({path:'debug.png', fullPage:true});
    console.log('loaded and screenshot taken');
  } catch (e) {
    console.log('goto error', e.toString());
  }
  await browser.close();
})();
