// Builds the homepage work cards and every /work/<slug>/ case-study page
// from src/data/projects.js. Runs automatically before `dev` and `build`.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { projects } from '../src/data/projects.js'
import { homeJsonLd, caseJsonLd, writeSeoFiles } from './seo.mjs'

const SITE = 'https://shivakumar-dev.vercel.app'
const pad = (n) => String(n).padStart(2, '0')
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const has = (file) => fs.existsSync(path.join('public', file))

function picture(base, widths, sizes, alt, { lazy = true, attrs = '' } = {}) {
  const set = (ext) => widths.map((w) => `/images/${base}-${w}.${ext} ${w}w`).join(', ')
  const fallback = `/images/${base}-${widths[Math.min(1, widths.length - 1)]}.webp`
  return `<picture>
                <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}" />
                <img src="${fallback}" srcset="${set('webp')}" sizes="${sizes}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ' fetchpriority="high"'} decoding="async"${attrs} />
              </picture>`
}

/* ---------------------------------------------------------
   Homepage cards
   --------------------------------------------------------- */
function card(p, i) {
  return `            <article class="card" style="--i:${i}" data-card>
              <div class="card__info">
                <p class="card__meta"><b>${pad(i + 1)}</b><span>${esc(p.industry)}</span><span>${esc(p.location)}</span></p>
                <h3>${esc(p.name)}</h3>
                <p class="card__line">${esc(p.line)}</p>
                <dl class="card__facts">
                  <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
                  <div><dt>Stack</dt><dd>${esc(p.stack.slice(0, 2).join(' · '))}</dd></div>
                </dl>
                <div class="card__actions">
                  <a class="card__cta" href="/work/${p.slug}/">Read the case study <span aria-hidden="true">→</span></a>
                  <a class="card__live" href="${p.url}" target="_blank" rel="noopener">Live site ↗<span class="sr-only"> (opens in a new tab)</span></a>
                </div>
              </div>
              <a class="shot" href="/work/${p.slug}/" tabindex="-1" aria-hidden="true">
                <span class="shot__bar"><i></i><i></i><i></i><span>${esc(p.shotDomain || p.domain)}</span></span>
                <span class="shot__media">
              ${picture(p.image || p.slug, [480, 960, 1440, 1920], '(min-width: 1360px) 700px, (min-width: 860px) 52vw, 90vw', `${p.name} homepage`, { attrs: ' width="1440" height="900" data-shot' })}
                </span>
              </a>
            </article>`
}

const indexPath = 'index.html'
const indexHtml = fs.readFileSync(indexPath, 'utf8')
const cards = projects.map(card).join('\n')
let updated = indexHtml.replace(
  /(<!-- work:start -->)[\s\S]*?(\s*<!-- work:end -->)/,
  `$1\n${cards}\n$2`,
)
// Structured data + AI/search files, generated from the same sources
updated = updated.replace(
  /(<!-- ld:start -->)[\s\S]*?(<!-- ld:end -->)/,
  `$1\n  <script type="application/ld+json">\n  ${JSON.stringify(homeJsonLd(updated), null, 2).replace(/\n/g, '\n  ')}\n  </script>\n  $2`,
)
writeSeoFiles(updated)
if (updated !== indexHtml) fs.writeFileSync(indexPath, updated)

/* ---------------------------------------------------------
   Case-study pages
   --------------------------------------------------------- */
const nav = `  <header class="nav" data-nav>
    <div class="nav__inner">
      <a href="/" class="nav__logo">
        <span class="nav__mark" aria-hidden="true">SK</span>
        <span class="nav__name">Shiva Kumar</span>
      </a>
      <nav class="nav__links" aria-label="Primary">
        <a href="/#process">Process</a>
        <a href="/#work">Work</a>
        <a href="/#pricing">Pricing</a>
        <a href="/#note">About</a>
        <a href="/#faq">FAQ</a>
      </nav>
      <div class="nav__actions">
        <a href="/#contact" class="btn btn--light btn--sm"><span>Start a project</span><span class="btn__chip" aria-hidden="true">↗</span></a>
        <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
          <span class="sr-only">Open menu</span>
          <span class="nav__toggle-line"></span>
          <span class="nav__toggle-line"></span>
        </button>
      </div>
    </div>
    <div class="mobile-menu" id="mobile-menu" hidden data-menu>
      <nav aria-label="Mobile">
        <a href="/"><small>00</small> Home</a>
        <a href="/#process"><small>02</small> How I work</a>
        <a href="/#work"><small>03</small> The work</a>
        <a href="/#toolkit"><small>04</small> Toolkit</a>
        <a href="/#pricing"><small>05</small> What you get</a>
        <a href="/#contact"><small>08</small> Contact</a>
      </nav>
      <p class="hud">shivakumar.frontend@gmail.com</p>
    </div>
  </header>`

