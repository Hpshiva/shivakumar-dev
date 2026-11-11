// Builds the homepage work cards and every /work/<slug>/ case-study page
// from src/data/projects.js. Runs automatically before `dev` and `build`.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { projects } from '../src/data/projects.js'
import { homeJsonLd, caseJsonLd, writeSeoFiles } from './seo.mjs'
import { UPDATED, PRIVACY_INTRO, PRIVACY_SECTIONS } from './privacy.mjs'

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

// Height of each full-page capture (1200px wide), for the scroll-through previews
const fullHeights = {}
for (const p of projects) {
  const file = path.join('public', `images/cases/${p.slug}-full-1200.webp`)
  if (fs.existsSync(file)) fullHeights[p.slug] = (await sharp(file).metadata()).height
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
              <a class="shot" href="/work/${p.slug}/" tabindex="-1" aria-hidden="true" data-slug="${p.slug}"${fullHeights[p.slug] ? ` data-full="/images/cases/${p.slug}-full-1200" data-full-h="${fullHeights[p.slug]}"` : ''}>
                <span class="shot__bar"><i></i><i></i><i></i><span>${esc(p.shotDomain || p.domain)}</span></span>
                <span class="shot__media">
              ${picture(p.image || p.slug, [480, 960, 1440, 1920], '(min-width: 1360px) 700px, (min-width: 860px) 52vw, 90vw', `${p.name} homepage`, { attrs: ' width="1440" height="900" data-shot' })}
                </span>
              </a>
            </article>`
}

/* ---------------------------------------------------------
   Hero showcase deck: one slide per project. Offsets are written inline so the
   deck is already laid out on first paint, before any script runs.
   --------------------------------------------------------- */
function slide(p, i) {
  const half = Math.floor(projects.length / 2)
  const o = i <= half ? i : i - projects.length
  const far = Math.abs(o) >= 3
  return `          <a class="screen${o === 0 ? ' is-active' : ''}" href="/work/${p.slug}/" data-screen="${i}" data-name="${esc(p.name)}" draggable="false" style="--o:${o};--a:${Math.abs(o)}"${far ? ' data-far' : ''} aria-label="${esc(p.shotDomain || p.domain)}: ${esc(p.name)} case study">
            <span class="screen__bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(p.shotDomain || p.domain)}</span></span>
            <span class="screen__media">
              ${picture(p.image || p.slug, [480, 960, 1440, 1920], '(min-width: 860px) 44vw, 78vw', '', { lazy: i !== 0, attrs: ` width="1440" height="900" draggable="false"${i !== 0 ? ' fetchpriority="low"' : ''}` })}
            </span>
          </a>`
}
const pip = (p, i) =>
  `            <button type="button" class="deck__pip${i === 0 ? ' is-active' : ''}" data-deck-pip="${i}" aria-label="Show ${esc(p.name)}"${i === 0 ? ' aria-current="true"' : ''}></button>`

const indexPath = 'index.html'
const indexHtml = fs.readFileSync(indexPath, 'utf8')
const cards = projects.map(card).join('\n')
let updated = indexHtml.replace(
  /(<!-- work:start -->)[\s\S]*?(\s*<!-- work:end -->)/,
  (_, start) => `${start}\n${cards}\n            <!-- work:end -->`,
)
updated = updated
  .replace(/(<!-- deck:start -->)[\s\S]*?\s*(<!-- deck:end -->)/, (_, start, end) => `${start}\n${projects.map(slide).join('\n')}\n          ${end}`)
  .replace(/(<!-- pips:start -->)[\s\S]*?\s*(<!-- pips:end -->)/, (_, start, end) => `${start}\n${projects.map(pip).join('\n')}\n            ${end}`)
  .replace(/(<span data-deck-total>)\d+(<\/span>)/, (_, a, b) => `${a}${pad(projects.length)}${b}`)
  .replace(/(data-deck-name>)[^<]*(<\/span>)/, (_, a, b) => `${a}${esc(projects[0].name)}${b}`)
// Structured data + AI/search files, generated from the same sources
// Replacer function, not a string: JSON text like "$25" must never be read as $2
const ld = JSON.stringify(homeJsonLd(updated), null, 2).replace(/\n/g, '\n  ').replace(/</g, '\\u003c')
updated = updated.replace(
  /<!-- ld:start -->[\s\S]*?<!-- ld:end -->/,
  () => `<!-- ld:start -->\n  <script type="application/ld+json">\n  ${ld}\n  </script>\n  <!-- ld:end -->`,
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
        <a href="/#work">Work</a>
        <a href="/#process">Process</a>
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
        <a href="/#work"><small>01</small> The work</a>
        <a href="/#process"><small>03</small> How I work</a>
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
          <a href="/privacy/">Privacy</a>
          <button type="button" class="footer__cookie" data-cookie-settings>Cookie settings</button>
          <a href="https://github.com/Hpshiva" target="_blank" rel="noopener">GitHub ↗<span class="sr-only"> (opens in a new tab)</span></a>
          <a href="https://wa.me/916283937782" target="_blank" rel="noopener">WhatsApp ↗<span class="sr-only"> (opens in a new tab)</span></a>
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
  return `      <section class="cs-section" data-reveal data-chapter="${pad(num)}" data-chapter-title="${kicker}">
        <h2><small>${pad(num)} — ${kicker}</small>${title}</h2>
        ${body}
      </section>`
}

function caseStudy(p, i) {
  const next = projects[(i + 1) % projects.length]
  const prev = projects[(i - 1 + projects.length) % projects.length]
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
        <div class="shot__bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(p.domain)}</span><b class="cs-browser__pct" data-scroll-pct>000%</b></div>
        <div class="cs-browser__view">
          <span class="cs-browser__track" aria-hidden="true"><i></i></span>
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
            <a class="btn btn--light" href="${p.url}" target="_blank" rel="noopener"><span>Visit ${esc(p.domain)}</span><span class="sr-only"> (opens in a new tab)</span><span class="btn__chip" aria-hidden="true">↗</span></a>
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
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <script type="application/ld+json">
  ${JSON.stringify(caseJsonLd(p, og))}
  </script>
  <script>
    document.documentElement.classList.add('js');
    // Page transitions, arriving side: name the screenshot that should morph in
    addEventListener('pagereveal', function (e) {
      if (!e.viewTransition) return;
      document.documentElement.classList.add('vt-in');
      var from = (window.navigation && navigation.activation && navigation.activation.from && navigation.activation.from.url) || '';
      var slug = (from.match(/\\/work\\/([a-z0-9-]+)\\/?$/) || [])[1];
      var el = /^\\/work\\//.test(location.pathname)
        ? document.querySelector('[data-cover-shot]')
        : slug && document.querySelector('.shot[data-slug="' + slug + '"]');
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= innerHeight) return;
      el.style.viewTransitionName = 'case-shot';
      var clear = function () { el.style.viewTransitionName = ''; };
      e.viewTransition.finished.then(clear, clear);
    });
    setTimeout(function () { if (!window.__motionReady) document.documentElement.classList.add('no-motion'); }, 3000);
  </script>
  <script type="module" src="/src/main.js"></script>
</head>

<body>
  <a class="skip-link" href="#main">Skip to content</a>

${nav}

  <div class="read-progress" aria-hidden="true"></div>
  <aside class="chapter-nav" aria-hidden="true" data-chapter-nav>
    <span class="chapter-nav__num">CH <span data-chapter-num>00</span></span>
    <span class="chapter-nav__bar"><span data-chapter-progress></span></span>
    <span class="chapter-nav__title" data-chapter-title>Hello</span>
  </aside>

  <main id="main">
    <section class="cs-hero container" data-chapter="00" data-chapter-title="Intro" aria-labelledby="cs-title">
      <div class="cs-top">
        <a class="cs-back" href="/#work">← All work</a>
        <nav class="cs-pager" aria-label="Other case studies">
          <a href="/work/${prev.slug}/" aria-label="Previous case study: ${esc(prev.name)}"><span aria-hidden="true">←</span></a>
          <span class="hud" aria-hidden="true"><b>${pad(i + 1)}</b> / ${pad(projects.length)}</span>
          <a href="/work/${next.slug}/" aria-label="Next case study: ${esc(next.name)}"><span aria-hidden="true">→</span></a>
        </nav>
      </div>
      <p class="chapter__label hud hero-in"><span class="hud__bracket">[</span> Case study ${pad(i + 1)} / ${pad(projects.length)} <span class="hud__bracket">]</span> ${esc(p.industry)}</p>
      <h1 class="cs-title" id="cs-title"><span class="line"><span class="line__inner">${esc(p.name)}</span></span></h1>
      <p class="cs-intro hero-in hero-in--soft" style="--d:.3s">${esc(p.intro)}</p>
      <dl class="cs-meta hero-in" style="--d:.45s">
        <div><dt>Client</dt><dd>${esc(p.name)}</dd></div>
        <div><dt>Industry</dt><dd>${esc(p.industry)}</dd></div>
        <div><dt>Location</dt><dd>${esc(p.location)}</dd></div>
        <div><dt>My role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Stack</dt><dd>${esc(p.stack.join(', '))}</dd></div>
        <div><dt>Live site</dt><dd><a href="${p.url}" target="_blank" rel="noopener">${esc(p.domain)} ↗<span class="sr-only"> (opens in a new tab)</span></a></dd></div>
      </dl>
    </section>

    <section class="cs-cover container hero-in" style="--d:.6s" aria-label="Homepage">
      <div class="shot" data-cover-shot>
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
      <span class="cs-next__peek" aria-hidden="true">
        <span class="shot cs-next__shot" data-next-shot>
          <span class="shot__bar"><i></i><i></i><i></i><span>${esc(next.shotDomain || next.domain)}</span></span>
          <span class="shot__media">
            ${picture(next.image || next.slug, [480, 960, 1440], '(min-width: 1200px) 1040px, 88vw', '', { attrs: ' width="1440" height="900"' })}
          </span>
        </span>
      </span>
    </a>
  </main>

  <div class="mcta" data-mcta>
    <a class="btn btn--light mcta__main" href="/#contact"><span>Start a project</span><span class="btn__chip" aria-hidden="true">↗</span></a>
    <a class="mcta__wa" href="https://wa.me/916283937782" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg><span class="sr-only">Chat on WhatsApp (opens in a new tab)</span></a>
  </div>
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

// Privacy page, sharing the nav and footer of the other inner pages
const privacyTitle = 'Privacy policy — Shiva Kumar'
const privacyDesc = 'What personal information Shiva Kumar collects through this website and business outreach, why, who processes it, and your choices.'
fs.mkdirSync('privacy', { recursive: true })
fs.writeFileSync(
  path.join('privacy', 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#070708" />
  <meta name="color-scheme" content="dark" />
  <title>${privacyTitle}</title>
  <meta name="description" content="${privacyDesc}" />
  <link rel="canonical" href="https://shivakumar-dev.vercel.app/privacy/" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://shivakumar-dev.vercel.app/privacy/" />
  <meta property="og:site_name" content="Shiva Kumar" />
  <meta property="og:title" content="${privacyTitle}" />
  <meta property="og:description" content="${privacyDesc}" />
  <meta property="og:image" content="https://shivakumar-dev.vercel.app/images/og-image.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <script>
    document.documentElement.classList.add('js');
    // Page transitions, arriving side: name the screenshot that should morph in
    addEventListener('pagereveal', function (e) {
      if (!e.viewTransition) return;
      document.documentElement.classList.add('vt-in');
      var from = (window.navigation && navigation.activation && navigation.activation.from && navigation.activation.from.url) || '';
      var slug = (from.match(/\\/work\\/([a-z0-9-]+)\\/?$/) || [])[1];
      var el = /^\\/work\\//.test(location.pathname)
        ? document.querySelector('[data-cover-shot]')
        : slug && document.querySelector('.shot[data-slug="' + slug + '"]');
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= innerHeight) return;
      el.style.viewTransitionName = 'case-shot';
      var clear = function () { el.style.viewTransitionName = ''; };
      e.viewTransition.finished.then(clear, clear);
    });
    setTimeout(function () { if (!window.__motionReady) document.documentElement.classList.add('no-motion'); }, 3000);
  </script>
  <script type="module" src="/src/main.js"></script>
</head>

<body>
  <a class="skip-link" href="#main">Skip to content</a>

${nav}

  <main id="main">
    <article class="legal container">
      <header class="legal__head">
        <p class="chapter__label hud"><span class="hud__bracket">[</span> Legal <span class="hud__bracket">]</span> Last updated ${UPDATED}</p>
        <h1 class="legal__title">Privacy policy</h1>
        <p class="legal__intro">${PRIVACY_INTRO}</p>
      </header>
${PRIVACY_SECTIONS.map(
  (sec, i) => `      <section class="legal__section">
        <h2><small>${pad(i + 1)}</small>${sec.title}</h2>
        <div class="legal__body">${sec.body}</div>
      </section>`,
).join('\n')}
    </article>
  </main>

${footer}
</body>
</html>
`,
)

