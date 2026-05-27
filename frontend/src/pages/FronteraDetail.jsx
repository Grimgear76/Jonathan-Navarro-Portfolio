import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'
import './FronteraDetail.css'

const ACCENT_DARK = projects.find(p => p.id === 'frontera-hackathon')?.accentColor ?? '#58a6ff'
const ACCENT_MONO = projects.find(p => p.id === 'frontera-hackathon')?.monoAccentColor ?? '#003ce0'

const TAGS = ['HTML', 'CSS', 'JavaScript', 'Google Gemini API']

const PROBLEM_STATS = [
  { value: '1ST', label: 'Place in the Financial Track — UTRGV Frontera Gemini Hackathon', source: 'UTRGV 2024' },
  { value: '24HRS', label: 'To design, build, and demo a working multi-tool product', source: 'HACKATHON' },
  { value: '3', label: 'Financial tools: payroll calculator, revenue calculator, and an AI assistant', source: 'FINANCABLE' },
  { value: 'GEMINI', label: 'Google Gemini API powers the in-app small-business finance assistant', source: 'GOOGLE AI' },
]

const FEATURES = [
  {
    num: '01',
    title: 'Salary Cost Calculator',
    body: 'Computes weekly, monthly, and yearly payroll cost from an hourly rate, hours worked, and employment type (full- or part-time) — turning an owner\'s payroll math into a few inputs.',
  },
  {
    num: '02',
    title: 'Revenue Calculator',
    body: 'Weighs income against the two big outflows — employee salaries and business purchases — to give a quick read on revenue, so owners can sanity-check the numbers without a spreadsheet.',
  },
  {
    num: '03',
    title: 'Financable Assist',
    body: 'A chatbot powered by the Google Gemini API that answers small-business finance questions in plain language — with a typing effect, light/dark theme, and chat history saved in localStorage.',
  },
  {
    num: '04',
    title: 'Multi-Page Site',
    body: 'A cohesive five-page site — Home, Calculator, Revenue, Contact, and Gemini — sharing one nav and design language, built with plain HTML, CSS, and JavaScript for a fast, dependency-free demo.',
  },
]

const PIPELINE = [
  { step: '01', name: 'HTML', sub: 'Multi-page site structure' },
  { step: '02', name: 'CSS', sub: 'Shared layout + theming' },
  { step: '03', name: 'JavaScript', sub: 'Calculators + chat logic' },
  { step: '04', name: 'Gemini API', sub: 'Finance assistant responses' },
]

const TIMELINE = [
  { time: '00:00', event: 'Hackathon begins — idea chosen: a financial toolkit for small-business owners' },
  { time: '02:00', event: 'Scope decided: payroll + revenue calculators and a Gemini-powered assistant' },
  { time: '06:00', event: 'Multi-page site scaffolded; payroll calculator logic working' },
  { time: '14:00', event: 'Revenue calculator done; Gemini API wired into "Financable Assist"' },
  { time: '20:00', event: 'Shared styling, theme toggle, and chat persistence polished' },
  { time: '24:00', event: 'Presented to judges — awarded 1st Place, Financial Track' },
]

