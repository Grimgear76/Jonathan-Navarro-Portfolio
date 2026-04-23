import { useEffect, useRef, useState } from 'react'
import './Skills.css'

const ACCENT = {
  ml:   '#e8a838',
  llm:  '#3dd6c8',
  web:  '#58a6ff',
  game: '#9d7fff',
}

// ─────────────────────────────────────────────────────────────
// ML — NEURAL NETWORK  (clicks → level 0-5, faster + rainbow)
// ─────────────────────────────────────────────────────────────
const ML_PALETTES = [
  ['#e8a838'],
  ['#e8a838', '#f0b84a'],
  ['#e8a838', '#3dd6c8'],
  ['#e8a838', '#3dd6c8', '#58a6ff'],
  ['#e8a838', '#3dd6c8', '#58a6ff', '#9d7fff'],
  ['#e8a838', '#3dd6c8', '#58a6ff', '#9d7fff', '#f472b6', '#fb923c'],
]

function NeuralNetCanvas({ clicks }) {
  const canvasRef = useRef(null)
  const clicksRef = useRef(clicks)
  useEffect(() => { clicksRef.current = clicks }, [clicks])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height

    const LAYERS = [3, 5, 4, 3]
    const xs = LAYERS.map((_, i) => W * 0.1 + (W * 0.8 / (LAYERS.length - 1)) * i)

    function nodeY(l, i) {
      const n = LAYERS[l]
      return H / 2 + (i - (n - 1) / 2) * (H / (n + 1))
    }

    let pulses = []
    let lastSpawn = 0
    let animId

    function frame(ts) {
      const level   = Math.min(clicksRef.current, 5)
      const palette = ML_PALETTES[level]
      const speed   = 0.012 + level * 0.009
      const interval = 360 - level * 52

      ctx.clearRect(0, 0, W, H)

      // connections — first pass: dim background connections
      const connAlpha = 50 + level * 18
      ctx.lineWidth = 0.7
      for (let l = 0; l < LAYERS.length - 1; l++) {
        for (let a = 0; a < LAYERS[l]; a++) {
          for (let b = 0; b < LAYERS[l + 1]; b++) {
            ctx.beginPath()
            ctx.strokeStyle = `${palette[0]}${connAlpha.toString(16).padStart(2,'0')}`
            ctx.moveTo(xs[l], nodeY(l, a))
            ctx.lineTo(xs[l + 1], nodeY(l + 1, b))
            ctx.stroke()
          }
        }
      }

      // second pass: draw active connections (ones a pulse is currently on) brighter
      pulses.forEach(p => {
        ctx.beginPath()
        ctx.strokeStyle = palette[0] + 'aa'
        ctx.lineWidth = 1.5
        ctx.moveTo(xs[p.fl], nodeY(p.fl, p.fn))
        ctx.lineTo(xs[p.fl + 1], nodeY(p.fl + 1, p.tn))
        ctx.stroke()
        ctx.lineWidth = 0.7
      })

      // update + draw pulses
      pulses = pulses.filter(p => {
        p.t += speed
        if (p.t > 1) return false
        const x = xs[p.fl] + (xs[p.fl + 1] - xs[p.fl]) * p.t
        const y = nodeY(p.fl, p.fn) + (nodeY(p.fl + 1, p.tn) - nodeY(p.fl, p.fn)) * p.t
        const r = 10 + level * 2
        const glowR = 22 + level * 3
        const g = ctx.createRadialGradient(x, y, 0, x, y, glowR)
        g.addColorStop(0, p.color)
        g.addColorStop(1, p.color + '00')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, glowR, 0, Math.PI * 2)
        ctx.fill()
        return true
      })

      // spawn
      if (ts - lastSpawn > interval) {
        const fl = Math.floor(Math.random() * (LAYERS.length - 1))
        pulses.push({
          fl, fn: Math.floor(Math.random() * LAYERS[fl]),
          tn: Math.floor(Math.random() * LAYERS[fl + 1]),
          t: 0,
          color: palette[Math.floor(Math.random() * palette.length)],
        })
        lastSpawn = ts
      }

      // nodes
      LAYERS.forEach((n, l) => {
        for (let i = 0; i < n; i++) {
          const x = xs[l], y = nodeY(l, i)
          const lit = pulses.some(p =>
            (p.fl === l - 1 && p.tn === i && p.t > 0.82) ||
            (p.fl === l && p.fn === i && p.t < 0.18)
          )
          const litPulse = pulses.find(p =>
            (p.fl === l - 1 && p.tn === i && p.t > 0.82) ||
            (p.fl === l && p.fn === i && p.t < 0.18)
          )
          const nodeColor = (lit && litPulse) ? litPulse.color : palette[0]
          if (lit) {
            const glowR = 22 + level * 3
            const ng = ctx.createRadialGradient(x, y, 0, x, y, glowR)
            ng.addColorStop(0, nodeColor + '66')
            ng.addColorStop(1, nodeColor + '00')
            ctx.fillStyle = ng
            ctx.beginPath()
            ctx.arc(x, y, glowR, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.beginPath()
          ctx.arc(x, y, lit ? 8 : 5, 0, Math.PI * 2)
          ctx.fillStyle = lit ? nodeColor : palette[0] + '55'
          ctx.fill()
        }
      })

      animId = requestAnimationFrame(frame)
    }

    animId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animId)
  }, [])

  const level = Math.min(clicks, 5)
  const labels = ['IDLE', 'TRAINING', 'LEARNING', 'ADAPTING', 'OPTIMIZING', 'CONVERGED']

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} className="domain-canvas" width={380} height={150} />
      <span className="ml-level-badge" style={{ color: ML_PALETTES[level][0] }}>
        LVL {level} — {labels[level]}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// LLM — LOCAL MODEL SHOWCASE  (clicks → cycle models)
