import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'
import './Rapp956Detail.css'

const ACCENT_DARK = projects.find(p => p.id === 'rapp956')?.accentColor ?? '#4ade80'
const ACCENT_MONO = projects.find(p => p.id === 'rapp956')?.monoAccentColor ?? '#16a34a'

const TAGS = ['Vite', 'React', 'CSS Modules', 'Cloudflare Pages']

const PROBLEM_STATS = [
  { value: '1 IN 4', label: 'Middle schoolers report being offered vaping products', source: 'CDC' },
  { value: '70%', label: 'Of teens say peer pressure is the #1 reason they try substances', source: 'SAMHSA' },
  { value: '2×', label: 'More likely to continue if not addressed before high school', source: 'NIH' },
  { value: '1 IN 3', label: 'Parents feel unprepared to talk to their teen about substance use', source: 'NIDA' },
]

const PIPELINE = [
  { step: '01', name: 'Vite', sub: 'Lightning-fast dev server + build' },
  { step: '02', name: 'React', sub: 'Component-based single-page app' },
  { step: '03', name: 'CSS Modules', sub: 'Scoped styles, zero dependencies' },
  { step: '04', name: 'Cloudflare Pages', sub: 'Global edge deployment + SPA redirect' },
]

const SECTIONS_BUILT = [
  { num: 'Hero', title: 'Real Stories. Real Choices.', body: 'Bold above-the-fold messaging with the RAPP logo, program tagline, and dual CTAs — "Discover the Program" and "Sessions Coming Soon."' },
  { num: 'Problem', title: 'Today\'s Youth Are Under Pressure', body: 'Data-driven statistics panel (CDC, SAMHSA, NIH, NIDA) with a standout quote block to make the case for why this program exists.' },
  { num: 'Program', title: 'What RAPP Teaches', body: 'Structured breakdown of curriculum topics: vaping, peer pressure, risky decision-making, and life skills — tailored for RGV middle and high schoolers.' },
  { num: 'Districts', title: 'For School Districts', body: 'Pitch section with clear value props and contact information for Shey & Miguel Segura, the program founders, to drive district outreach.' },
]

