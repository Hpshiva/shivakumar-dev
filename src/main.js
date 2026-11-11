import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/doto/wght.css'
import './styles.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { initContact } from './contact.js'
import { initConsent } from './consent.js'
import { buildToolData } from './toolkit-data.js'

gsap.registerPlugin(ScrollTrigger, SplitText)

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const mm = gsap.matchMedia()
const DESKTOP = '(min-width: 861px)'
window.__motionReady = true

function whenIdle(fn, timeout) {
  if ('requestIdleCallback' in window) window.requestIdleCallback(fn, { timeout })
  else setTimeout(fn, timeout / 4)
}

/* ---------------------------------------------------------
   Smooth scroll
   --------------------------------------------------------- */
let lenis = null
function setupSmoothScroll() {
  if (reduceMotion) return
  lenis = new Lenis({ lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

/* ---------------------------------------------------------
   Navigation
   --------------------------------------------------------- */
const nav = document.querySelector('[data-nav]')
const menu = document.querySelector('[data-menu]')
const toggle = document.querySelector('[data-menu-toggle]')

function setMenu(open) {
  nav.classList.toggle('is-open', open)
  toggle.setAttribute('aria-expanded', String(open))
  toggle.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu'
  menu.hidden = !open
  // Keep keyboard and screen-reader focus inside the open menu
  for (const el of document.body.children) {
    if (el !== nav && !el.matches('script')) el.inert = open
  }
  if (open) {
    lenis?.stop()
    gsap.fromTo(menu.querySelectorAll('a'), { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.5, ease: 'expo.out' })
  } else {
    lenis?.start()
  }
}
toggle?.addEventListener('click', () => setMenu(menu.hidden))
document.addEventListener('keydown', (e) => {
  if (!menu || menu.hidden) return
  if (e.key === 'Escape') {
    setMenu(false)
    toggle.focus()
    return
  }
  // Wrap Tab / Shift+Tab inside the open menu (the toggle, the CTA and the menu links)
  if (e.key === 'Tab') {
    const items = [...nav.querySelectorAll('a[href], button:not([disabled])')].filter((el) => el.offsetParent !== null)
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
})

// In-page anchors: smooth scroll, keep shareable hashes, move focus for keyboard users
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]')
  if (!link) return
  const hash = link.getAttribute('href')
  const target = hash === '#top' ? document.getElementById('top') : document.querySelector(hash)
  if (!target) return
  e.preventDefault()
  if (menu && !menu.hidden) setMenu(false)
  if (lenis) lenis.scrollTo(target, { duration: 1.4 })
  else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
  history.replaceState(null, '', hash === '#top' ? window.location.pathname : hash)
  if (hash !== '#top') {
    target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
})

let lastY = window.scrollY
let ticking = false
window.addEventListener(
  'scroll',
  () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      const y = window.scrollY
      nav.classList.toggle('is-scrolled', y > 24)
      if (!menu || menu.hidden) nav.classList.toggle('is-hidden', y > lastY && y > 600)
      lastY = y
      ticking = false
    })
  },
  { passive: true },
)

/* ---------------------------------------------------------
   Story: chapter indicator + active nav link
   --------------------------------------------------------- */
function setupChapters() {
  const box = document.querySelector('[data-chapter-nav]')
  if (box) {
    const num = box.querySelector('[data-chapter-num]')
    const title = box.querySelector('[data-chapter-title]')
    const bar = box.querySelector('[data-chapter-progress]')
    document.querySelectorAll('[data-chapter]').forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: ({ isActive }) => {
          if (!isActive) return
          num.textContent = section.dataset.chapter
          title.textContent = section.dataset.chapterTitle
          box.classList.toggle('is-visible', section.dataset.chapter !== '00')
          box.classList.toggle('is-night', section.classList.contains('chapter--night'))
        },
        onUpdate: ({ progress, isActive }) => {
          if (isActive) gsap.set(bar, { scaleX: progress })
        },
      })
    })
  }

  // The pill steps aside at the end of the page so it never covers the footer text
  const pageEnd = document.querySelector('.footer__bottom')
  if (box && pageEnd) {
    new IntersectionObserver(([entry]) => box.classList.toggle('is-away', entry.isIntersecting), {
      rootMargin: '0px 0px 80px 0px',
    }).observe(pageEnd)
  }

  document.querySelectorAll('.nav__links a[href^="#"]').forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'))
    if (!section) return
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: ({ isActive }) => link.classList.toggle('is-active', isActive),
    })
  })
}

