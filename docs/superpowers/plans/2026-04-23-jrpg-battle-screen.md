# JRPG Battle Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the click-to-cycle pixel battle animation in `PixelBattleCanvas` with a JRPG command menu where each click executes the highlighted command (ATTACK → MAGIC → ITEM → RUN, then loops), with HP bars, floating numbers, screen shake, and a win/reset loop.

**Architecture:** All animation state lives in a single plain object `s` inside the animation `useEffect`, accessed via closure. Click detection compares `clicksRef.current` to `s.prevClicks` at the top of each frame. `DomainCard` is unchanged — it still increments `clicks` on card click. Phase transitions happen at the bottom of `frame()` after drawing.

**Tech Stack:** React hooks (useRef, useEffect), HTML Canvas 2D API, requestAnimationFrame, Courier New pixel font, existing sprite data (KP/GP palettes, KNIGHT_IDLE/ATK, GOBLIN_IDLE/HIT, drawSprite, PS=5, ACCENT.game)

---

## Files Changed

- **Modify:** `frontend/src/components/Skills.jsx`
  - Remove: lines 457–459 (`ATTACK_LABELS`, `PHASE_DUR`) and lines 498–509 (`makeLightning`)
  - Replace: `PixelBattleCanvas` function body (lines 460–745)
  - Update: `DOMAINS[3].hint` (line 754) from `'[ CLICK TO CHANGE ATTACK ]'` to `'[ CLICK TO COMMAND ]'`

---

## Task 1: Remove Dead Code + Static Layout Scaffold

**Files:**
- Modify: `frontend/src/components/Skills.jsx:457-745`

Replace the old `PixelBattleCanvas` with a skeleton that renders the static battle scene (sprites, ground line, HP bars, command box) and loops via rAF, but contains no state machine or click logic yet.

- [ ] **Step 1: Delete dead code declarations**

Remove these three const declarations (lines 457–459 and 498–509 in original):
```js
// DELETE these lines:
const ATTACK_LABELS = ['⚔ SWORD', '🔥 FIREBALL', '⚡ ARCANE']
const PHASE_DUR = [55, 22, 22, 22, 22]
// ...and the makeLightning function (lines 498-509)
function makeLightning(...) { ... }
```

- [ ] **Step 2: Replace PixelBattleCanvas (lines 460–745) with the scaffold**

