import { useEffect, useRef } from 'react'
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'

function parseHex(hex) {
  const h = (hex || '#e8a838').trim().replace(/^#/, '')
  if (h.length !== 6) return [232, 168, 56]
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

const N              = 110
const CONNECT_DIST   = 160
const MOUSE_R        = 130
const MOUSE_FORCE    = 0.15
const MAX_SPEED      = 1.0    // slowed down
const COLOR_LERP     = 0.018
const DRIFT_FORCE    = 0.007  // slowed down

const MAX_STARS      = 65
const STAR_INTERVAL  = 12    // frames between each star spawn

export default function ParticleBackground() {
  const { state }       = useColorContext()
  const paletteRef      = useRef([])
  const unlockedCountRef = useRef(0)
  const canvasRef       = useRef(null)

  useEffect(() => {
    paletteRef.current      = projects
      .filter(p => state.unlockedIds.has(p.id))
      .map(p => p.accentColor)
    unlockedCountRef.current = state.unlockedIds.size
  }, [state.unlockedIds])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let animId

    const mouse = { x: -9999, y: -9999 }

    function resize() {
      const dpr     = window.devicePixelRatio || 1
      canvas.width  = window.innerWidth  * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove  = e => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999;    mouse.y = -9999 }
    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mouseleave', onLeave)

    const [sr, sg, sb] = parseHex('#e8a838')
    const particles = Array.from({ length: N }, (_, i) => ({
      x:   Math.random() * window.innerWidth,
      y:   Math.random() * window.innerHeight,
      vx:  (Math.random() - 0.5) * 0.18,
      vy:  (Math.random() - 0.5) * 0.18,
      rad: Math.random() * 2.2 + 1.2,
      slot: i,
      phase:      Math.random() * Math.PI * 2,
      phaseSpeed: 0.18 + Math.random() * 0.22,
      cr: sr, cg: sg, cb: sb,
    }))

    // Stars — spawned gradually once all 6 projects are unlocked
    const stars = []
    let frameCount = 0

    function spawnStar(palette) {
      const slot = stars.length
      const [cr, cg, cb] = parseHex(palette[slot % palette.length])
      stars.push({
        x:          Math.random() * window.innerWidth,
        y:          Math.random() * window.innerHeight,
        vx:         (Math.random() - 0.5) * 0.08,
        vy:         (Math.random() - 0.5) * 0.08,
        rad:        Math.random() * 0.7 + 0.5,
        slot,
        phase:      Math.random() * Math.PI * 2,
        phaseSpeed: 0.06 + Math.random() * 0.09,
        opacity:    0,           // fades in slowly
        cr, cg, cb,
      })
    }

    function frame(ts = 0) {
      const W = window.innerWidth
      const H = window.innerHeight
      const t = ts * 0.001
      frameCount++
      ctx.clearRect(0, 0, W, H)

      const baseHex = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#e8a838'
      const unlocked = paletteRef.current
      const palette  = unlocked.length > 0 ? unlocked : [baseHex]
      const allUnlocked = unlockedCountRef.current >= projects.length

      // ── Spawn stars gradually at full unlock ─────────────
      if (allUnlocked && stars.length < MAX_STARS && frameCount % STAR_INTERVAL === 0) {
        spawnStar(palette)
      }

      // ── Update nodes ─────────────────────────────────────
      particles.forEach(p => {
        const [tr, tg, tb] = parseHex(palette[p.slot % palette.length])
        p.cr += (tr - p.cr) * COLOR_LERP
        p.cg += (tg - p.cg) * COLOR_LERP
        p.cb += (tb - p.cb) * COLOR_LERP

        p.vx += Math.cos(t * p.phaseSpeed + p.phase) * DRIFT_FORCE
        p.vy += Math.sin(t * p.phaseSpeed * 0.7 + p.phase + 1.3) * DRIFT_FORCE

        const mdx   = p.x - mouse.x
        const mdy   = p.y - mouse.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < MOUSE_R && mdist > 0) {
          const force = (1 - mdist / MOUSE_R) * MOUSE_FORCE
          p.vx += (mdx / mdist) * force
          p.vy += (mdy / mdist) * force
        }

        p.vx *= 0.975
        p.vy *= 0.975
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > MAX_SPEED) { p.vx = (p.vx / spd) * MAX_SPEED; p.vy = (p.vy / spd) * MAX_SPEED }

        p.x += p.vx;  p.y += p.vy
        if (p.x < -20)    p.x = W + 20
        if (p.x > W + 20) p.x = -20
        if (p.y < -20)    p.y = H + 20
        if (p.y > H + 20) p.y = -20
      })

      // ── Update stars ─────────────────────────────────────
      stars.forEach(s => {
        const [tr, tg, tb] = parseHex(palette[s.slot % palette.length])
        s.cr += (tr - s.cr) * COLOR_LERP
        s.cg += (tg - s.cg) * COLOR_LERP
        s.cb += (tb - s.cb) * COLOR_LERP

        s.opacity += (0.75 - s.opacity) * 0.004  // slow fade-in (~15s to full)

        s.vx += Math.cos(t * s.phaseSpeed + s.phase) * 0.003
        s.vy += Math.sin(t * s.phaseSpeed * 0.7 + s.phase + 2.1) * 0.003

        s.vx *= 0.98;  s.vy *= 0.98

        s.x += s.vx;  s.y += s.vy
        if (s.x < -10)    s.x = W + 10
        if (s.x > W + 10) s.x = -10
        if (s.y < -10)    s.y = H + 10
        if (s.y > H + 10) s.y = -10
      })

      // ── Draw connections (nodes only) ─────────────────────
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.38
            const { cr, cg, cb } = particles[i]
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${alpha})`
            ctx.lineWidth   = 1.0
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // ── Draw nodes ────────────────────────────────────────
      particles.forEach(({ x, y, rad, cr, cg, cb }) => {
        ctx.beginPath()
        ctx.arc(x, y, rad, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},0.85)`
        ctx.fill()
      })

      // ── Draw stars (on top, but tiny + semi-transparent) ──
      stars.forEach(({ x, y, rad, cr, cg, cb, opacity }) => {
        ctx.beginPath()
        ctx.arc(x, y, rad, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${opacity.toFixed(3)})`
        ctx.fill()
      })

      animId = requestAnimationFrame(frame)
    }

    animId = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize',    resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:          0,
        width:         '100vw',
        height:        '100vh',
        zIndex:         0,
        pointerEvents: 'none',
      }}
    />
  )
}