/* ---------------------------------------------------------
   Parallax: [data-parallax="-20"] moves an element up by 20% of the
   viewport height while its section scrolls past. Different values
   put layers at different depths.
   --------------------------------------------------------- */
function setupParallax() {
  mm.add({ isDesktop: DESKTOP, isMobile: '(max-width: 860px)' }, ({ conditions }) => {
    const factor = conditions.isDesktop ? 1 : 0.5
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const section = el.closest('section') || el.parentElement
      const isTop = section.classList.contains('hero') || section.classList.contains('cs-hero')
      gsap.fromTo(
        el,
        { y: 0 },
        {
          y: () => (parseFloat(el.dataset.parallax) * factor * window.innerHeight) / 100,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: isTop ? 'top top' : 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    })
  })

  // Hero: the showcase deck drifts forward and fades as you scroll past
  const stage = document.querySelector('[data-stage]')
  if (stage && window.matchMedia('(hover: hover)').matches) {
    gsap
      .timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      .to(stage, { scale: 1.1, yPercent: 8, opacity: 0, ease: 'power1.in' }, 0)
  }

  // Stats count up once
  gsap.from('[data-count]', {
    textContent: 0,
    delay: 0.9,
    duration: 1.6,
    ease: 'power2.out',
    snap: { textContent: 1 },
    stagger: 0.1,
  })
}

/* ---------------------------------------------------------
   Chapter 1: words ink in as you read (pinned)
   --------------------------------------------------------- */
function setupProblem() {
  const text = document.querySelector('[data-fill]')
  if (!text) return
  const split = SplitText.create(text, { type: 'words', wordsClass: 'word', aria: 'none' })
  const turn = document.querySelector('.problem__turn')
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '[data-problem]',
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: 0.6,
      },
    })
    .to(split.words, { color: '#f4f4f1', stagger: 0.1, ease: 'none' })
    .from('.problem__foot', { opacity: 0, y: 40, duration: 1.2, ease: 'power2.out' }, '-=0.4')
    .call(() => turn.classList.add('is-drawn'))
    .to({}, { duration: 0.6 })
}

/* ---------------------------------------------------------
   Chapter 2: sketchbook pages slide sideways (pinned on desktop)
   --------------------------------------------------------- */
function setupProcess() {
  const track = document.querySelector('[data-process-track]')
  if (!track) return
  const pages = track.querySelectorAll('.module')

  mm.add(DESKTOP, () => {
    const distance = () => track.scrollWidth - window.innerWidth
    const move = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '[data-process]',
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    })
    pages.forEach((page) => {
      ScrollTrigger.create({
        trigger: page,
        containerAnimation: move,
        start: 'left 85%',
        onEnter: () => page.classList.add('is-drawn'),
      })
    })
  })

  mm.add('(max-width: 860px)', () => {
    pages.forEach((page) =>
      ScrollTrigger.create({ trigger: page, start: 'top 75%', once: true, onEnter: () => page.classList.add('is-drawn') }),
    )
  })
}

/* ---------------------------------------------------------
   Chapter 3: the work — cards pin and pile up as you scroll
   --------------------------------------------------------- */
function setupWork() {
  const section = document.querySelector('[data-work]')
  if (!section || reduceMotion) return
  const cards = [...section.querySelectorAll('[data-card]')]
  cards.forEach((card, i) => {
    // The card beneath shrinks and dims as the next one slides over it
    const next = cards[i + 1]
    if (next) {
      gsap.to(card, {
        scale: 0.93,
        filter: 'brightness(0.55)',
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top 70%', end: 'top 20%', scrub: true },
      })
    }
    const img = card.querySelector('[data-shot]')
    if (img) {
      gsap.fromTo(img, { yPercent: -10 }, {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'top top', scrub: true },
      })
    }
  })
}

