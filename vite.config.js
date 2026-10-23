import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

// Every generated case study (work/<slug>/index.html) is its own page
const workPages = fs.existsSync('work')
  ? Object.fromEntries(
      fs
        .readdirSync('work')
        .filter((slug) => fs.existsSync(path.join('work', slug, 'index.html')))
        .map((slug) => [`work-${slug}`, path.resolve('work', slug, 'index.html')]),
    )
  : {}

// Preload the primary text fonts so headlines render in Archivo immediately
const preloadFonts = {
  name: 'preload-fonts',
  enforce: 'post',
  transformIndexHtml(html, ctx) {
    if (!ctx.bundle) return html
    const fonts = Object.keys(ctx.bundle).filter((file) =>
      /(archivo-latin-wdth-normal|doto-latin-wght-normal).*\.woff2$/.test(file),
    )
    return {
      html,
      tags: fonts.map((file) => ({
        tag: 'link',
        attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
        injectTo: 'head',
      })),
    }
  },
}

export default defineConfig({
  plugins: [preloadFonts],
  build: {
    target: 'es2020',
    rollupOptions: {
      input: { main: path.resolve('index.html'), ...workPages },
    },
    // Never base64-inline fonts into the render-blocking CSS
    assetsInlineLimit: (file) => (/\.(woff2?|ttf|otf)$/.test(file) ? false : undefined),
  },
})