```jsx
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

    const GROUND = 97
    const CMD_Y  = 102
    const KX = 20
    const GX = W - GOBLIN_IDLE[0].length * PS - 20
    const KH = KNIGHT_IDLE.length * PS
    const GH = GOBLIN_IDLE.length * PS
    const COMMANDS = ['ATTACK', 'MAGIC', 'ITEM', 'RUN']

    const s = {
      phase: 'idle',        // 'idle' | 'player' | 'enemy' | 'result' | 'reset'
      commandIdx: 0,        // 0=ATTACK 1=MAGIC 2=ITEM 3=RUN
      kHp: 100,
      gHp: 100,
      floats: [],           // { x, y, text, color, life }
      shakeFrames: 0,
      gFlash: { color: '', life: 0 },
      kFlash: 0,
      blinkFrame: 0,
      blinkVisible: true,
      prevClicks: clicks,
      tick: 0,
      firstClick: false,
      lightningPts: null,
      lightningLife: 0,
      runOffset: 0,
    }

    const PLAYER_DUR  = [45, 35, 40, 40]   // frames per player phase per command
    const HAS_COUNTER = [true, true, false, false]
    const ENEMY_DUR   = 30

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
      ctx.fillStyle = '#111'
      ctx.fillRect(x, y, 56, 5)
      ctx.fillStyle = crit ? '#ff4444' : col
      ctx.fillRect(x, y, Math.round(56 * hp / 100), 5)
      if (crit && s.blinkFrame % 20 < 10) {
        ctx.fillStyle = 'rgba(255,60,60,0.3)'
        ctx.fillRect(x, y, Math.round(56 * hp / 100), 5)
      }
      ctx.fillStyle = crit ? '#ff4444' : col
      ctx.font = '6px "Courier New"'
      ctx.textAlign = 'left'
      ctx.fillText(label, x, y - 2)
    }

    function drawCommandBox(runMsg) {
      ctx.fillStyle = '#0d0d15'
      ctx.fillRect(0, CMD_Y, W, H - CMD_Y)
      ctx.strokeStyle = C
      ctx.lineWidth = 1
      ctx.strokeRect(1, CMD_Y, W - 2, H - CMD_Y - 1)
      const cy = CMD_Y + (H - CMD_Y) / 2 + 4
      if (runMsg) {
        ctx.fillStyle = C + 'cc'
        ctx.font = 'bold 7px "Courier New"'
        ctx.textAlign = 'center'
        ctx.fillText('…but failed!', W / 2, cy)
        return
      }
      const slotW = W / COMMANDS.length
      COMMANDS.forEach((cmd, i) => {
        const cx = slotW * i + slotW / 2
        if (i === s.commandIdx) {
          const showCursor = s.phase === 'idle' ? s.blinkVisible : true
          ctx.fillStyle = C
          ctx.font = 'bold 7px "Courier New"'
          ctx.textAlign = 'center'
          ctx.fillText((showCursor ? '▶ ' : '  ') + cmd, cx, cy)
        } else {
          ctx.fillStyle = C + '44'
          ctx.font = '7px "Courier New"'
          ctx.textAlign = 'center'
          ctx.fillText(cmd, cx, cy)
        }
      })
    }

    let animId

    function frame() {
      ctx.clearRect(0, 0, W, H)

      // scanlines (battle area only)
      for (let sy = 0; sy < GROUND; sy += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.07)'
        ctx.fillRect(0, sy, W, 1)
      }

      // ground line
      ctx.strokeStyle = C + '40'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(10, GROUND)
      ctx.lineTo(W - 10, GROUND)
      ctx.stroke()

      // static sprites
      drawSprite(ctx, KNIGHT_IDLE, KP, KX, GROUND - KH, false)
      drawSprite(ctx, GOBLIN_IDLE, GP, GX, GROUND - GH, true)

      // HP bars
      drawHpBar('JN',  s.kHp, KX,      GROUND - KH - 16, '#58a6ff')
      drawHpBar('GOB', s.gHp, GX - 10, GROUND - GH - 16, '#5aae2a')

      drawCommandBox(false)

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
```

- [ ] **Step 3: Start dev server and verify static render**

```bash
cd "C:\Users\Jonathan Navarro\Desktop\Jonathan N Portfolio\frontend" && npm run dev
```

Navigate to the Skills section. Verify: knight sprite on left, goblin sprite on right, ground line between them and command box, HP bars labeled `JN` and `GOB`, command box with `▶ ATTACK  MAGIC  ITEM  RUN` visible. No console errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/Skills.jsx
git commit -m "feat(skills): JRPG battle canvas static layout + command box scaffold

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Full Animation Loop — Idle, Click Detection, State Machine, All Commands

This task adds the complete animation logic into `frame()`. Replace the `frame()` function from Task 1 entirely with the version below.

**Files:**
- Modify: `frontend/src/components/Skills.jsx` — replace `frame()` inside `PixelBattleCanvas`

- [ ] **Step 1: Replace `frame()` with the full animated version**

