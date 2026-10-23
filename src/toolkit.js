// Interactive 3D "toolkit" constellation. Outer ring: tools. Inner ring: projects.
// Every line is real: it comes from the `stack` of each project in src/data/projects.js.
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  BufferGeometry,
  Float32BufferAttribute,
  LineSegments,
  LineBasicMaterial,
  Sprite,
  SpriteMaterial,
  CanvasTexture,
  SRGBColorSpace,
  Vector3,
  Vector2,
  Raycaster,
  Points,
  PointsMaterial,
  AdditiveBlending,
} from 'three'
import { buildToolData } from './toolkit-data.js'

function fibonacciPoints(count, radius) {
  const pts = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = golden * i
    pts.push(new Vector3(Math.cos(t) * r * radius, y * radius * 0.82, Math.sin(t) * r * radius))
  }
  return pts
}

function labelTexture(text, { accent }) {
  const dpr = 2
  const font = `600 ${28 * dpr}px "Archivo Variable", system-ui, sans-serif`
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  ctx.font = font
  const pad = 22 * dpr
  const dot = 9 * dpr
  const w = Math.ceil(ctx.measureText(text).width) + pad * 2 + dot * 2.4
  const h = 64 * dpr
  c.width = w
  c.height = h
  ctx.font = font
  // pill
  ctx.fillStyle = accent ? 'rgba(255,90,31,0.16)' : 'rgba(17,17,19,0.85)'
  ctx.strokeStyle = accent ? 'rgba(255,90,31,0.9)' : 'rgba(255,255,255,0.22)'
  ctx.lineWidth = 2 * dpr
  const r = h / 2 - 2 * dpr
  ctx.beginPath()
  ctx.roundRect(2 * dpr, 2 * dpr, w - 4 * dpr, h - 4 * dpr, r)
  ctx.fill()
  ctx.stroke()
  // dot
  ctx.fillStyle = accent ? '#ff5a1f' : '#f4f4f1'
  ctx.beginPath()
  ctx.arc(pad, h / 2, dot / 2, 0, Math.PI * 2)
  ctx.fill()
  // text
  ctx.fillStyle = '#f4f4f1'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, pad + dot * 1.4, h / 2 + 1 * dpr)
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  return { tex, aspect: w / h }
}

