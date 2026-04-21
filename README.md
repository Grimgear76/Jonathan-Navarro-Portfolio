# Jonathan Navarro — Portfolio

Personal portfolio website built with the MERN stack. Showcases CS projects and skills with a muted cyberpunk aesthetic, scroll-driven color transitions, and a click-to-unlock project system.

## Features

- **Scroll-driven color journey** — background and accent color morph through three zones as you scroll (amber → teal → violet)
- **Click-to-unlock projects** — each project card starts dark; clicking it reveals its unique accent color and adds an ambient glow layer to the page
- **EXPLORED X% tracker** — navbar progress bar fills as more projects are unlocked
- **Full-unlock celebration** — toast fires when all 6 projects are discovered
- **Project detail pages** — each project expands to a `/projects/:id` route with problem, what was built, and outcome
- **Animated skill bars** — triggered by IntersectionObserver when scrolled into view
- **Contact form** — client-side validated (name, email, message)
- **Downloadable resume** — served directly from the frontend

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Plain CSS with custom properties (no framework) |
| State | React Context + useReducer |
| Testing | Vitest, @testing-library/react |
| Backend | Express.js (planned) |
| Database | MongoDB (planned — contact form) |

## Project Structure

```
Jonathan N Portfolio/
├── frontend/
│   ├── public/
│   │   └── resume.pdf
│   └── src/
│       ├── context/
│       │   └── ColorContext.jsx      # Global scroll zone + unlock state
│       ├── hooks/
│       │   ├── useScrollZone.js      # Scroll % → CSS custom property interpolation
│       │   └── useColorUnlock.js     # Project unlock helpers + exploredPercent
│       ├── data/
│       │   └── projects.js           # All 6 projects with accent colors + detail copy
│       ├── components/
│       │   ├── Navbar.jsx            # Fixed nav with EXPLORED X% progress bar
│       │   ├── Hero.jsx              # Full-viewport hero with blinking cursor
│       │   ├── About.jsx             # Bio + terminal whoami card
│       │   ├── Skills.jsx            # Animated skill bars (IntersectionObserver)
│       │   ├── Projects/
│       │   │   ├── Projects.jsx      # 6-card grid section
│       │   │   └── ProjectCard.jsx   # Click-to-unlock individual card
│       │   ├── Contact.jsx           # Validated contact form
│       │   ├── Footer.jsx            # GitHub / LinkedIn / email links
│       │   ├── AmbientOverlay.jsx    # Fixed radial gradient layer (grows as cards unlock)
│       │   ├── Toast.jsx             # Full-unlock celebration toast
│       │   └── ScrollZoneWatcher.jsx # Renderless — hooks scroll events
│       ├── pages/
│       │   └── ProjectDetail.jsx     # /projects/:id detail page
│       ├── styles/
│       │   └── globals.css           # CSS custom properties, reset, shared classes
│       ├── App.jsx                   # Root: ColorProvider + BrowserRouter + routes
│       └── main.jsx                  # Vite entry point
└── docs/
    └── superpowers/
        ├── specs/                    # Design spec
        └── plans/                    # Implementation plan (21 tasks)
```

## Running Locally

### Prerequisites

- Node.js 18+
- npm 9+

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Grimgear76/Jonathan-Navarro-Portfolio.git
cd Jonathan-Navarro-Portfolio

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Tests

```bash
cd frontend
npm run test:run
```

All 21 tests should pass:
- 5 × `colorReducer` (state management)
- 10 × `useScrollZone` (color interpolation + zone detection)
- 6 × `Contact.validate` (form validation)

## Color System

### Scroll Zones

| Zone | Trigger | Background | Accent |
|------|---------|-----------|--------|
| Zone 01 | Top (Hero) | `#111111` | `#e8a838` Warm Amber |
| Zone 02 | Mid (Skills) | `#0d1117` | `#3dd6c8` Steel Teal |
| Zone 03 | Bottom (Contact) | `#10101a` | `#9d7fff` Midnight Violet |

Colors interpolate smoothly between zones as you scroll.

### Project Accent Colors

| Project | Color |
|---------|-------|
| Pokémon Battle Bot | `#e8a838` amber |
| RGV Tutor | `#3dd6c8` teal |
| Frontera Hackathon | `#58a6ff` blue |
| 2D Action RPG | `#9d7fff` violet |
| College Social App | `#f472b6` pink |
| Roblox UX Redesign | `#fb923c` orange |

Color unlock state is **session-only** — resets on page refresh. Every visit starts as a fresh monochrome journey.

## Roadmap

- [ ] Backend: Express.js API for contact form submissions
- [ ] Database: MongoDB to store contact messages
- [ ] Deployment: Vercel (frontend) + Railway or Render (backend)
- [ ] Footer: Add real LinkedIn URL and email address