export default function Rapp956Detail() {
  const navigate = useNavigate()
  const { state } = useColorContext()
  const { monoMode } = state

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const accent = monoMode ? ACCENT_MONO : ACCENT_DARK

  return (
    <div className="rapp-page" style={{ '--rapp-accent': accent }}>

      {/* ── Ambient glows ── */}
      <div className="rapp-glow rapp-glow--tr" />
      <div className="rapp-glow rapp-glow--bl" />

      {/* ════════════════════════════════════ HERO */}
      <section className="rapp-hero">
        <div className="rapp-hero__inner">
          <button className="rapp-back" onClick={() => navigate(-1)}>← BACK</button>

          <p className="rapp-eyebrow">// PROJECT — PRODUCTION WEB</p>

          <h1 className="rapp-title">
            <span className="rapp-title__line1">RAPP956</span>
            <span className="rapp-title__line2">Website</span>
          </h1>

          <p className="rapp-hero__sub">
            A production marketing site built to pitch a youth mental health &amp; life skills program
            to RGV school districts — designed, built, and deployed from scratch.
          </p>

          <div className="rapp-tags">
            {TAGS.map(t => <span key={t} className="rapp-tag">{t}</span>)}
          </div>

          <div className="rapp-hero__links">
            <a
              href="https://rapp956-website.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="rapp-hero__cta"
            >
              ↗ VIEW LIVE SITE
            </a>
          </div>
        </div>

        <div className="rapp-hero__scroll-hint">SCROLL TO EXPLORE ↓</div>
      </section>

      {/* ════════════════════════════════════ LIVE PREVIEW */}
      <section className="rapp-section rapp-preview">
        <div className="rapp-section__inner">
          <span className="rapp-section__label">// LIVE SITE</span>
          <h2 className="rapp-section__title">The finished product</h2>
          <p className="rapp-section__lead">
            Real visitors, real school districts. The site is live on Cloudflare Pages' global edge
            network — sub-second load times, zero downtime.
          </p>

          <div className="rapp-screenshot-main">
            <img
              src="/screenshots/rapp956/hero.png"
              alt="RAPP956 website hero section"
              className="rapp-screenshot__img"
            />
            <div className="rapp-screenshot__label">RAPP956 — HERO SECTION · rapp956-website.pages.dev</div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ THE PROBLEM */}
      <section className="rapp-section rapp-problem">
        <div className="rapp-section__inner">
          <span className="rapp-section__label">// THE PROBLEM</span>
          <h2 className="rapp-section__title">Today's youth are under pressure</h2>
          <p className="rapp-section__lead">
            The Rise Above Pressure Program was created because the data is undeniable — RGV students
            face real pressures every day and most schools lack a structured response. The website needed
            to make this case instantly to decision-makers.
          </p>

          <div className="rapp-stats-grid">
            {PROBLEM_STATS.map(s => (
              <div key={s.value} className="rapp-stat-card">
                <span className="rapp-stat-card__value">{s.value}</span>
                <p className="rapp-stat-card__label">{s.label}</p>
                <span className="rapp-stat-card__source">{s.source}</span>
              </div>
            ))}
          </div>

          <div className="rapp-quote">
            <p className="rapp-quote__text">
              "Nobody wakes up and says 'I want to mess up my life.' It happens little by little."
            </p>
            <span className="rapp-quote__attr">— RAPP Program Session</span>
          </div>

          <div className="rapp-screenshot-main">
            <img
              src="/screenshots/rapp956/problem.png"
              alt="RAPP956 website problem statistics section"
              className="rapp-screenshot__img"
            />
            <div className="rapp-screenshot__label">RAPP956 — PROBLEM SECTION · STAT CARDS + QUOTE BLOCK</div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ WHAT WAS BUILT */}
      <section className="rapp-section rapp-built">
        <div className="rapp-section__inner">
          <span className="rapp-section__label">// WHAT WAS BUILT</span>
          <h2 className="rapp-section__title">Four sections. One clear pitch.</h2>
          <p className="rapp-section__lead">
            Built as a focused single-page app — no bloat, no external routing library.
            Anchor-based navigation keeps it fast and simple. Every section has a single job.
          </p>

          <div className="rapp-sections-grid">
            {SECTIONS_BUILT.map((s, i) => (
              <div key={s.num} className="rapp-built-card">
                <span className="rapp-built-card__num">// {String(i + 1).padStart(2, '0')}</span>
                <h3 className="rapp-built-card__title">{s.title}</h3>
                <p className="rapp-built-card__body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ TECH PIPELINE */}
      <section className="rapp-section rapp-pipeline-section">
        <div className="rapp-section__inner">
          <span className="rapp-section__label">// TECH STACK</span>
          <h2 className="rapp-section__title">Lean stack. Production-grade.</h2>

          <div className="rapp-pipeline">
            {PIPELINE.map((p, i) => (
              <div key={p.step} className="rapp-pipeline__item">
                <div className="rapp-pipeline__card">
                  <span className="rapp-pipeline__step">{p.step}</span>
                  <span className="rapp-pipeline__name">{p.name}</span>
                  <span className="rapp-pipeline__sub">{p.sub}</span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <span className="rapp-pipeline__arrow">→</span>
                )}
              </div>
            ))}
          </div>

          <p className="rapp-pipeline__note">
            SPA redirects handled via a <code>_redirects</code> file — all routes return index.html so
            Cloudflare's edge doesn't 404 on direct navigation or refresh.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════ DISTRICTS / OUTREACH */}
      <section className="rapp-section rapp-districts">
        <div className="rapp-section__inner">
          <span className="rapp-section__label">// FOR DISTRICTS</span>
          <h2 className="rapp-section__title">Designed to convert</h2>
          <p className="rapp-section__lead">
            The contact section was built with one audience in mind: school district administrators.
            Direct founder contact, clear program identity, and a bold call-to-action — no friction.
          </p>

          <div className="rapp-screenshot-main">
            <img
              src="/screenshots/rapp956/contact.png"
              alt="RAPP956 website district contact section"
              className="rapp-screenshot__img"
            />
            <div className="rapp-screenshot__label">RAPP956 — DISTRICT OUTREACH SECTION · CONTACT + FOUNDERS</div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ OUTCOME / LIMITS */}
      <section className="rapp-section rapp-limits">
        <div className="rapp-section__inner rapp-limits__inner">
          <div className="rapp-limits__col">
            <span className="rapp-section__label">// OUTCOME</span>
            <ul className="rapp-limits__list">
              <li>Live production site serving real visitors across the Rio Grande Valley</li>
              <li>School district contacts actively reaching out via the site</li>
              <li>Sub-second load times on Cloudflare's global edge network</li>
              <li>Zero-cost hosting — Cloudflare Pages free tier handles all traffic</li>
            </ul>
          </div>
          <div className="rapp-limits__col">
            <span className="rapp-section__label">// NEXT STEPS</span>
            <ul className="rapp-limits__list">
              <li>Add session signup and scheduling for enrolled districts</li>
              <li>Student testimonials section once program launches</li>
              <li>Analytics dashboard for founders to track outreach metrics</li>
              <li>Expand to a full CMS so founders can update content themselves</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  )
}