const footer = `  <footer class="footer">
    <div class="container" data-footer>
      <div class="footer__top">
        <p class="hud">[ Thanks for reading ]</p>
        <nav class="footer__links" aria-label="Footer">
          <a href="/#work">Work</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#contact">Contact</a>
          <a href="https://github.com/Hpshiva" target="_blank" rel="noopener">GitHub ↗</a>
          <a href="https://wa.me/916283937782" target="_blank" rel="noopener">WhatsApp ↗</a>
        </nav>
      </div>
      <p class="footer__word" aria-hidden="true">Shiva Kumar</p>
      <div class="footer__bottom hud">
        <span>© <span data-year>2026</span> Shiva Kumar · Designed &amp; developed in Bengaluru</span>
        <a href="/">Back to the homepage ↑</a>
      </div>
    </div>
  </footer>`

function section(num, kicker, title, body) {
  return `      <section class="cs-section" data-reveal>
        <h2><small>${pad(num)} — ${kicker}</small>${title}</h2>
        ${body}
      </section>`
}

const fullHeights = {}
for (const p of projects) {
  const file = path.join('public', `images/cases/${p.slug}-full-1200.webp`)
  if (fs.existsSync(file)) fullHeights[p.slug] = (await sharp(file).metadata()).height
}

function caseStudy(p, i) {
  const next = projects[(i + 1) % projects.length]
  const url = `${SITE}/work/${p.slug}/`
  const og = has(`images/cases/${p.slug}-og.jpg`) ? `${SITE}/images/cases/${p.slug}-og.jpg` : `${SITE}/images/og-image.jpg`
  const full = has(`images/cases/${p.slug}-full-1200.avif`)
  const phones = [0, 1, 2].filter((n) => has(`images/cases/${p.slug}-phone${n}-600.avif`))
  let n = 0

  const parts = []
  parts.push(section(++n, 'Context', 'The client', `<div class="cs-body">${p.context.map((t) => `<p>${esc(t)}</p>`).join('')}</div>`))
  parts.push(section(++n, 'Challenge', 'The problem to solve', `<div class="cs-body">${p.challenge.map((t) => `<p>${esc(t)}</p>`).join('')}</div>`))

  const gallery = p.gallery
    ? `    <section class="cs-gallery container" aria-label="${esc(p.gallery.title)}">
      <div class="cs-scroll__head">
        <h2>${esc(p.gallery.title)}</h2>
        <p class="hud">[ ${esc(p.gallery.note)} ]</p>
      </div>
      <ul class="cs-gallery__grid">
${p.gallery.items
  .map(
    (g) => `        <li data-reveal>
          <div class="shot">
            ${picture(g.img, [480, 960, 1440], '(min-width: 1320px) 400px, (min-width: 700px) 30vw, 92vw', `Screenshot of the ${g.caption.split(' · ')[0]} page I built`, { attrs: ' width="1440" height="900"' })}
          </div>
          <p class="hud">${esc(g.caption)}</p>
        </li>`,
  )
  .join('\n')}
      </ul>
    </section>`
    : ''

  const scrollThrough = full
    ? `    <section class="cs-scroll container" data-scrollthrough>
      <div class="cs-scroll__head">
        <h2>The site, top to bottom.</h2>
        <p class="hud">[ Keep scrolling — the page scrolls with you ]</p>
      </div>
      <div class="cs-browser">
        <div class="shot__bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(p.domain)}</span></div>
        <div class="cs-browser__view">
          ${picture(`cases/${p.slug}-full`, [1200, 2400], '(min-width: 1320px) 1220px, 92vw', `Full-length screenshot of the ${p.name} homepage`, { attrs: ` width="1200" height="${fullHeights[p.slug]}" data-scroll-img` })}
        </div>
      </div>
    </section>`
    : ''

  const features = section(
    ++n,
    'What I built',
    'Key features',
    `<ul class="cs-features">
${p.features.map((f) => `          <li><i>${esc(f.note)}</i><b>${esc(f.title)}</b><span>${esc(f.text)}</span></li>`).join('\n')}
        </ul>`,
  )

  const phoneBlock = phones.length
    ? `    <section class="container" aria-label="Mobile screens">
      <p class="hud cs-phones__label">[ On mobile, where most visitors actually are ]</p>
      <div class="cs-phones">
${phones
  .map(
    (k, j) => `        <div class="phone" data-parallax="${[-6, -18, -10][j]}">
          ${picture(`cases/${p.slug}-phone${k}`, [300, 600], '(min-width: 860px) 290px, 40vw', `${p.name} on mobile, screen ${k + 1}`, { attrs: ' width="600" height="1299"' })}
        </div>`,
  )
  .join('\n')}
      </div>
    </section>`
    : ''

  const approach = section(++n, 'Approach', 'How I built it', `<div class="cs-body">${p.approach.map((t) => `<p>${esc(t)}</p>`).join('')}</div>`)
  const results = p.results?.length
    ? section(
        ++n,
        'Results',
        'The outcome',
        `<ul class="cs-results">${p.results.map((r) => `<li><b>${esc(r.value)}</b><span>${esc(r.label)}</span></li>`).join('')}</ul>`,
      )
    : ''
  const delivered = section(
    ++n,
    'Delivered',
    'What shipped',
    `<div class="cs-body">
          <ul class="cs-delivered">${p.delivered.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
          <div class="hero__ctas" style="margin-top:24px">
            <a class="btn btn--light" href="${p.url}" target="_blank" rel="noopener"><span>Visit ${esc(p.domain)}</span><span class="btn__chip" aria-hidden="true">↗</span></a>
            <a class="btn btn--line" href="/#contact"><span>Start a similar project</span></a>
          </div>
        </div>`,
  )

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#070708" />
  <meta name="color-scheme" content="dark" />
  <title>${esc(p.name)} case study — Shiva Kumar, frontend engineer</title>
  <meta name="description" content="${esc(p.line)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="Shiva Kumar" />
  <meta property="og:title" content="${esc(p.name)} — case study by Shiva Kumar" />
  <meta property="og:description" content="${esc(p.line)}" />
  <meta property="og:image" content="${og}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(p.name)} — case study by Shiva Kumar" />
  <meta name="twitter:description" content="${esc(p.line)}" />
  <meta name="twitter:image" content="${og}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="manifest" href="/site.webmanifest" />
  <script type="application/ld+json">
  ${JSON.stringify(caseJsonLd(p, og))}
  </script>
  <script>
    document.documentElement.classList.add('js');
    setTimeout(function () { if (!window.__motionReady) document.documentElement.classList.add('no-motion'); }, 3000);
  </script>
  <script type="module" src="/src/main.js"></script>
</head>

<body>
  <a class="skip-link" href="#main">Skip to content</a>

${nav}

  <main id="main">
    <section class="cs-hero container" aria-labelledby="cs-title">
      <a class="cs-back" href="/#work">← All work</a>
      <p class="chapter__label hud hero-in"><span class="hud__bracket">[</span> Case study ${pad(i + 1)} / ${pad(projects.length)} <span class="hud__bracket">]</span> ${esc(p.industry)}</p>
      <h1 class="cs-title" id="cs-title"><span class="line"><span class="line__inner">${esc(p.name)}</span></span></h1>
      <p class="cs-intro hero-in hero-in--soft" style="--d:.3s">${esc(p.intro)}</p>
      <dl class="cs-meta hero-in" style="--d:.45s">
        <div><dt>Client</dt><dd>${esc(p.name)}</dd></div>
        <div><dt>Industry</dt><dd>${esc(p.industry)}</dd></div>
        <div><dt>Location</dt><dd>${esc(p.location)}</dd></div>
        <div><dt>My role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Stack</dt><dd>${esc(p.stack.join(', '))}</dd></div>
        <div><dt>Live site</dt><dd><a href="${p.url}" target="_blank" rel="noopener">${esc(p.domain)} ↗</a></dd></div>
      </dl>
    </section>

    <section class="cs-cover container hero-in" style="--d:.6s" aria-label="Homepage">
      <div class="shot">
        <div class="shot__bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(p.shotDomain || p.domain)}</span></div>
        <div class="shot__media">
          ${picture(p.image || p.slug, [960, 1440, 1920, 2560], '(min-width: 1320px) 1220px, 92vw', `${p.name} homepage`, { lazy: false, attrs: ' width="1440" height="900" data-shot' })}
        </div>
      </div>
    </section>

    <div class="container">
${parts.join('\n')}
    </div>

${gallery}

${scrollThrough}

    <div class="container">
${features}
    </div>

${phoneBlock}

    <div class="container">
${approach}
${results}
${delivered}
    </div>

    <a class="cs-next" href="/work/${next.slug}/">
      <span class="hud">Next case study →</span>
      <span class="cs-next__title">${esc(next.name)}</span>
      <span class="cs-next__meta">${esc(next.industry)} · ${esc(next.location)}</span>
    </a>
  </main>

${footer}
</body>
</html>
`
}

projects.forEach((p, i) => {
  const dir = path.join('work', p.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), caseStudy(p, i))
})

console.log(`✓ ${projects.length} work cards + ${projects.length} case-study pages`)
