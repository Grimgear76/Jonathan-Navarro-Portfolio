# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Jonathan Navarro's MERN portfolio SPA with scroll-driven theme transitions and click-to-unlock project color system.

**Architecture:** React SPA (Vite) with React Router for project detail routes; Express.js REST API for contact form; MongoDB for contact submission storage. All color/theme logic lives in React hooks consuming CSS custom properties — no external animation libraries, matching the prototype in `references/ui-preview.html` exactly.

**Tech Stack:** Vite, React 18, React Router v6, CSS custom properties, Express.js, Mongoose, MongoDB, dotenv, cors, Axios

**Git Workflow:** All commits and pushes target the `main` branch. Each commit should include `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`. Never push to `master` — it has been deleted.

---

## File Map

```
client/
  public/
    resume.pdf                ← copy of "Jonathan Navarro Resume (1).pdf"
  src/
    main.jsx                  ← React entry, Router wrapper
    App.jsx                   ← Section layout, scroll/unlock context providers
    index.css                 ← CSS reset, :root variables, global styles
    hooks/
      useScrollTheme.js       ← Scroll → CSS variable interpolation
      useUnlockState.js       ← Per-project unlock state + ambient glow
    context/
      UnlockContext.js        ← React context for unlock state
    data/
      projects.js             ← All 6 project definitions (color, tags, detail copy)
    components/
      Nav.jsx                 ← Fixed nav with EXPLORED % bar
      AmbientLayer.jsx        ← Fixed radial gradient overlay
      Hero.jsx                ← Hero section
      About.jsx               ← About + stat grid
      Skills.jsx              ← Skills category grid
      ProjectCard.jsx         ← Individual card with unlock mechanic + ripple
      Projects.jsx            ← Projects section grid
      Toast.jsx               ← Slide-up notification
      Contact.jsx             ← Contact form + info
      Footer.jsx              ← Footer
    pages/
      ProjectDetail.jsx       ← Full detail page per project
  package.json
  vite.config.js

server/
  index.js                    ← Express app entry
  routes/
    contact.js                ← POST /api/contact
  models/
    Message.js                ← Mongoose schema
  .env.example
  package.json
```

---

### Task 1: Scaffold client (Vite + React)

**Files:**
- Create: `client/` (Vite project)

- [ ] **Step 1: Create Vite React project**

```bash
cd "C:\Users\Jonathan Navarro\Desktop\Jonathan N Portfolio"
npm create vite@latest client -- --template react
cd client
npm install
npm install react-router-dom axios
```

- [ ] **Step 2: Remove boilerplate files**

Delete: `client/src/App.css`, `client/src/assets/react.svg`, `client/public/vite.svg`

- [ ] **Step 3: Verify dev server starts**

```bash
cd client && npm run dev
```

Expected: `http://localhost:5173` loads blank React app with no errors.

- [ ] **Step 4: Commit**

```bash
git add client/
git commit -m "feat: scaffold Vite React client

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Scaffold server (Express)

**Files:**
- Create: `server/package.json`, `server/index.js`, `server/.env.example`, `server/routes/contact.js`, `server/models/Message.js`

- [ ] **Step 1: Init server package**

```bash
cd "C:\Users\Jonathan Navarro\Desktop\Jonathan N Portfolio"
mkdir server && cd server
npm init -y
npm install express mongoose cors dotenv
```

- [ ] **Step 2: Create `server/.env.example`**

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio
PORT=5000
```

- [ ] **Step 3: Create `server/models/Message.js`**

```js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
```

- [ ] **Step 4: Create `server/routes/contact.js`**

```js
import { Router } from 'express';
import Message from '../models/Message.js';

const router = Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields required.' });
  }
  try {
    await Message.create({ name, email, message });
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
```

- [ ] **Step 5: Create `server/index.js`**

```js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import contactRouter from './routes/contact.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/contact', contactRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 6: Add `"type": "module"` to `server/package.json`**

In `server/package.json`, add `"type": "module"` at the top level and add a start script:

```json
{
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  }
}
```

- [ ] **Step 7: Create a `.env` file from the example and verify server starts (skip MongoDB for now)**

```bash
cd server
cp .env.example .env
```

Edit `.env` with your real `MONGO_URI`. Then run:

```bash
node index.js
```

Expected: Connection error or success depending on `MONGO_URI`. Server will print port message if DB connects.

- [ ] **Step 8: Commit**

```bash
cd ..
git add server/
git commit -m "feat: scaffold Express server with contact route

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Global CSS & CSS variable system

**Files:**
- Modify: `client/src/index.css`

- [ ] **Step 1: Replace `client/src/index.css` entirely**

```css
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg:     #111111;
  --bg2:    #1c1c1c;
  --bg3:    #222222;
  --text:   #f0f0f0;
  --muted:  #555555;
  --base:   #e8a838;
  --border: #e8a83825;
}

html { scroll-behavior: smooth; }

body {
  font-family: 'Courier New', Courier, monospace;
  background: var(--bg);
  color: var(--text);
  overflow-x: hidden;
}

section { position: relative; z-index: 1; }

.section-label {
  font-size: 8px;
  letter-spacing: 5px;
  color: var(--base);
  margin-bottom: 16px;
  transition: color 0.6s;
}

.section-title {
  font-size: 36px;
  font-weight: 900;
  letter-spacing: 1px;
  color: var(--text);
  margin-bottom: 20px;
  transition: color 0.6s;
}

.btn-fill {
  background: var(--base);
  color: var(--bg);
  padding: 11px 26px;
  font-size: 9px;
  letter-spacing: 3px;
  font-weight: 900;
  border: none;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: background 0.6s, color 0.6s;
}

.btn-outline {
  border: 1px solid var(--base);
  color: var(--base);
  background: transparent;
  padding: 11px 26px;
  font-size: 9px;
  letter-spacing: 3px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: border-color 0.6s, color 0.6s;
}
```

