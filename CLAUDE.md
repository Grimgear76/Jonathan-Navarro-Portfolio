# Jonathan Navarro — Portfolio Website

## Project Overview
Personal portfolio website built with the MERN stack to showcase CS projects and skills to
recruiters and fellow developers. Primary audience is recruiters (professional + impressive at a
glance) with enough technical depth to impress the dev community.

## Architecture — Option A (chosen)
- **Frontend:** React SPA with React Router (project detail pages as routes)
- **Backend:** Express.js REST API
- **Database:** MongoDB (contact form submissions)
- **Resume:** Static file served from Express or hosted directly
- **Deployment:** Vercel (frontend) + Railway or Render (backend)

## Features
- Hero section with name, title, CTA buttons
- About / bio section
- Skills / tech stack section (categorized)
- Projects section with unlock mechanic (see Color System below)
- Contact form (submissions stored in MongoDB)
- Downloadable resume button (PDF)

## Visual Design

### Aesthetic
Muted cyberpunk — dark, techy, sharp. NOT neon/garish. Sophisticated and restrained.
Monospace font (Courier New or similar) for headings and labels.

### Color System — Two Interlocking Mechanics

#### 1. Scroll-Driven Theme Transition
As the user scrolls top-to-bottom the entire palette smoothly morphs through three themes.
Implemented via scroll event → CSS custom property interpolation.

| Zone     | Trigger         | BG        | Accent    | Name                  |
|----------|-----------------|-----------|-----------|----------------------|
| Zone 01  | Top (Hero)      | `#111111` | `#e8a838` | Carbon + Warm Amber  |
| Zone 02  | Mid (Skills)    | `#0d1117` | `#3dd6c8` | GitHub Dark + Steel Teal |
| Zone 03  | Bottom (Contact)| `#10101a` | `#9d7fff` | Midnight Violet + Ice Blue |

#### 2. Click-to-Unlock Color System
Each project card starts visually muted/dark. When the user clicks a project card, that
project's unique accent color "unlocks" — the card lights up with its color (title, tags,
border, glow) AND the same color bleeds into the page as an ambient radial gradient overlay.

The more projects explored, the richer and more colorful the ambient backdrop becomes.
A nav progress bar ("EXPLORED X%") tracks how much has been unlocked.
On full unlock (all 6 projects), a toast celebration fires.

**Session only** — color unlock state resets on page refresh (no localStorage persistence).
This is intentional: every visit starts as a fresh monochrome journey.

Per-project accent colors:
| Project                      | Color     |
|------------------------------|-----------|
| Pokémon Battle Bot           | `#e8a838` (amber)  |
| RGV Tutor                    | `#3dd6c8` (teal)   |
| Frontera Hackathon (1st)     | `#58a6ff` (blue)   |
| 2D Action RPG                | `#9d7fff` (violet) |
| College Social Life App      | `#f472b6` (pink)   |
| Roblox UI Redesign           | `#fb923c` (orange) |

### Interactivity Level
Start at **B** (scroll-triggered animations, animated skill bars, particle/ambient backgrounds)
with room to push toward **C** (cursor effects, WebGL) later.

## Projects to Showcase (from resume)
1. **Pokémon Battle Bot** — Python, PPO, Stable-Baselines3, Gymnasium
2. **RGV Tutor** — Flutter, Node.js, Ollama, SQLite — *2nd Place AI/ML Hackathon*
3. **Frontera Gemini Hackathon 2024** — React, Node.js, Express, MongoDB — *1st Place Financial*
4. **2D Action RPG** — Unity, C#
5. **College Social Life App** — MERN stack
6. **Roblox UX/UI Redesign** — Figma
7. **Hack Research (Roons)** — Research paper (optional / secondary)

Each project gets a card that expands into a full detail page (problem → what was built → outcome).
Featured projects (hackathon wins, Battle Bot) get extra visual weight.

## UI Reference
A working HTML prototype of the full UI concept (scroll transition + unlock system) is saved at:
`references/ui-preview.html`

Open in any browser to see the scroll color journey and click-to-unlock mechanic in action.

## Key Design Decisions
- No blog/articles section — keeps scope tight
- No localStorage — session-only color state keeps every visit feeling like a first impression
- Single-page app with React Router for project detail routes (not full multi-page)
- The "explore to unlock color" mechanic is the primary hook that keeps recruiters scrolling
- Monochrome-first: the site looks intentional before ANY unlocking happens

## Git / GitHub

**Always push to `main` branch.** Never use `master`. The `main` branch is the source of truth for all production code.

Commits should include:
```
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Repository: https://github.com/Grimgear76/Jonathan-Navarro-Portfolio.git

## Obsidian Conversation Log

At the end of every session, append a summary of the conversation to:
`Jonathan Portfolio/Claude Conversations.md`

Format each session as:
```
## YYYY-MM-DD — <short topic title>
<summary of what was discussed and done>
```

Never overwrite the file — always append.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