/* ---------------------------------------------------------
   Chapter 4: toolkit — a wall of tool names that fits on one screen. The
   active tool shows the client sites it shipped in (a fanned stack of
   screenshots). It cycles through the tools on its own until the visitor
   hovers, taps or focuses one.
   --------------------------------------------------------- */
function setupToolkit() {
  const root = document.querySelector('[data-stack]')
  if (!root) return
  const { tools, projects } = buildToolData()
  const clients = projects.filter((p) => p.slug)
  const list = root.querySelector('[data-stack-list]')
  const nameEl = root.querySelector('[data-stack-name]')
  const countEl = root.querySelector('[data-stack-count]')
  const bigEl = root.querySelector('[data-stack-big]')
  const fan = root.querySelector('[data-stack-fan]')
  const chips = root.querySelector('[data-stack-projects]')
  const pipsEl = root.querySelector('[data-stack-pips]')
  const meterEl = root.querySelector('[data-stack-meter]')
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const AUTO_MS = 3200
  const pad2 = (n) => String(n).padStart(2, '0')
  const make = (tag, className, text) => {
    const el = document.createElement(tag)
    if (className) el.className = className
    if (text) el.textContent = text
    return el
  }
  const shot = (p) => {
    const img = make('img')
    img.loading = 'lazy' // the section is far below the fold: fetch only when it is near
    const base = `/images/${p.image || p.slug}`
    img.src = `${base}-480.webp`
    img.srcset = `${base}-480.webp 480w, ${base}-960.webp 960w`
    img.sizes = '(min-width: 961px) 340px, 56vw'
    img.width = 480
    img.height = 300
    img.alt = ''
    img.decoding = 'async'
    return img
  }

  // One square per client project, lit for the ones built with the active tool
  const pips = clients.map(() => pipsEl.appendChild(make('i')))

  let active = null
  let auto = !reduceMotion
  let hovering = false
  let inView = false
  let timer = 0

  const rows = tools.map((tool) => {
    const real = tool.projects.filter((p) => p.slug)
    const li = make('li', 'stack__row')
    const btn = make('button', 'stack__btn')
    btn.type = 'button'
    btn.setAttribute('aria-pressed', 'false')
    btn.append(make('span', 'stack__tool', tool.name), make('sup', 'stack__sup', real.length ? String(real.length) : '·'))
    btn.setAttribute('aria-label', `${tool.name}, ${real.length ? `${real.length} client project${real.length > 1 ? 's' : ''}` : 'used to build this website'}`)
    li.append(btn)
    list.append(li)
    const row = { tool, real, li, btn }
    const choose = () => select(row, { user: true })
    btn.addEventListener('click', choose)
    btn.addEventListener('focus', choose)
    if (finePointer) btn.addEventListener('pointerenter', choose)
    return row
  })

  function schedule() {
    clearTimeout(timer)
    const run = auto && inView && !hovering && !document.hidden
    root.classList.remove('is-auto')
    if (!run) return
    void root.offsetWidth // restart the active name's timer underline
    root.classList.add('is-auto')
    timer = setTimeout(() => select(rows[(rows.indexOf(active) + 1) % rows.length]), AUTO_MS)
  }

  function select(row, { user = false } = {}) {
    if (user) auto = false
    if (row === active) {
      schedule()
      return
    }
    active?.li.classList.remove('is-active')
    active?.btn.setAttribute('aria-pressed', 'false')
    active = row
    row.li.classList.add('is-active')
    row.btn.setAttribute('aria-pressed', 'true')
    const { tool, real } = row
    const extra = real.length < tool.projects.length

    nameEl.textContent = tool.name
    bigEl.textContent = pad2(real.length || 1)
    countEl.textContent = real.length
      ? `${real.length} client project${real.length > 1 ? 's' : ''}${extra ? ' + this site' : ''}`
      : 'Built this site'
    clients.forEach((p, i) => pips[i].classList.toggle('on', tool.projects.includes(p)))
    meterEl.textContent = real.length ? `Used in ${real.length} of ${clients.length} client projects` : 'Used to build this website'

    // Fanned stack of up to three screenshots; every project is listed as a chip below
    const cards = real.slice(0, 3).map((p, k, all) => {
      const a = make('a', 'stack__card')
      a.href = `/work/${p.slug}/`
      a.setAttribute('aria-label', `${p.name} case study`)
      a.style.setProperty('--k', k - (all.length - 1) / 2)
      a.style.setProperty('--n', k)
      a.append(shot(p), make('span', '', p.name))
      return a
    })
    if (!cards.length) {
      const self = make('div', 'stack__card stack__card--self')
      self.style.setProperty('--k', 0)
      self.style.setProperty('--n', 0)
      self.append(make('b', '', 'This website'), make('span', '', 'You are looking at it.'))
      cards.push(self)
    }
    fan.replaceChildren(...cards)
    chips.replaceChildren(
      ...tool.projects.map((p) => {
        const li = make('li')
        if (p.slug) {
          const a = make('a', '', `${p.name} →`)
          a.href = `/work/${p.slug}/`
          li.append(a)
        } else {
          li.textContent = p.name
        }
        return li
      }),
    )
    schedule()
  }

  root.style.setProperty('--stack-auto', `${AUTO_MS}ms`)
  root.addEventListener('pointerenter', () => {
    hovering = true
    schedule()
  })
  root.addEventListener('pointerleave', () => {
    hovering = false
    schedule()
  })
  document.addEventListener('visibilitychange', schedule)
  new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting
      schedule()
    },
    { threshold: 0.35 },
  ).observe(root)

  select(rows[0])
}

