import { useEffect, useRef } from 'react'
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'

// Parse "#rrggbb" → [r, g, b]
function parseHex(hex) {
  const h = (hex || '#e8a838').trim().replace(/^#/, '')
  if (h.length !== 6) return [232, 168, 56]
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

const N            = 70
const CONNECT_DIST = 130
const MOUSE_R      = 115
const MOUSE_FORCE  = 0.15
const MAX_SPEED    = 1.5
const COLOR_LERP   = 0.018   // ~3 s smooth color transition

export default function ParticleBackground() {
  const { state }    = useColorContext()
  const paletteRef   = useRef([])   // hex strings of unlocked project colors
  const canvasRef    = useRef(null)

  // Keep paletteRef in sync with unlock state
  useEffect(() => {
    paletteRef.current = projects
      .filter(p => state.unlockedIds.has(p.id))
      .map(p => p.accentColor)
  }, [state.unlockedIds])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let animId

    const mouse = { x: -9999, y: -9999 }

    // Size canvas to full viewport at device pixel ratio
    function resize() {
      const dpr     = window.devicePixelRatio || 1
      canvas.width  = window.innerWidth  * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Mouse tracking
    const onMove  = e => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999;    mouse.y = -9999 }
    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mouseleave', onLeave)

    // Build particles — start in amber (zone 1 accent)
    const [sr, sg, sb] = parseHex('#e8a838')
    const particles = Array.from({ length: N }, (_, i) => ({
      x:   Math.random() * window.innerWidth,
      y:   Math.random() * window.innerHeight,
      vx:  (Math.random() - 0.5) * 0.28,
      vy:  (Math.random() - 0.5) * 0.28,
      rad: Math.random() * 1.1 + 0.4,
      slot: i,           // stable index — color = palette[slot % palette.length]
      cr: sr, cg: sg, cb: sb,  // current rendered color (lerped each frame)
    }))

    function frame() {
      const W = window.innerWidth
      const H = window.innerHeight
      ctx.clearRect(0, 0, W, H)

      // Current scroll-zone accent (fallback when nothing is unlocked)
      const baseHex = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#e8a838'
      const unlocked = paletteRef.current
      const palette  = unlocked.length > 0 ? unlocked : [baseHex]

      particles.forEach(p => {
        // ── Target color from palette slot ──────────────────
        const targetHex     = palette[p.slot % palette.length]
        const [tr, tg, tb]  = parseHex(targetHex)
        p.cr += (tr - p.cr) * COLOR_LERP
        p.cg += (tg - p.cg) * COLOR_LERP
        p.cb += (tb - p.cb) * COLOR_LERP

        // ── Mouse repulsion ─────────────────────────────────
        const mdx   = p.x - mouse.x
        const mdy   = p.y - mouse.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < MOUSE_R && mdist > 0) {
          const force = (1 - mdist / MOUSE_R) * MOUSE_FORCE
          p.vx += (mdx / mdist) * force
          p.vy += (mdy / mdist) * force
        }

        // ── Damping + speed cap ─────────────────────────────
        p.vx *= 0.97
        p.vy *= 0.97
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > MAX_SPEED) {
          p.vx = (p.vx / spd) * MAX_SPEED
          p.vy = (p.vy / spd) * MAX_SPEED
        }

        p.x += p.vx
        p.y += p.vy

        // ── Wrap edges (seamless across full page height) ───
        if (p.x < -20)    p.x = W + 20
        if (p.x > W + 20) p.x = -20
        if (p.y < -20)    p.y = H + 20
        if (p.y > H + 20) p.y = -20
      })

      // ── Draw connections ──────────────────────────────────
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const alpha        = (1 - dist / CONNECT_DIST) * 0.13
            const { cr, cg, cb } = particles[i]
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${alpha})`
            ctx.lineWidth   = 0.6
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // ── Draw dots ─────────────────────────────────────────
      particles.forEach(({ x, y, rad, cr, cg, cb }) => {
        ctx.beginPath()
        ctx.arc(x, y, rad, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},0.45)`
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