- [ ] **Step 2: Verify dev server still loads without CSS errors**

```bash
cd client && npm run dev
```

Expected: No console errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/index.css
git commit -m "feat: global CSS variables and base styles

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 4: `useScrollTheme` hook — scroll-driven color interpolation

**Files:**
- Create: `client/src/hooks/useScrollTheme.js`

- [ ] **Step 1: Create the hook**

```js
import { useEffect } from 'react';

const THEMES = {
  carbon: { bg:'#111111', bg2:'#1c1c1c', bg3:'#222222', text:'#f0f0f0', muted:'#555555', base:'#e8a838', border:'#e8a83825' },
  teal:   { bg:'#0d1117', bg2:'#161b22', bg3:'#1c232e', text:'#e6edf3', muted:'#8b949e', base:'#3dd6c8', border:'#3dd6c825' },
  violet: { bg:'#10101a', bg2:'#1a1a2e', bg3:'#20203a', text:'#c9d1d9', muted:'#6e7681', base:'#9d7fff', border:'#9d7fff25' },
};

function hexToRgb(h) {
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}

function lerpHex(h1, h2, t) {
  const suffix = h1.slice(7) || '';
  const [r1,g1,b1] = hexToRgb(h1.slice(0,7));
  const [r2,g2,b2] = hexToRgb(h2.slice(0,7));
  const r = Math.round(r1 + (r2-r1)*t).toString(16).padStart(2,'0');
  const g = Math.round(g1 + (g2-g1)*t).toString(16).padStart(2,'0');
  const b = Math.round(b1 + (b2-b1)*t).toString(16).padStart(2,'0');
  return `#${r}${g}${b}${suffix}`;
}

function blendTheme(progress) {
  const keys = Object.keys(THEMES.carbon);
  const out = {};
  if (progress <= 0.5) {
    const t = progress / 0.5;
    keys.forEach(k => { out[k] = lerpHex(THEMES.carbon[k], THEMES.teal[k], t); });
  } else {
    const t = (progress - 0.5) / 0.5;
    keys.forEach(k => { out[k] = lerpHex(THEMES.teal[k], THEMES.violet[k], t); });
  }
  return out;
}

