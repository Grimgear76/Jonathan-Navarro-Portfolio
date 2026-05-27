import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'
import './RobloxDetail.css'

const ACCENT_DARK = projects.find(p => p.id === 'roblox-ux-redesign')?.accentColor ?? '#fb923c'
const ACCENT_MONO = projects.find(p => p.id === 'roblox-ux-redesign')?.monoAccentColor ?? '#ec5f00'

const TAGS = ['Figma', 'UX Research', 'UI Design', 'Design Systems', 'Prototyping']

const UX_PROBLEMS = [
  {
    num: '01',
    title: 'Discoverability failure',
    body: 'The home feed surfaces the same top-10 games endlessly. Niche titles with high engagement in smaller communities never break through. The algorithm rewards existing popularity, not relevance to the user.',
  },
  {
    num: '02',
    title: 'Visual inconsistency',
    body: 'Roblox\'s UI has accumulated years of incremental updates without a unified design language. Font scales, button styles, icon treatments, and spacing systems vary wildly across screens — it feels unfinished.',
  },
  {
    num: '03',
    title: 'Search underperforms',
    body: 'The search experience lacks filters, category scoping, and result ranking transparency. Users searching for "horror games" get results polluted by keyword-stuffed titles with no horror content.',
  },
]

const PROCESS = [
  { step: '01', name: 'Audit', body: 'Documented 20+ existing screens, catalogued inconsistencies in spacing, type, color, and component patterns across web and mobile.' },
  { step: '02', name: 'UX Analysis', body: 'Identified the three core problem areas through heuristic evaluation using Nielsen\'s 10 usability principles as a rubric.' },
  { step: '03', name: 'Wireframes', body: 'Low-fidelity wireframes for home feed, game detail, search, and navigation — iterated on information architecture before touching visuals.' },
  { step: '04', name: 'Design System', body: 'Built a component library, color token set, and typography scale before designing any high-fidelity screens — all components derived from this single source.' },
  { step: '05', name: 'Prototype', body: '11 high-fidelity screens with interactive prototype connections — navigable from home through charts/discovery and into settings, friends, and more.' },
]

const SCREENS = [
  {
    name: 'Charts',
    change: 'Rebuilt the charts screen from scratch — replaced a flat, hard-to-scan ranked list with card-based rows that lead with thumbnail, active player count, and genre tags. Added category tabs (Top, Trending, New) to split discovery intent.',
    impact: 'Users can assess a game at a glance without tapping in. The "Trending" tab surfaces rising titles that the old popularity sort permanently buried.',
  },
  {
    name: 'Home Feed',
    change: 'Replaced the static popularity carousel with a grid that surfaces games by play history, friend activity, and category affinity.',
    impact: 'Niche titles get surface area. Users see different content on repeat visits.',
  },
  {
    name: 'Navigation',
    change: 'Collapsed the crowded top nav into a persistent bottom tab bar (Home, Charts, Friends, Avatar, More) — giving Charts a dedicated, always-visible entry point.',
    impact: 'Game discovery is one tap away from anywhere in the app. Charts is no longer buried under a search flow.',
  },
  {
    name: 'Settings & More',
    change: 'Consolidated scattered settings and secondary features into a clean Settings panel with grouped toggles, and a More tab with a scannable icon grid for less-used features.',
    impact: 'Reduces cognitive load on the primary nav. Power-user features remain accessible without crowding the main flow.',
  },
]

const DESIGN_SYSTEM = [
  { token: 'Color', value: '5 semantic roles — Background, Surface, Primary, Accent, Text — each with 3 elevation tiers' },
  { token: 'Type Scale', value: '6-step scale (Display → Caption) with two weights per step — Roblox Bold and Roblox Regular' },
  { token: 'Spacing', value: '4px base unit, 8-step scale — all component padding and margin derived from this grid' },
  { token: 'Components', value: '40+ components: buttons (5 variants), cards (4 types), inputs, badges, nav elements, overlays' },
  { token: 'Icons', value: 'Unified 20px grid with stroke-weight consistency across all icons — replaced the mixed-weight set' },
]

