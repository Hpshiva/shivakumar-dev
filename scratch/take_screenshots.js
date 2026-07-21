import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const websites = [
  { name: 'trident_hyundai', url: 'https://www.tridenthyundai.com' },
  { name: 'pristine_renault', url: 'https://pristinerenault.com' },
  { name: 'pristine_isuzu', url: 'https://pristineisuzu.com' },
  { name: 'agan_health', url: 'https://www.aganhealth.com' },
  { name: 'kinara_capital', url: 'https://kinaracapital.com' },
  { name: 'design_esthetics', url: 'https://designesthetics.com' }
];

const outputDir = path.join(__dirname, '../src/assets');

async function run() {
  console.log('Starting puppeteer browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const site of websites) {
    console.log(`Navigating to ${site.url}...`);
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      // Set user agent to avoid blocking
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait another 4 seconds for lazy-loaded assets/animations
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 4000)));

      const outputPath = path.join(outputDir, `${site.name}.png`);
      await page.screenshot({ path: outputPath });
      console.log(`Saved screenshot to ${outputPath}`);
      await page.close();
    } catch (err) {
      console.error(`Failed to capture ${site.url}:`, err.message);
    }
  }

  await browser.close();
  console.log('Finished capturing all websites.');
}

run();
