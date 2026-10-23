import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/doto/wght.css'
import './styles.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { initContact } from './contact.js'
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
if (!reduceMotion) {
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
  if (open) {
    lenis?.stop()
    gsap.fromTo(menu.querySelectorAll('a'), { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.5, ease: 'expo.out' })
  } else {
    lenis?.start()
  }
}
toggle?.addEventListener('click', () => setMenu(menu.hidden))
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu && !menu.hidden) {
    setMenu(false)
    toggle.focus()
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

  // Hero: the wall of live sites tilts toward you and flies past as you scroll
  const stage = document.querySelector('[data-stage]')
  if (stage) {
    gsap
      .timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      .to('[data-ring-tilt]', { '--tilt': '22deg', ease: 'none' }, 0)
      .to(stage, { scale: 1.35, yPercent: 10, opacity: 0, ease: 'power1.in' }, 0)
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
    .to(split.words, { color: '#171512', stagger: 0.1, ease: 'none' })
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
   Chapter 4: toolkit — accessible chips + lazy Three.js constellation
   --------------------------------------------------------- */
function setupToolkit() {
  const stage = document.querySelector('[data-toolkit]')
  if (!stage) return
  const { tools } = buildToolData()
  const chips = document.querySelector('[data-toolkit-chips]')
  const nameEl = document.querySelector('[data-toolkit-name]')
  const countEl = document.querySelector('[data-toolkit-count]')
  const listEl = document.querySelector('[data-toolkit-projects]')
  let scene = null
  let current = tools[0].name

  function show(tool) {
    current = tool.name
    nameEl.textContent = tool.name
    const real = tool.projects.filter((p) => p.slug)
    countEl.textContent = real.length
      ? `Used in ${real.length} client project${real.length > 1 ? 's' : ''}${real.length < tool.projects.length ? ' + this website' : ''}`
      : 'Used to build this website'
    listEl.replaceChildren(
      ...tool.projects.map((p) => {
        const li = document.createElement('li')
        if (p.slug) {
          const a = document.createElement('a')
          a.href = `/work/${p.slug}/`
          a.textContent = `${p.name} →`
          li.append(a)
        } else {
          li.textContent = p.name
        }
        return li
      }),
    )
    chips.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tool === tool.name)))
  }

  tools.forEach((tool) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.dataset.tool = tool.name
    b.textContent = tool.name
    b.addEventListener('click', () => {
      show(tool)
      scene?.select(tool.name)
    })
    chips.append(b)
  })
  show(tools[0])

  const canvas = stage.querySelector('[data-toolkit-canvas]')
  let webgl = false
  try {
    webgl = !!document.createElement('canvas').getContext('webgl2')
  } catch {
    webgl = false
  }
  if (!webgl) {
    stage.hidden = true
    return
  }
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      import('./toolkit.js').then(({ createToolkit }) => {
        scene = createToolkit(canvas, {
          reduceMotion,
          initial: current,
          onSelect: (tool) => show(tools.find((t) => t.name === tool.name) || tool),
        })
      })
    },
    { rootMargin: '800px 0px' },
  )
  io.observe(stage)
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
// Set up top-to-bottom so pinned sections are measured in page order
setupChapters()
setupToolkit()
if (reduceMotion) {
  document.querySelectorAll('.module, .problem__turn').forEach((el) => el.classList.add('is-drawn'))
  setupWork()
} else {
  setupParallax()
  setupProblem()
  setupProcess()
  setupWork()
  setupCaseStudy()
  whenIdle(setupReveals, 800)
}

const clock = document.querySelector('[data-clock]')
if (clock) {
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })
  const tick = () => (clock.textContent = fmt.format(new Date()))
  tick()
  setInterval(tick, 15000)
}
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()))

initContact()

window.addEventListener('load', () => ScrollTrigger.refresh())

/* ---------------------------------------------------------
   Analytics — loaded after the page is idle, never on localhost
   --------------------------------------------------------- */
const GTM_ID = 'GTM-N5WLVNMQ'
if (!/^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)) {
  window.addEventListener('load', () => {
    whenIdle(() => {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
      const s = document.createElement('script')
      s.async = true
      s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
      document.head.appendChild(s)
    }, 3000)
  })
}
