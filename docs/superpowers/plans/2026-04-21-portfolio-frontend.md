# Portfolio Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete React frontend for Jonathan Navarro's portfolio — muted cyberpunk aesthetic, scroll-driven color transitions, and click-to-unlock project color system.

**Architecture:** Vite + React SPA with a single `ColorContext` managing all color state. Two hooks (`useScrollZone`, `useColorUnlock`) drive the two interlocking visual mechanics. All sections are isolated components with plain CSS files. React Router v6 handles the `/projects/:id` detail route.

**Tech Stack:** Vite, React 18, React Router v6, Vitest, @testing-library/react, CSS custom properties (no framework)

---

## File Map

| File | Responsibility |
|------|---------------|
| `frontend/src/styles/globals.css` | CSS reset, custom properties, body styles |
| `frontend/src/data/projects.js` | Static project data + accent colors |
| `frontend/src/context/ColorContext.jsx` | Shared scroll zone + unlock state (useReducer) |
| `frontend/src/hooks/useScrollZone.js` | Maps scroll% → CSS custom property updates |
| `frontend/src/hooks/useColorUnlock.js` | Unlock state helpers + exploredPercent |
| `frontend/src/components/ScrollZoneWatcher.jsx` | Renderless component that calls useScrollZone |
| `frontend/src/components/AmbientOverlay.jsx` | Fixed radial-gradient overlay per unlocked project |
| `frontend/src/components/Toast.jsx` | Full-unlock celebration toast |
| `frontend/src/components/Navbar.jsx` | Fixed top nav with EXPLORED X% progress bar |
| `frontend/src/components/Hero.jsx` | Full-viewport hero with name, title, CTAs |
| `frontend/src/components/About.jsx` | Bio + terminal-style whoami card |
| `frontend/src/components/Skills.jsx` | Categorized skill bars with IntersectionObserver |
| `frontend/src/components/Projects/ProjectCard.jsx` | Single project card (unlock on click, expand to detail) |
| `frontend/src/components/Projects/Projects.jsx` | Projects section wrapping 6 ProjectCards |
| `frontend/src/components/Contact.jsx` | Validated contact form (frontend-only) |
| `frontend/src/components/Footer.jsx` | GitHub / LinkedIn / email links |
| `frontend/src/pages/ProjectDetail.jsx` | Project detail page (problem → built → outcome) |
| `frontend/src/App.jsx` | Root: ColorProvider, BrowserRouter, routes |
| `frontend/src/main.jsx` | Vite entry point |
| `frontend/public/resume.pdf` | Resume PDF (copy from repo root) |

---

## Task 1: Scaffold Vite + React project

**Files:**
- Create: `frontend/` (Vite scaffold)
- Modify: `frontend/vite.config.js`
- Create: `frontend/src/test/setup.js`

- [ ] **Step 1: Scaffold the project**

Run from repo root (`C:\Users\Jonathan Navarro\Desktop\Jonathan N Portfolio`):
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Configure Vitest in vite.config.js**

Replace `frontend/vite.config.js` with:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
  },
})
```

- [ ] **Step 3: Create test setup file**

Create `frontend/src/test/setup.js`:
```js
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add test script to package.json**

In `frontend/package.json`, add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 5: Delete Vite boilerplate**

Delete these files:
```bash
rm frontend/src/App.css
rm frontend/src/index.css
rm frontend/src/assets/react.svg
rm frontend/public/vite.svg
```

- [ ] **Step 6: Verify scaffold works**

