// Social share cards (the picture WhatsApp, LinkedIn, X and Slack show for a link).
// Drawn as HTML in the site's own fonts and colours, photographed at 1200x630 by
// local Chrome, saved as JPG (most link previews can't read AVIF/WebP).
// Run with `npm run share` after changing the hero, or a project.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'
import puppeteer from 'puppeteer-core'
import { projects } from '../src/data/projects.js'

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = 'public/images'
const file = (p) => pathToFileURL(path.resolve(p)).href
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const pad = (n) => String(n).padStart(2, '0')

const fonts = `
@font-face { font-family: Archivo; src: url(${file('node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')}) format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
@font-face { font-family: Doto; src: url(${file('node_modules/@fontsource-variable/doto/files/doto-latin-full-normal.woff2')}) format('woff2'); font-weight: 100 900; }
`
const base = `
${fonts}
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { position: relative; background: #070708; color: #f4f4f1; font-family: Archivo, sans-serif; }
/* the hero's 120px grid lines with dots on them, fading out to the right */
.grid { position: absolute; inset: 0;
  background:
    radial-gradient(circle, rgba(244,244,241,.16) 1px, transparent 1.5px) 0 0 / 30px 30px,
    linear-gradient(90deg, rgba(244,244,241,.05) 1px, transparent 1px) 0 0 / 120px 120px,
    linear-gradient(rgba(244,244,241,.05) 1px, transparent 1px) 0 0 / 120px 120px;
  -webkit-mask: linear-gradient(90deg, #000 30%, transparent 85%); }
.hud { font-family: Doto, monospace; font-weight: 800; font-size: 21px; letter-spacing: .06em; text-transform: uppercase; color: #8d8d92; }
.hud b { color: #ff5a1f; font-weight: 800; }
.title { font-stretch: 125%; font-weight: 650; letter-spacing: -.055em; line-height: .92; }
.title em { font-style: normal; color: #ff5a1f; }
.url { display: inline-flex; align-items: center; gap: 14px; height: 54px; padding: 0 10px 0 26px; border-radius: 99px;
  background: #f4f4f1; color: #0b0b0c; font-size: 21px; font-weight: 600; }
.url i { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: #0b0b0c; color: #f4f4f1; font-style: normal; font-size: 18px; }
.bar { position: absolute; left: 0; right: 0; bottom: 0; height: 6px; background: #ff5a1f; }
`

// Three of the projects, fanned out on the right like the hero showcase
function homeCard(shots) {
  const screen = (src, k) => `<div class="screen s${k}"><div class="screen__bar"><i></i><i></i><i></i></div><img src="${src}"></div>`
  return `<!doctype html><meta charset="utf-8"><style>${base}
.glow { position: absolute; right: -160px; top: 60px; width: 900px; height: 700px; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(255,90,31,.34), transparent 65%); }
.copy { position: absolute; left: 72px; top: 76px; width: 640px; }
.title { margin-top: 48px; font-size: 70px; white-space: nowrap; }
.sub { margin-top: 34px; font-size: 25px; line-height: 1.4; color: #c9c9c4; max-width: 470px; }
.url { position: absolute; left: 72px; bottom: 62px; }
.screen { position: absolute; width: 470px; border: 1px solid rgba(244,244,241,.18); border-radius: 16px; overflow: hidden; background: #0a0a0b;
  box-shadow: 0 40px 90px -20px rgba(0,0,0,.8); }
.screen__bar { display: flex; gap: 6px; align-items: center; height: 30px; padding: 0 14px; border-bottom: 1px solid rgba(244,244,241,.1); }
.screen__bar i { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.18); }
.screen img { display: block; width: 100%; height: 280px; object-fit: cover; object-position: top; }
.s0 { left: 880px; top: 50px; transform: rotate(6deg); opacity: .5; }
.s1 { left: 850px; top: 150px; transform: rotate(-3deg); opacity: .8; }
.s2 { left: 820px; top: 270px; box-shadow: 0 50px 110px -30px rgba(255,90,31,.5), 0 30px 60px rgba(0,0,0,.7); }
</style>
<div class="grid"></div><div class="glow"></div>
${shots.map(screen).join('')}
<div class="copy">
  <p class="hud"><b>[</b> Shiva Kumar <b>]</b> Frontend engineer · Bengaluru</p>
  <h1 class="title">Websites built<br>to be <em>remembered.</em></h1>
  <p class="sub">Fast, story-driven websites, designed and hand-coded.</p>
</div>
<span class="url">shivakumar-dev.vercel.app <i>↗</i></span>
<div class="bar"></div>`
}

function caseCard(p, i, shot) {
  const name = esc(p.name)
  const size = name.length > 14 ? 74 : 92
  return `<!doctype html><meta charset="utf-8"><style>${base}
.glow { position: absolute; right: -200px; top: 40px; width: 900px; height: 700px; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(255,90,31,.32), transparent 65%); }
.copy { position: absolute; left: 72px; top: 70px; width: 520px; }
.title { margin-top: 40px; font-size: ${size}px; }
.line { margin-top: 28px; font-size: 22px; line-height: 1.42; color: #c9c9c4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.by { position: absolute; left: 72px; bottom: 60px; font-size: 17px; }
.shot { position: absolute; left: 640px; top: 110px; width: 760px; border: 1px solid rgba(244,244,241,.18); border-radius: 18px; overflow: hidden;
  background: #0a0a0b; box-shadow: 0 50px 110px -30px rgba(255,90,31,.45), 0 30px 60px rgba(0,0,0,.6); }
.shot__bar { display: flex; align-items: center; gap: 7px; height: 38px; padding: 0 16px; border-bottom: 1px solid rgba(244,244,241,.1); }
.shot__bar i { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.18); }
.shot__bar span { margin-left: 18px; font-family: Doto, monospace; font-weight: 800; font-size: 14px; color: #8d8d92; }
.shot img { display: block; width: 100%; }
</style>
<div class="grid"></div><div class="glow"></div>
<div class="shot"><div class="shot__bar"><i></i><i></i><i></i><span>${esc(p.shotDomain || p.domain)}</span></div><img src="${shot}"></div>
<div class="copy">
  <p class="hud"><b>[</b> Case study ${pad(i + 1)} / ${pad(projects.length)} <b>]</b></p>
  <h1 class="title">${name}</h1>
  <p class="line">${esc(p.line)}</p>
</div>
<p class="by hud">${esc(p.industry)} · by <b>Shiva Kumar</b></p>
<div class="bar"></div>`
}


const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] })
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
const tmp = path.resolve('node_modules/.cache/share-card.html')
fs.mkdirSync(path.dirname(tmp), { recursive: true })

async function shoot(html, out) {
  fs.writeFileSync(tmp, html)
  await page.goto(file(tmp), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  const png = await page.screenshot({ type: 'png' })
  await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(out)
  console.log('✓', out)
}

const homeShots = projects.slice(0, 3).reverse().map((p) => file(path.join(OUT, `${p.image || p.slug}-1440.webp`)))
await shoot(homeCard(homeShots), path.join(OUT, 'share-home.jpg'))
for (const [i, p] of projects.entries()) {
  const shot = path.join(OUT, `${p.image || p.slug}-1440.webp`)
  if (!fs.existsSync(shot)) continue
  await shoot(caseCard(p, i, file(shot)), path.join(OUT, 'cases', `${p.slug}-share.jpg`))
}
fs.rmSync(tmp)
await browser.close()