```jsx
function frame() {
  // ── Click detection ──
  if (clicksRef.current !== s.prevClicks) {
    s.prevClicks = clicksRef.current
    if (s.phase === 'idle') {
      s.phase = 'player'
      s.tick = 0
      s.firstClick = true
      s.runOffset = 0
      s.lightningPts = null
      s.lightningLife = 0
      s.blinkVisible = true
    }
  }

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
  ctx.strokeStyle = C + '40'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(10, GROUND)
  ctx.lineTo(W - 10, GROUND)
  ctx.stroke()

  // ── Idle bob + cursor blink ──
  s.blinkFrame++
  const bobY = s.phase === 'idle'
    ? Math.round(Math.sin(s.blinkFrame / 60 * Math.PI * 2))
    : 0
  if (s.phase === 'idle' && s.blinkFrame % 30 === 0) {
    s.blinkVisible = !s.blinkVisible
  }

  // ── Sprite selection ──
  const useKAtk = s.phase === 'player' && s.commandIdx === 0
    && s.tick > 5 && s.tick < 35
  const kSprite = useKAtk ? KNIGHT_ATK : KNIGHT_IDLE
  const gSprite = s.gFlash.life > 0.5 ? GOBLIN_HIT : GOBLIN_IDLE

  // ── Sprite positional offsets ──
  let kOffsetX = 0, gOffsetX = 0
  if (s.phase === 'player' && s.commandIdx === 3) {
    kOffsetX = Math.min(s.tick * 2, 40)
  }
  if (s.phase === 'enemy' && (s.commandIdx === 0 || s.commandIdx === 1)) {
    gOffsetX = s.tick < 15 ? -s.tick * 1.2 : -(30 - s.tick) * 1.2
  }

  // ── Draw sprites ──
  drawSprite(ctx, kSprite, KP, KX + kOffsetX, GROUND - KH + bobY, false)
  drawSprite(ctx, gSprite, GP, GX + gOffsetX, GROUND - GH + bobY, true)

  // ── ATTACK: sword swing ──
  if (s.phase === 'player' && s.commandIdx === 0) {
    const handX = KX + KNIGHT_IDLE[0].length * PS + 2
    const handY = GROUND - KH * 0.58
    const idleAngle = -Math.PI * 0.56
    const swingAngle = Math.PI * 0.08
    const swordAngle = idleAngle + (swingAngle - idleAngle) * Math.min(s.tick / 35, 1)
    const swordLen = 32
    const ex = handX + Math.cos(swordAngle) * swordLen
    const ey = handY + Math.sin(swordAngle) * swordLen
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
      const dmg = 18
      s.gHp = Math.max(0, s.gHp - dmg)
      addFloat(GX + 10, GROUND - GH - 10, `SLASH! -${dmg}`, '#ff6666')
      s.gFlash = { color: 'rgba(255,120,40,', life: 1.4 }
      s.shakeFrames = 8
    }
  }

  // ── MAGIC: lightning bolt + purple screen flash ──
  if (s.phase === 'player' && s.commandIdx === 1) {
    if (s.tick === 5) {
      const x1 = KX + KNIGHT_IDLE[0].length * PS
      const y1 = GROUND - KH * 0.5
      s.lightningPts = buildLightning(x1, y1, GX, GROUND - GH * 0.5)
      s.lightningLife = 18
      const dmg = 32
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

  // draw lightning (shared — can persist into next phase briefly)
  if (s.lightningPts && s.lightningLife > 0) {
    ctx.save()
    ctx.lineWidth = 2
    s.lightningPts.forEach((pt, i) => {
      if (i === s.lightningPts.length - 1) return
      const next = s.lightningPts[i + 1]
      ctx.strokeStyle = i % 2 === 0 ? '#c8b0ff' : '#ffffff'
      ctx.shadowColor = '#9d7fff'; ctx.shadowBlur = 10
      ctx.beginPath(); ctx.moveTo(pt.x, pt.y); ctx.lineTo(next.x, next.y); ctx.stroke()
    })
    ctx.restore()
    s.lightningLife--
  }

  // ── ITEM: potion glow + heal ──
  if (s.phase === 'player' && s.commandIdx === 2) {
    const potX = KX + KNIGHT_IDLE[0].length * PS - 5
    const potY = GROUND - KH * 0.6
    const alpha = Math.sin(s.tick / 40 * Math.PI) * 0.7
    const pg = ctx.createRadialGradient(potX, potY, 0, potX, potY, 12)
    pg.addColorStop(0, `rgba(104,211,145,${alpha})`)
    pg.addColorStop(1, 'rgba(104,211,145,0)')
    ctx.fillStyle = pg
    ctx.beginPath(); ctx.arc(potX, potY, 12, 0, Math.PI * 2); ctx.fill()
    if (s.tick === 15) {
      const heal = 25
      s.kHp = Math.min(100, s.kHp + heal)
      addFloat(KX + 5, GROUND - KH - 10, `POTION! +${heal} HP`, '#68d391')
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
    const dmg = s.commandIdx === 1 ? 10 : 8
    s.kHp = Math.max(0, s.kHp - dmg)
    addFloat(KX, GROUND - KH - 10, `COUNTER! -${dmg}`, '#ff6666')
    s.kFlash = 1.4
    s.shakeFrames = 8
  }

  // ── HP bars ──
  drawHpBar('JN',  s.kHp, KX,      GROUND - KH - 16, '#58a6ff')
  drawHpBar('GOB', s.gHp, GX - 10, GROUND - GH - 16, '#5aae2a')

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
    f.y -= 0.5
    if (f.life <= 0) return false
    ctx.globalAlpha = f.life
    ctx.fillStyle = f.color
    ctx.font = 'bold 8px "Courier New"'
    ctx.textAlign = 'left'
    ctx.fillText(f.text, f.x, f.y)
    ctx.globalAlpha = 1
    return true
  })

  // ── Command box ──
  const showRunMsg = s.phase === 'player' && s.commandIdx === 3 && s.tick > 10
  drawCommandBox(showRunMsg)

  // ── Pre-first-click hint ──
  if (!s.firstClick) {
    ctx.fillStyle = C + '55'
    ctx.font = '6px "Courier New"'
    ctx.textAlign = 'center'
    ctx.fillText('[ CLICK TO COMMAND ]', W / 2, H - 2)
  }

  ctx.restore() // end shake translate

  // ── State machine transitions ──
  if (s.phase !== 'idle') {
    s.tick++

    if (s.phase === 'player' && s.tick >= PLAYER_DUR[s.commandIdx]) {
      if (HAS_COUNTER[s.commandIdx]) {
        s.phase = 'enemy'; s.tick = 0
      } else {
        if (s.gHp <= 0 || s.kHp <= 0) { s.phase = 'result'; s.tick = 0 }
        else { s.commandIdx = (s.commandIdx + 1) % 4; s.phase = 'idle'; s.tick = 0 }
      }
    }

    if (s.phase === 'enemy' && s.tick >= ENEMY_DUR) {
      if (s.gHp <= 0 || s.kHp <= 0) { s.phase = 'result'; s.tick = 0 }
      else { s.commandIdx = (s.commandIdx + 1) % 4; s.phase = 'idle'; s.tick = 0 }
    }

    if (s.phase === 'result' && s.tick >= 90) { s.phase = 'reset'; s.tick = 0 }

    if (s.phase === 'reset') {
      s.kHp = 100; s.gHp = 100; s.commandIdx = 0
      s.floats = []; s.gFlash = { color: '', life: 0 }; s.kFlash = 0
      s.shakeFrames = 0; s.lightningPts = null; s.lightningLife = 0
      s.phase = 'idle'; s.tick = 0
    }
  }

  animId = requestAnimationFrame(frame)
}
```