export default function RobloxDetail() {
  const navigate = useNavigate()
  const { state } = useColorContext()
  const { monoMode } = state

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const accent = monoMode ? ACCENT_MONO : ACCENT_DARK

  return (
    <div className="roblox-page" style={{ '--roblox-accent': accent }}>

      <div className="roblox-glow roblox-glow--tr" />
      <div className="roblox-glow roblox-glow--bl" />

      {/* ════════════════════════════════════ HERO */}
      <section className="roblox-hero">
        <div className="roblox-hero__inner">
          <button className="roblox-back" onClick={() => navigate(-1)}>← BACK</button>

          <p className="roblox-eyebrow">// PROJECT — UX/UI DESIGN · FIGMA</p>

          <h1 className="roblox-title">
            <span className="roblox-title__line1">Roblox</span>
            <span className="roblox-title__line2">UX/UI</span>
            <span className="roblox-title__line3">Redesign</span>
          </h1>

          <p className="roblox-hero__sub">
            A high-fidelity Figma redesign of Roblox's core UI — centered on fixing the Charts and
            game lookup experience, with a consistent design language applied across all 11 primary screens.
          </p>

          <div className="roblox-tags">
            {TAGS.map(t => <span key={t} className="roblox-tag">{t}</span>)}
          </div>

          <div className="roblox-hero__links">
            <a
              href="https://www.figma.com/design/9GPGqfOMzfKncIsEdPU7s3/Roblox?node-id=0-1&t=gXAAUKJiuBYCu6vJ-1"
              target="_blank"
              rel="noopener noreferrer"
              className="roblox-hero__cta"
            >
              ↗ VIEW IN FIGMA
            </a>
          </div>
        </div>

        <div className="roblox-hero__scroll-hint">SCROLL TO EXPLORE ↓</div>
      </section>

      {/* ════════════════════════════════════ UX PROBLEMS */}
      <section className="roblox-section roblox-problems">
        <div className="roblox-section__inner">
          <span className="roblox-section__label">// UX AUDIT</span>
          <h2 className="roblox-section__title">Three core failures.</h2>
          <p className="roblox-section__lead">
            Before touching Figma, the existing product was audited using Nielsen's 10 usability
            heuristics. Three problems surfaced as systemic — not just cosmetic — and drove the
            entire redesign scope.
          </p>

          <div className="roblox-problems-grid">
            {UX_PROBLEMS.map(p => (
              <div key={p.num} className="roblox-problem-card">
                <span className="roblox-problem-card__num">// {p.num}</span>
                <h3 className="roblox-problem-card__title">{p.title}</h3>
                <p className="roblox-problem-card__body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ PROCESS */}
      <section className="roblox-section roblox-process">
        <div className="roblox-section__inner">
          <span className="roblox-section__label">// DESIGN PROCESS</span>
          <h2 className="roblox-section__title">System before screen.</h2>
          <p className="roblox-section__lead">
            Every screen was a byproduct of process — audit first, architecture second, components
            third. High-fidelity design came last, after the information architecture and design
            system were locked in.
          </p>

          <div className="roblox-process-steps">
            {PROCESS.map((p, i) => (
              <div key={p.step} className="roblox-process-step">
                <div className="roblox-process-step__header">
                  <span className="roblox-process-step__num">{p.step}</span>
                  <span className="roblox-process-step__name">{p.name}</span>
                  {i < PROCESS.length - 1 && <span className="roblox-process-step__arrow">→</span>}
                </div>
                <p className="roblox-process-step__body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ SCREENS */}
      <section className="roblox-section roblox-screens">
        <div className="roblox-section__inner">
          <span className="roblox-section__label">// SCREENS REDESIGNED</span>
          <h2 className="roblox-section__title">Key screens. Every decision justified.</h2>
          <p className="roblox-section__lead">
            Each screen change has a rationale — not aesthetic preference, but a specific usability
            problem it solves. The "before/after" is in the decision, not just the visual.
          </p>

          <div className="roblox-screens-list">
            {SCREENS.map(s => (
              <div key={s.name} className="roblox-screen-row">
                <div className="roblox-screen-row__name">{s.name}</div>
                <div className="roblox-screen-row__content">
                  <div className="roblox-screen-row__block">
                    <span className="roblox-screen-row__label">// CHANGE</span>
                    <p>{s.change}</p>
                  </div>
                  <div className="roblox-screen-row__block">
                    <span className="roblox-screen-row__label">// IMPACT</span>
                    <p>{s.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ DESIGN SYSTEM */}
      <section className="roblox-section roblox-design-system">
        <div className="roblox-section__inner">
          <span className="roblox-section__label">// DESIGN SYSTEM</span>
          <h2 className="roblox-section__title">Components, tokens, rules.</h2>
          <p className="roblox-section__lead">
            A design system isn't a style guide — it's a set of constraints that make future
            decisions consistent by default. Built before any screen, consumed by every screen.
          </p>

          <div className="roblox-tokens-list">
            {DESIGN_SYSTEM.map(t => (
              <div key={t.token} className="roblox-token-row">
                <span className="roblox-token-row__name">{t.token}</span>
                <p className="roblox-token-row__value">{t.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ OUTCOME */}
      <section className="roblox-section roblox-outcome">
        <div className="roblox-section__inner roblox-outcome__inner">
          <div className="roblox-outcome__col">
            <span className="roblox-section__label">// OUTCOME</span>
            <ul className="roblox-outcome__list">
              <li>11 high-fidelity screens covering all primary user flows</li>
              <li>Interactive Figma prototype — fully navigable from home through charts to settings and more</li>
              <li>40+ component library ready for developer handoff</li>
              <li>Full style guide: color tokens, type scale, spacing system, icon grid</li>
              <li>Heuristic audit documentation mapping each change to a specific UX problem</li>
            </ul>
          </div>
          <div className="roblox-outcome__col">
            <span className="roblox-section__label">// WHAT I LEARNED</span>
            <ul className="roblox-outcome__list">
              <li>Design systems pay back immediately — components built once, reused everywhere</li>
              <li>Heuristic evaluation gives critique structure — "it looks off" becomes "this violates consistency"</li>
              <li>Information architecture decisions are harder to reverse than visual ones — get the IA right first</li>
              <li>Figma's auto-layout and component variants eliminate a class of handoff ambiguity entirely</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ FIGMA OVERVIEW */}
      <section className="roblox-section roblox-preview">
        <div className="roblox-section__inner">
          <img
            src="/screenshots/roblox-ux-redesign/figma-overview.png"
            alt="Figma canvas overview showing all redesigned Roblox screens"
            className="roblox-preview__img"
          />
        </div>
      </section>

    </div>
  )
}
