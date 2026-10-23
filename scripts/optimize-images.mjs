// Generates web-ready images from /source-images into /public/images.
// Run with: npm run images
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'

const SRC = 'source-images'
const OUT = 'public/images'

const jobs = [
  // Project screenshots (1440x900): two widths, AVIF + WebP
  ...['agan_health', 'trident_hyundai', 'pristine_renault', 'kinara_capital', 'design_esthetics', 'pristine_isuzu'].map(
    (name) => ({ name, widths: [320, 480, 720, 1280] }),
  ),
  // Studio headshot
  { name: 'biopic', out: 'headshot', widths: [480, 800] },
]

await fs.mkdir(OUT, { recursive: true })

for (const job of jobs) {
  const input = path.join(SRC, `${job.name}.png`)
  const base = job.out || job.name.replace(/_/g, '-')
  for (const w of job.widths) {
    const img = sharp(input).resize({ width: w, withoutEnlargement: true })
    await img.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(OUT, `${base}-${w}.avif`))
    await img.clone().webp({ quality: 74, effort: 6 }).toFile(path.join(OUT, `${base}-${w}.webp`))
  }
  console.log('✓', base)
}

// Case-study captures (from `npm run capture`): full-page scroll-through, phone screens, OG card
const CASES = path.join(SRC, 'cases')
await fs.mkdir(path.join(OUT, 'cases'), { recursive: true })
const exists = (f) => fs.access(f).then(() => true, () => false)
for (const file of (await fs.readdir(CASES).catch(() => [])).filter((f) => f.endsWith('.png'))) {
  const [, slug, kind] = file.match(/^(.+)-(desktop|mobile)\.png$/) || []
  if (!slug) continue
  const input = path.join(CASES, file)
  if (kind === 'desktop') {
    for (const w of [700, 1100]) {
      const img = sharp(input).resize({ width: w })
      await img.clone().avif({ quality: 50, effort: 6 }).toFile(path.join(OUT, 'cases', `${slug}-full-${w}.avif`))
      await img.clone().webp({ quality: 72, effort: 6 }).toFile(path.join(OUT, 'cases', `${slug}-full-${w}.webp`))
    }
  } else {
    const { height } = await sharp(input).metadata()
    for (let n = 0; n < 3; n++) {
      const top = n * 1556
      if (top + 1688 > height) break
      const crop = sharp(input).extract({ left: 0, top, width: 780, height: 1688 })
      for (const w of [300, 600]) {
        const img = crop.clone().resize({ width: w })
        await img.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(OUT, 'cases', `${slug}-phone${n}-${w}.avif`))
        await img.clone().webp({ quality: 74, effort: 6 }).toFile(path.join(OUT, 'cases', `${slug}-phone${n}-${w}.webp`))
      }
    }
  }
  console.log('✓ case', slug, kind)
}

// Per-project social cards: the project screenshot on paper, framed like a browser
for (const slug of ['agan-health', 'trident-hyundai', 'kinara-capital', 'pristine-renault', 'design-esthetics', 'pristine-isuzu']) {
  const shotFile = path.join(SRC, `${slug.replace(/-/g, '_')}.png`)
  if (!(await exists(shotFile))) continue
  const shot = await sharp(shotFile).resize({ width: 1040, height: 536, fit: 'cover', position: 'top' }).png().toBuffer()
  const frame = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#f3eee5"/>
    <rect x="70" y="50" width="1060" height="620" rx="22" fill="#171512"/>
    <rect x="80" y="60" width="1040" height="34" fill="#1f1c19"/>
    <circle cx="102" cy="77" r="5" fill="#6b645a"/><circle cx="120" cy="77" r="5" fill="#6b645a"/><circle cx="138" cy="77" r="5" fill="#6b645a"/>
  </svg>`)
  await sharp(frame)
    .composite([{ input: shot, left: 80, top: 94 }])
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, 'cases', `${slug}-og.jpg`))
}
console.log('✓ case OG cards')

// Open Graph image (1200x630 JPG — AVIF isn't supported by WhatsApp/LinkedIn previews)
const portrait = await sharp(path.join(SRC, 'myPic.png')).resize({ height: 600 }).png().toBuffer()
const ogSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="78%" cy="45%" r="55%">
      <stop offset="0" stop-color="#6d5dfc" stop-opacity=".55"/>
      <stop offset=".45" stop-color="#2a2f8f" stop-opacity=".25"/>
      <stop offset="1" stop-color="#07080a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#07080a"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="72" y="120" fill="#8b8f98" font-family="Menlo, monospace" font-size="22" letter-spacing="3">SHIVA KUMAR — BENGALURU, IN</text>
  <text x="72" y="270" fill="#f3f2ee" font-family="Helvetica Neue, Arial, sans-serif" font-size="92" font-weight="300" letter-spacing="-3">Fast, fluid,</text>
  <text x="72" y="372" fill="#f3f2ee" font-family="Helvetica Neue, Arial, sans-serif" font-size="92" font-weight="300" letter-spacing="-3">flawless web.</text>
  <text x="72" y="470" fill="#b7b9c0" font-family="Helvetica Neue, Arial, sans-serif" font-size="30">Frontend engineering · Motion · Core Web Vitals</text>
  <rect x="72" y="526" width="340" height="56" rx="28" fill="#f3f2ee"/>
  <text x="104" y="562" fill="#07080a" font-family="Helvetica Neue, Arial, sans-serif" font-size="22" font-weight="500">shivakumar-dev.vercel.app</text>
</svg>`
await sharp(Buffer.from(ogSvg))
  .composite([{ input: portrait, left: 700, top: 30 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(OUT, 'og-image.jpg'))
console.log('✓ og-image')
