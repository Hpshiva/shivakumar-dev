// Interactive 3D toolkit: tools orbit a glowing core on two tilted rings.
// Every tool comes from the real `stack` of the projects in src/data/projects.js.
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  BufferGeometry,
  Float32BufferAttribute,
  LineLoop,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  IcosahedronGeometry,
  Sprite,
  SpriteMaterial,
  CanvasTexture,
  SRGBColorSpace,
  Vector3,
  Vector2,
  Raycaster,
  AdditiveBlending,
} from 'three'
import { buildToolData } from './toolkit-data.js'

const ACCENT = 0xff5a1f

function labelTexture(text, active) {
  const dpr = 2
  const font = `600 ${26 * dpr}px "Archivo Variable", system-ui, sans-serif`
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  ctx.font = font
  const pad = 20 * dpr
  const dot = 8 * dpr
  const w = Math.ceil(ctx.measureText(text).width) + pad * 2 + dot * 2.2
  const h = 58 * dpr
  c.width = w
  c.height = h
  ctx.font = font
  ctx.fillStyle = active ? '#ff5a1f' : 'rgba(17,17,19,0.92)'
  ctx.strokeStyle = active ? '#ff5a1f' : 'rgba(255,255,255,0.18)'
  ctx.lineWidth = 2 * dpr
  ctx.beginPath()
  ctx.roundRect(2 * dpr, 2 * dpr, w - 4 * dpr, h - 4 * dpr, h / 2 - 2 * dpr)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = active ? '#ffffff' : '#ff5a1f'
  ctx.beginPath()
  ctx.arc(pad, h / 2, dot / 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#f4f4f1'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, pad + dot * 1.3, h / 2 + dpr)
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  return { tex, aspect: w / h }
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,140,80,0.9)')
  g.addColorStop(0.35, 'rgba(255,90,31,0.35)')
  g.addColorStop(1, 'rgba(255,90,31,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  return tex
}

function circle(radius, segments = 128) {
  const pts = []
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2
    pts.push(Math.cos(a) * radius, 0, Math.sin(a) * radius)
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new Float32BufferAttribute(pts, 3))
  return geo
}