export default function FronteraDetail() {
  const navigate = useNavigate()
  const { state } = useColorContext()
  const { monoMode } = state

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const accent = monoMode ? ACCENT_MONO : ACCENT_DARK

  return (
    <div className="frontera-page" style={{ '--frontera-accent': accent }}>

      <div className="frontera-glow frontera-glow--tr" />
      <div className="frontera-glow frontera-glow--bl" />

      {/* ════════════════════════════════════ HERO */}
      <section className="frontera-hero">
        <div className="frontera-hero__inner">
          <button className="frontera-back" onClick={() => navigate(-1)}>← BACK</button>

          <p className="frontera-eyebrow">// PROJECT — HACKATHON · FINANCIAL TRACK</p>

          <div className="frontera-award-badge">⬡ 1ST PLACE — FINANCIAL TRACK</div>

          <h1 className="frontera-title">
            <span className="frontera-title__line1">Frontera</span>
            <span className="frontera-title__line2">Hackathon</span>
            <span className="frontera-title__line3">2024</span>
          </h1>

          <p className="frontera-hero__sub">
            Financable — a small-business financial toolkit with payroll and revenue calculators plus
            a Gemini-powered finance assistant, built in 24 hours at the UTRGV Frontera Gemini
            Hackathon for a first-place finish in the Financial Track.
          </p>

          <div className="frontera-tags">
            {TAGS.map(t => <span key={t} className="frontera-tag">{t}</span>)}
          </div>

          <div className="frontera-hero__links">
            <a
              href="https://github.com/Grimgear76/frontera-hackathon"
              target="_blank"
              rel="noopener noreferrer"
              className="frontera-hero__cta"
            >
              ↗ VIEW ON GITHUB
            </a>
          </div>
        </div>

        <div className="frontera-hero__scroll-hint">SCROLL TO EXPLORE ↓</div>
      </section>

      {/* ════════════════════════════════════ THE PROBLEM */}
      <section className="frontera-section frontera-problem">
        <div className="frontera-section__inner">
          <span className="frontera-section__label">// THE PROBLEM</span>
          <h2 className="frontera-section__title">Small-business finance, simplified</h2>
          <p className="frontera-section__lead">
            Small-business owners juggle payroll, revenue, and tax math without accessible tools —
            getting clear answers usually means wrestling spreadsheets or paying an accountant.
            The goal: bundle the everyday calculations and an AI finance assistant into one simple site.
          </p>

          <div className="frontera-stats-grid">
            {PROBLEM_STATS.map(s => (
              <div key={s.value} className="frontera-stat-card">
                <span className="frontera-stat-card__value">{s.value}</span>
                <p className="frontera-stat-card__label">{s.label}</p>
                <span className="frontera-stat-card__source">{s.source}</span>
              </div>
            ))}
          </div>

          <div className="frontera-quote">
            <p className="frontera-quote__text">
              "At Financable, our mission is to empower small businesses with easy-to-use financial tools that simplify complex processes."
            </p>
            <span className="frontera-quote__attr">— Financable, project mission</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ 24HR CONSTRAINT */}
      <section className="frontera-section frontera-constraint">
        <div className="frontera-section__inner">
          <span className="frontera-section__label">// THE CONSTRAINT</span>
          <h2 className="frontera-section__title">24 hours. One shot.</h2>
          <p className="frontera-section__lead">
            Hackathon conditions mean no iteration cycles, no second chances. Every architectural
            decision had to be right the first time — and the product had to demo flawlessly in front of judges.
          </p>

          <div className="frontera-timeline">
            {TIMELINE.map((t, i) => (
              <div key={t.time} className="frontera-timeline__item">
                <span className="frontera-timeline__time">{t.time}</span>
                <div className="frontera-timeline__line" />
                <p className="frontera-timeline__event">{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ WHAT WAS BUILT */}
      <section className="frontera-section frontera-built">
        <div className="frontera-section__inner">
          <span className="frontera-section__label">// WHAT WAS BUILT</span>
          <h2 className="frontera-section__title">Four pieces. One cohesive product.</h2>
          <p className="frontera-section__lead">
            Two calculators, an AI assistant, and a shared multi-page site — all designed,
            implemented, and integrated within the 24-hour window.
          </p>

          <div className="frontera-features-grid">
            {FEATURES.map(f => (
              <div key={f.num} className="frontera-feature-card">
                <span className="frontera-feature-card__num">// {f.num}</span>
                <h3 className="frontera-feature-card__title">{f.title}</h3>
                <p className="frontera-feature-card__body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ TECH PIPELINE */}
      <section className="frontera-section frontera-pipeline-section">
        <div className="frontera-section__inner">
          <span className="frontera-section__label">// TECH STACK</span>
          <h2 className="frontera-section__title">Vanilla web + Gemini, shipped fast.</h2>

          <div className="frontera-pipeline">
            {PIPELINE.map((p, i) => (
              <div key={p.step} className="frontera-pipeline__item">
                <div className="frontera-pipeline__card">
                  <span className="frontera-pipeline__step">{p.step}</span>
                  <span className="frontera-pipeline__name">{p.name}</span>
                  <span className="frontera-pipeline__sub">{p.sub}</span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <span className="frontera-pipeline__arrow">→</span>
                )}
              </div>
            ))}
          </div>

          <p className="frontera-pipeline__note">
            A no-framework, plain HTML/CSS/JS build was a deliberate hackathon call — zero setup
            overhead meant more time on the calculators and the Gemini assistant, and the whole
            site could be demoed instantly with a live server.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════ OUTCOME */}
      <section className="frontera-section frontera-outcome">
        <div className="frontera-section__inner frontera-outcome__inner">
          <div className="frontera-outcome__col">
            <span className="frontera-section__label">// OUTCOME</span>
            <ul className="frontera-outcome__list">
              <li>1st Place — Financial Track, UTRGV Frontera Gemini Hackathon 2024</li>
              <li>Working multi-tool product delivered within the 24-hour window</li>
              <li>Live demo with real Gemini-powered assistant responses shown to judges</li>
              <li>Payroll and revenue calculators producing instant results in-browser</li>
            </ul>
          </div>
          <div className="frontera-outcome__col">
            <span className="frontera-section__label">// WHAT I LEARNED</span>
            <ul className="frontera-outcome__list">
              <li>Rapid scope decisions under time pressure — choosing boring, proven tech wins</li>
              <li>Gemini API integration: fetch, streaming a typing effect, and localStorage chat history</li>
              <li>Demo-driven development: if it doesn't work in front of judges, it doesn't matter</li>
              <li>Plain HTML/CSS/JS ships fast precisely because there's no build step to fight</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  )
}