export function useScrollTheme() {
  useEffect(() => {
    function onScroll() {
      const s = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const progress = h > 0 ? Math.min(s / h, 1) : 0;
      const theme = blendTheme(progress);
      const root = document.documentElement;
      for (const [k, v] of Object.entries(theme)) {
        root.style.setProperty('--' + k, v);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/hooks/useScrollTheme.js
git commit -m "feat: useScrollTheme hook for scroll-driven color interpolation

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 5: UnlockContext + `useUnlockState` hook

**Files:**
- Create: `client/src/context/UnlockContext.js`
- Create: `client/src/hooks/useUnlockState.js`

- [ ] **Step 1: Create `client/src/hooks/useUnlockState.js`**

```js
import { useState, useCallback } from 'react';

const AMBIENT_POSITIONS = [
  'ellipse 55% 45% at 10% 15%',
  'ellipse 50% 40% at 88% 75%',
  'ellipse 40% 35% at 50% 50%',
  'ellipse 35% 30% at 20% 85%',
  'ellipse 30% 25% at 78% 20%',
  'ellipse 25% 20% at 40% 10%',
];

export function useUnlockState(total) {
  const [unlocked, setUnlocked] = useState(new Set());
  const [ambientColors, setAmbientColors] = useState([]);

  const unlock = useCallback((id, color) => {
    setUnlocked(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setAmbientColors(prev => {
      if (prev.some(c => c.id === id)) return prev;
      return [...prev, { id, color }];
    });
  }, []);

  const percent = total > 0 ? Math.round(unlocked.size / total * 100) : 0;

  const ambientBackground = ambientColors.length === 0
    ? 'none'
    : ambientColors
        .map((c, i) => `radial-gradient(${AMBIENT_POSITIONS[i] || AMBIENT_POSITIONS[0]}, ${c.color}14, transparent)`)
        .join(', ');

  const ambientOpacity = Math.min(ambientColors.length * 0.18, 0.95);

  return { unlocked, unlock, percent, ambientBackground, ambientOpacity };
}
```

- [ ] **Step 2: Create `client/src/context/UnlockContext.js`**

```js
import { createContext, useContext } from 'react';

export const UnlockContext = createContext(null);

export function useUnlock() {
  return useContext(UnlockContext);
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/hooks/useUnlockState.js client/src/context/UnlockContext.js
git commit -m "feat: unlock state hook and context

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 6: Project data

**Files:**
- Create: `client/src/data/projects.js`

- [ ] **Step 1: Create `client/src/data/projects.js`**

```js
export const PROJECTS = [
  {
    id: 'pokemon',
    title: 'Pokémon Battle Bot',
    badge: 'AI / RL',
    color: '#e8a838',
    tags: ['Python', 'PPO', 'Stable-Baselines3', 'Gymnasium'],
    category: 'AI/ML',
    footerLink: 'GITHUB →',
    desc: 'RL agent trained with PPO to battle in Pokémon Showdown. Built a custom Gymnasium environment, reward shaping, and action masking. TensorBoard monitoring throughout training.',
    detail: {
      problem: 'Build an AI that can compete in Pokémon Showdown through pure reinforcement learning — no hard-coded rules.',
      built: 'Custom Gymnasium environment wrapping the Showdown WebSocket API. PPO agent via Stable-Baselines3 with action masking for invalid moves. Reward shaped around HP delta, KOs, and win/loss outcomes. TensorBoard logging for training visibility.',
      outcome: 'Agent learned non-trivial battle strategies — switching, type coverage, PP management — entirely from self-play reward signal.',
      github: 'https://github.com/Grimgear76',
    },
  },
  {
    id: 'rgv',
    title: 'RGV Tutor — AI/ML Hackathon',
    badge: '2ND PLACE',
    color: '#3dd6c8',
    tags: ['Flutter', 'Node.js', 'Ollama', 'SQLite'],
    category: 'AI · MOBILE',
    footerLink: 'GITHUB →',
    desc: 'Offline-first AI tutoring app for low-connectivity environments. Local LLM via Ollama with no API dependency. Quizzes, flashcards, digital Book Hub, optimized for low-end devices.',
    detail: {
      problem: 'Students in the Rio Grande Valley often lack reliable internet — cloud AI tutoring is inaccessible.',
      built: 'Flutter mobile app with a Node.js backend running Ollama locally. No cloud API calls at runtime. SQLite for student progress. Quizzes, flashcards, and a curated Book Hub all work offline.',
      outcome: '2nd Place in the AI/ML category at a regional hackathon. Praised for accessibility-first design.',
      github: 'https://github.com/Grimgear76',
    },
  },
  {
    id: 'frontera',
    title: 'Frontera Gemini Hackathon 2024',
    badge: '1ST PLACE',
    color: '#58a6ff',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    category: 'FULL-STACK',
    footerLink: 'GITHUB →',
    desc: 'Financial analytics web app with real-time spending & savings dashboards. Won 1st in the Financial Category. Full MERN stack delivered in 24 hours.',
    detail: {
      problem: 'Help users visualize and understand their spending patterns without complex financial literacy.',
      built: 'MERN stack web app with Gemini API integration for natural-language spend summaries. Real-time dashboards, category breakdowns, and savings goal tracking — built and deployed in 24 hours.',
      outcome: '1st Place — Financial Category, Frontera Hackathon 2024. Judges noted the polish and AI integration quality.',
      github: 'https://github.com/Grimgear76',
    },
  },
  {
    id: 'rpg',
    title: '2D Action RPG',
    badge: 'GAME DEV',
    color: '#9d7fff',
    tags: ['Unity', 'C#', 'OOP'],
    category: 'UNITY',
    footerLink: 'GITHUB →',
    desc: 'Full 2D action RPG built in Unity. Player movement, combat systems, environment interactions, UI systems — every mechanic implemented from scratch with OOP principles.',
    detail: {
      problem: 'Learn game development end-to-end by building a complete action RPG from scratch.',
      built: 'Player controller with 8-directional movement, melee and ranged combat, enemy AI state machines, inventory and item pickup, health/damage systems, and a full HUD — all in Unity with C#.',
      outcome: 'Fully playable prototype with multiple enemy types, dungeon room design, and save/load capability.',
      github: 'https://github.com/Grimgear76',
    },
  },
  {
    id: 'social',
    title: 'College Social Life App',
    badge: 'MERN',
    color: '#f472b6',
    tags: ['React', 'Node.js', 'MongoDB'],
    category: 'FULL-STACK',
    footerLink: 'GITHUB →',
    desc: 'Full-stack MERN web application for students to share events and resources. RESTful APIs, responsive React UI, and MongoDB for scalable storage.',
    detail: {
      problem: 'UTRGV students lack a central hub for discovering campus events, study groups, and resources.',
      built: 'MERN stack app with user auth, event creation/browsing, resource sharing feeds, and a React UI that works across mobile and desktop.',
      outcome: 'Production-ready full-stack application demonstrating end-to-end MERN competency.',
      github: 'https://github.com/Grimgear76',
    },
  },
  {
    id: 'roblox',
    title: 'Roblox UI Redesign',
    badge: 'UX/UI',
    color: '#fb923c',
    tags: ['Figma', 'UX Research', 'Prototyping'],
    category: 'DESIGN',
    footerLink: 'FIGMA →',
    desc: 'Redesigned the Roblox platform interface in Figma. UX analysis, modern UI overhaul, improved search and navigation flows.',
    detail: {
      problem: 'Roblox\'s UI suffers from discoverability issues and visual inconsistency — especially for new users.',
      built: 'Full UX audit followed by a Figma redesign covering home, search, game detail pages, and navigation. Applied modern design system principles, improved information hierarchy, and created an interactive prototype.',
      outcome: 'High-fidelity prototype showcasing professional UX process — research to polished deliverable.',
      github: 'https://github.com/Grimgear76',
    },
  },
];

export const TOAST_MESSAGES = {
  pokemon:  ['BATTLE BOT UNLOCKED',  'An RL agent that learned to fight — trained entirely from reward.'],
  rgv:      ['RGV TUTOR UNLOCKED',   "Built for the students who can't afford a connection."],
  frontera: ['HACKATHON 1ST PLACE',  '1st in Financial Category — MERN stack in 24 hours.'],
  rpg:      ['2D RPG UNLOCKED',      'Every mechanic hand-built — movement, combat, the whole world.'],
  social:   ['SOCIAL APP UNLOCKED',  'Full-stack from scratch. MERN, REST, responsive UI.'],
  roblox:   ['UI REDESIGN UNLOCKED', 'UX is the hidden feature. Figma-first redesign.'],
};
```

- [ ] **Step 2: Commit**

```bash
git add client/src/data/projects.js
git commit -m "feat: project data definitions

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 7: AmbientLayer component

**Files:**
- Create: `client/src/components/AmbientLayer.jsx`

- [ ] **Step 1: Create `client/src/components/AmbientLayer.jsx`**

```jsx
import { useUnlock } from '../context/UnlockContext';

export default function AmbientLayer() {
  const { ambientBackground, ambientOpacity } = useUnlock();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: ambientOpacity,
        transition: 'opacity 1.4s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: ambientBackground,
          transition: 'background 1.4s ease',
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/AmbientLayer.jsx
git commit -m "feat: AmbientLayer fixed glow overlay

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 8: Nav component

**Files:**
- Create: `client/src/components/Nav.jsx`

- [ ] **Step 1: Create `client/src/components/Nav.jsx`**

```jsx
import { useUnlock } from '../context/UnlockContext';

export default function Nav() {
  const { percent } = useUnlock();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#111111f0',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 40px', height: '54px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'border-color 0.6s, background 0.6s',
    }}>
      <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '4px', color: 'var(--base)', transition: 'color 0.6s' }}>
        JN
      </div>

      <div style={{ display: 'flex', gap: '28px' }}>
        {['about','skills','projects','contact'].map(id => (
          <a
            key={id}
            href={`#${id}`}
            style={{ fontSize: '9px', letterSpacing: '3px', color: 'var(--muted)', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.3s' }}
            onMouseEnter={e => e.target.style.color = 'var(--base)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >
            {id}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ fontSize: '8px', letterSpacing: '2px', color: 'var(--muted)', transition: 'color 0.6s' }}>
          EXPLORED
        </div>
        <div style={{ width: '80px', height: '2px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${percent}%`,
            background: 'linear-gradient(90deg, #e8a838, #3dd6c8, #9d7fff)',
            borderRadius: '2px',
            transition: 'width 0.9s cubic-bezier(0.34,1.56,0.64,1)',
          }} />
        </div>
        <div style={{ fontSize: '8px', letterSpacing: '1px', color: 'var(--muted)', minWidth: '26px', transition: 'color 0.6s' }}>
          {percent}%
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/Nav.jsx
git commit -m "feat: Nav with EXPLORED unlock progress bar

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 9: Hero section

**Files:**
- Create: `client/src/components/Hero.jsx`

- [ ] **Step 1: Create `client/src/components/Hero.jsx`**

```jsx
export default function Hero() {
  return (
    <section id="hero" style={{
      minHeight: '100vh', padding: '120px 60px 80px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      borderBottom: '1px solid var(--border)',
      transition: 'border-color 0.6s',
    }}>
      <div style={{ fontSize: '9px', letterSpacing: '5px', color: 'var(--muted)', marginBottom: '20px', transition: 'color 0.6s' }}>
        [ CS STUDENT · BUILDER · PROBLEM SOLVER ]
      </div>

      <div style={{
        fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 900,
        letterSpacing: '-3px', lineHeight: 0.95, color: 'var(--text)',
        transition: 'color 0.6s',
      }}>
        Jonathan<br />
        <span style={{ color: 'var(--base)', transition: 'color 0.6s' }}>Navarro.</span>
      </div>

      <div style={{
        marginTop: '20px', fontSize: '12px', letterSpacing: '2px',
        color: 'var(--muted)', maxWidth: '500px', lineHeight: 2,
        transition: 'color 0.6s',
      }}>
        Full-Stack · AI/ML · Game Development<br />
        UTRGV · Magna Cum Laude · May 2026<br />
        2× Hackathon Award Winner
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '28px' }}>
        {['React', 'Node.js', 'Python', 'Unity / C#', 'RL / PPO', 'MongoDB', 'Flutter'].map(tag => (
          <div key={tag} style={{
            border: '1px solid var(--border)', color: 'var(--base)',
            fontSize: '9px', padding: '5px 14px', letterSpacing: '2px',
            background: 'var(--border)', transition: 'border-color 0.6s, color 0.6s, background 0.6s',
          }}>
            {tag}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '14px', marginTop: '32px' }}>
        <button
          className="btn-fill"
          onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
        >
          VIEW PROJECTS
        </button>
        <a href="/resume.pdf" download="Jonathan_Navarro_Resume.pdf">
          <button className="btn-outline">DOWNLOAD RESUME</button>
        </a>
      </div>

      <div style={{
        marginTop: '60px', fontSize: '8px', letterSpacing: '3px', color: '#333',
        display: 'flex', alignItems: 'center', gap: '10px',
        animation: 'pulse 2.5s ease-in-out infinite',
      }}>
        <span>↓</span> SCROLL — SITE EVOLVES AS YOU EXPLORE
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Copy resume PDF to `client/public/`**

```bash
cp "C:\Users\Jonathan Navarro\Desktop\Jonathan N Portfolio\Jonathan Navarro Resume (1).pdf" \
   "C:\Users\Jonathan Navarro\Desktop\Jonathan N Portfolio\client\public\resume.pdf"
```

- [ ] **Step 3: Commit**

```bash
git add client/src/components/Hero.jsx client/public/resume.pdf
git commit -m "feat: Hero section with CTA buttons and resume download

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 10: About section

**Files:**
- Create: `client/src/components/About.jsx`

- [ ] **Step 1: Create `client/src/components/About.jsx`**

```jsx
const STATS = [
  { num: '7',   lbl: 'PROJECTS SHIPPED' },
  { num: '2×',  lbl: 'HACKATHON AWARDS' },
  { num: '4.0', lbl: "PRESIDENT'S LIST" },
  { num: '6+',  lbl: 'LANGUAGES' },
];

export default function About() {
  return (
    <section id="about" style={{
      padding: '100px 60px',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px',
      borderBottom: '1px solid var(--border)', transition: 'border-color 0.6s',
    }}>
      <div>
        <div className="section-label">[ 01 · ABOUT ]</div>
        <div className="section-title">Who I Am</div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 2.2, transition: 'color 0.6s' }}>
          Analytical CS student building across reinforcement learning,<br />
          game development, and full-stack web applications.<br /><br />
          Dean's List both semesters 2023–24. President's List<br />
          both semesters 2024–25. Graduating Magna Cum Laude.<br /><br />
          Bilingual in English and Spanish. 6 years volunteer<br />
          musician and technician. Lifelong builder.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {STATS.map(s => (
          <div key={s.lbl} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            padding: '20px', transition: 'background 0.6s, border-color 0.6s',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--base)', transition: 'color 0.6s' }}>
              {s.num}
            </div>
            <div style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--muted)', marginTop: '4px', transition: 'color 0.6s' }}>
              {s.lbl}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/About.jsx
git commit -m "feat: About section with stat grid

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 11: Skills section

**Files:**
- Create: `client/src/components/Skills.jsx`

- [ ] **Step 1: Create `client/src/components/Skills.jsx`**

```jsx
const CATEGORIES = [
  { label: 'FRONTEND',  items: 'React · HTML · CSS\nBootstrap · Flutter\nFigma · UX/UI' },
  { label: 'BACKEND',   items: 'Node.js · Express\nPython · Java · C++\nRESTful APIs' },
  { label: 'AI / ML',   items: 'RL · PPO · Stable-Baselines3\nGymnasium · TensorBoard\nReward Shaping' },
  { label: 'GAME DEV',  items: 'Unity · C#\n2D Systems · Combat\nOOP Game Design' },
  { label: 'DATABASES', items: 'MongoDB · SQLite\nData Modeling\nRESTful Storage' },
  { label: 'SYSTEMS',   items: 'Linux · AWS · Azure\nGit · GitHub · VMs\nCybersecurity · Nmap' },
];

export default function Skills() {
  return (
    <section id="skills" style={{
      padding: '100px 60px',
      borderBottom: '1px solid var(--border)', transition: 'border-color 0.6s',
    }}>
      <div className="section-label">[ 02 · SKILLS ]</div>
      <div className="section-title">Tech Stack</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px', marginTop: '36px',
      }}>
        {CATEGORIES.map(cat => (
          <div key={cat.label} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            padding: '20px', transition: 'background 0.6s, border-color 0.6s',
          }}>
            <div style={{ fontSize: '8px', letterSpacing: '3px', color: 'var(--base)', marginBottom: '12px', transition: 'color 0.6s' }}>
              {cat.label}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: 2.2, whiteSpace: 'pre-line', transition: 'color 0.6s' }}>
              {cat.items}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/Skills.jsx
git commit -m "feat: Skills section category grid

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 12: Toast component

**Files:**
- Create: `client/src/components/Toast.jsx`

- [ ] **Step 1: Create `client/src/components/Toast.jsx`**

```jsx
import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const Toast = forwardRef(function Toast(_props, ref) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [sub, setSub] = useState('');
  const [color, setColor] = useState('#e8a838');
  const timerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    show(toastName, toastSub, toastColor, duration = 3400) {
      setName(toastName);
      setSub(toastSub);
      setColor(toastColor);
      setVisible(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), duration);
    },
  }));

  return (
    <div style={{
      position: 'fixed', bottom: '28px', right: '28px',
      background: 'var(--bg2)', border: `1px solid ${color}`,
      padding: '14px 20px', fontSize: '9px', letterSpacing: '1px',
      color: 'var(--text)', zIndex: 999,
      maxWidth: '260px', lineHeight: 1.8,
      transform: visible ? 'translateY(0)' : 'translateY(80px)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s, border-color 0.4s',
    }}>
      <span style={{ fontWeight: 900, letterSpacing: '2px', display: 'block', marginBottom: '3px', color }}>
        {name}
      </span>
      <span style={{ color: 'var(--muted)', fontSize: '9px' }}>{sub}</span>
    </div>
  );
});

export default Toast;
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/Toast.jsx
git commit -m "feat: Toast slide-up notification component

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 13: ProjectCard component

**Files:**
- Create: `client/src/components/ProjectCard.jsx`

- [ ] **Step 1: Create `client/src/components/ProjectCard.jsx`**

```jsx
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnlock } from '../context/UnlockContext';

export default function ProjectCard({ project, onUnlock }) {
  const { unlocked, unlock } = useUnlock();
  const isUnlocked = unlocked.has(project.id);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  function handleClick(e) {
    if (!isUnlocked) {
      unlock(project.id, project.color);
      onUnlock(project);
      spawnRipple(e);
    } else {
      navigate(`/project/${project.id}`);
    }
  }

  function spawnRipple(e) {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const rip = document.createElement('div');
    rip.style.cssText = `
      position:absolute;width:80px;height:80px;border-radius:50%;
      background:${project.color};transform:scale(0);pointer-events:none;
      left:${e.clientX - rect.left - 40}px;top:${e.clientY - rect.top - 40}px;
      animation:ripple 0.8s ease-out forwards;
    `;
    card.appendChild(rip);
    setTimeout(() => rip.remove(), 900);
  }

  const c = project.color;

  return (
    <>
      <style>{`@keyframes ripple{0%{transform:scale(0);opacity:.4}100%{transform:scale(5);opacity:0}}`}</style>
      <div
        ref={cardRef}
        onClick={handleClick}
        style={{
          background: 'var(--bg2)',
          border: `1px solid ${isUnlocked ? c : '#222'}`,
          padding: '24px', cursor: 'pointer',
          position: 'relative', overflow: 'hidden',
          transition: 'border-color 0.5s, transform 0.25s, box-shadow 0.5s, background 0.6s',
          boxShadow: isUnlocked ? `0 0 20px ${c}1f` : 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {/* Inner glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          opacity: isUnlocked ? 1 : 0, transition: 'opacity 0.6s',
          background: `radial-gradient(ellipse 80% 60% at 0% 0%, ${c}14, transparent)`,
        }} />

        {/* Badge */}
        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          fontSize: '7px', letterSpacing: '2px', fontWeight: 900,
          padding: '4px 10px', background: c, color: '#111',
          opacity: isUnlocked ? 1 : 0,
          transform: isUnlocked ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'opacity 0.4s, transform 0.4s',
        }}>
          {project.badge}
        </div>

        {/* Title */}
        <div style={{
          fontSize: '13px', fontWeight: 700, letterSpacing: '1px',
          color: isUnlocked ? c : '#888',
          marginBottom: '10px', transition: 'color 0.5s', lineHeight: 1.3,
        }}>
          {project.title}
        </div>

        {/* Description */}
        <div style={{
          fontSize: '10px',
          color: isUnlocked ? 'var(--muted)' : '#3a3a3a',
          lineHeight: 1.9, transition: 'color 0.5s',
        }}>
          {project.desc}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
          {project.tags.map(tag => (
            <div key={tag} style={{
              fontSize: '8px', padding: '3px 9px',
              border: `1px solid ${isUnlocked ? `${c}80` : '#282828'}`,
              color: isUnlocked ? `${c}cc` : '#333',
              background: isUnlocked ? `${c}0f` : 'transparent',
              transition: 'border-color 0.5s, color 0.5s, background 0.5s',
            }}>
              {tag}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '16px', paddingTop: '14px',
          borderTop: `1px solid ${isUnlocked ? `${c}40` : '#222'}`,
          fontSize: '8px', letterSpacing: '2px',
          color: isUnlocked ? `${c}99` : '#2a2a2a',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          transition: 'border-color 0.5s, color 0.5s',
        }}>
          <span>{isUnlocked ? project.footerLink : 'CLICK TO UNLOCK'}</span>
          <span>{project.category}</span>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/ProjectCard.jsx
git commit -m "feat: ProjectCard with unlock mechanic and ripple effect

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 14: Projects section

**Files:**
- Create: `client/src/components/Projects.jsx`

- [ ] **Step 1: Create `client/src/components/Projects.jsx`**

```jsx
import { useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import { PROJECTS, TOAST_MESSAGES } from '../data/projects';
import { useUnlock } from '../context/UnlockContext';

export default function Projects({ toastRef }) {
  const { unlocked } = useUnlock();
  const celebratedRef = useRef(false);

  useEffect(() => {
    if (unlocked.size === PROJECTS.length && !celebratedRef.current) {
      celebratedRef.current = true;
      setTimeout(() => {
        toastRef.current?.show(
          '✦ ALL PROJECTS EXPLORED',
          'Full palette unlocked. Jonathan builds everywhere.',
          '#9d7fff',
          5000
        );
      }, 3800);
    }
  }, [unlocked.size, toastRef]);

  function handleUnlock(project) {
    const [name, sub] = TOAST_MESSAGES[project.id] || ['UNLOCKED', ''];
    toastRef.current?.show(name, sub, project.color);
  }

  return (
    <section id="projects" style={{
      padding: '100px 60px',
      borderBottom: '1px solid var(--border)', transition: 'border-color 0.6s',
    }}>
      <div className="section-label">[ 03 · PROJECTS ]</div>
      <div className="section-title">What I've Built</div>
      <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#333', marginTop: '8px' }}>
        ↗ CLICK A PROJECT TO UNLOCK ITS COLOR AND SEE DETAILS
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px', marginTop: '36px',
      }}>
        {PROJECTS.map(project => (
          <ProjectCard key={project.id} project={project} onUnlock={handleUnlock} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/Projects.jsx
git commit -m "feat: Projects section grid with unlock callbacks

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 15: Contact section (frontend only)

**Files:**
- Create: `client/src/components/Contact.jsx`

- [ ] **Step 1: Create `client/src/components/Contact.jsx`**

```jsx
import { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  function update(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post(`${API}/api/contact`, form);
      setForm({ name: '', email: '', message: '' });
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  const inputStyle = {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    color: 'var(--text)', padding: '13px 16px',
    fontFamily: "'Courier New', monospace", fontSize: '11px',
    outline: 'none', transition: 'background 0.6s, border-color 0.6s, color 0.6s',
    width: '100%',
  };

  return (
    <section id="contact" style={{ padding: '100px 60px', transition: 'border-color 0.6s' }}>
      <div className="section-label">[ 04 · CONTACT ]</div>
      <div className="section-title">Let's Talk</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginTop: '36px' }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            style={inputStyle}
            placeholder="Name"
            value={form.name}
            onChange={update('name')}
            required
            onFocus={e => e.target.style.borderColor = 'var(--base)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <input
            style={inputStyle}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={update('email')}
            required
            onFocus={e => e.target.style.borderColor = 'var(--base)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <textarea
            style={{ ...inputStyle, height: '110px', resize: 'none' }}
            placeholder="Message"
            value={form.message}
            onChange={update('message')}
            required
            onFocus={e => e.target.style.borderColor = 'var(--base)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            type="submit"
            className="btn-fill"
            style={{ alignSelf: 'flex-start' }}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'SENDING...' : status === 'sent' ? 'SENT ✓' : status === 'error' ? 'ERROR — RETRY' : 'SEND MESSAGE'}
          </button>
        </form>

        <div>
          <div style={{ fontSize: '8px', letterSpacing: '3px', color: 'var(--base)', marginBottom: '14px', transition: 'color 0.6s' }}>
            REACH OUT DIRECTLY
          </div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: 2.4, transition: 'color 0.6s' }}>
            jonathan63592@gmail.com<br />
            (956) 367-6193<br /><br />
            <a href="https://github.com/Grimgear76" style={{ color: 'var(--base)', textDecoration: 'none', transition: 'color 0.6s' }}>
              github.com/Grimgear76
            </a><br />
            <a href="https://g.dev/JonathanNavarro" style={{ color: 'var(--base)', textDecoration: 'none', transition: 'color 0.6s' }}>
              g.dev/JonathanNavarro
            </a><br /><br />
            Open to internships, new grad roles,<br />
            and collaborative projects.
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `client/.env` for local dev**

Create `client/.env`:

```
VITE_API_URL=http://localhost:5000
```

- [ ] **Step 3: Commit**

```bash
git add client/src/components/Contact.jsx client/.env
git commit -m "feat: Contact section with form submission to Express API

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 16: Footer component

**Files:**
- Create: `client/src/components/Footer.jsx`

- [ ] **Step 1: Create `client/src/components/Footer.jsx`**

```jsx
export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '24px 60px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: '8px', letterSpacing: '2px', color: 'var(--muted)',
      position: 'relative', zIndex: 1,
      transition: 'border-color 0.6s, color 0.6s',
    }}>
      <div>JONATHAN NAVARRO · <span style={{ color: 'var(--base)', transition: 'color 0.6s' }}>© 2026</span></div>
      <div>BUILT WITH <span style={{ color: 'var(--base)', transition: 'color 0.6s' }}>MERN STACK</span></div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/Footer.jsx
git commit -m "feat: Footer component

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 17: ProjectDetail page

**Files:**
- Create: `client/src/pages/ProjectDetail.jsx`

- [ ] **Step 1: Create `client/src/pages/ProjectDetail.jsx`**

```jsx
import { useParams, useNavigate } from 'react-router-dom';
import { PROJECTS } from '../data/projects';
import { useUnlock } from '../context/UnlockContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { unlocked } = useUnlock();
  const project = PROJECTS.find(p => p.id === id);

  if (!project) {
    return (
      <div style={{ padding: '120px 60px', minHeight: '100vh', color: 'var(--muted)', fontSize: '12px' }}>
        Project not found. <button onClick={() => navigate('/')} className="btn-outline" style={{ marginLeft: '16px' }}>BACK</button>
      </div>
    );
  }

  const isUnlocked = unlocked.has(project.id);
  const c = isUnlocked ? project.color : '#555';

  return (
    <div style={{ padding: '120px 60px', minHeight: '100vh', maxWidth: '800px' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none', border: 'none', color: 'var(--muted)',
          fontSize: '9px', letterSpacing: '3px', cursor: 'pointer',
          fontFamily: "'Courier New', monospace", marginBottom: '40px',
          display: 'block',
        }}
      >
        ← BACK TO PROJECTS
      </button>

      <div style={{ fontSize: '8px', letterSpacing: '4px', color: c, marginBottom: '12px', transition: 'color 0.6s' }}>
        {project.badge}
      </div>

      <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: c, letterSpacing: '-1px', transition: 'color 0.6s', marginBottom: '24px' }}>
        {project.title}
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '48px' }}>
        {project.tags.map(tag => (
          <div key={tag} style={{
            fontSize: '9px', padding: '4px 12px',
            border: `1px solid ${c}80`, color: `${c}cc`,
            background: `${c}0f`, transition: 'all 0.6s',
          }}>
            {tag}
          </div>
        ))}
      </div>

      {[
        { label: 'THE PROBLEM', text: project.detail.problem },
        { label: 'WHAT WAS BUILT', text: project.detail.built },
        { label: 'OUTCOME', text: project.detail.outcome },
      ].map(section => (
        <div key={section.label} style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '8px', letterSpacing: '4px', color: c, marginBottom: '12px' }}>
            {section.label}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 2, maxWidth: '640px' }}>
            {section.text}
          </div>
        </div>
      ))}

      {project.detail.github && (
        <a
          href={project.detail.github}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <button className="btn-fill" style={{ background: c, marginTop: '12px' }}>
            {project.footerLink}
          </button>
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/ProjectDetail.jsx
git commit -m "feat: ProjectDetail page with problem/built/outcome sections

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 18: Wire everything in `App.jsx` and `main.jsx`

**Files:**
- Modify: `client/src/main.jsx`
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Replace `client/src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 2: Replace `client/src/App.jsx`**

```jsx
import { useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UnlockContext } from './context/UnlockContext';
import { useScrollTheme } from './hooks/useScrollTheme';
import { useUnlockState } from './hooks/useUnlockState';
import { PROJECTS } from './data/projects';
import AmbientLayer from './components/AmbientLayer';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ProjectDetail from './pages/ProjectDetail';

function HomePage({ toastRef }) {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects toastRef={toastRef} />
      <Contact />
      <Footer />
    </>
  );
}

export default function App() {
  useScrollTheme();
  const unlockState = useUnlockState(PROJECTS.length);
  const toastRef = useRef(null);

  return (
    <UnlockContext.Provider value={unlockState}>
      <AmbientLayer />
      <div id="scroll-bar" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 999,
        background: 'linear-gradient(90deg, #e8a838, #3dd6c8, #9d7fff)',
        transformOrigin: 'left',
        transform: 'scaleX(0)',
        transition: 'transform 0.05s linear',
      }} ref={el => {
        if (!el) return;
        function onScroll() {
          const s = window.scrollY;
          const h = document.documentElement.scrollHeight - window.innerHeight;
          el.style.transform = `scaleX(${h > 0 ? Math.min(s/h, 1) : 0})`;
        }
        window.addEventListener('scroll', onScroll, { passive: true });
      }} />
      <Nav />
      <Toast ref={toastRef} />
      <Routes>
        <Route path="/" element={<HomePage toastRef={toastRef} />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </UnlockContext.Provider>
  );
}
```

- [ ] **Step 3: Start dev server and verify the full page renders**

```bash
cd client && npm run dev
```

Open `http://localhost:5173`. Verify:
- Nav appears with EXPLORED 0%
- Hero section visible with correct text
- Scroll bar appears at top and fills as you scroll
- Page background color shifts from amber → teal → violet as you scroll

- [ ] **Step 4: Commit**

```bash
git add client/src/main.jsx client/src/App.jsx
git commit -m "feat: wire App with scroll theme, unlock context, and routing

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 19: Vite proxy for local API dev

**Files:**
- Modify: `client/vite.config.js`

- [ ] **Step 1: Update `client/vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
```

- [ ] **Step 2: Update `client/.env` to use relative path in dev**

Change `client/.env`:
```
VITE_API_URL=
```

(Empty string so `${API}/api/contact` becomes `/api/contact`, proxied by Vite.)

- [ ] **Step 3: Start both servers and test contact form end-to-end**

Terminal 1:
```bash
cd server && node index.js
```

Terminal 2:
```bash
cd client && npm run dev
```

Open `http://localhost:5173/#contact`, fill the form, submit. Verify `201` response in Network tab (or no error shown).

- [ ] **Step 4: Commit**

```bash
git add client/vite.config.js client/.env
git commit -m "feat: Vite proxy for local API dev, contact form end-to-end working

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 20: Responsive layout (mobile breakpoints)

**Files:**
- Modify: `client/src/index.css`

- [ ] **Step 1: Add responsive overrides to `client/src/index.css`**

Append to the end of `client/src/index.css`:

```css
@media (max-width: 768px) {
  #hero { padding: 100px 24px 60px; }
  #about { grid-template-columns: 1fr; padding: 60px 24px; }
  #skills { padding: 60px 24px; }
  #projects { padding: 60px 24px; }
  #contact { padding: 60px 24px; }
  .contact-grid { grid-template-columns: 1fr !important; }
  footer { padding: 20px 24px; flex-direction: column; gap: 8px; text-align: center; }
}

@media (max-width: 600px) {
  nav { padding: 0 20px; }
  .nav-links { display: none; }
}
```

- [ ] **Step 2: Verify on 375px viewport**

In browser DevTools, set viewport to 375px wide. Verify:
- Hero text doesn't overflow
- About section stacks vertically
- Projects grid wraps to single column
- Contact form is full width
- Nav hides links (just logo + explore bar)

- [ ] **Step 3: Commit**

```bash
git add client/src/index.css
git commit -m "feat: responsive CSS for mobile viewports

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 21: Final polish pass

**Files:**
- Verify all sections render correctly in browser

- [ ] **Step 1: Full walkthrough checklist**

Open `http://localhost:5173` and verify each item:

- [ ] Hero: Name, subtitle, tags, CTA buttons visible
- [ ] "DOWNLOAD RESUME" button downloads the PDF
- [ ] "VIEW PROJECTS" button scrolls to projects section
- [ ] Scroll bar fills from left as you scroll
- [ ] Background color transitions: amber zone → teal zone → violet zone
- [ ] Nav accent color transitions with scroll
- [ ] About section: text and stat grid visible
- [ ] Skills section: 6 category cards visible
- [ ] Projects: 6 dark cards with "CLICK TO UNLOCK" hint
- [ ] Click Pokémon Battle Bot → amber unlock → toast → ambient glow
- [ ] Click each project → correct color + toast + EXPLORED % increments
- [ ] After all 6 → celebration toast fires
- [ ] Click an unlocked card → navigates to `/project/:id`
- [ ] Project detail page: shows problem / built / outcome / GitHub button
- [ ] Back button returns to homepage
- [ ] Contact form: submits, shows SENT ✓, resets
- [ ] Footer visible

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: final polish pass — all sections verified

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Final Push to GitHub

After all 22 tasks are complete:

```bash
git push origin main
```

All commits will be pushed to the `main` branch on GitHub. The implementation is production-ready.

---

## Self-Review

**Spec coverage check:**

| Requirement | Task |
|---|---|
| Hero with name, CTA buttons | Task 9 |
| About / bio section | Task 10 |
| Skills / tech stack categorized | Task 11 |
| Projects with click-to-unlock | Tasks 12–14 |
| Contact form → MongoDB | Tasks 2, 15 |
| Downloadable resume | Task 9 |
| Scroll-driven theme transition | Tasks 3–4 |
| Ambient glow per unlocked project | Tasks 5, 7 |
| Nav EXPLORED % bar | Task 8 |
| Full unlock celebration toast | Tasks 12, 19 |
| Session-only unlock (no localStorage) | Hook in Task 5 — Set resets on refresh |
| Project detail pages (React Router) | Tasks 17, 18 |
| Responsive layout | Task 20 |
| Express REST API | Task 2 |
| MongoDB message storage | Task 2 |
| Vite proxy for local dev | Task 19 |

**Type consistency verified:** `unlock(id, color)` matches signature used in `ProjectCard`, `UnlockContext`, and `useUnlockState`. `unlocked` is always a `Set` — `.has()` calls are consistent throughout.

**No placeholders:** All code blocks are complete and self-contained.
