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
      <canvas ref={canvasRef} className="domain-canvas" width={380} height={190} />
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

const KP = ['', '#8a9baa', '#c5d5de', '#1a2838', '#e8a838', '#4a6070', '#7ab8ff', '#0f1820']
// 1=steel, 2=polished silver, 3=dark visor, 4=gold, 5=shadow steel, 6=glowing blue slit, 7=dark boot
const KNIGHT_IDLE = [
  [0,0,1,4,4,1,0,0],  // helmet top — gold crest
  [0,1,2,4,4,2,1,0],  // upper helmet, gold band
  [0,1,2,3,3,2,1,0],  // visor top (dark)
  [0,1,5,6,6,5,1,0],  // glowing blue eye slit
  [0,1,2,3,3,2,1,0],  // lower visor / chin
  [0,0,1,2,2,1,0,0],  // gorget (neck guard)
  [1,2,1,1,1,1,2,0],  // pauldrons (shoulder plates)
  [1,4,3,1,1,3,4,0],  // breastplate, gold trim
  [1,4,3,1,1,3,4,0],  // lower chest
  [0,1,1,5,5,1,1,0],  // tassets (hip guards)
  [0,1,2,0,0,2,1,0],  // thighs
  [0,1,2,0,0,2,1,0],  // greaves (shin guards)
  [0,7,2,0,0,2,7,0],  // sabatons (foot armor)
  [0,7,7,0,0,7,7,0],  // boot soles
]
const KNIGHT_ATK = [
  [0,0,1,4,4,1,0,0],
  [0,1,2,4,4,2,1,0],
  [0,1,2,3,3,2,1,0],
  [0,1,5,6,6,5,1,0],
  [0,1,2,3,3,2,1,0],
  [0,0,1,2,2,1,0,0],
  [1,2,1,1,1,1,6,6],  // gauntlet extended right
  [1,4,3,1,1,3,6,6],  // sword arm
  [1,4,3,1,1,3,4,0],
  [0,1,1,5,5,1,1,0],
  [0,0,1,2,0,2,1,0],  // combat lean
  [0,0,1,2,0,2,1,0],
  [0,0,7,2,0,2,7,0],
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

const SUBCOMMANDS = [
  ['SWORD', 'AXE', 'BOW'],
  ['FIREBALL', 'ARCANE', 'ICE'],
  ['SM.POT', 'POTION', 'FOOD'],
  null,
]
const SUB_DMG  = [[18, 26, 12], [22, 32, 15], [0, 0, 0], [0]]
const SUB_HEAL = [12, 25, 8]
const SUB_DUR  = [[45, 50, 32], [35, 35, 35], [40, 40, 30], [40]]

function PixelBattleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    const W = canvas.width, H = canvas.height
    const C = ACCENT.game

    const GROUND = 100
    const CMD_Y  = 108
    const KX = 20
    const GX = W - GOBLIN_IDLE[0].length * PS - 20
    const KH = KNIGHT_IDLE.length * PS
    const GH = GOBLIN_IDLE.length * PS
    const COMMANDS = ['ATTACK', 'MAGIC', 'ITEM', 'RUN']
    const ENEMY_DUR = 30

    const s = {
      phase: 'idle',
      selectedMain: 0,
      selectedSub: 0,
      hoverMain: -1,
      hoverSub: -1,
      kHp: 100,
      gHp: 100,
      floats: [],
      shakeFrames: 0,
      gFlash: { color: '', life: 0 },
      kFlash: 0,
      blinkFrame: 0,
      tick: 0,
      firstClick: false,
      lightningPts: null,
      lightningLife: 0,
      lightningColor: '#c8b0ff',
    }

    // ── Canvas interaction (hover + zone-click) ──
    const ROW1_Y = CMD_Y + 2
    const ROW1_H = 26
    const ROW2_Y = ROW1_Y + ROW1_H
    const ROW2_H = 28

    canvas.addEventListener('mousemove', e => {
      if (s.phase !== 'idle') return
      const r = canvas.getBoundingClientRect()
      const x = (e.clientX - r.left) * (W / r.width)
      const y = (e.clientY - r.top)  * (H / r.height)
      if (y >= ROW1_Y && y < ROW1_Y + ROW1_H) {
        s.hoverMain = Math.min(Math.floor(x / (W / 4)), 3)
        s.hoverSub  = -1
      } else if (y >= ROW2_Y && y < ROW2_Y + ROW2_H && s.hoverMain >= 0 && s.hoverMain !== 3) {
        const subs = SUBCOMMANDS[s.hoverMain]
        s.hoverSub = Math.min(Math.floor(x / (W / subs.length)), subs.length - 1)
      } else {
        s.hoverSub = -1
      }
    })
    canvas.addEventListener('mouseleave', () => { s.hoverMain = -1; s.hoverSub = -1 })
    canvas.addEventListener('click', e => {
      e.stopPropagation()
      if (s.phase !== 'idle') return
      const r = canvas.getBoundingClientRect()
      const x = (e.clientX - r.left) * (W / r.width)
      const y = (e.clientY - r.top)  * (H / r.height)
      s.firstClick = true
      if (y >= ROW1_Y && y < ROW1_Y + ROW1_H) {
        const idx = Math.min(Math.floor(x / (W / 4)), 3)
        s.hoverMain = idx
        if (idx === 3) {
          s.selectedMain = 3; s.selectedSub = 0
          s.phase = 'player'; s.tick = 0
          s.lightningPts = null; s.lightningLife = 0
        }
      } else if (y >= ROW2_Y && y < ROW2_Y + ROW2_H && s.hoverMain >= 0 && s.hoverMain !== 3) {
        const subs = SUBCOMMANDS[s.hoverMain]
        const subIdx = Math.min(Math.floor(x / (W / subs.length)), subs.length - 1)
        s.selectedMain = s.hoverMain
        s.selectedSub  = subIdx
        s.phase = 'player'; s.tick = 0
        s.lightningPts = null; s.lightningLife = 0
      }
    })

    function addFloat(x, y, text, color) {
      s.floats.push({ x, y, text, color, life: 1.0 })
    }

    function buildLightning(x1, y1, x2, y2) {
      const pts = [{ x: x1, y: y1 }]
      for (let i = 1; i < 7; i++) {
        const t = i / 7
        pts.push({
          x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 28,
          y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 18,
        })
      }
      pts.push({ x: x2, y: y2 })
      return pts
    }

    function drawHpBar(label, hp, x, y, col) {
      const crit = hp < 25
      ctx.fillStyle = '#1e2030'
      ctx.fillRect(x, y, 56, 6)
      ctx.fillStyle = crit ? '#ff4444' : col
      ctx.fillRect(x, y, Math.round(56 * hp / 100), 6)
      if (crit && s.blinkFrame % 20 < 10) {
        ctx.fillStyle = 'rgba(255,60,60,0.3)'
        ctx.fillRect(x, y, Math.round(56 * hp / 100), 6)
      }
      ctx.fillStyle = crit ? '#ff4444' : col
      ctx.font = 'bold 8px "Courier New"'
      ctx.textAlign = 'left'
      ctx.fillText(label, x, y - 2)
    }

    function drawCommandBox() {
      ctx.fillStyle = '#0c0e18'
      ctx.fillRect(0, CMD_Y, W, H - CMD_Y)
      ctx.strokeStyle = C + 'cc'
      ctx.lineWidth = 1
      ctx.strokeRect(1, CMD_Y, W - 2, H - CMD_Y - 1)

      if (s.phase === 'idle') {
        // ── Row 1: main commands ──
        const slotW = W / 4
        const row1TextY = ROW1_Y + 17
        COMMANDS.forEach((cmd, i) => {
          const cx = slotW * i + slotW / 2
          const hot = i === s.hoverMain
          if (hot) {
            ctx.fillStyle = C + '28'
            ctx.fillRect(slotW * i + 1, ROW1_Y, slotW - 2, ROW1_H - 1)
          }
          ctx.fillStyle = hot ? C : C + 'aa'
          ctx.font = hot ? 'bold 10px "Courier New"' : '9px "Courier New"'
          ctx.textAlign = 'center'
          ctx.fillText(hot ? '▶ ' + cmd : cmd, cx, row1TextY)
        })

        // ── Divider ──
        ctx.strokeStyle = C + '55'
        ctx.lineWidth = 0.5
        ctx.setLineDash([2, 3])
        ctx.beginPath()
        ctx.moveTo(4, ROW2_Y); ctx.lineTo(W - 4, ROW2_Y)
        ctx.stroke(); ctx.setLineDash([])

        // ── Row 2: sub-options or hint ──
        const row2TextY = ROW2_Y + 18
        if (s.hoverMain >= 0 && s.hoverMain !== 3) {
          const subs = SUBCOMMANDS[s.hoverMain]
          const subSlotW = W / subs.length
          subs.forEach((sub, i) => {
            const cx = subSlotW * i + subSlotW / 2
            const hot = i === s.hoverSub
            if (hot) {
              ctx.fillStyle = C + '30'
              ctx.fillRect(subSlotW * i + 1, ROW2_Y, subSlotW - 2, ROW2_H - 1)
            }
            ctx.fillStyle = hot ? C : C + 'cc'
            ctx.font = hot ? 'bold 9px "Courier New"' : '8px "Courier New"'
            ctx.textAlign = 'center'
            ctx.fillText(hot ? '▶ ' + sub : sub, cx, row2TextY)
          })
        } else if (s.hoverMain === 3) {
          ctx.fillStyle = C + 'cc'
          ctx.font = '8px "Courier New"'
          ctx.textAlign = 'center'
          ctx.fillText('[ CLICK TO ATTEMPT ESCAPE ]', W / 2, row2TextY)
        } else if (!s.firstClick) {
          ctx.fillStyle = C + '99'
          ctx.font = '8px "Courier New"'
          ctx.textAlign = 'center'
          ctx.fillText('hover a command to choose', W / 2, row2TextY)
        }
        return
      }

      // ── Active action phases ──
      const mid = CMD_Y + (H - CMD_Y) / 2 + 5
      if (s.phase === 'player' && s.selectedMain === 3 && s.tick > 10) {
        ctx.fillStyle = C
        ctx.font = 'bold 11px "Courier New"'
        ctx.textAlign = 'center'
        ctx.fillText('…but failed to escape!', W / 2, mid)
        return
      }
      const subs = SUBCOMMANDS[s.selectedMain]
      const actionName = subs ? subs[s.selectedSub] : 'RUN'
      ctx.fillStyle = s.phase === 'enemy' ? '#ff7777' : C
      ctx.font = 'bold 10px "Courier New"'
      ctx.textAlign = 'center'
      ctx.fillText(s.phase === 'enemy' ? '⚔ ENEMY COUNTER!' : '▶ ' + actionName, W / 2, mid)
    }

    let animId

    function frame() {

      // ── Screen shake transform ──
      ctx.save()
      if (s.shakeFrames > 0) {
        ctx.translate((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3)
        s.shakeFrames--
      }

      ctx.clearRect(-5, -5, W + 10, H + 10)

      // scanlines (battle area only)
      for (let sy = 0; sy < GROUND; sy += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.07)'
        ctx.fillRect(0, sy, W, 1)
      }

      // ground line
      ctx.strokeStyle = C + '80'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(10, GROUND)
      ctx.lineTo(W - 10, GROUND)
      ctx.stroke()

      // ── Idle bob ──
      s.blinkFrame++
      const bobY = s.phase === 'idle'
        ? Math.round(Math.sin(s.blinkFrame / 60 * Math.PI * 2))
        : 0

      // ── Sprite selection ──
      const useKAtk = s.phase === 'player' && s.selectedMain === 0
        && s.selectedSub !== 2 && s.tick > 5 && s.tick < 42
      const kSprite = useKAtk ? KNIGHT_ATK : KNIGHT_IDLE
      const gSprite = s.gFlash.life > 0.5 ? GOBLIN_HIT : GOBLIN_IDLE

      // ── Sprite positional offsets ──
      let kOffsetX = 0, gOffsetX = 0
      if (s.phase === 'player' && s.selectedMain === 3) {
        kOffsetX = Math.min(s.tick * 2, 40)
      }
      if (s.phase === 'enemy') {
        gOffsetX = s.tick < 15 ? -s.tick * 1.2 : -(30 - s.tick) * 1.2
      }

      // ── Draw sprites ──
      drawSprite(ctx, kSprite, KP, KX + kOffsetX, GROUND - KH + bobY, false)
      drawSprite(ctx, gSprite, GP, GX + gOffsetX, GROUND - GH + bobY, true)

      // ── ATTACK sub-commands ──
      if (s.phase === 'player' && s.selectedMain === 0) {
        const handX = KX + KNIGHT_IDLE[0].length * PS + 2
        const handY = GROUND - KH * 0.58

        if (s.selectedSub === 0) {
          const angle = -Math.PI * 0.56 + (Math.PI * 0.64) * Math.min(s.tick / 35, 1)
          const ex = handX + Math.cos(angle) * 32
          const ey = handY + Math.sin(angle) * 32
          ctx.save()
          ctx.lineCap = 'round'
          ctx.strokeStyle = '#aaccff'; ctx.lineWidth = 7; ctx.globalAlpha = 0.3
          ctx.beginPath(); ctx.moveTo(handX, handY); ctx.lineTo(ex, ey); ctx.stroke()
          ctx.strokeStyle = '#e8f4ff'; ctx.lineWidth = 2.5; ctx.globalAlpha = 1
          ctx.beginPath(); ctx.moveTo(handX, handY); ctx.lineTo(ex, ey); ctx.stroke()
          ctx.fillStyle = '#fff'
          ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2); ctx.fill()
          ctx.restore()
          if (s.tick === 25) {
            const dmg = SUB_DMG[0][0]
            s.gHp = Math.max(0, s.gHp - dmg)
            addFloat(GX + 10, GROUND - GH - 10, `SLASH! -${dmg}`, '#ff6666')
            s.gFlash = { color: 'rgba(255,120,40,', life: 1.4 }
            s.shakeFrames = 8
          }
        }

        if (s.selectedSub === 1) {
          // Axe swings from raised (overhead) down through the goblin
          const swing = Math.min(s.tick / 45, 1)
          const axeAngle = -Math.PI * 0.9 + Math.PI * 1.1 * swing
          const pivotX = handX
          const pivotY = handY
          const shaftLen = 28

          ctx.save()
          ctx.translate(pivotX, pivotY)
          ctx.rotate(axeAngle)

          // handle
          ctx.strokeStyle = '#8B5E3C'
          ctx.lineWidth = 3
          ctx.lineCap = 'round'
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, shaftLen); ctx.stroke()

          // blade — crescent shape at tip of shaft
          const bx = 0, by = shaftLen
          // blade body (wide flat shape)
          ctx.fillStyle = '#d4d4d4'
          ctx.beginPath()
          ctx.moveTo(bx,      by - 3)   // base top-right
          ctx.lineTo(bx + 12, by - 10)  // top-right point
          ctx.lineTo(bx + 14, by + 2)   // bottom-right bulge
          ctx.lineTo(bx + 8,  by + 7)   // bottom-right curve
          ctx.lineTo(bx,      by + 4)   // base bottom
          ctx.closePath()
          ctx.fill()
          // blade edge highlight
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(bx + 12, by - 10)
          ctx.lineTo(bx + 14, by + 2)
          ctx.lineTo(bx + 8,  by + 7)
          ctx.stroke()
          // blade shadow/dark side
          ctx.fillStyle = '#888'
          ctx.beginPath()
          ctx.moveTo(bx,      by - 3)
          ctx.lineTo(bx - 6,  by - 8)
          ctx.lineTo(bx - 5,  by + 5)
          ctx.lineTo(bx,      by + 4)
          ctx.closePath()
          ctx.fill()
          // butt cap
          ctx.fillStyle = '#6b4226'
          ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill()

          // motion blur trail at fast swing speeds
          if (swing > 0.1 && swing < 0.85) {
            ctx.globalAlpha = 0.18
            ctx.strokeStyle = '#ffcc66'
            ctx.lineWidth = 10
            ctx.beginPath()
            ctx.moveTo(0, shaftLen * 0.5)
            ctx.lineTo(0, shaftLen + 8)
            ctx.stroke()
          }

          ctx.restore()

          if (s.tick === 35) {
            const dmg = SUB_DMG[0][1]
            s.gHp = Math.max(0, s.gHp - dmg)
            addFloat(GX + 10, GROUND - GH - 10, `CLEAVE! -${dmg}`, '#ffcc44')
            s.gFlash = { color: 'rgba(255,180,50,', life: 1.8 }
            s.shakeFrames = 12
          }
        }

        if (s.selectedSub === 2) {
          const HIT_T = 20
          if (s.tick <= HIT_T) {
            const p = s.tick / HIT_T
            const ax = (KX + KNIGHT_IDLE[0].length * PS + 4) + (GX - 4 - (KX + KNIGHT_IDLE[0].length * PS + 4)) * p
            const ay = (GROUND - KH * 0.52) + ((GROUND - GH * 0.52) - (GROUND - KH * 0.52)) * p
            const ag = ctx.createRadialGradient(ax, ay, 0, ax, ay, 6)
            ag.addColorStop(0, '#fffacc')
            ag.addColorStop(1, '#e8a83800')
            ctx.fillStyle = ag
            ctx.beginPath(); ctx.arc(ax, ay, 6, 0, Math.PI * 2); ctx.fill()
            ctx.fillStyle = '#ddd'
            ctx.fillRect(ax - 5, ay - 1, 10, 2)
          }
          if (s.tick === HIT_T + 1) {
            const dmg = SUB_DMG[0][2]
            s.gHp = Math.max(0, s.gHp - dmg)
            addFloat(GX + 10, GROUND - GH - 10, `PIERCE! -${dmg}`, '#ffd700')
            s.gFlash = { color: 'rgba(255,210,50,', life: 1.2 }
            s.shakeFrames = 5
          }
        }
      }

      // ── MAGIC sub-commands ──
      if (s.phase === 'player' && s.selectedMain === 1) {
        const x1 = KX + KNIGHT_IDLE[0].length * PS
        const y1 = GROUND - KH * 0.5

        if (s.selectedSub === 0) {
          const HIT_T = 18
          if (s.tick <= HIT_T) {
            const p = s.tick / HIT_T
            const fx = x1 + (GX - x1) * p
            const fy = y1 + ((GROUND - GH * 0.5) - y1) * p
            const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, 11)
            fg.addColorStop(0, '#fff8e0')
            fg.addColorStop(0.4, '#fb923c')
            fg.addColorStop(1, '#fb923c00')
            ctx.fillStyle = fg
            ctx.beginPath(); ctx.arc(fx, fy, 11, 0, Math.PI * 2); ctx.fill()
            ctx.fillStyle = `rgba(251,146,60,${0.12 * (1 - p)})`
            ctx.fillRect(0, 0, W, GROUND)
          }
          if (s.tick === HIT_T + 1) {
            const dmg = SUB_DMG[1][0]
            s.gHp = Math.max(0, s.gHp - dmg)
            addFloat(GX + 10, GROUND - GH - 10, `BLAZE! -${dmg}`, '#fb923c')
            s.gFlash = { color: 'rgba(251,146,60,', life: 1.6 }
            s.shakeFrames = 8
          }
        }

        if (s.selectedSub === 1) {
          if (s.tick === 5) {
            s.lightningPts = buildLightning(x1, y1, GX, GROUND - GH * 0.5)
            s.lightningLife = 18
            s.lightningColor = '#c8b0ff'
            const dmg = SUB_DMG[1][1]
            s.gHp = Math.max(0, s.gHp - dmg)
            addFloat(GX + 10, GROUND - GH - 10, `ARCANE! -${dmg}`, '#c8b0ff')
            s.gFlash = { color: 'rgba(157,127,255,', life: 1.8 }
            s.shakeFrames = 8
          }
          if (s.tick < 15) {
            ctx.fillStyle = `rgba(100,60,180,${Math.max(0, 0.25 - s.tick * 0.018)})`
            ctx.fillRect(0, 0, W, GROUND)
          }
        }

        if (s.selectedSub === 2) {
          const SHARD_DUR = 22
          const FREEZE_DUR = 28
          // Phase 1: ice shard travels to goblin
          if (s.tick <= SHARD_DUR) {
            const p = s.tick / SHARD_DUR
            const sx = x1 + (GX + 4 - x1) * p
            const sy = y1 + ((GROUND - GH * 0.5) - y1) * p
            const angle = Math.atan2((GROUND - GH * 0.5) - y1, GX + 4 - x1)
            ctx.save()
            ctx.translate(sx, sy)
            ctx.rotate(angle)
            // shard body
            ctx.beginPath()
            ctx.moveTo(10, 0)
            ctx.lineTo(2, -4)
            ctx.lineTo(-6, 0)
            ctx.lineTo(2, 4)
            ctx.closePath()
            ctx.fillStyle = '#c8eeff'
            ctx.fill()
            // bright tip
            ctx.beginPath()
            ctx.moveTo(10, 0)
            ctx.lineTo(4, -2)
            ctx.lineTo(4, 2)
            ctx.closePath()
            ctx.fillStyle = '#ffffff'
            ctx.fill()
            // icy trail
            for (let i = 1; i <= 4; i++) {
              const tp = Math.max(0, p - i * 0.06)
              const tx = x1 + (GX + 4 - x1) * tp - sx
              const ty = y1 + ((GROUND - GH * 0.5) - y1) * tp - sy
              ctx.globalAlpha = (1 - i * 0.22) * 0.5
              ctx.fillStyle = '#88d4ff'
              ctx.beginPath()
              ctx.arc(tx, ty, 3 - i * 0.5, 0, Math.PI * 2)
              ctx.fill()
            }
            ctx.restore()
          }
          // Phase 2: hit + freeze
          if (s.tick === SHARD_DUR + 1) {
            const dmg = SUB_DMG[1][2]
            s.gHp = Math.max(0, s.gHp - dmg)
            addFloat(GX + 10, GROUND - GH - 10, `FREEZE! -${dmg}`, '#88d4ff')
            s.gFlash = { color: 'rgba(180,230,255,', life: 1.2 }
            s.shakeFrames = 5
            s.freezeLife = FREEZE_DUR
          }
          if (s.tick > SHARD_DUR && s.tick <= SHARD_DUR + FREEZE_DUR) {
            const fp = 1 - (s.tick - SHARD_DUR) / FREEZE_DUR
            const gCX = GX + (GOBLIN_IDLE[0].length * PS) / 2
            const gCY = GROUND - GH * 0.55
            // ice block overlay
            ctx.save()
            ctx.globalAlpha = fp * 0.78
            ctx.fillStyle = '#a8e6ff'
            ctx.strokeStyle = '#e0f8ff'
            ctx.lineWidth = 1.5
            // main crystal shape
            const hw = (GOBLIN_IDLE[0].length * PS) / 2 + 4
            const hh = GH * 0.6
            ctx.beginPath()
            ctx.moveTo(gCX,           gCY - hh)
            ctx.lineTo(gCX + hw * 0.5, gCY - hh * 0.55)
            ctx.lineTo(gCX + hw,       gCY)
            ctx.lineTo(gCX + hw * 0.6, gCY + hh * 0.65)
            ctx.lineTo(gCX,            gCY + hh)
            ctx.lineTo(gCX - hw * 0.6, gCY + hh * 0.65)
            ctx.lineTo(gCX - hw,       gCY)
            ctx.lineTo(gCX - hw * 0.5, gCY - hh * 0.55)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
            // inner highlight facet
            ctx.globalAlpha = fp * 0.35
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.moveTo(gCX - hw * 0.25, gCY - hh * 0.9)
            ctx.lineTo(gCX + hw * 0.15, gCY - hh * 0.5)
            ctx.lineTo(gCX - hw * 0.1,  gCY - hh * 0.1)
            ctx.lineTo(gCX - hw * 0.45, gCY - hh * 0.5)
            ctx.closePath()
            ctx.fill()
            // sparkle crystals
            ctx.globalAlpha = fp * 0.9
            const sparks = [
              [gCX - hw - 4, gCY - hh * 0.3],
              [gCX + hw + 4, gCY - hh * 0.2],
              [gCX,           gCY - hh - 6],
              [gCX + hw * 0.7, gCY + hh * 0.8],
            ]
            sparks.forEach(([sx2, sy2]) => {
              ctx.strokeStyle = '#d0f0ff'
              ctx.lineWidth = 1
              ctx.beginPath(); ctx.moveTo(sx2 - 4, sy2); ctx.lineTo(sx2 + 4, sy2); ctx.stroke()
              ctx.beginPath(); ctx.moveTo(sx2, sy2 - 4); ctx.lineTo(sx2, sy2 + 4); ctx.stroke()
              ctx.beginPath(); ctx.moveTo(sx2 - 3, sy2 - 3); ctx.lineTo(sx2 + 3, sy2 + 3); ctx.stroke()
              ctx.beginPath(); ctx.moveTo(sx2 + 3, sy2 - 3); ctx.lineTo(sx2 - 3, sy2 + 3); ctx.stroke()
            })
            ctx.restore()
          }
        }
      }

      // ── Lightning (arcane only) ──
      if (s.lightningPts && s.lightningLife > 0) {
        ctx.save()
        ctx.lineWidth = 2
        const lc = s.lightningColor
        s.lightningPts.forEach((pt, i) => {
          if (i === s.lightningPts.length - 1) return
          const next = s.lightningPts[i + 1]
          ctx.strokeStyle = i % 2 === 0 ? lc : '#ffffff'
          ctx.shadowColor = lc; ctx.shadowBlur = 10
          ctx.beginPath(); ctx.moveTo(pt.x, pt.y); ctx.lineTo(next.x, next.y); ctx.stroke()
        })
        ctx.restore()
        s.lightningLife--
      }

      // ── ITEM sub-commands ──
      if (s.phase === 'player' && s.selectedMain === 2) {
        const potX = KX + KNIGHT_IDLE[0].length * PS - 5
        const potY = GROUND - KH * 0.6
        const alpha = Math.sin(s.tick / 40 * Math.PI) * 0.7

        if (s.selectedSub === 0) {
          const pg = ctx.createRadialGradient(potX, potY, 0, potX, potY, 9)
          pg.addColorStop(0, `rgba(104,211,145,${alpha * 0.7})`)
          pg.addColorStop(1, 'rgba(104,211,145,0)')
          ctx.fillStyle = pg
          ctx.beginPath(); ctx.arc(potX, potY, 9, 0, Math.PI * 2); ctx.fill()
          if (s.tick === 15) {
            const heal = SUB_HEAL[0]
            s.kHp = Math.min(100, s.kHp + heal)
            addFloat(KX + 5, GROUND - KH - 10, `SM.POT +${heal}HP`, '#68d391')
          }
        }

        if (s.selectedSub === 1) {
          const pg = ctx.createRadialGradient(potX, potY, 0, potX, potY, 13)
          pg.addColorStop(0, `rgba(104,211,145,${alpha})`)
          pg.addColorStop(1, 'rgba(104,211,145,0)')
          ctx.fillStyle = pg
          ctx.beginPath(); ctx.arc(potX, potY, 13, 0, Math.PI * 2); ctx.fill()
          if (s.tick === 15) {
            const heal = SUB_HEAL[1]
            s.kHp = Math.min(100, s.kHp + heal)
            addFloat(KX + 5, GROUND - KH - 10, `POTION! +${heal}HP`, '#68d391')
          }
        }

        if (s.selectedSub === 2) {
          const pg = ctx.createRadialGradient(potX, potY, 0, potX, potY, 10)
          pg.addColorStop(0, `rgba(251,196,60,${alpha * 0.8})`)
          pg.addColorStop(1, 'rgba(251,196,60,0)')
          ctx.fillStyle = pg
          ctx.beginPath(); ctx.arc(potX, potY, 10, 0, Math.PI * 2); ctx.fill()
          if (s.tick === 15) {
            const heal = SUB_HEAL[2]
            s.kHp = Math.min(100, s.kHp + heal)
            addFloat(KX + 5, GROUND - KH - 10, `NOM NOM +${heal}HP`, '#fbc43c')
          }
        }
      }

      // ── Sprite flashes ──
      if (s.gFlash.life > 0) {
        ctx.fillStyle = s.gFlash.color + Math.min(s.gFlash.life, 1) * 0.45 + ')'
        ctx.fillRect(GX - 2, GROUND - GH - 2, GOBLIN_IDLE[0].length * PS + 4, GH + 4)
        s.gFlash.life -= 0.09
      }
      if (s.kFlash > 0) {
        ctx.fillStyle = `rgba(100,160,255,${Math.min(s.kFlash, 1) * 0.4})`
        ctx.fillRect(KX - 2, GROUND - KH - 2, KNIGHT_IDLE[0].length * PS + 4, KH + 4)
        s.kFlash -= 0.09
      }

      // ── Enemy counter damage ──
      if (s.phase === 'enemy' && s.tick === 10) {
        const dmg = s.selectedMain === 1 ? 10 : 8
        s.kHp = Math.max(0, s.kHp - dmg)
        addFloat(KX, GROUND - KH - 12, `COUNTER! -${dmg}`, '#ff6666')
        s.kFlash = 1.4
        s.shakeFrames = 8
      }

      // ── HP bars ──
      drawHpBar('JN',  s.kHp, KX,      GROUND - KH - 18, '#58a6ff')
      drawHpBar('GOB', s.gHp, GX - 10, GROUND - GH - 18, '#5aae2a')

      // ── RESULT overlay ──
      if (s.phase === 'result') {
        const msg = s.gHp <= 0 ? 'VICTORY!' : 'DEFEATED!'
        const col = s.gHp <= 0 ? '#9d7fff' : '#ff4444'
        ctx.save()
        ctx.fillStyle = 'rgba(0,0,0,0.55)'
        ctx.fillRect(0, 0, W, GROUND)
        ctx.fillStyle = col
        ctx.font = 'bold 18px "Courier New"'
        ctx.textAlign = 'center'
        ctx.fillText(msg, W / 2, GROUND / 2 + 6)
        ctx.restore()
      }

      // ── Floating numbers ──
      s.floats = s.floats.filter(f => {
        f.life -= 1 / 40
        f.y -= 0.6
        if (f.life <= 0) return false
        ctx.globalAlpha = f.life
        ctx.fillStyle = f.color
        ctx.font = 'bold 10px "Courier New"'
        ctx.textAlign = 'left'
        ctx.fillText(f.text, f.x, f.y)
        ctx.globalAlpha = 1
        return true
      })

      // ── Command box ──
      drawCommandBox()

      ctx.restore() // end shake translate

      // ── State machine transitions ──
      if (s.phase !== 'idle') {
        s.tick++

        const dur = s.selectedMain === 3 ? 40 : SUB_DUR[s.selectedMain][s.selectedSub]
        const hasCounter = s.selectedMain === 0 || s.selectedMain === 1

        if (s.phase === 'player' && s.tick >= dur) {
          if (hasCounter) {
            s.phase = 'enemy'; s.tick = 0
          } else {
            if (s.gHp <= 0 || s.kHp <= 0) { s.phase = 'result'; s.tick = 0 }
            else { s.phase = 'idle'; s.tick = 0; s.hoverMain = -1; s.hoverSub = -1 }
          }
        }

        if (s.phase === 'enemy' && s.tick >= ENEMY_DUR) {
          if (s.gHp <= 0 || s.kHp <= 0) { s.phase = 'result'; s.tick = 0 }
          else { s.phase = 'idle'; s.tick = 0; s.hoverMain = -1; s.hoverSub = -1 }
        }

        if (s.phase === 'result' && s.tick >= 90) { s.phase = 'reset'; s.tick = 0 }

        if (s.phase === 'reset') {
          s.kHp = 100; s.gHp = 100
          s.selectedMain = 0; s.selectedSub = 0; s.hoverMain = -1; s.hoverSub = -1
          s.floats = []; s.gFlash = { color: '', life: 0 }; s.kFlash = 0
          s.shakeFrames = 0; s.lightningPts = null; s.lightningLife = 0
          s.phase = 'idle'; s.tick = 0
        }
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
      height={190}
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
  { id: 'game', accent: ACCENT.game, label: 'Game Development',   desc: 'Unity systems, C# scripting, enemy AI state machines, combat feel.',   skills: ['Unity', 'C#', 'Figma', 'Game Design'],                  Anim: PixelBattleCanvas,  hint: '[ HOVER COMMANDS ABOVE TO BATTLE ]' },
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