export function createToolkit(canvas, { onSelect, reduceMotion, initial }) {
  const { tools } = buildToolData()
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(36, 1, 0.1, 100)
  camera.position.set(0, 2.6, 9.6)
  camera.lookAt(0, 0, 0)

  const world = new Group()
  scene.add(world)

  // --- core ---
  const core = new Mesh(
    new IcosahedronGeometry(0.62, 1),
    new MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.75 }),
  )
  const glow = new Sprite(new SpriteMaterial({ map: glowTexture(), blending: AdditiveBlending, depthWrite: false, transparent: true }))
  glow.scale.set(3.4, 3.4, 1)
  world.add(core, glow)

  // --- two tilted orbits; busiest tools on the inner ring ---
  const rings = [
    { radius: 1.75, tilt: [0.32, 0, 0.16], speed: 0.0024 },
    { radius: 2.7, tilt: [0.18, 0, -0.14], speed: -0.0015 },
  ]
  const inner = tools.slice(0, Math.ceil(tools.length / 2))
  const outer = tools.slice(inner.length)
  const sprites = []

  rings.forEach((ring, ri) => {
    const tiltGroup = new Group()
    tiltGroup.rotation.set(...ring.tilt)
    const spin = new Group()
    tiltGroup.add(spin)
    world.add(tiltGroup)
    ring.spin = spin

    spin.add(
      new LineLoop(circle(ring.radius), new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })),
    )

    const list = ri === 0 ? inner : outer
    list.forEach((tool, i) => {
      const a = (i / list.length) * Math.PI * 2 + ri * 0.4
      const anchor = new Group()
      anchor.position.set(Math.cos(a) * ring.radius, 0, Math.sin(a) * ring.radius)
      spin.add(anchor)

      const normal = labelTexture(tool.name, false)
      const active = labelTexture(tool.name, true)
      const sprite = new Sprite(new SpriteMaterial({ map: normal.tex, transparent: true, depthWrite: false }))
      const h = 0.3
      sprite.scale.set(h * normal.aspect, h, 1)
      sprite.userData = { tool, normal: normal.tex, active: active.tex, base: sprite.scale.clone() }
      anchor.add(sprite)
      tool.anchor = anchor
      tool.sprite = sprite
      sprites.push(sprite)
    })
  })

  // --- beam from the core to the selected tool ---
  const beamGeo = new BufferGeometry()
  beamGeo.setAttribute('position', new Float32BufferAttribute(new Float32Array(6), 3))
  const beam = new Line(beamGeo, new LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.9 }))
  const spark = new Sprite(new SpriteMaterial({ map: glow.material.map, blending: AdditiveBlending, depthWrite: false, transparent: true }))
  spark.scale.set(0.5, 0.5, 1)
  world.add(beam, spark)

  let selected = null
  function select(tool) {
    if (selected) {
      selected.sprite.material.map = selected.sprite.userData.normal
    }
    selected = tool
    tool.sprite.material.map = tool.sprite.userData.active
    onSelect?.(tool)
  }

  // --- interaction ---
  const raycaster = new Raycaster()
  const pointer = new Vector2()
  let dragging = false
  let lastX = 0
  let lastY = 0
  let moved = 0
  let tiltX = 0
  const speedFactor = reduceMotion ? 0 : 1

  function pick(e) {
    const r = canvas.getBoundingClientRect()
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    raycaster.setFromCamera(pointer, camera)
    return raycaster.intersectObjects(sprites, false)[0]?.object
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
      moved += Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY)
      world.rotation.y += (e.clientX - lastX) * 0.006
      tiltX = Math.max(-0.4, Math.min(0.4, tiltX + (e.clientY - lastY) * 0.003))
      lastX = e.clientX
      lastY = e.clientY
      return
    }
    const hit = pick(e)
    canvas.style.cursor = hit ? 'pointer' : 'grab'
    if (hit && hit.userData.tool !== selected) select(hit.userData.tool)
  })
  canvas.addEventListener('pointerup', (e) => {
    if (!dragging) return
    dragging = false
    if (moved < 6) {
      const hit = pick(e)
      if (hit) select(hit.userData.tool)
    }
  })
  canvas.addEventListener('pointercancel', () => (dragging = false))

  // --- sizing ---
  function resize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.position.z = w / h < 0.9 ? 12.5 : 9.6
    camera.updateProjectionMatrix()
  }
  new ResizeObserver(resize).observe(canvas)
  resize()

  // --- loop ---
  const tmp = new Vector3()
  const camDir = new Vector3()
  let t = 0
  function frame() {
    t += 0.016
    rings.forEach((ring) => {
      if (!dragging) ring.spin.rotation.y += ring.speed * speedFactor
    })
    core.rotation.y += 0.004 * speedFactor
    core.rotation.x += 0.002 * speedFactor
    world.rotation.x += (tiltX - world.rotation.x) * 0.08

    // Depth cue: labels behind the core fade and shrink
    camera.getWorldDirection(camDir)
    sprites.forEach((s) => {
      s.getWorldPosition(tmp)
      const depth = Math.min(Math.max(-tmp.dot(camDir) / 3.4, -1), 1) * 0.5 + 0.5
      const isSel = s.userData.tool === selected
      s.material.opacity = isSel ? 1 : 0.18 + depth * 0.82
      s.scale.copy(s.userData.base).multiplyScalar((isSel ? 1.15 : 0.85) + depth * 0.2)
      s.renderOrder = Math.round(depth * 100) + (isSel ? 200 : 0)
    })

    if (selected) {
      selected.anchor.getWorldPosition(tmp)
      world.worldToLocal(tmp)
      const pos = beamGeo.attributes.position
      pos.setXYZ(0, 0, 0, 0)
      pos.setXYZ(1, tmp.x, tmp.y, tmp.z)
      pos.needsUpdate = true
      const k = (t * 0.6) % 1
      spark.position.set(tmp.x * k, tmp.y * k, tmp.z * k)
    }
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

  select(tools.find((tl) => tl.name === initial) || tools[0])
  requestAnimationFrame(() => canvas.classList.add('is-ready'))

  return {
    select: (name) => {
      const tool = tools.find((tl) => tl.name === name)
      if (tool) select(tool)
    },
  }
}
