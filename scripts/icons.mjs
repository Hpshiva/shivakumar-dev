// Generates the icon pack from public/favicon.svg. Run with: npm run icons
import sharp from 'sharp'
import fs from 'node:fs'

const svg = fs.readFileSync('public/favicon.svg')
const png = (size, file, pad = 0) =>
  sharp(svg, { density: 384 })
    .resize(size - pad * 2, size - pad * 2)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: '#070708' })
    .png()
    .toFile(`public/${file}`)

await png(180, 'apple-touch-icon.png')
await png(192, 'icon-192.png')
await png(512, 'icon-512.png')
await png(512, 'icon-maskable-512.png', 64) // content inside the maskable safe zone

// favicon.ico holding a 32px and a 16px PNG (PNG-in-ICO is supported by every modern browser)
const images = await Promise.all([32, 16].map((s) => sharp(svg, { density: 384 }).resize(s, s).png().toBuffer()))
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(images.length, 4)
let offset = 6 + 16 * images.length
const dir = images.map((img, i) => {
  const size = [32, 16][i]
  const e = Buffer.alloc(16)
  e.writeUInt8(size, 0)
  e.writeUInt8(size, 1)
  e.writeUInt16LE(1, 4)
  e.writeUInt16LE(32, 6)
  e.writeUInt32LE(img.length, 8)
  e.writeUInt32LE(offset, 12)
  offset += img.length
  return e
})
fs.writeFileSync('public/favicon.ico', Buffer.concat([header, ...dir, ...images]))
console.log('✓ icons')
