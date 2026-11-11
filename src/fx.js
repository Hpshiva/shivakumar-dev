// Creative layer, loaded after the page is up and running (its own small chunk):
// a living dot-matrix field behind the hero, labels that decode as they appear,
// a cursor tag over clickable work, tilting screenshots and a ticker that leans
// with the scroll. None of it is needed to read or use the site.

const FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches

/* ---------------------------------------------------------
   Hero: dot-matrix field. Dots sit on the hero's grid lines, breathe in a slow
   wave, light up orange around the cursor, and ripple out from a click or tap.
   --------------------------------------------------------- */
function heroDots(reduceMotion) {
  const hero = document.querySelector('.hero')
  if (!hero) return
  const canvas = document.createElement('canvas')
  canvas.className = 'hero__dots'
  canvas.setAttribute('aria-hidden', 'true')
  hero.prepend(canvas)
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const GAP = 30 // a quarter of the 120px grid lines, so dots land on them
  const RADIUS = 190
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 }
  const ripples = []
  let w = 0
  let h = 0
  let offX = 0
  let visible = false
  let raf = 0
  let lastFrame = 0

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, FINE ? 2 : 1.5)
    w = hero.clientWidth
    h = hero.clientHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    offX = (w / 2) % GAP
    if (reduceMotion || !visible) draw(0)
  }

  function draw(now) {
    const t = now / 1000
    ctx.clearRect(0, 0, w, h)
    mouse.x += (mouse.tx - mouse.x) * 0.14
    mouse.y += (mouse.ty - mouse.y) * 0.14
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i]
      r.age = (now - r.start) / 1100
      if (r.age >= 1) ripples.splice(i, 1)
    }

    const hot = []
    ctx.fillStyle = 'rgb(244, 244, 241)'
    for (let y = 0; y <= h; y += GAP) {
      for (let x = offX; x <= w; x += GAP) {
        const wave = Math.sin(x * 0.011 + t * 0.8) * Math.cos(y * 0.015 - t * 0.55)
        let k = 0
        const dx = x - mouse.x
        const dy = y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < RADIUS * RADIUS) k = 1 - Math.sqrt(d2) / RADIUS
        for (const r of ripples) {
          const dist = Math.hypot(x - r.x, y - r.y)
          const band = 1 - Math.abs(dist - r.age * 520) / 46
          if (band > 0) k = Math.max(k, band * (1 - r.age))
        }
        if (k > 0.03) {
          hot.push(x, y, k)
        } else {
          ctx.globalAlpha = 0.12 + 0.075 * wave
          ctx.fillRect(x - 1, y - 1, 2, 2)
        }
      }
    }
    ctx.fillStyle = 'rgb(255, 90, 31)'
    for (let i = 0; i < hot.length; i += 3) {
      const k = hot[i + 2]
      const s = 2 + 3.4 * k * k
      ctx.globalAlpha = 0.2 + 0.8 * k
      ctx.fillRect(hot[i] - s / 2, hot[i + 1] - s / 2, s, s)
    }
    ctx.globalAlpha = 1
  }

  const frame = (now) => {
    raf = 0
    if (!visible || document.hidden) return
    // Phones get a calmer 30fps; the wave is slow enough that it reads the same
    if (FINE || now - lastFrame > 32) {
      lastFrame = now
      draw(now)
    }
    raf = requestAnimationFrame(frame)
  }
  const start = () => {
    if (!raf && visible && !reduceMotion) raf = requestAnimationFrame(frame)
  }

  new ResizeObserver(resize).observe(hero)
  resize()
  if (reduceMotion) return

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    start()
  }).observe(hero)
  document.addEventListener('visibilitychange', start)

  const point = (e) => {
    const r = hero.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  if (FINE) {
    hero.addEventListener(
      'pointermove',
      (e) => {
        const p = point(e)
        if (mouse.tx < -9000) Object.assign(mouse, { x: p.x, y: p.y })
        mouse.tx = p.x
        mouse.ty = p.y
      },
      { passive: true },
    )
    hero.addEventListener('pointerleave', () => Object.assign(mouse, { tx: -9999, ty: -9999, x: -9999, y: -9999 }))
  }
  hero.addEventListener(
    'pointerdown',
    (e) => {
      if (ripples.length < 4) ripples.push({ ...point(e), start: performance.now(), age: 0 })
    },
    { passive: true },
  )
}