// Branded 404 (Vercel serves dist/404.html with a 404 status for unknown URLs)
fs.writeFileSync(
  '404.html',
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#070708" />
  <meta name="color-scheme" content="dark" />
  <meta name="robots" content="noindex" />
  <title>Page not found — Shiva Kumar</title>
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <script>
    document.documentElement.classList.add('js');
    // Page transitions, arriving side: name the screenshot that should morph in
    addEventListener('pagereveal', function (e) {
      if (!e.viewTransition) return;
      document.documentElement.classList.add('vt-in');
      var from = (window.navigation && navigation.activation && navigation.activation.from && navigation.activation.from.url) || '';
      var slug = (from.match(/\\/work\\/([a-z0-9-]+)\\/?$/) || [])[1];
      var el = /^\\/work\\//.test(location.pathname)
        ? document.querySelector('[data-cover-shot]')
        : slug && document.querySelector('.shot[data-slug="' + slug + '"]');
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= innerHeight) return;
      el.style.viewTransitionName = 'case-shot';
      var clear = function () { el.style.viewTransitionName = ''; };
      e.viewTransition.finished.then(clear, clear);
    });
    setTimeout(function () { if (!window.__motionReady) document.documentElement.classList.add('no-motion'); }, 3000);
  </script>
  <script type="module" src="/src/main.js"></script>
</head>

<body>
  <a class="skip-link" href="#main">Skip to content</a>

${nav}

  <main id="main">
    <section class="notfound container" aria-labelledby="nf-title">
      <p class="chapter__label hud"><span class="hud__bracket">[</span> 404 <span class="hud__bracket">]</span> Page not found</p>
      <h1 class="notfound__title" id="nf-title">This page took a <em>wrong turn.</em></h1>
      <p class="notfound__text">The link may be old or mistyped. Everything I’ve built is still one click away.</p>
      <div class="hero__ctas">
        <a class="btn btn--light" href="/#work"><span>See the work</span><span class="btn__chip" aria-hidden="true">↗</span></a>
        <a class="btn btn--line" href="/#contact"><span>Start a project</span></a>
      </div>
      <ul class="notfound__links" aria-label="Case studies">
${projects.map((p) => `        <li><a href="/work/${p.slug}/">${esc(p.name)}</a></li>`).join('\n')}
      </ul>
    </section>
  </main>

${footer}
</body>
</html>
`,
)

console.log(`✓ ${projects.length} work cards + ${projects.length} case-study pages`)