- [ ] **Step 2: Verify animation loop in browser**

Navigate to Skills section. Click the Game Development card and verify each click behavior:
- **1st click:** Knight swings sword, `SLASH! -18` floats red over goblin, goblin flashes orange, screen shakes, then goblin lurches and `COUNTER! -8` floats over knight, both HP bars decrease. Cursor advances to `MAGIC`.
- **2nd click:** Purple screen flash, lightning bolt fires, `ARCANE! -32` floats purple, goblin flashes violet, counter fires `-10` on knight. Cursor advances to `ITEM`.
- **3rd click:** Green glow at knight's hand, `POTION! +25 HP` floats green, knight HP bar refills. No enemy counter. Cursor advances to `RUN`.
- **4th click:** Knight slides right, command box shows `…but failed!`. Cursor resets to `ATTACK`.
- **Idle:** Sprites bob subtly, `▶` blinks every ~0.5s.
- **HP crit (<25%):** HP bar turns red and pulses.
- **Win/loss:** When any HP reaches 0, `VICTORY!` or `DEFEATED!` appears centered, then resets after 1.5s.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Skills.jsx
git commit -m "feat(skills): full JRPG battle state machine — all 4 commands, floats, shake, win/reset

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Update DOMAINS Hint + Final Cleanup

**Files:**
- Modify: `frontend/src/components/Skills.jsx:754`