// ─────────────────────────────────────────────────────────────
const MODELS = [
  { name: 'LLaMA 3',     creator: 'Meta',        params: '8B · 70B',  ctx: '128K', icon: '🦙', tags: ['reasoning', 'multilingual', 'chat'] },
  { name: 'Mistral 7B',  creator: 'Mistral AI',  params: '7B',        ctx: '32K',  icon: '💨', tags: ['efficient', 'code', 'instruct'] },
  { name: 'Phi-3',       creator: 'Microsoft',   params: '3.8B',      ctx: '128K', icon: 'φ',  tags: ['compact', 'capable', 'STEM'] },
  { name: 'Gemma 2',     creator: 'Google',      params: '9B · 27B',  ctx: '8K',   icon: '♊', tags: ['open', 'safe', 'instruction'] },
  { name: 'DeepSeek-R1', creator: 'DeepSeek',    params: '7B+',       ctx: '64K',  icon: '🔍', tags: ['reasoning', 'math', 'CoT'] },
  { name: 'Qwen 2.5',    creator: 'Alibaba',     params: '7B · 72B',  ctx: '128K', icon: '乾', tags: ['multilingual', 'code', 'tools'] },
]

function LLMModelShowcase({ clicks }) {
  const idx = clicks % MODELS.length
  const m   = MODELS[idx]
  const C   = ACCENT.llm

  return (
    <div className="llm-showcase" key={idx}>
      <div className="llm-icon" style={{ borderColor: C + '55', color: C }}>{m.icon}</div>
      <div className="llm-model-info">
        <div className="llm-model-name" style={{ color: C }}>{m.name}</div>
        <div className="llm-model-meta" style={{ color: C + 'aa' }}>
          {m.creator} · {m.params} params · {m.ctx} ctx
        </div>
        <div className="llm-tags">
          {m.tags.map(t => (
            <span key={t} className="llm-tag" style={{ borderColor: C + '44', color: C + 'cc' }}>{t}</span>
          ))}
        </div>
        <div className="llm-counter" style={{ color: C + '44' }}>
          {idx + 1} / {MODELS.length} — click to cycle
        </div>
      </div>
      <div className="llm-dots">
        {MODELS.map((_, i) => (
          <span key={i} className="llm-dot" style={{ background: i === idx ? C : C + '22' }} />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// WEB — GROWING ARCHITECTURE DIAGRAM  (clicks → add nodes)
// ─────────────────────────────────────────────────────────────
const FLOW_NODES = [
  { id: 'user',   label: 'USER',      sub: 'browser',  row: 0, col: 0 },
  { id: 'app',    label: 'REACT',     sub: 'frontend', row: 0, col: 1 },
  { id: 'api',    label: 'EXPRESS',   sub: 'REST API', row: 0, col: 2 },
  { id: 'db',     label: 'MONGO',     sub: 'database', row: 0, col: 3 },
  { id: 'auth',   label: 'JWT',       sub: 'auth',     row: 1, col: 2 },
  { id: 'ws',     label: 'SOCKET',    sub: 'realtime', row: 1, col: 1 },
]

const FLOW_EDGES = [
  [0, 1], [1, 2], [2, 3], [2, 4], [1, 5],
]

// Per-node colors
const NODE_COLORS = {
  user:  '#58a6ff',
  app:   '#61dafb',
  api:   '#68d391',
  db:    '#4db33d',
  auth:  '#f6c90e',
  ws:    '#9d7fff',
}

// Proportional positions so canvas scales to any width
function getNodePos(id, W, H) {
  const positions = {
    user:  { x: W * 0.07,  y: H * 0.32 },
    app:   { x: W * 0.30,  y: H * 0.32 },
    api:   { x: W * 0.55,  y: H * 0.32 },
    db:    { x: W * 0.925, y: H * 0.32 },
    auth:  { x: W * 0.55,  y: H * 0.75 },
    ws:    { x: W * 0.30,  y: H * 0.75 },
  }
  return positions[id]
}

function WebFlowCanvas({ clicks }) {
  const canvasRef = useRef(null)
  const clicksRef = useRef(clicks)
  useEffect(() => { clicksRef.current = clicks }, [clicks])

  useEffect(() => {
    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const W = rect.width
    const H = rect.height || 160
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    let nodeProgress = {}   // id → opacity 0-1 for appear animation
    let packetT = 0
    let packetEdge = 0
    let animId

    function drawNode(n, alpha) {
      if (alpha <= 0) return
      const { x, y } = getNodePos(n.id, W, H)
      const C = NODE_COLORS[n.id]
      const BW = 54, BH = 24
      ctx.globalAlpha = alpha
      ctx.fillStyle = C + '10'
      ctx.fillRect(x - BW / 2, y - BH / 2, BW, BH)
      ctx.strokeStyle = C + '88'
      ctx.lineWidth = 1
      ctx.strokeRect(x - BW / 2, y - BH / 2, BW, BH)
      ctx.fillStyle = C
      ctx.font = 'bold 7px "Courier New"'
      ctx.textAlign = 'center'
      ctx.fillText(n.label, x, y - 1)
      ctx.fillStyle = C + '77'
      ctx.font = '6px "Courier New"'
      ctx.fillText(n.sub, x, y + 9)
      ctx.globalAlpha = 1
    }

    function drawEdge(a, b, alpha) {
      if (alpha <= 0) return
      const p1 = getNodePos(a.id, W, H), p2 = getNodePos(b.id, W, H)
      const C = NODE_COLORS[a.id]
      ctx.globalAlpha = alpha * 0.4
      ctx.beginPath()
      ctx.setLineDash([3, 3])
      ctx.strokeStyle = C
      ctx.lineWidth = 1
      // vertical/diagonal vs horizontal edge
      if (a.id === b.id || (Math.abs(p1.x - p2.x) < 10)) {
        ctx.moveTo(p1.x, p1.y + 12)
        ctx.lineTo(p2.x, p2.y - 12)
      } else if (p1.y !== p2.y) {
        // cross row edge
        ctx.moveTo(p1.x, p1.y + 12)
        ctx.lineTo(p2.x, p2.y - 12)
      } else {
        ctx.moveTo(p1.x + 27, p1.y)
        ctx.lineTo(p2.x - 27, p2.y)
      }
      ctx.stroke()
      ctx.setLineDash([])
      ctx.globalAlpha = 1
    }

    function frame() {
      ctx.clearRect(0, 0, W, H)

      const targetLevel = Math.min(clicksRef.current + 1, FLOW_NODES.length)

      // animate node opacity
      FLOW_NODES.forEach((n, i) => {
        const target = i < targetLevel ? 1 : 0
        const cur = nodeProgress[n.id] ?? 0
        nodeProgress[n.id] = cur + (target - cur) * 0.07
      })

      // draw edges
      FLOW_EDGES.forEach(([ai, bi]) => {
        const a = FLOW_NODES[ai], b = FLOW_NODES[bi]
        const alpha = Math.min(nodeProgress[a.id] ?? 0, nodeProgress[b.id] ?? 0)
        drawEdge(a, b, alpha)
      })

      // animated packet along active edges
      const visibleEdges = FLOW_EDGES.filter(([ai, bi]) =>
        (nodeProgress[FLOW_NODES[ai].id] ?? 0) > 0.8 &&
        (nodeProgress[FLOW_NODES[bi].id] ?? 0) > 0.8
      )

      if (visibleEdges.length > 0) {
        packetT += 0.02
        if (packetT > 1) {
          packetT = 0
          packetEdge = (packetEdge + 1) % visibleEdges.length
        }
        const [ai, bi] = visibleEdges[packetEdge % visibleEdges.length]
        const destNode = FLOW_NODES[bi]
        const C = NODE_COLORS[destNode.id]
        const a = getNodePos(FLOW_NODES[ai].id, W, H), b = getNodePos(FLOW_NODES[bi].id, W, H)
        const sameRow = Math.abs(a.y - b.y) < 5
        const px = sameRow ? (a.x + 27) + ((b.x - 27) - (a.x + 27)) * packetT : a.x + (b.x - a.x) * packetT
        const py = sameRow ? a.y : (a.y + 12) + ((b.y - 12) - (a.y + 12)) * packetT

        const g = ctx.createRadialGradient(px, py, 0, px, py, 7)
        g.addColorStop(0, C)
        g.addColorStop(1, C + '00')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px, py, 7, 0, Math.PI * 2)
        ctx.fill()
      }

      // draw nodes
      FLOW_NODES.forEach(n => drawNode(n, nodeProgress[n.id] ?? 0))

      // hint label
      if (clicksRef.current < FLOW_NODES.length - 1) {
        ctx.fillStyle = NODE_COLORS.user + '33'
        ctx.font = '6px "Courier New"'
        ctx.textAlign = 'center'
        ctx.fillText('click to expand architecture', W / 2, H - 6)
      }

      animId = requestAnimationFrame(frame)
    }

    animId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animId)
  }, [])

  return <canvas ref={canvasRef} className="domain-canvas" />
}

// ─────────────────────────────────────────────────────────────
// GAME — PIXEL BATTLE  (clicks → cycle attack modes)
// ─────────────────────────────────────────────────────────────
const PS = 5

const KP = ['', '#9ab0c0', '#c8d8e8', '#334455', '#e8a838', '#d4a06a', '#ddeeff', '#223344']
const KNIGHT_IDLE = [
  [0,0,1,1,1,1,0,0],
  [0,1,2,4,4,2,1,0],
  [0,1,5,5,5,5,1,0],
  [0,1,3,5,5,3,1,0],
  [0,1,5,5,5,5,1,0],
  [0,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,0],
  [1,4,4,1,1,4,1,0],
  [1,4,4,1,1,4,1,0],
  [1,1,1,1,1,1,1,0],
  [0,1,1,0,0,1,1,0],
  [0,1,1,0,0,1,1,0],
  [0,7,7,0,0,7,7,0],
]
const KNIGHT_ATK = [
  [0,0,1,1,1,1,0,0],
  [0,1,2,4,4,2,1,0],
  [0,1,5,5,5,5,1,0],
  [0,1,3,5,5,3,1,0],
  [0,1,5,5,5,5,1,0],
  [0,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,6],
  [1,4,4,1,1,4,4,6],
  [1,4,4,1,1,4,1,0],
  [1,1,1,1,1,1,1,0],
  [0,0,1,1,0,1,1,0],
  [0,0,1,1,0,1,1,0],
  [0,0,7,7,0,7,7,0],
]

const GP = ['', '#5aae2a', '#2d7010', '#ff2222', '#8b5a1a', '#f0e060', '#1a4408']
const GOBLIN_IDLE = [
  [0,2,2,2,2,0],
  [2,1,1,1,1,2],
  [2,3,1,3,1,2],
  [2,1,5,5,1,2],
  [0,2,2,2,2,0],
  [2,2,2,2,2,2],
  [1,2,1,1,2,1],
  [0,2,2,2,2,0],
  [4,4,0,2,0,0],
  [4,0,0,2,0,0],
  [0,0,2,0,2,0],
  [0,2,2,0,2,2],
]
const GOBLIN_HIT = [
  [2,2,2,2,0,0],
  [1,1,1,1,2,0],
  [3,1,3,1,2,0],
  [1,5,5,1,2,0],
  [2,2,2,2,0,0],
  [0,2,2,2,2,2],
  [0,2,1,1,2,1],
  [0,0,2,2,2,0],
  [0,0,0,4,4,0],
  [0,0,0,2,0,0],
  [0,0,2,0,2,0],
  [0,0,2,2,2,0],
]

function drawSprite(ctx, sprite, palette, ox, oy, flipX) {
  const cols = sprite[0].length
  sprite.forEach((row, y) => {
    row.forEach((ci, x) => {
      if (!ci) return
      ctx.fillStyle = palette[ci]
      const dx = flipX ? ox + (cols - 1 - x) * PS : ox + x * PS
      ctx.fillRect(dx, oy + y * PS, PS, PS)
    })
  })
}

const ATTACK_LABELS = ['⚔ SWORD', '🔥 FIREBALL', '⚡ ARCANE']
const PHASE_DUR = [55, 22, 22, 22, 22]

function PixelBattleCanvas({ clicks }) {
  const canvasRef = useRef(null)
  const clicksRef = useRef(clicks)
  useEffect(() => { clicksRef.current = clicks }, [clicks])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    const W = canvas.width, H = canvas.height
    const C = ACCENT.game

    const GROUND = H - 18
    const KX = 20
    const GX = W - GOBLIN_IDLE[0].length * PS - 20
    const KH = KNIGHT_IDLE.length * PS
    const GH = GOBLIN_IDLE.length * PS

    let phase = 0, tick = 0
    let kHp = 100, gHp = 100
    let kFlash = 0, gFlash = 0
    let projectile = null  // { x, y, tx, ty, t, type }
    let particles  = []
    let lightningPoints = null
    let lightningTimer = 0
    let animId

    function hpBar(label, hp, x, y, col) {
      ctx.fillStyle = '#111'
      ctx.fillRect(x, y, 56, 5)
      ctx.fillStyle = col
      ctx.fillRect(x, y, Math.round(56 * hp / 100), 5)
      ctx.fillStyle = col
      ctx.font = '6px "Courier New"'
      ctx.textAlign = 'left'
      ctx.fillText(label, x, y - 2)
    }

    function makeLightning(x1, y1, x2, y2, segs = 6) {
      const pts = [{ x: x1, y: y1 }]
      for (let i = 1; i < segs; i++) {
        const t = i / segs
        pts.push({
          x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 30,
          y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 20,
        })
      }
      pts.push({ x: x2, y: y2 })
      return pts
    }

    function frame() {
      const attackMode = clicksRef.current % 3
      ctx.clearRect(0, 0, W, H)

      // scanlines
      for (let sy = 0; sy < H; sy += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.07)'
        ctx.fillRect(0, sy, W, 1)
      }

      // ground
      ctx.strokeStyle = C + '28'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(10, GROUND)
      ctx.lineTo(W - 10, GROUND)
      ctx.stroke()

      // sprites
      const kSprite = (phase === 1 || phase === 4) ? KNIGHT_ATK : KNIGHT_IDLE
      const gSprite = (phase === 2) ? GOBLIN_HIT : GOBLIN_IDLE
      drawSprite(ctx, kSprite, KP, KX, GROUND - KH, false)
      drawSprite(ctx, gSprite, GP, GX, GROUND - GH, true)

      // ── Sword swing animation (mode 0 only) ──
      if (attackMode === 0) {
        // Hand position (right side of knight sprite, at arm height)
        const handX = KX + KNIGHT_IDLE[0].length * PS + 2
        const handY = GROUND - KH * 0.58

        // Sword angle: idle = -100deg, attack sweeps to +15deg
        const idleAngle = -Math.PI * 0.56
        const swingAngle = Math.PI * 0.08

        let swordAngle = idleAngle
        if (phase === 1) {
          // sweep from idle to swing over the phase duration
          const sweepT = Math.min(tick / (PHASE_DUR[1] * 0.9), 1)
          swordAngle = idleAngle + (swingAngle - idleAngle) * sweepT
        } else if (phase === 4) {
          swordAngle = idleAngle + 0.3
        }

        const swordLen = 32
        const ex = handX + Math.cos(swordAngle) * swordLen
        const ey = handY + Math.sin(swordAngle) * swordLen

        // Glow
        ctx.save()
        ctx.strokeStyle = '#aaccff'
        ctx.lineWidth = 7
        ctx.globalAlpha = 0.3
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(handX, handY)
        ctx.lineTo(ex, ey)
        ctx.stroke()

        // Blade
        ctx.globalAlpha = 1
        ctx.strokeStyle = '#e8f4ff'
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(handX, handY)
        ctx.lineTo(ex, ey)
        ctx.stroke()

        // Tip diamond
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(ex, ey, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // During swing, draw a motion arc trail
        if (phase === 1 && tick > 4) {
          ctx.save()
          ctx.globalAlpha = 0.2
          ctx.strokeStyle = '#ddeeff'
          ctx.lineWidth = 1
          const trailStart = idleAngle
          const trailEnd = swordAngle
          ctx.beginPath()
          for (let a = trailStart; a <= trailEnd; a += 0.05) {
            const tx = handX + Math.cos(a) * swordLen
            const ty = handY + Math.sin(a) * swordLen
            if (a === trailStart) ctx.moveTo(tx, ty)
            else ctx.lineTo(tx, ty)
          }
          ctx.stroke()
          ctx.restore()
        }
      }

      // ── Fireball projectile ──
      if (attackMode === 1 && projectile) {
        projectile.t += 0.045
        const px = projectile.x + (projectile.tx - projectile.x) * projectile.t
        const py = projectile.y + (projectile.ty - projectile.y) * projectile.t + Math.sin(projectile.t * Math.PI) * -10
        // flame trail particles
        if (Math.random() < 0.5) {
          particles.push({ x: px, y: py, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 2, life: 1 })
        }
        // fireball glow
        const fg = ctx.createRadialGradient(px, py, 0, px, py, 14)
        fg.addColorStop(0, '#fff')
        fg.addColorStop(0.3, '#fb923c')
        fg.addColorStop(1, '#fb923c00')
        ctx.fillStyle = fg
        ctx.beginPath()
        ctx.arc(px, py, 14, 0, Math.PI * 2)
        ctx.fill()
        if (projectile.t >= 1) { projectile = null; gFlash = 1.4 }
      }

      // particles
      particles = particles.filter(p => {
        p.life -= 0.07
        if (p.life <= 0) return false
        p.x += p.vx; p.y += p.vy
        ctx.fillStyle = `rgba(251,146,60,${p.life})`
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2)
        return true
      })

      // ── Arcane lightning ──
      if (attackMode === 2 && lightningPoints) {
        lightningTimer--
        ctx.save()
        ctx.lineWidth = 2
        for (let i = 0; i < lightningPoints.length - 1; i++) {
          const a = lightningPoints[i], b = lightningPoints[i + 1]
          ctx.strokeStyle = i % 2 === 0 ? '#c8b0ff' : '#ffffff'
          ctx.shadowColor = '#9d7fff'
          ctx.shadowBlur = 10
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
        ctx.restore()
        if (lightningTimer <= 0) { lightningPoints = null }
      }

      // sword slash FX
      if (attackMode === 0 && phase === 1 && tick > PHASE_DUR[1] * 0.5) {
        const sx = GX - 12, sy = GROUND - GH * 0.55
        ctx.strokeStyle = 'rgba(255,255,200,0.9)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(sx - 8, sy - 8); ctx.lineTo(sx + 8, sy + 8)
        ctx.moveTo(sx + 8, sy - 8); ctx.lineTo(sx - 8, sy + 8)
        ctx.stroke()
      }

      // flashes
      if (gFlash > 0) {
        const col = attackMode === 1 ? 'rgba(255,100,40,' : attackMode === 2 ? 'rgba(157,127,255,' : 'rgba(255,80,40,'
        ctx.fillStyle = col + Math.min(gFlash, 1) * 0.45 + ')'
        ctx.fillRect(GX - 2, GROUND - GH - 2, GOBLIN_IDLE[0].length * PS + 4, GH + 4)
        gFlash -= 0.09
      }
      if (kFlash > 0) {
        ctx.fillStyle = `rgba(100,160,255,${Math.min(kFlash, 1) * 0.4})`
        ctx.fillRect(KX - 2, GROUND - KH - 2, KNIGHT_IDLE[0].length * PS + 4, KH + 4)
        kFlash -= 0.09
      }

      // HP bars
      hpBar('JN',  kHp, KX,      GROUND - KH - 16, '#58a6ff')
      hpBar('GOB', gHp, GX - 10, GROUND - GH - 16, '#5aae2a')

      // attack label
      ctx.fillStyle = C + 'aa'
      ctx.font = 'bold 7px "Courier New"'
      ctx.textAlign = 'center'
      ctx.fillText(ATTACK_LABELS[attackMode], W / 2, H - 5)

      // phase machine
      tick++
      const dur = PHASE_DUR[phase]
      if (tick >= dur) {
        tick = 0
        // launch projectiles / FX on attack phase
        if (phase === 1) {
          if (attackMode === 1) {
            // launch fireball
            projectile = {
              x: KX + KNIGHT_IDLE[0].length * PS + 5,
              y: GROUND - KH * 0.55,
              tx: GX - 10,
              ty: GROUND - GH * 0.55,
              t: 0,
            }
          } else if (attackMode === 2) {
            // lightning bolt
            const x1 = KX + KNIGHT_IDLE[0].length * PS
            const y1 = GROUND - KH * 0.5
            const x2 = GX
            const y2 = GROUND - GH * 0.5
            lightningPoints = makeLightning(x1, y1, x2, y2)
            lightningTimer = 14
            gFlash = 1.4
          } else {
            // sword — damage on phase 2
          }
        }
        if (phase === 2 && attackMode === 0) {
          gHp = Math.max(18, gHp - (10 + Math.floor(Math.random() * 8)))
          gFlash = 1.4
        }
        if (phase === 3) {
          kHp = Math.max(18, kHp - (6 + Math.floor(Math.random() * 5)))
          kFlash = 1.4
        }
        if (kHp <= 18 && gHp <= 18) { kHp = 100; gHp = 100 }
        phase = (phase + 1) % PHASE_DUR.length
      }

      animId = requestAnimationFrame(frame)
    }

    animId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="domain-canvas pixel-canvas"
      width={380}
      height={150}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// DOMAIN CARD + MAIN
// ─────────────────────────────────────────────────────────────
const DOMAINS = [
  { id: 'ml',   accent: ACCENT.ml,   label: 'Machine Learning',  desc: 'RL agents, custom Gymnasium environments, PPO training loops.',         skills: ['Python', 'Stable-Baselines3', 'Gymnasium', 'PPO / RL'], Anim: NeuralNetCanvas,    hint: '[ CLICK TO TRAIN ]' },
  { id: 'llm',  accent: ACCENT.llm,  label: 'Local AI / LLMs',   desc: 'On-device inference, prompt engineering, Gemini API integration.',      skills: ['Ollama', 'Gemini API', 'Node.js', 'Prompt Eng.'],       Anim: LLMModelShowcase,   hint: '[ CLICK TO CYCLE MODEL ]' },
  { id: 'web',  accent: ACCENT.web,  label: 'Web Development',    desc: 'Full-stack MERN apps, REST APIs, real-time Socket.io features.',        skills: ['React', 'Node.js / Express', 'MongoDB', 'Vite'],        Anim: WebFlowCanvas,      hint: '[ CLICK TO EXPAND STACK ]' },
  { id: 'game', accent: ACCENT.game, label: 'Game Development',   desc: 'Unity systems, C# scripting, enemy AI state machines, combat feel.',   skills: ['Unity', 'C#', 'Figma', 'Game Design'],                  Anim: PixelBattleCanvas,  hint: '[ CLICK TO CHANGE ATTACK ]' },
]

function DomainCard({ domain }) {
  const [clicks, setClicks] = useState(0)
  const { Anim } = domain
  const idle = clicks === 0

  return (
    <div
      className={`domain-card${idle ? ' domain-card--idle' : ' domain-card--on'}`}
      style={{ '--da': domain.accent }}
      onClick={() => setClicks(c => c + 1)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setClicks(c => c + 1)}
    >
      <div className="domain-anim">
        <Anim clicks={clicks} />
      </div>
      <div className="domain-info">
        <h3 className="domain-label">{domain.label}</h3>
        <p className="domain-desc">{domain.desc}</p>
        <div className="domain-chips">
          {domain.skills.map(s => (
            <span key={s} className="domain-chip">{s}</span>
          ))}
        </div>
        <span className={`domain-click-hint${idle ? '' : ' domain-click-hint--hidden'}`}>
          {domain.hint}
        </span>
      </div>
    </div>
  )
}

export default function Skills() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('skills-visible')
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="skills" id="skills" ref={sectionRef}>
      <div className="skills-container">
        <h2 className="section-label">// SKILLS</h2>
        <div className="domains-grid">
          {DOMAINS.map(d => <DomainCard key={d.id} domain={d} />)}
        </div>
      </div>
    </section>
  )
}