/* ---------------------------------------------------------
   Case study: full-page screenshot scrolls inside a pinned browser
   --------------------------------------------------------- */
function setupCaseStudy() {
  document.querySelectorAll('[data-scrollthrough]').forEach((section) => {
    const img = section.querySelector('[data-scroll-img]')
    const view = section.querySelector('.cs-browser__view')
    const distance = () => Math.max(img.offsetHeight - view.clientHeight, 1)
    gsap.to(img, {
      y: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'center center',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    })
  })

  const cover = document.querySelector('.cs-cover [data-shot]')
  if (cover) {
    gsap.fromTo(cover, { yPercent: 0 }, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: { trigger: '.cs-cover', start: 'top bottom', end: 'bottom top', scrub: true },
    })
  }
}

/* ---------------------------------------------------------
   Reveals
   --------------------------------------------------------- */
function setupReveals() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
    })
  })

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', overwrite: true }),
  })

  gsap.from('.footer__word', {
    yPercent: 50,
    opacity: 0,
    duration: 1.6,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.footer', start: 'top 85%', once: true },
  })

  ScrollTrigger.sort()
  ScrollTrigger.refresh()
}

/* ---------------------------------------------------------
   Boot
   --------------------------------------------------------- */
// Startup is spread over several short tasks instead of one long one, so the page
// stays responsive on slow phones. It begins after the first paint: by then the
// browser has already laid the page out, so the first measurements are cheap.
// The order still runs top-to-bottom so pinned sections are measured in page order.
const nextTask = () =>
  new Promise((resolve) => (globalThis.scheduler?.yield ? globalThis.scheduler.yield().then(resolve) : setTimeout(resolve, 0)))

let booted = false
async function boot() {
  if (booted) return
  booted = true
  const steps = reduceMotion
    ? [
        setupChapters,
        setupToolkit,
        () => document.querySelectorAll('.module, .problem__turn').forEach((el) => el.classList.add('is-drawn')),
        setupWork,
      ]
    : [setupSmoothScroll, setupChapters, setupToolkit, setupParallax, setupProblem, setupProcess, setupWork, setupCaseStudy]
  for (const step of steps) {
    step()
    await nextTask()
  }
  alignToHash()
  if (!reduceMotion)
    whenIdle(() => {
      setupReveals()
      alignToHash()
    }, 800)
  // The creative layer (hero dot field, cursor tag, tilting screenshots) loads last, as its own chunk
  whenIdle(() => import('./fx.js').then((fx) => fx.initFx({ reduceMotion })), 1600)
}

