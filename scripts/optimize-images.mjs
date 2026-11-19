// Generates web-ready images from /source-images into /public/images.
// Run with: npm run images
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'

const SRC = 'source-images'
const OUT = 'public/images'

const PROJECTS = ['agan-health', 'trident-hyundai', 'pristine-renault', 'kinara-capital', 'design-esthetics', 'pristine-isuzu']
// Retina sizes: the browser picks the smallest one that is still sharp on the visitor's screen
const SHOT_WIDTHS = [480, 960, 1440, 1920, 2560]

const jobs = [
  // Project screenshots: HD 2x captures (2880x1800) from `npm run capture`, else the original PNGs
  ...PROJECTS.map((slug) => ({
    input: [path.join(SRC, 'cases', `${slug}-hd.png`), path.join(SRC, `${slug.replace(/-/g, '_')}.png`)],
    out: slug,
    widths: SHOT_WIDTHS,
  })),
]

await fs.mkdir(OUT, { recursive: true })
const exists = (f) => fs.access(f).then(() => true, () => false)

for (const job of jobs) {
  let input = null
  for (const candidate of job.input) if (await exists(candidate)) { input = candidate; break }
  if (!input) continue
  for (const w of job.widths) {
    // Lanczos downscale + light sharpening keeps small UI text crisp
    const img = sharp(input).resize({ width: w, withoutEnlargement: true, kernel: 'lanczos3' }).sharpen({ sigma: 0.5 })
    await img.clone().avif({ quality: 62, effort: 6, chromaSubsampling: '4:4:4' }).toFile(path.join(OUT, `${job.out}-${w}.avif`))
    await img.clone().webp({ quality: 82, effort: 6, smartSubsample: true }).toFile(path.join(OUT, `${job.out}-${w}.webp`))
  }
  console.log('✓', job.out, path.basename(input))
}

// Case-study captures (from `npm run capture`): full-page scroll-through, phone screens, OG card
const CASES = path.join(SRC, 'cases')
await fs.mkdir(path.join(OUT, 'cases'), { recursive: true })
for (const file of (await fs.readdir(CASES).catch(() => [])).filter((f) => f.endsWith('.png'))) {
  const [, slug, kind] = file.match(/^(.+)-(desktop|mobile)\.png$/) || []
  if (!slug) continue
  const input = path.join(CASES, file)
  if (kind === 'desktop') {
    for (const w of [1200, 2400]) {
      const img = sharp(input).resize({ width: w, kernel: 'lanczos3' }).sharpen({ sigma: 0.5 })
      await img.clone().avif({ quality: 58, effort: 6 }).toFile(path.join(OUT, 'cases', `${slug}-full-${w}.avif`))
      await img.clone().webp({ quality: 78, effort: 6 }).toFile(path.join(OUT, 'cases', `${slug}-full-${w}.webp`))
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

// Social share cards are drawn by scripts/share-cards.mjs (npm run share)

// UnivAssist case study (screenshots from the event work, in source-images/univassist)
const UA = path.join(SRC, 'univassist')
if (await exists(UA)) {
  const enc = async (input, base, widths) => {
    for (const w of widths) {
      const img = sharp(input).resize({ width: w, withoutEnlargement: true, kernel: 'lanczos3' }).sharpen({ sigma: 0.5 })
      await img.clone().avif({ quality: 62, effort: 6, chromaSubsampling: '4:4:4' }).toFile(`${base}-${w}.avif`)
      await img.clone().webp({ quality: 82, effort: 6, smartSubsample: true }).toFile(`${base}-${w}.webp`)
    }
  }
  await enc(path.join(UA, 'redeinspira.png'), path.join(OUT, 'univassist'), SHOT_WIDTHS)
  for (const f of await fs.readdir(UA)) {
    const name = f.replace(/\.(png|jpe?g)$/, '')
    await enc(path.join(UA, f), path.join(OUT, 'cases', `univassist-${name}`), [480, 960, 1440])
  }
  console.log('✓ univassist')
}

