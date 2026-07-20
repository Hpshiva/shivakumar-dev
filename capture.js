import puppeteer from 'puppeteer';

async function run() {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    console.log('Fetching original...');
    await page.goto('https://heynesh.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
    
    await page.evaluate(() => window.scrollTo(0, 1000));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'original_mid.png' });

    await page.evaluate(() => window.scrollTo(0, 3000));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'original_bottom.png' });

    console.log('Fetching local...');
    await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));

    await page.evaluate(() => window.scrollTo(0, 1000));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'local_mid.png' });

    await page.evaluate(() => window.scrollTo(0, 3000));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'local_bottom.png' });
    
    await browser.close();
    console.log('Capture finished');
  } catch (err) {
    console.error(err);
  }
}

run();