// Pinned sections change the page height after the browser's own jump to a
// #section link, so line the linked section up again once they exist. Skipped
// as soon as the visitor scrolls on their own.
let userScrolled = false
;['wheel', 'touchstart', 'keydown'].forEach((type) =>
  window.addEventListener(type, () => (userScrolled = true), { once: true, passive: true }),
)
function alignToHash() {
  const linked = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)))
  if (!linked || userScrolled) return
  ScrollTrigger.refresh()
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(linked, { immediate: true, force: true })
  } else {
    linked.scrollIntoView()
  }
}
requestAnimationFrame(() => setTimeout(boot, 0))
// Background tabs don't run animation frames: make sure the page still sets up
setTimeout(boot, 1200)

const clocks = document.querySelectorAll('[data-clock]')
if (clocks.length) {
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })
  const tick = () => clocks.forEach((clock) => (clock.textContent = fmt.format(new Date())))
  tick()
  setInterval(tick, 15000)
}
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()))

initContact()

// Auto-scrolling client ticker: a visible control to pause it (WCAG 2.2.2)
const tickerPause = document.querySelector('[data-ticker-pause]')
tickerPause?.addEventListener('click', () => {
  const paused = tickerPause.getAttribute('aria-pressed') !== 'true'
  tickerPause.setAttribute('aria-pressed', String(paused))
  tickerPause.textContent = paused ? 'Play' : 'Pause'
  tickerPause.closest('.ticker').classList.toggle('is-paused', paused)
})

window.addEventListener('load', () => ScrollTrigger.refresh())

// Analytics only loads after the visitor accepts cookies
initConsent()

/* ---------------------------------------------------------
   Hero showcase deck: one site in focus, the rest fanned out behind it.
   Steps on its own every few seconds; arrows, pips, drag/swipe, keyboard
   focus or a click on a side screen bring another site forward. Any of
   those also stops the automatic stepping. A click on the front screen
   opens its case study.
   --------------------------------------------------------- */