/* ---------------------------------------------------------
   Chapter labels decode from dot-matrix noise as they scroll into view
   --------------------------------------------------------- */
function decodeLabels() {
  const NOISE = '01#/<>[]_=+*'
  const run = (el) => {
    const nodes = []
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const node = walker.currentNode
      if (node.nodeValue.trim()) nodes.push({ node, text: node.nodeValue })
    }
    const total = nodes.reduce((n, item) => n + item.text.length, 0)
    const began = performance.now()
    let tick = 0
    const step = (now) => {
      const progress = Math.min(1, (now - began) / 750)
      // Change the noise every third frame: it should tick, not shimmer
      if (tick++ % 3 === 0 || progress === 1) {
        let index = 0
        for (const { node, text } of nodes) {
          let out = ''
          for (const ch of text) {
            out += ch === ' ' || ch === '\n' || index / total < progress ? ch : NOISE[(Math.random() * NOISE.length) | 0]
            index++
          }
          node.nodeValue = out
        }
      }
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        io.unobserve(entry.target)
        run(entry.target)
      }),
    { threshold: 0.6 },
  )
  // Labels already on screen at load stay as they are
  document.querySelectorAll('.chapter__label').forEach((el) => {
    if (el.getBoundingClientRect().top > window.innerHeight) io.observe(el)
  })
}

/* ---------------------------------------------------------
   Cursor tag: a small label trails the cursor over things worth opening
   --------------------------------------------------------- */
function cursorTag() {
  const TARGETS = [
    ['[data-card] .shot', 'View case ↗'],
    ['.screen', 'View case ↗'],
    ['.cs-next', 'Next case →'],
    ['[data-toolkit-canvas]', 'Drag to spin'],
  ]
  const tag = document.createElement('div')
  tag.className = 'cursor-tag'
  tag.setAttribute('aria-hidden', 'true')
  document.body.append(tag)

  let x = 0
  let y = 0
  let tx = 0
  let ty = 0
  let active = false
  let raf = 0
  let frames = 0
  const labelFor = (el) => TARGETS.find(([selector]) => el?.closest?.(selector))?.[1]
  const set = (label) => {
    if (label) {
      if (tag.textContent !== label) tag.textContent = label
      if (!active) {
        active = true
        x = tx
        y = ty
        tag.classList.add('is-on')
      }
      if (!raf) raf = requestAnimationFrame(loop)
    } else if (active) {
      active = false
      tag.classList.remove('is-on')
    }
  }
  function loop() {
    raf = 0
    x += (tx - x) * 0.22
    y += (ty - y) * 0.22
    tag.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
    // The page can scroll under a still cursor: re-check what's beneath it now and then
    if (active && ++frames % 8 === 0) set(labelFor(document.elementFromPoint(tx, ty)))
    if (active || Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) raf = requestAnimationFrame(loop)
  }
  document.addEventListener(
    'pointermove',
    (e) => {
      tx = e.clientX
      ty = e.clientY
      set(labelFor(e.target))
    },
    { passive: true },
  )
  document.addEventListener('pointerleave', () => set(null))
}

/* ---------------------------------------------------------
   Work screenshots tilt a few degrees toward the cursor
   --------------------------------------------------------- */
function tiltShots() {
  document.querySelectorAll('[data-card] .shot').forEach((shot) => {
    shot.addEventListener('pointermove', (e) => {
      const r = shot.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      shot.style.transform = `perspective(1200px) rotateY(${(px * 5).toFixed(2)}deg) rotateX(${(-py * 4).toFixed(2)}deg)`
    })
    shot.addEventListener('pointerleave', () => (shot.style.transform = ''))
  })
}

/* ---------------------------------------------------------
   The brand ticker leans into the direction and speed of the scroll
   --------------------------------------------------------- */
function leanTicker(lenis) {
  const track = document.querySelector('.ticker__track')
  if (!track || !lenis) return
  let settle = 0
  lenis.on('scroll', ({ velocity }) => {
    const lean = Math.max(-1, Math.min(1, velocity / 45))
    track.style.setProperty('--lean', `${(lean * -9).toFixed(2)}deg`)
    clearTimeout(settle)
    settle = setTimeout(() => track.style.setProperty('--lean', '0deg'), 140)
  })
}

export function initFx({ lenis, reduceMotion }) {
  heroDots(reduceMotion)
  if (reduceMotion) return
  decodeLabels()
  leanTicker(lenis)
  if (FINE) {
    cursorTag()
    tiltShots()
  }
}
