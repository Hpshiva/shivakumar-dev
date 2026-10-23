// Captures clean desktop + mobile screenshots of each live project into source-images/cases.
// Uses the locally installed Google Chrome. Run with: npm run capture
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs/promises'
import { projects } from '../src/data/projects.js'

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = 'source-images/cases'
const DESKTOP_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'

const only = process.argv.slice(2)
await fs.mkdir(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] })

async function capture(url, file, { width, height, mobile }) {
  const page = await browser.newPage()
  await page.setUserAgent(mobile ? MOBILE_UA : DESKTOP_UA)
  await page.setViewport({ width, height: 900, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile })
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 })
  } catch {
    // keep whatever has loaded
  }
  // Scroll through the page so lazy images and scroll animations load
  await page.evaluate(async (limit) => {
    for (let y = 0; y < limit; y += 300) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 220))
    }
    window.scrollTo(0, 0)
  }, height + 900)
  await new Promise((r) => setTimeout(r, 1500))
  // Hide popups, chat widgets and cookie banners
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el)
      const z = parseInt(cs.zIndex, 10) || 0
      const isOverlay = cs.position === 'fixed' && (z > 50 || el.getBoundingClientRect().height > window.innerHeight * 0.5)
      const looksModal = /modal|popup|overlay|cookie|chat|whatsapp|enquir/i.test(`${el.id} ${el.className}`)
      if ((isOverlay && !/header|nav/i.test(`${el.tagName} ${el.className}`)) || (looksModal && cs.position !== 'static')) {
        el.style.setProperty('display', 'none', 'important')
      }
    }
    document.documentElement.style.overflow = 'auto'
    document.body.style.overflow = 'auto'
  })
  await new Promise((r) => setTimeout(r, 800))
  // Full-page capture at a normal viewport (so 100vh sections keep their real size), then crop
  const full = await page.screenshot({ fullPage: true })
  const meta = await sharp(full).metadata()
  const scale = mobile ? 2 : 1
  await sharp(full)
    .extract({ left: 0, top: 0, width: meta.width, height: Math.min(meta.height, height * scale) })
    .toFile(file)
  await page.close()
}

for (const p of projects) {
  if (only.length && !only.includes(p.slug)) continue
  try {
    await capture(p.url, path.join(OUT, `${p.slug}-desktop.png`), { width: 1440, height: 4000, mobile: false })
    await capture(p.url, path.join(OUT, `${p.slug}-mobile.png`), { width: 390, height: 2400, mobile: true })
    console.log('✓', p.slug)
  } catch (err) {
    console.log('✗', p.slug, err.message)
  }
}
await browser.close()