const deck = document.querySelector('[data-deck]')
if (deck) {
  const stageEl = deck.closest('[data-stage]')
  const screens = [...deck.querySelectorAll('[data-screen]')]
  const pips = [...stageEl.querySelectorAll('[data-deck-pip]')]
  const indexEl = stageEl.querySelector('[data-deck-index]')
  const nameEl = stageEl.querySelector('[data-deck-name]')
  const count = screens.length
  const half = Math.floor(count / 2)
  const AUTO_MS = 4200
  let active = 0
  let timer = 0
  let auto = !reduceMotion
  let hovering = false
  let inView = true

  const offsetOf = (i, from) => {
    let o = i - from
    if (o > half) o -= count
    if (o < -half) o += count
    return o
  }

  function schedule() {
    clearTimeout(timer)
    const run = auto && !hovering && inView && !document.hidden && !stageEl.matches(':focus-within')
    // Toggling the class restarts the pip's timer fill from zero
    stageEl.classList.remove('is-auto')
    if (!run) return
    void stageEl.offsetWidth
    stageEl.classList.add('is-auto')
    timer = setTimeout(() => go(active + 1), AUTO_MS)
  }

  function go(to, { user = false } = {}) {
    to = ((to % count) + count) % count
    if (user) auto = false
    screens.forEach((screen, i) => {
      const before = Number(screen.style.getPropertyValue('--o'))
      const o = offsetOf(i, to)
      // A screen that swaps sides round the back must not sweep across the front
      const wraps = Math.abs(o - before) > half
      if (wraps) screen.classList.add('no-anim')
      screen.style.setProperty('--o', o)
      screen.style.setProperty('--a', Math.abs(o))
      screen.toggleAttribute('data-far', Math.abs(o) >= 3)
      screen.classList.toggle('is-active', o === 0)
      if (wraps) {
        void screen.offsetWidth
        screen.classList.remove('no-anim')
      }
    })
    active = to
    pips.forEach((pip, i) => {
      pip.classList.toggle('is-active', i === to)
      if (i === to) pip.setAttribute('aria-current', 'true')
      else pip.removeAttribute('aria-current')
    })
    indexEl.textContent = String(to + 1).padStart(2, '0')
    nameEl.textContent = screens[to].dataset.name
    schedule()
  }

  stageEl.style.setProperty('--deck-auto', `${AUTO_MS}ms`)
  stageEl.querySelector('[data-deck-prev]').addEventListener('click', () => go(active - 1, { user: true }))
  stageEl.querySelector('[data-deck-next]').addEventListener('click', () => go(active + 1, { user: true }))
  pips.forEach((pip, i) => pip.addEventListener('click', () => go(i, { user: true })))

  // Drag or swipe sideways: every 70px steps one site
  let startX = null
  let dragged = false
  let activeAtDown = 0
  deck.addEventListener('pointerdown', (e) => {
    startX = e.clientX
    dragged = false
    activeAtDown = active
  })
  window.addEventListener('pointermove', (e) => {
    if (startX === null) return
    const dx = e.clientX - startX
    if (Math.abs(dx) < 70) return
    dragged = true
    startX = e.clientX
    go(active + (dx < 0 ? 1 : -1), { user: true })
  })
  const endDrag = () => (startX = null)
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)

  screens.forEach((screen, i) => {
    // Keyboard focus brings that screen to the front
    screen.addEventListener('focus', () => {
      if (i !== active) go(i, { user: true })
    })
    screen.addEventListener('click', (e) => {
      // Only the screen that was already in front opens its case study
      if (dragged || i !== activeAtDown) e.preventDefault()
      if (!dragged && i !== activeAtDown && i !== active) go(i, { user: true })
    })
  })

  if (window.matchMedia('(hover: hover)').matches) {
    stageEl.addEventListener('pointerenter', () => {
      hovering = true
      schedule()
    })
    stageEl.addEventListener('pointerleave', () => {
      hovering = false
      schedule()
    })
  }
  stageEl.addEventListener('focusin', schedule)
  stageEl.addEventListener('focusout', () => setTimeout(schedule, 0))
  document.addEventListener('visibilitychange', schedule)
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    schedule()
  }).observe(stageEl)

  schedule()
}

/* ---------------------------------------------------------
   Work cards: hover the screenshot to scroll through the whole homepage
   --------------------------------------------------------- */
if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.shot[data-full]').forEach((shot) => {
    const media = shot.querySelector('.shot__media')
    const fullH = Number(shot.dataset.fullH)
    let layer = null
    let timer = 0

    const build = () => {
      layer = document.createElement('span')
      layer.className = 'shot__full'
      layer.innerHTML = `<picture><source type="image/avif" srcset="${shot.dataset.full}.avif" /><img src="${shot.dataset.full}.webp" alt="" decoding="async" /></picture>`
      media.append(layer)
      const bar = document.createElement('span')
      bar.className = 'shot__progress'
      media.append(bar)
      const img = layer.querySelector('img')
      const ready = () => {
        layer.classList.add('is-ready')
        if (shot.classList.contains('is-previewing')) play()
      }
      if (img.complete) ready()
      else img.addEventListener('load', ready, { once: true })
    }

    const play = () => {
      if (!layer?.classList.contains('is-ready')) return
      const dist = Math.max(0, (media.clientWidth * fullH) / 1200 - media.clientHeight)
      const secs = Math.min(14, Math.max(4, dist / 320))
      media.style.setProperty('--scroll-dur', `${secs}s`)
      layer.style.transform = `translateY(${-dist}px)`
      shot.classList.add('is-playing')
    }

    shot.addEventListener('pointerenter', () => {
      // A short pause, so cards don't start scrolling as the cursor passes over them
      timer = setTimeout(() => {
        shot.classList.add('is-previewing')
        if (!layer) build()
        else play()
      }, 180)
    })
    shot.addEventListener('pointerleave', () => {
      clearTimeout(timer)
      shot.classList.remove('is-previewing', 'is-playing')
      if (layer) layer.style.transform = ''
    })
  })
}