export function createToolkit(canvas, { onSelect, reduceMotion, initial }) {
  const data = buildToolData()
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(38, 1, 0.1, 100)
  camera.position.set(0, 0.4, 9.2)
  camera.lookAt(0, 0, 0)

  const world = new Group()
  scene.add(world)

  // --- nodes ---
  const toolPos = fibonacciPoints(data.tools.length, 3.2)
  const projPos = data.projects.map((_, i) => {
    const a = (i / data.projects.length) * Math.PI * 2
    return new Vector3(Math.cos(a) * 1.75, (i % 2 ? 0.55 : -0.55) + Math.sin(a) * 0.2, Math.sin(a) * 1.75)
  })

  const sprites = []
  const makeSprite = (text, pos, kind, ref) => {
    const { tex, aspect } = labelTexture(text, { accent: kind === 'project' })
    const mat = new SpriteMaterial({ map: tex, transparent: true, depthWrite: false })
    const s = new Sprite(mat)
    const h = kind === 'project' ? 0.3 : 0.28
    s.scale.set(h * aspect, h, 1)
    s.position.copy(pos)
    s.userData = { kind, ref, baseScale: s.scale.clone() }
    world.add(s)
    sprites.push(s)
    return s
  }
  data.tools.forEach((t, i) => (t.sprite = makeSprite(t.name, toolPos[i], 'tool', t)))
  data.projects.forEach((p, i) => (p.sprite = makeSprite(p.name, projPos[i], 'project', p)))

  // --- links ---
  const pairs = []
  data.tools.forEach((t, ti) =>
    t.projects.forEach((p) => pairs.push({ tool: t, project: p, a: toolPos[ti], b: projPos[data.projects.indexOf(p)] })),
  )
  const positions = new Float32Array(pairs.length * 6)
  const colors = new Float32Array(pairs.length * 6)
  pairs.forEach((l, i) => {
    positions.set([l.a.x, l.a.y, l.a.z, l.b.x, l.b.y, l.b.z], i * 6)
  })
  const lineGeo = new BufferGeometry()
  lineGeo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  lineGeo.setAttribute('color', new Float32BufferAttribute(colors, 3))
  const lines = new LineSegments(
    lineGeo,
    new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false }),
  )
  world.add(lines)

  // faint star dust for depth
  const dust = new Float32Array(600 * 3)
  for (let i = 0; i < 600; i++) {
    const v = new Vector3().randomDirection().multiplyScalar(4 + Math.random() * 3)
    dust.set([v.x, v.y, v.z], i * 3)
  }
  const dustGeo = new BufferGeometry()
  dustGeo.setAttribute('position', new Float32BufferAttribute(dust, 3))
  world.add(new Points(dustGeo, new PointsMaterial({ color: 0xffffff, size: 0.018, transparent: true, opacity: 0.35, depthWrite: false })))

  // --- selection ---
  let selected = null
  function select(tool) {
    selected = tool
    const linked = new Set(tool.projects)
    pairs.forEach((l, i) => {
      const on = l.tool === tool
      const c = on ? [1, 0.42, 0.16] : [0.2, 0.2, 0.22]
      colors.set([...c, ...c], i * 6)
    })
    lineGeo.attributes.color.needsUpdate = true
    sprites.forEach((s) => {
      const { kind, ref } = s.userData
      const active = (kind === 'tool' && ref === tool) || (kind === 'project' && linked.has(ref))
      s.material.opacity = active ? 1 : 0.28
      s.scale.copy(s.userData.baseScale).multiplyScalar(active ? 1.12 : 1)
    })
    onSelect?.(tool)
  }

  // --- interaction ---
  const raycaster = new Raycaster()
  const pointer = new Vector2()
  let dragging = false
  let lastX = 0
  let lastY = 0
  let moved = 0
  let velY = reduceMotion ? 0 : 0.0016
  let targetX = 0.15

  function pick(e) {
    const r = canvas.getBoundingClientRect()
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(sprites, false)[0]
    return hit?.object
  }
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true
    moved = 0
    lastX = e.clientX
    lastY = e.clientY
    canvas.setPointerCapture(e.pointerId)
  })
  canvas.addEventListener('pointermove', (e) => {
    if (dragging) {
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      moved += Math.abs(dx) + Math.abs(dy)
      world.rotation.y += dx * 0.006
      targetX = Math.max(-0.6, Math.min(0.6, targetX + dy * 0.004))
      lastX = e.clientX
      lastY = e.clientY
      return
    }
    const hit = pick(e)
    canvas.style.cursor = hit ? 'pointer' : 'grab'
    if (hit?.userData.kind === 'tool' && hit.userData.ref !== selected) select(hit.userData.ref)
  })
  const end = (e) => {
    if (!dragging) return
    dragging = false
    if (moved < 6) {
      const hit = pick(e)
      if (hit?.userData.kind === 'tool') select(hit.userData.ref)
      if (hit?.userData.kind === 'project' && hit.userData.ref.slug) window.location.href = `/work/${hit.userData.ref.slug}/`
    }
  }
  canvas.addEventListener('pointerup', end)
  canvas.addEventListener('pointercancel', () => (dragging = false))

  // --- sizing & loop ---
  function resize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.position.z = w / h < 0.9 ? 12 : 10
    camera.updateProjectionMatrix()
  }
  new ResizeObserver(resize).observe(canvas)
  resize()

  function frame() {
    if (!dragging) world.rotation.y += velY
    world.rotation.x += (targetX - world.rotation.x) * 0.06
    renderer.render(scene, camera)
  }
  let running = false
  const start = () => {
    if (!running) renderer.setAnimationLoop(frame)
    running = true
  }
  const stop = () => {
    renderer.setAnimationLoop(null)
    running = false
  }
  let visible = false
  const sync = () => (visible && !document.hidden ? start() : stop())
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    sync()
  }).observe(canvas)
  document.addEventListener('visibilitychange', sync)

  select(data.tools.find((t) => t.name === initial) || data.tools[0])
  requestAnimationFrame(() => canvas.classList.add('is-ready'))

  return {
    select: (name) => {
      const tool = data.tools.find((t) => t.name === name)
      if (tool) select(tool)
    },
  }
}
