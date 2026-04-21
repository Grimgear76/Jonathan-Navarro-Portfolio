# Portfolio Frontend Design Spec
**Date:** 2026-04-21
**Scope:** React frontend only (backend/MongoDB wired later)
**Stack:** Vite + React, React Router, CSS custom properties

---

## Architecture

Component-based React SPA. A single `ColorContext` holds all shared color state (scroll zone + project unlock). Two custom hooks encapsulate the two interlocking color mechanics.

```
frontend/
├── src/
│   ├── components/
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects/
│   │   │   ├── Projects.jsx
│   │   │   └── ProjectCard.jsx
│   │   ├── Contact.jsx
│   │   └── Navbar.jsx
│   ├── context/
│   │   └── ColorContext.jsx
│   ├── hooks/
│   │   ├── useScrollZone.js
│   │   └── useColorUnlock.js
│   ├── data/
│   │   └── projects.js
│   ├── styles/
│   │   └── globals.css
│   └── App.jsx
├── index.html
└── vite.config.js
```

---

## Color System

### Scroll-Driven Zone Transitions
`useScrollZone` listens to `window.scroll`, computes `scrollPercent`, and updates `--bg` and `--accent` CSS custom properties on `:root` by interpolating between zone values.

| Zone | Scroll % | BG | Accent |
|------|----------|----|--------|
| 01 | 0–33% | `#111111` | `#e8a838` |
| 02 | 33–66% | `#0d1117` | `#3dd6c8` |
| 03 | 66–100% | `#10101a` | `#9d7fff` |

### Click-to-Unlock
`useColorUnlock` manages a `Set` of unlocked project IDs in `ColorContext`. On `ProjectCard` click, the project's ID is added to the set. A fixed `div.ambient-overlay` renders stacked `radial-gradient` layers — one per unlocked project at a randomized position. `pointer-events: none`, `z-index: 0`.

### Progress Bar
Navbar shows `EXPLORED X%` — `(unlockedCount / 6) * 100`. At 100%, a toast celebration fires. State is session-only (React state, no localStorage).

### Per-Project Accent Colors
| Project | Color |
|---------|-------|
| Pokémon Battle Bot | `#e8a838` amber |
| RGV Tutor | `#3dd6c8` teal |
| Frontera Hackathon | `#58a6ff` blue |
| 2D Action RPG | `#9d7fff` violet |
| College Social Life App | `#f472b6` pink |
| Roblox UI Redesign | `#fb923c` orange |

---

## Components

### Navbar
Fixed top. Monospace font. Site name (left) + `EXPLORED X%` progress bar (right). Bar fill color tracks current `--accent`.

### Hero
Full viewport height (`100vh`). Name, title, two CTAs: `VIEW PROJECTS` (smooth scroll to `#projects`) and `DOWNLOAD RESUME` (links to PDF). Animated background — CSS blinking cursor animation on the title text (pure CSS, no JS).

### About
Two-column: bio text (left) + terminal-style card (right). Terminal card displays fake `> whoami` output: name, graduation year, location, interests. Monospace font throughout.

### Skills
Categorized: Languages, Frameworks, Tools, AI/ML. Animated fill bars triggered by `IntersectionObserver` on scroll-into-view.

### Projects
6 `ProjectCard` components in a CSS grid. Default state: dark/muted. On click: card accent color activates (title, tags, border, glow). Ambient overlay gains a new radial-gradient layer. Card shows title, 2-line description, tech tags, `→` expand icon. Expand navigates to `/projects/:id` via React Router.

### Contact
Name + email + message form. Frontend-only for now — validates inputs, shows inline errors, renders a success state on submit. No API call until backend is built.

### Footer
GitHub, LinkedIn, email links. Minimal.

---

## Routing
React Router v6. Routes:
- `/` — main single-page view (all sections)
- `/projects/:id` — project detail page (problem → what was built → outcome)

---

## Styling Approach
- CSS custom properties (`--bg`, `--accent`, `--text`) on `:root` for live theme morphing
- `globals.css` for base reset, typography (Courier New / monospace), and custom property definitions
- Plain CSS files per component (e.g. `Hero.css` alongside `Hero.jsx`)
- No CSS framework (Tailwind etc.) — keep full control over the cyberpunk aesthetic
- `will-change: background-color` on body to smooth scroll transitions
- Font: `'Courier New', Courier, monospace` for headings/labels; system sans for body copy

---

## Data
`src/data/projects.js` exports an array of project objects:
```js
{
  id: 'pokemon-battle-bot',
  title: 'Pokémon Battle Bot',
  description: '...',
  technologies: ['Python', 'PPO', 'Stable-Baselines3', 'Gymnasium'],
  accentColor: '#e8a838',
  detail: { problem: '...', built: '...', outcome: '...' }
}
```

---

## Out of Scope (this phase)
- Express backend
- MongoDB contact form storage
- Deployment (Vercel / Railway)
- WebGL / cursor effects (Phase C)