/* ---------------------------------------------------------
   Page transitions: the screenshot you clicked grows into the case study cover.
   The arriving side is handled by an inline script in <head> (pagereveal).
   --------------------------------------------------------- */
let lastLink = null
document.addEventListener('click', (e) => (lastLink = e.target.closest('a')), true)
window.addEventListener('pageswap', (e) => {
  if (!e.viewTransition) return
  const to = new URL(e.activation?.entry?.url || location.href)
  const inView = (el) => {
    const r = el?.getBoundingClientRect()
    return r && r.bottom > 0 && r.top < innerHeight
  }
  let el = null
  if (/^\/work\/[a-z0-9-]+\/?$/.test(to.pathname)) {
    el = lastLink?.closest('[data-card]')?.querySelector('.shot') || (lastLink?.matches('.screen') ? lastLink : null)
  } else if (to.pathname === '/') {
    el = document.querySelector('[data-cover-shot]')
  }
  if (inView(el)) el.style.viewTransitionName = 'case-shot'
})

/* ---------------------------------------------------------
   Mobile: a small "Start a project / WhatsApp" bar after the hero,
   hidden while the contact form or footer is on screen
   --------------------------------------------------------- */
const mcta = document.querySelector('[data-mcta]')
if (mcta) {
  const seen = new Map()
  const hero = document.querySelector('.hero, .cs-hero')
  const blockers = [hero, document.querySelector('#contact'), document.querySelector('.footer')].filter(Boolean)
  const update = () => {
    const show = [...seen.values()].every((v) => !v)
    mcta.classList.toggle('is-shown', show)
    document.documentElement.classList.toggle('mcta-on', show)
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => seen.set(en.target, en.isIntersecting))
    update()
  })
  blockers.forEach((el) => {
    seen.set(el, true)
    io.observe(el)
  })
}

/* ---------------------------------------------------------
   Pointer polish (mouse only): a glow that follows the cursor across
   cards and panels, buttons that lean toward it, and a light that
   sweeps the giant footer name.
   --------------------------------------------------------- */
if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const GLOW = '.module, .plan, .note-stat, .now, .direct, .form, .problem__stat, .cs-features li, .cs-results li, [data-card]'
  document.querySelectorAll(GLOW).forEach((el) => {
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
    el.classList.add('has-glow')
    const glow = document.createElement('span')
    glow.className = 'glow'
    glow.setAttribute('aria-hidden', 'true')
    el.append(glow)
  })

  const word = document.querySelector('.footer__word')
  let frame = 0
  let last = null
  document.addEventListener(
    'pointermove',
    (e) => {
      last = e
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const host = last.target.closest?.('.has-glow')
        if (host) {
          const r = host.getBoundingClientRect()
          host.style.setProperty('--gx', `${last.clientX - r.left}px`)
          host.style.setProperty('--gy', `${last.clientY - r.top}px`)
        }
        if (word) {
          const r = word.getBoundingClientRect()
          if (r.top < innerHeight && r.bottom > 0) {
            word.style.setProperty('--fx', `${last.clientX - r.left}px`)
            word.style.setProperty('--fy', `${last.clientY - r.top}px`)
          }
        }
      })
    },
    { passive: true },
  )

  // Magnetic buttons: the pill leans a few pixels toward the cursor
  document.querySelectorAll('.btn:not(.btn--block)').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height
      btn.style.translate = `${(dx * 14).toFixed(1)}px ${(dy * 10).toFixed(1)}px`
    })
    btn.addEventListener('pointerleave', () => (btn.style.translate = ''))
  })
}