- [ ] **Step 1: Update the game domain hint string**

Find in `DOMAINS`:
```js
{ id: 'game', accent: ACCENT.game, label: 'Game Development', ..., hint: '[ CLICK TO CHANGE ATTACK ]' },
```

Change `hint` to:
```js
hint: '[ CLICK TO COMMAND ]'
```

- [ ] **Step 2: Verify hint shows before first click, hides after**

In browser: reload page, scroll to Skills. The Game Development card should show `[ CLICK TO COMMAND ]` below the canvas. After clicking the card once, the hint disappears.

- [ ] **Step 3: Final commit**

```bash
git add frontend/src/components/Skills.jsx
git commit -m "fix(skills): update game card hint to '[ CLICK TO COMMAND ]'

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Self-Review

### Spec coverage

| Spec requirement | Task covering it |
|---|---|
| Canvas layout 380×150, battle area ~97px, command box ~53px | Task 1 (`GROUND=97`, `CMD_Y=102`) |
| HP bars labeled JN/GOB, crit pulse <25% | Task 1 (`drawHpBar`), Task 2 (blink logic) |
| 4 commands in row, `▶` cursor highlights active | Task 1 (`drawCommandBox`) |
| Cursor blinks every 30 frames while idle | Task 2 (`blinkFrame % 30`) |
| ATTACK: sword swing, SLASH! -18, goblin flash orange | Task 2 |
| ATTACK: enemy counter -8 on knight | Task 2 |
| MAGIC: lightning bolt, ARCANE! -32, purple screen flash | Task 2 |
| MAGIC: enemy counter -10 on knight | Task 2 |
| ITEM: potion glow, POTION! +25 HP, no counter | Task 2 |
| RUN: knight slides right, "…but failed!" in command box, no counter | Task 2 |
| Cursor resets to ATTACK after RUN | Task 2 (`commandIdx = (commandIdx+1) % 4`) |
| Floating numbers drift up ~20px over 40 frames, fade out | Task 2 (float filter, `life -= 1/40`, `y -= 0.5`) |
| Damage red/orange, heal green, 8px bold Courier New | Task 2 (`addFloat` colors, font) |
| Screen shake 3px, 8 frames, on any hit | Task 2 (`shakeFrames`, translate) |
| Goblin flash: orange on ATTACK, purple on MAGIC | Task 2 (gFlash color set per command) |
| Knight flash: blue on taking damage | Task 2 (kFlash = `rgba(100,160,255,...)`) |
| VICTORY/DEFEATED overlay, 90-frame hold, then reset | Task 2 (result/reset phase) |
| Idle sprite bob ±1px, 60-frame period | Task 2 (`bobY = Math.sin(blinkFrame/60*2π)`) |
| `[ CLICK TO COMMAND ]` hint, hidden after first click | Task 2 (`firstClick` flag) |
| Keep: KP, KNIGHT_IDLE/ATK, GP, GOBLIN_IDLE/HIT, drawSprite, ACCENT.game | All tasks (never removed) |
| Remove: ATTACK_LABELS, PHASE_DUR, makeLightning, fireball system | Task 1 |
| Update DOMAINS[3].hint | Task 3 |

### Placeholder scan

None found. All steps contain actual code.

### Type consistency

- `s.gFlash` is always `{ color: string, life: number }` — set in ATTACK (`rgba(255,120,40,`), MAGIC (`rgba(157,127,255,`), and reset in RESET phase. Read in flash draw block with same shape.
- `s.floats` entries are always `{ x, y, text, color, life }` — created by `addFloat`, consumed in filter block.
- `buildLightning` returns `{ x, y }[]` — same shape consumed in lightning draw loop.
- `s.commandIdx` is always 0–3, used consistently in `COMMANDS[i]`, `PLAYER_DUR[i]`, `HAS_COUNTER[i]`.
- `s.tick` is incremented at end of frame and reset to 0 on phase transition. All `s.tick === N` checks fire exactly once per phase.