```bash
cd frontend && npm run dev
```
Expected: Vite dev server starts at `http://localhost:5173`. App renders (broken styles OK — we haven't written our own yet). Stop the server with `Ctrl+C`.

- [ ] **Step 7: Commit**

```bash
cd .. && git add frontend/ && git commit -m "feat: scaffold Vite + React frontend with Vitest"
```

---

## Task 2: Copy resume PDF to public/

**Files:**
- Create: `frontend/public/resume.pdf`

- [ ] **Step 1: Copy PDF**

```bash
cp "Jonathan Navarro Resume (1).pdf" frontend/public/resume.pdf
```

- [ ] **Step 2: Commit**

```bash
git add frontend/public/resume.pdf && git commit -m "feat: add resume PDF to public/"
```

---

## Task 3: Create globals.css

**Files:**
- Create: `frontend/src/styles/globals.css`

- [ ] **Step 1: Create styles directory and globals.css**

Create `frontend/src/styles/globals.css`:
```css
:root {
  --bg: #111111;
  --accent: #e8a838;
  --text: #e0e0e0;
  --text-muted: #888888;
  --font-mono: 'Courier New', Courier, monospace;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, sans-serif;
  transition: background-color 0.4s ease;
  will-change: background-color;
  min-height: 100vh;
}

h1, h2, h3, label, .mono {
  font-family: var(--font-mono);
}

.section-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--accent);
  margin-bottom: 2.5rem;
  transition: color 0.3s ease;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/styles/ && git commit -m "feat: add globals.css with CSS custom properties"
```

---

## Task 4: Create projects.js data

**Files:**
- Create: `frontend/src/data/projects.js`

- [ ] **Step 1: Create projects.js**

Create `frontend/src/data/projects.js`:
```js
export const projects = [
  {
    id: 'pokemon-battle-bot',
    title: 'Pokémon Battle Bot',
    description: 'Reinforcement learning agent that masters competitive Pokémon battles using PPO.',
    technologies: ['Python', 'PPO', 'Stable-Baselines3', 'Gymnasium'],
    accentColor: '#e8a838',
    detail: {
      problem: 'Training an AI to play competitive Pokémon requires handling complex game state, partial information, and long-horizon rewards with sparse feedback.',
      built: 'Implemented a Proximal Policy Optimization agent using Stable-Baselines3 and a custom Gymnasium environment wrapping the Pokémon Showdown battle simulator.',
      outcome: 'Agent surpassed random baseline play and demonstrated adaptive battle strategies — switching moves based on type matchups — after extended training.',
    },
  },
  {
    id: 'rgv-tutor',
    title: 'RGV Tutor',
    description: 'AI-powered tutoring platform using local LLM inference — 2nd Place AI/ML Hackathon.',
    technologies: ['Flutter', 'Node.js', 'Ollama', 'SQLite'],
    accentColor: '#3dd6c8',
    detail: {
      problem: 'Students in the Rio Grande Valley lack affordable, personalized tutoring resources. Cloud AI costs make real-time tutoring apps expensive to run.',
      built: 'Flutter mobile app backed by a Node.js server running Ollama for fully local LLM inference. SQLite persists session history for continuity across conversations.',
      outcome: '2nd Place at the AI/ML Hackathon. Demonstrated real-time tutoring with zero cloud API costs — fully runnable on a laptop.',
    },
  },
  {
    id: 'frontera-hackathon',
    title: 'Frontera Gemini Hackathon',
    description: 'Financial literacy app built with Gemini AI — 1st Place Financial Track.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    accentColor: '#58a6ff',
    detail: {
      problem: 'First-generation college students lack accessible, personalized financial guidance — budgeting, loans, and investing are overwhelming without context.',
      built: 'Full-stack web app: React frontend, Express API, MongoDB storage, integrated with Google Gemini for personalized financial coaching based on the user\'s situation.',
      outcome: '1st Place in the Financial Track at Frontera Hackathon 2024.',
    },
  },
  {
    id: '2d-action-rpg',
    title: '2D Action RPG',
    description: 'A complete 2D action RPG with combat, levels, and enemies built in Unity.',
    technologies: ['Unity', 'C#'],
    accentColor: '#9d7fff',
    detail: {
      problem: 'Designing a full game loop from scratch — player movement, enemy AI, combat feel, and progression systems — requires every system to work in concert.',
      built: 'Built in Unity with C#: player controller with dash + melee combat, enemy state machines (patrol/chase/attack), inventory system, and hand-crafted level design.',
      outcome: 'Fully playable vertical slice with multiple enemy types, a boss encounter, and a complete win/lose loop.',
    },
  },
  {
    id: 'college-social-app',
    title: 'College Social Life App',
    description: 'MERN stack social platform connecting college students around campus events.',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
    accentColor: '#f472b6',
    detail: {
      problem: 'College students struggle to discover on-campus events and connect with peers who share their interests — information is scattered across flyers, GroupMe, and word of mouth.',
      built: 'Full MERN stack app with JWT auth, event creation and RSVP system, interest-based feed, and real-time notifications using Socket.io.',
      outcome: 'Functional MVP: user registration, event discovery, RSVP flow, and a live-updating feed filtered by user interests.',
    },
  },
  {
    id: 'roblox-ux-redesign',
    title: 'Roblox UX/UI Redesign',
    description: "Figma redesign of Roblox's core UI targeting improved discoverability and modern aesthetics.",
    technologies: ['Figma'],
    accentColor: '#fb923c',
    detail: {
      problem: "Roblox's existing UI has discoverability issues, visual inconsistency across platforms, and an outdated aesthetic that doesn't reflect the platform's scale.",
      built: 'High-fidelity Figma prototype redesigning the home feed, game detail pages, search, and navigation. Includes a full design system: component library, color tokens, and typography scale.',
      outcome: 'Complete interactive prototype with 30+ screens, a reusable component library, and a style guide ready for developer handoff.',
    },
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/data/ && git commit -m "feat: add projects data with accent colors and detail copy"
```

---

## Task 5: Create ColorContext with tests

**Files:**
- Create: `frontend/src/context/ColorContext.jsx`
- Create: `frontend/src/context/ColorContext.test.js`

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/context/ColorContext.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { colorReducer } from './ColorContext'

describe('colorReducer', () => {
  const initial = { scrollZone: 1, unlockedIds: new Set() }

  it('SET_ZONE updates scrollZone', () => {
    const result = colorReducer(initial, { type: 'SET_ZONE', zone: 2 })
    expect(result.scrollZone).toBe(2)
  })

  it('SET_ZONE does not mutate unlockedIds', () => {
    const result = colorReducer(initial, { type: 'SET_ZONE', zone: 3 })
    expect(result.unlockedIds).toBe(initial.unlockedIds)
  })

  it('UNLOCK_PROJECT adds id to unlockedIds', () => {
    const result = colorReducer(initial, { type: 'UNLOCK_PROJECT', id: 'test-id' })
    expect(result.unlockedIds.has('test-id')).toBe(true)
  })

  it('UNLOCK_PROJECT returns same reference when id already unlocked', () => {
    const state = { scrollZone: 1, unlockedIds: new Set(['test-id']) }
    const result = colorReducer(state, { type: 'UNLOCK_PROJECT', id: 'test-id' })
    expect(result).toBe(state)
  })

  it('UNLOCK_PROJECT does not mutate existing unlockedIds set', () => {
    const state = { scrollZone: 1, unlockedIds: new Set(['a']) }
    const result = colorReducer(state, { type: 'UNLOCK_PROJECT', id: 'b' })
    expect(state.unlockedIds.has('b')).toBe(false)
    expect(result.unlockedIds.has('b')).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd frontend && npx vitest run src/context/ColorContext.test.js
```
Expected: FAIL — `colorReducer is not exported`

- [ ] **Step 3: Create ColorContext.jsx**

Create `frontend/src/context/ColorContext.jsx`:
```jsx
import { createContext, useContext, useReducer } from 'react'

const ColorContext = createContext(null)

const initialState = {
  scrollZone: 1,
  unlockedIds: new Set(),
}

export function colorReducer(state, action) {
  switch (action.type) {
    case 'SET_ZONE':
      return { ...state, scrollZone: action.zone }
    case 'UNLOCK_PROJECT':
      if (state.unlockedIds.has(action.id)) return state
      return { ...state, unlockedIds: new Set([...state.unlockedIds, action.id]) }
    default:
      return state
  }
}

export function ColorProvider({ children }) {
  const [state, dispatch] = useReducer(colorReducer, initialState)
  return (
    <ColorContext.Provider value={{ state, dispatch }}>
      {children}
    </ColorContext.Provider>
  )
}

export function useColorContext() {
  const ctx = useContext(ColorContext)
  if (!ctx) throw new Error('useColorContext must be used inside ColorProvider')
  return ctx
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run src/context/ColorContext.test.js
```
Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/context/ && git commit -m "feat: add ColorContext with useReducer and passing tests"
```

---

## Task 6: Create useScrollZone with tests

**Files:**
- Create: `frontend/src/hooks/useScrollZone.js`
- Create: `frontend/src/hooks/useScrollZone.test.js`

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/hooks/useScrollZone.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { interpolateColor, getZoneIndex } from './useScrollZone'

describe('interpolateColor', () => {
  it('returns start color at t=0', () => {
    expect(interpolateColor('#000000', '#ffffff', 0)).toBe('#000000')
  })

  it('returns end color at t=1', () => {
    expect(interpolateColor('#000000', '#ffffff', 1)).toBe('#ffffff')
  })

  it('interpolates midpoint correctly', () => {
    expect(interpolateColor('#000000', '#ffffff', 0.5)).toBe('#7f7f7f')
  })

  it('interpolates between two real zone colors', () => {
    const result = interpolateColor('#111111', '#0d1117', 0)
    expect(result).toBe('#111111')
  })
})

describe('getZoneIndex', () => {
  it('returns 0 for scroll at 0%', () => {
    expect(getZoneIndex(0)).toBe(0)
  })

  it('returns 0 for scroll at 32%', () => {
    expect(getZoneIndex(0.32)).toBe(0)
  })

  it('returns 1 for scroll at 33%', () => {
    expect(getZoneIndex(0.33)).toBe(1)
  })

  it('returns 1 for scroll at 65%', () => {
    expect(getZoneIndex(0.65)).toBe(1)
  })

  it('returns 2 for scroll at 66%', () => {
    expect(getZoneIndex(0.66)).toBe(2)
  })

  it('returns 2 for scroll at 100%', () => {
    expect(getZoneIndex(1)).toBe(2)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/hooks/useScrollZone.test.js
```
Expected: FAIL — `interpolateColor is not exported`

- [ ] **Step 3: Create useScrollZone.js**

Create `frontend/src/hooks/useScrollZone.js`:
```js
import { useEffect } from 'react'
import { useColorContext } from '../context/ColorContext'

const ZONES = [
  { zone: 1, bg: '#111111', accent: '#e8a838' },
  { zone: 2, bg: '#0d1117', accent: '#3dd6c8' },
  { zone: 3, bg: '#10101a', accent: '#9d7fff' },
]

export function getZoneIndex(scrollPercent) {
  if (scrollPercent < 0.33) return 0
  if (scrollPercent < 0.66) return 1
  return 2
}

export function interpolateColor(hex1, hex2, t) {
  const r1 = parseInt(hex1.slice(1, 3), 16)
  const g1 = parseInt(hex1.slice(3, 5), 16)
  const b1 = parseInt(hex1.slice(5, 7), 16)
  const r2 = parseInt(hex2.slice(1, 3), 16)
  const g2 = parseInt(hex2.slice(3, 5), 16)
  const b2 = parseInt(hex2.slice(5, 7), 16)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export default function useScrollZone() {
  const { dispatch } = useColorContext()

  useEffect(() => {
    let rafId = null

    function handleScroll() {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const scrollY = window.scrollY
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0

        const zoneIdx = getZoneIndex(scrollPercent)
        const nextIdx = Math.min(zoneIdx + 1, ZONES.length - 1)

        const zoneFraction =
          zoneIdx === 0 ? scrollPercent / 0.33
          : zoneIdx === 1 ? (scrollPercent - 0.33) / 0.33
          : (scrollPercent - 0.66) / 0.34

        const bg = interpolateColor(ZONES[zoneIdx].bg, ZONES[nextIdx].bg, zoneFraction)
        const accent = interpolateColor(ZONES[zoneIdx].accent, ZONES[nextIdx].accent, zoneFraction)

        document.documentElement.style.setProperty('--bg', bg)
        document.documentElement.style.setProperty('--accent', accent)
        dispatch({ type: 'SET_ZONE', zone: zoneIdx + 1 })
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dispatch])
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run src/hooks/useScrollZone.test.js
```
Expected: 10 tests PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/hooks/useScrollZone.js frontend/src/hooks/useScrollZone.test.js && git commit -m "feat: add useScrollZone with interpolateColor and passing tests"
```

---

## Task 7: Create useColorUnlock

**Files:**
- Create: `frontend/src/hooks/useColorUnlock.js`

- [ ] **Step 1: Create useColorUnlock.js**

Create `frontend/src/hooks/useColorUnlock.js`:
```js
import { useCallback } from 'react'
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'

export default function useColorUnlock() {
  const { state, dispatch } = useColorContext()

  const unlockProject = useCallback((id) => {
    dispatch({ type: 'UNLOCK_PROJECT', id })
  }, [dispatch])

  const exploredPercent = Math.round((state.unlockedIds.size / projects.length) * 100)
  const isFullyUnlocked = state.unlockedIds.size === projects.length
  const unlockedProjects = projects.filter(p => state.unlockedIds.has(p.id))

  return {
    unlockProject,
    exploredPercent,
    isFullyUnlocked,
    unlockedProjects,
    unlockedIds: state.unlockedIds,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/hooks/useColorUnlock.js && git commit -m "feat: add useColorUnlock hook"
```

---

## Task 8: Create ScrollZoneWatcher

**Files:**
- Create: `frontend/src/components/ScrollZoneWatcher.jsx`

- [ ] **Step 1: Create ScrollZoneWatcher.jsx**

Create `frontend/src/components/ScrollZoneWatcher.jsx`:
```jsx
import useScrollZone from '../hooks/useScrollZone'

export default function ScrollZoneWatcher() {
  useScrollZone()
  return null
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ScrollZoneWatcher.jsx && git commit -m "feat: add ScrollZoneWatcher renderless component"
```

---

## Task 9: Create AmbientOverlay

**Files:**
- Create: `frontend/src/components/AmbientOverlay.jsx`
- Create: `frontend/src/components/AmbientOverlay.css`

- [ ] **Step 1: Create AmbientOverlay.css**

Create `frontend/src/components/AmbientOverlay.css`:
```css
.ambient-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  transition: background 0.8s ease;
}
```

- [ ] **Step 2: Create AmbientOverlay.jsx**

Create `frontend/src/components/AmbientOverlay.jsx`:
```jsx
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'
import './AmbientOverlay.css'

const POSITIONS = {
  'pokemon-battle-bot': '20% 30%',
  'rgv-tutor': '75% 55%',
  'frontera-hackathon': '50% 15%',
  '2d-action-rpg': '30% 75%',
  'college-social-app': '80% 40%',
  'roblox-ux-redesign': '10% 85%',
}

export default function AmbientOverlay() {
  const { state } = useColorContext()
  const unlockedProjects = projects.filter(p => state.unlockedIds.has(p.id))

  if (unlockedProjects.length === 0) return null

  const gradients = unlockedProjects
    .map(p => `radial-gradient(ellipse 50% 40% at ${POSITIONS[p.id]}, ${p.accentColor}1a 0%, transparent 70%)`)
    .join(', ')

  return <div className="ambient-overlay" style={{ background: gradients }} />
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/AmbientOverlay.jsx frontend/src/components/AmbientOverlay.css && git commit -m "feat: add AmbientOverlay with per-project radial gradients"
```

---

## Task 10: Create Toast

**Files:**
- Create: `frontend/src/components/Toast.jsx`
- Create: `frontend/src/components/Toast.css`

- [ ] **Step 1: Create Toast.css**

Create `frontend/src/components/Toast.css`:
```css
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 10, 10, 0.95);
  border: 1px solid var(--accent);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  padding: 0.75rem 1.5rem;
  z-index: 200;
  animation: slideUp 0.4s ease;
  white-space: nowrap;
  transition: color 0.3s ease, border-color 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(1rem); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
```

- [ ] **Step 2: Create Toast.jsx**

Create `frontend/src/components/Toast.jsx`:
```jsx
import { useEffect, useState } from 'react'
import useColorUnlock from '../hooks/useColorUnlock'
import './Toast.css'

export default function Toast() {
  const { isFullyUnlocked } = useColorUnlock()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isFullyUnlocked) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [isFullyUnlocked])

  if (!visible) return null

  return (
    <div className="toast" role="status">
      ALL PROJECTS UNLOCKED — FULL SPECTRUM ACHIEVED
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Toast.jsx frontend/src/components/Toast.css && git commit -m "feat: add Toast component for full-unlock celebration"
```

---

## Task 11: Create Navbar

**Files:**
- Create: `frontend/src/components/Navbar.jsx`
- Create: `frontend/src/components/Navbar.css`

- [ ] **Step 1: Create Navbar.css**

Create `frontend/src/components/Navbar.css`:
```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
}

.navbar-logo {
  font-family: var(--font-mono);
  color: var(--accent);
  font-size: 1rem;
  letter-spacing: 0.12em;
  transition: color 0.3s ease;
}

.navbar-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.progress-bar {
  width: 120px;
  height: 2px;
  background: rgba(255, 255, 255, 0.08);
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.5s ease, background-color 0.3s ease;
}
```

- [ ] **Step 2: Create Navbar.jsx**

Create `frontend/src/components/Navbar.jsx`:
```jsx
import useColorUnlock from '../hooks/useColorUnlock'
import './Navbar.css'

export default function Navbar() {
  const { exploredPercent } = useColorUnlock()

  return (
    <nav className="navbar">
      <span className="navbar-logo">JN.DEV</span>
      <div className="navbar-progress">
        <span className="progress-label">EXPLORED {exploredPercent}%</span>
        <div className="progress-bar" role="progressbar" aria-valuenow={exploredPercent} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${exploredPercent}%` }} />
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Navbar.jsx frontend/src/components/Navbar.css && git commit -m "feat: add Navbar with EXPLORED progress bar"
```

---

## Task 12: Create Hero

**Files:**
- Create: `frontend/src/components/Hero.jsx`
- Create: `frontend/src/components/Hero.css`

- [ ] **Step 1: Create Hero.css**

Create `frontend/src/components/Hero.css`:
```css
.hero {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.hero-content {
  text-align: center;
  padding: 2rem;
}

.hero-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.3em;
  color: var(--accent);
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.hero-name {
  font-family: var(--font-mono);
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 700;
  line-height: 1.05;
  color: #e0e0e0;
  margin-bottom: 1.5rem;
}

.cursor {
  color: var(--accent);
  animation: blink 1s step-end infinite;
  transition: color 0.3s ease;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-title {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--text-muted);
  letter-spacing: 0.2em;
  margin-bottom: 2.5rem;
}

.hero-ctas {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  padding: 0.75rem 2rem;
  background: var(--accent);
  color: #111;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease, background-color 0.3s ease;
}

.btn-primary:hover {
  opacity: 0.85;
}

.btn-secondary {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  padding: 0.75rem 2rem;
  background: transparent;
  color: var(--accent);
  border: 1px solid var(--accent);
  text-decoration: none;
  display: inline-block;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.3s ease;
}

.btn-secondary:hover {
  background: var(--accent);
  color: #111;
}
```

- [ ] **Step 2: Create Hero.jsx**

Create `frontend/src/components/Hero.jsx`:
```jsx
import './Hero.css'

export default function Hero() {
  function scrollToProjects() {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">HELLO, I AM</p>
        <h1 className="hero-name">
          Jonathan<br />Navarro<span className="cursor">_</span>
        </h1>
        <p className="hero-title">CS Student · Developer · Builder</p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={scrollToProjects}>
            VIEW PROJECTS
          </button>
          <a className="btn-secondary" href="/resume.pdf" download="Jonathan_Navarro_Resume.pdf">
            DOWNLOAD RESUME
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Hero.jsx frontend/src/components/Hero.css && git commit -m "feat: add Hero section with blinking cursor and CTA buttons"
```

---

## Task 13: Create About

**Files:**
- Create: `frontend/src/components/About.jsx`
- Create: `frontend/src/components/About.css`

- [ ] **Step 1: Create About.css**

Create `frontend/src/components/About.css`:
```css
.about {
  padding: 7rem 2rem;
  position: relative;
  z-index: 1;
}

.about-container {
  max-width: 900px;
  margin: 0 auto;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.about-bio p {
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.terminal-card {
  background: #0a0a0a;
  border: 1px solid #1e1e1e;
  font-family: var(--font-mono);
  font-size: 0.82rem;
}

.terminal-header {
  display: flex;
  gap: 0.4rem;
  padding: 0.6rem 0.8rem;
  background: #121212;
  border-bottom: 1px solid #1e1e1e;
}

.terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2a2a2a;
}

.terminal-body {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.terminal-prompt {
  color: var(--accent);
  transition: color 0.3s ease;
}

.terminal-output {
  color: #888;
  padding-left: 0.5rem;
}

.terminal-cursor {
  color: var(--accent);
  animation: blink 1s step-end infinite;
  transition: color 0.3s ease;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 640px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Create About.jsx**

Create `frontend/src/components/About.jsx`:
```jsx
import './About.css'

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <h2 className="section-label">// ABOUT</h2>
        <div className="about-grid">
          <div className="about-bio">
            <p>
              I'm a Computer Science student at UTRGV with a passion for building things —
              from reinforcement learning bots to full-stack web apps to 2D games.
              I thrive at the intersection of engineering and creativity, and I love
              competitions: two hackathon placements (1st and 2nd) in 2024.
            </p>
            <p>
              When I'm not coding, I'm designing, gaming, or thinking about
              how AI is changing the way we build software.
            </p>
          </div>
          <div className="terminal-card">
            <div className="terminal-header">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
            </div>
            <div className="terminal-body">
              <p><span className="terminal-prompt">$ whoami</span></p>
              <p className="terminal-output">Jonathan Navarro</p>
              <p><span className="terminal-prompt">$ cat info.txt</span></p>
              <p className="terminal-output">📍 Rio Grande Valley, TX</p>
              <p className="terminal-output">🎓 CS @ UTRGV</p>
              <p className="terminal-output">🏆 2× Hackathon winner</p>
              <p className="terminal-output">⚡ ML · Web · Game Dev</p>
              <p><span className="terminal-cursor">_</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/About.jsx frontend/src/components/About.css && git commit -m "feat: add About section with terminal whoami card"
```

---

## Task 14: Create Skills

**Files:**
- Create: `frontend/src/components/Skills.jsx`
- Create: `frontend/src/components/Skills.css`

- [ ] **Step 1: Create Skills.css**

Create `frontend/src/components/Skills.css`:
```css
.skills {
  padding: 7rem 2rem;
  position: relative;
  z-index: 1;
}

.skills-container {
  max-width: 900px;
  margin: 0 auto;
}

.skills-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem 4rem;
}

.category-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  color: #444;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
}

.skill-item {
  margin-bottom: 1rem;
}

.skill-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.skill-name {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text);
}

.skill-level {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--accent);
  transition: color 0.3s ease;
}

.skill-track {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
}

.skill-fill {
  height: 100%;
  background: var(--accent);
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease;
}

@media (max-width: 640px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Create Skills.jsx**

Create `frontend/src/components/Skills.jsx`:
```jsx
import { useEffect, useRef, useState } from 'react'
import './Skills.css'

const SKILL_CATEGORIES = [
  {
    label: 'Languages',
    skills: [
      { name: 'Python', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'C#', level: 75 },
      { name: 'Dart / Flutter', level: 70 },
    ],
  },
  {
    label: 'Frameworks & Libraries',
    skills: [
      { name: 'React', level: 85 },
      { name: 'Node.js / Express', level: 80 },
      { name: 'Unity', level: 75 },
      { name: 'Stable-Baselines3', level: 70 },
    ],
  },
  {
    label: 'Tools & Platforms',
    skills: [
      { name: 'Git / GitHub', level: 90 },
      { name: 'Figma', level: 80 },
      { name: 'MongoDB', level: 75 },
      { name: 'Vite', level: 70 },
    ],
  },
  {
    label: 'AI / ML',
    skills: [
      { name: 'Reinforcement Learning', level: 75 },
      { name: 'Ollama / Local LLMs', level: 75 },
      { name: 'Gemini API', level: 70 },
      { name: 'Gymnasium', level: 70 },
    ],
  },
]

function SkillBar({ name, level, animate }) {
  return (
    <div className="skill-item">
      <div className="skill-meta">
        <span className="skill-name">{name}</span>
        <span className="skill-level">{level}%</span>
      </div>
      <div className="skill-track">
        <div className="skill-fill" style={{ width: animate ? `${level}%` : '0%' }} />
      </div>
    </div>
  )
}

export default function Skills() {
  const ref = useRef(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="skills" id="skills" ref={ref}>
      <div className="skills-container">
        <h2 className="section-label">// SKILLS</h2>
        <div className="skills-grid">
          {SKILL_CATEGORIES.map(cat => (
            <div key={cat.label} className="skill-category">
              <h3 className="category-label">{cat.label}</h3>
              {cat.skills.map(s => (
                <SkillBar key={s.name} name={s.name} level={s.level} animate={animate} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Skills.jsx frontend/src/components/Skills.css && git commit -m "feat: add Skills section with IntersectionObserver animated bars"
```

---

## Task 15: Create ProjectCard

**Files:**
- Create: `frontend/src/components/Projects/ProjectCard.jsx`
- Create: `frontend/src/components/Projects/ProjectCard.css`

- [ ] **Step 1: Create ProjectCard.css**

Create `frontend/src/components/Projects/ProjectCard.css`:
```css
.project-card {
  border: 1px solid #1a1a1a;
  padding: 1.5rem;
  cursor: pointer;
  background: #090909;
  transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.2s ease;
  position: relative;
  z-index: 1;
}

.project-card:hover {
  transform: translateY(-2px);
}

.project-card.unlocked {
  background: #0c0c0c;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.card-title {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: #3a3a3a;
  transition: color 0.4s ease;
  flex: 1;
  margin-right: 0.5rem;
}

.card-arrow {
  background: none;
  border: none;
  color: #2a2a2a;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.4s ease;
  flex-shrink: 0;
}

.card-arrow:hover {
  opacity: 0.7;
}

.project-card.unlocked .card-arrow {
  color: var(--project-accent);
}

.card-description {
  font-size: 0.8rem;
  color: #2e2e2e;
  line-height: 1.6;
  margin-bottom: 1rem;
  transition: color 0.4s ease;
}

.project-card.unlocked .card-description {
  color: #777;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.card-tag {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  padding: 0.2rem 0.5rem;
  border: 1px solid #1e1e1e;
  color: #333;
  letter-spacing: 0.05em;
  transition: border-color 0.4s ease, color 0.4s ease;
}
```

- [ ] **Step 2: Create ProjectCard.jsx**

Create `frontend/src/components/Projects/ProjectCard.jsx`:
```jsx
import { useNavigate } from 'react-router-dom'
import useColorUnlock from '../../hooks/useColorUnlock'
import './ProjectCard.css'

export default function ProjectCard({ project }) {
  const { unlockProject, unlockedIds } = useColorUnlock()
  const navigate = useNavigate()
  const isUnlocked = unlockedIds.has(project.id)

  function handleCardClick() {
    unlockProject(project.id)
  }

  function handleExpand(e) {
    e.stopPropagation()
    navigate(`/projects/${project.id}`)
  }

  const unlockedStyles = isUnlocked
    ? { '--project-accent': project.accentColor, borderColor: project.accentColor, boxShadow: `0 0 24px ${project.accentColor}22` }
    : {}

  return (
    <div
      className={`project-card${isUnlocked ? ' unlocked' : ''}`}
      style={unlockedStyles}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleCardClick()}
    >
      <div className="card-header">
        <h3 className="card-title" style={isUnlocked ? { color: project.accentColor } : {}}>
          {project.title}
        </h3>
        <button
          className="card-arrow"
          onClick={handleExpand}
          aria-label={`View ${project.title} details`}
        >
          →
        </button>
      </div>
      <p className="card-description">{project.description}</p>
      <div className="card-tags">
        {project.technologies.map(tech => (
          <span
            key={tech}
            className="card-tag"
            style={isUnlocked ? { borderColor: `${project.accentColor}55`, color: project.accentColor } : {}}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Projects/ && git commit -m "feat: add ProjectCard with unlock mechanic and detail navigation"
```

---

## Task 16: Create Projects section

**Files:**
- Create: `frontend/src/components/Projects/Projects.jsx`
- Create: `frontend/src/components/Projects/Projects.css`

- [ ] **Step 1: Create Projects.css**

Create `frontend/src/components/Projects/Projects.css`:
```css
.projects {
  padding: 7rem 2rem;
  position: relative;
  z-index: 1;
}

.projects-container {
  max-width: 900px;
  margin: 0 auto;
}

.projects-hint {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: #2a2a2a;
  letter-spacing: 0.12em;
  margin-bottom: 2.5rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Create Projects.jsx**

Create `frontend/src/components/Projects/Projects.jsx`:
```jsx
import { projects } from '../../data/projects'
import ProjectCard from './ProjectCard'
import './Projects.css'

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="projects-container">
        <h2 className="section-label">// PROJECTS</h2>
        <p className="projects-hint">Click a project to unlock its story.</p>
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Projects/Projects.jsx frontend/src/components/Projects/Projects.css && git commit -m "feat: add Projects section with 6-card grid"
```

---

## Task 17: Create Contact with validation tests

**Files:**
- Create: `frontend/src/components/Contact.jsx`
- Create: `frontend/src/components/Contact.css`
- Create: `frontend/src/components/Contact.test.js`

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/components/Contact.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { validate } from './Contact'

describe('validate', () => {
  it('returns name error for empty name', () => {
    const errors = validate({ name: '', email: 'a@b.com', message: 'hi' })
    expect(errors.name).toBeTruthy()
  })

  it('returns email error for empty email', () => {
    const errors = validate({ name: 'Jon', email: '', message: 'hi' })
    expect(errors.email).toBeTruthy()
  })

  it('returns email error for invalid email format', () => {
    const errors = validate({ name: 'Jon', email: 'notvalid', message: 'hi' })
    expect(errors.email).toBeTruthy()
  })

  it('returns message error for empty message', () => {
    const errors = validate({ name: 'Jon', email: 'jon@test.com', message: '' })
    expect(errors.message).toBeTruthy()
  })

  it('returns no errors for valid form', () => {
    const errors = validate({ name: 'Jon', email: 'jon@test.com', message: 'Hello there' })
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('returns no errors for email with subdomain', () => {
    const errors = validate({ name: 'Jon', email: 'jon@mail.example.com', message: 'Hi' })
    expect(errors.email).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/components/Contact.test.js
```
Expected: FAIL — `validate is not exported`

- [ ] **Step 3: Create Contact.css**

Create `frontend/src/components/Contact.css`:
```css
.contact {
  padding: 7rem 2rem;
  position: relative;
  z-index: 1;
}

.contact-container {
  max-width: 600px;
  margin: 0 auto;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  color: var(--accent);
  transition: color 0.3s ease;
}

.field input,
.field textarea {
  background: #090909;
  border: 1px solid #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: 0.75rem 1rem;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.field input:focus,
.field textarea:focus {
  border-color: var(--accent);
}

.field-error {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: #e05555;
  letter-spacing: 0.06em;
}

.contact-success {
  text-align: center;
  padding: 5rem 0;
}

.success-text {
  font-family: var(--font-mono);
  font-size: 1.4rem;
  color: var(--accent);
  transition: color 0.3s ease;
}

.success-sub {
  color: var(--text-muted);
  margin-top: 1rem;
  font-size: 0.85rem;
}
```

- [ ] **Step 4: Create Contact.jsx**

Create `frontend/src/components/Contact.jsx`:
```jsx
import { useState } from 'react'
import './Contact.css'

export function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Invalid email address'
  }
  if (!form.message.trim()) errors.message = 'Message is required'
  return errors
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="contact" id="contact">
        <div className="contact-container">
          <h2 className="section-label">// CONTACT</h2>
          <div className="contact-success">
            <p className="success-text">MESSAGE RECEIVED_</p>
            <p className="success-sub">I'll get back to you soon.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <h2 className="section-label">// CONTACT</h2>
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">NAME</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="email">EMAIL</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="message">MESSAGE</label>
            <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} />
            {errors.message && <span className="field-error">{errors.message}</span>}
          </div>
          <button type="submit" className="btn-primary">SEND MESSAGE</button>
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npx vitest run src/components/Contact.test.js
```
Expected: 6 tests PASS

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/Contact.jsx frontend/src/components/Contact.css frontend/src/components/Contact.test.js && git commit -m "feat: add Contact form with validation and passing tests"
```

---

## Task 18: Create Footer

**Files:**
- Create: `frontend/src/components/Footer.jsx`
- Create: `frontend/src/components/Footer.css`

- [ ] **Step 1: Create Footer.css**

Create `frontend/src/components/Footer.css`:
```css
.footer {
  padding: 3rem 2rem;
  text-align: center;
  border-top: 1px solid #141414;
  position: relative;
  z-index: 1;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.footer-links a {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  color: var(--accent);
  text-decoration: none;
  transition: opacity 0.2s ease, color 0.3s ease;
}

.footer-links a:hover {
  opacity: 0.65;
}

.footer-sep {
  color: #2a2a2a;
  font-family: var(--font-mono);
  font-size: 0.68rem;
}

.footer-copy {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: #2a2a2a;
  letter-spacing: 0.1em;
}
```

- [ ] **Step 2: Create Footer.jsx**

Create `frontend/src/components/Footer.jsx`:
```jsx
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="https://github.com/Grimgear76" target="_blank" rel="noopener noreferrer">GITHUB</a>
        <span className="footer-sep">/</span>
        <a href="https://linkedin.com/in/YOUR_LINKEDIN_SLUG" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
        <span className="footer-sep">/</span>
        <a href="mailto:YOUR_EMAIL@example.com">EMAIL</a>
      </div>
      <p className="footer-copy">© 2025 Jonathan Navarro</p>
    </footer>
  )
}
```

**Note:** Replace `YOUR_LINKEDIN_SLUG` and `YOUR_EMAIL@example.com` with your real LinkedIn URL slug and email before shipping.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Footer.jsx frontend/src/components/Footer.css && git commit -m "feat: add Footer with GitHub, LinkedIn, email links"
```

---

## Task 19: Create ProjectDetail page

**Files:**
- Create: `frontend/src/pages/ProjectDetail.jsx`
- Create: `frontend/src/pages/ProjectDetail.css`

- [ ] **Step 1: Create ProjectDetail.css**

Create `frontend/src/pages/ProjectDetail.css`:
```css
.project-detail {
  min-height: 100vh;
  padding: 7rem 2rem 4rem;
  position: relative;
  z-index: 1;
}

.detail-back {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  margin-bottom: 3rem;
  display: block;
  transition: color 0.2s ease;
}

.detail-back:hover {
  color: var(--accent);
}

.detail-container {
  max-width: 720px;
  margin: 0 auto;
}

.detail-title {
  font-family: var(--font-mono);
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 3rem;
}

.detail-section {
  margin-bottom: 2.5rem;
}

.detail-section h2 {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--accent);
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
}

.detail-section p {
  color: var(--text-muted);
  line-height: 1.8;
  font-size: 0.95rem;
}

.detail-not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-family: var(--font-mono);
  color: var(--text-muted);
}

.detail-not-found button {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  background: none;
  border: 1px solid #333;
  color: var(--accent);
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: border-color 0.3s ease, color 0.3s ease;
}
```

- [ ] **Step 2: Create ProjectDetail.jsx**

Create `frontend/src/pages/ProjectDetail.jsx`:
```jsx
import { useParams, useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = projects.find(p => p.id === id)

  if (!project) {
    return (
      <div className="detail-not-found">
        <p>Project not found.</p>
        <button onClick={() => navigate('/')}>← BACK</button>
      </div>
    )
  }

  return (
    <div className="project-detail">
      <button className="detail-back" onClick={() => navigate(-1)}>← BACK</button>
      <div className="detail-container">
        <h1 className="detail-title" style={{ color: project.accentColor }}>
          {project.title}
        </h1>
        <div className="detail-tags">
          {project.technologies.map(t => (
            <span
              key={t}
              className="card-tag"
              style={{ borderColor: `${project.accentColor}55`, color: project.accentColor }}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="detail-section">
          <h2>THE PROBLEM</h2>
          <p>{project.detail.problem}</p>
        </div>
        <div className="detail-section">
          <h2>WHAT WAS BUILT</h2>
          <p>{project.detail.built}</p>
        </div>
        <div className="detail-section">
          <h2>OUTCOME</h2>
          <p>{project.detail.outcome}</p>
        </div>
      </div>
    </div>
  )
}
```

**Note:** `card-tag` class is defined in `ProjectCard.css`. Import it here or extract it to `globals.css`. Simplest fix: add `.card-tag` to `globals.css`:
```css
.card-tag {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  padding: 0.2rem 0.5rem;
  border: 1px solid #1e1e1e;
  color: #333;
  letter-spacing: 0.05em;
  transition: border-color 0.4s ease, color 0.4s ease;
}
```

Add that block to `frontend/src/styles/globals.css`.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/ frontend/src/styles/globals.css && git commit -m "feat: add ProjectDetail page with problem/built/outcome sections"
```

---

## Task 20: Wire App.jsx and main.jsx

**Files:**
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/main.jsx`

- [ ] **Step 1: Replace App.jsx**

Replace the entire contents of `frontend/src/App.jsx` with:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ColorProvider } from './context/ColorContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AmbientOverlay from './components/AmbientOverlay'
import Toast from './components/Toast'
import ScrollZoneWatcher from './components/ScrollZoneWatcher'
import ProjectDetail from './pages/ProjectDetail'
import './styles/globals.css'

function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ColorProvider>
        <AmbientOverlay />
        <Navbar />
        <Toast />
        <ScrollZoneWatcher />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </ColorProvider>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Replace main.jsx**

Replace the entire contents of `frontend/src/main.jsx` with:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 3: Run the dev server and verify the full app renders**

```bash
npm run dev
```
Open `http://localhost:5173`. Check:
- Hero section visible with blinking cursor
- Scrolling changes background color (amber → teal → violet)
- Clicking a project card lights it up with its accent color
- Ambient overlay gains glow layers as more cards are unlocked
- Navbar EXPLORED % increases with each unlock
- `→` arrow on a card navigates to the detail page
- Contact form shows validation errors on empty submit
- Toast appears when all 6 projects are unlocked

- [ ] **Step 4: Run all tests**

```bash
npx vitest run
```
Expected: All tests PASS (colorReducer × 5, interpolateColor × 4, getZoneIndex × 6, validate × 6 = 21 tests)

- [ ] **Step 5: Commit**

```bash
cd .. && git add frontend/src/App.jsx frontend/src/main.jsx && git commit -m "feat: wire App.jsx with all routes, ColorProvider, and components"
```

---

## Task 21: Final run — all tests green, dev server clean

- [ ] **Step 1: Run full test suite**

```bash
cd frontend && npx vitest run
```
Expected: 21 tests PASS, 0 failures

- [ ] **Step 2: Start dev server and do a full manual check**

```bash
npm run dev
```

Walk through the golden path:
1. Load `http://localhost:5173` — hero appears, cursor blinks
2. Scroll slowly top-to-bottom — background morphs amber → teal → violet
3. Click each of the 6 project cards — each lights up, EXPLORED % increases
4. On the 6th unlock — toast appears "ALL PROJECTS UNLOCKED"
5. Click any `→` arrow — navigates to `/projects/:id` detail page
6. Click `← BACK` — returns to home
7. Submit contact form empty — inline errors appear
8. Submit with valid data — success state shows

- [ ] **Step 3: Final commit**

```bash
cd .. && git add -A && git commit -m "feat: complete portfolio frontend — all sections, color system, routing"
```
