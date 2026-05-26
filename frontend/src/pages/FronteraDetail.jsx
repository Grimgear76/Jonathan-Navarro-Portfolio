import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'
import './FronteraDetail.css'

const ACCENT_DARK = projects.find(p => p.id === 'frontera-hackathon')?.accentColor ?? '#58a6ff'
const ACCENT_MONO = projects.find(p => p.id === 'frontera-hackathon')?.monoAccentColor ?? '#003ce0'

const TAGS = ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini AI']

const PROBLEM_STATS = [
  { value: '57%', label: 'Of first-gen college students say they feel unprepared for financial decisions', source: 'NASPA' },
  { value: '3×', label: 'More likely to drop out due to financial stress than continuing-gen students', source: 'Pell Institute' },
  { value: '$37K', label: 'Average student loan debt for graduates — often taken without full context', source: 'NCES' },
  { value: '24HRS', label: 'Total time to design, build, and ship a working product at the hackathon', source: 'UTRGV 2024' },
]

const FEATURES = [
  {
    num: '01',
    title: 'Spending Dashboard',
    body: 'Interactive React charts visualizing income, expenses, and savings rate in real time. Users see their financial picture at a glance — no spreadsheets required.',
  },
  {
    num: '02',
    title: 'REST API Layer',
    body: 'Node.js + Express backend with RESTful endpoints for financial data ingestion, user auth, and AI query routing. Built in hours, stress-tested under hackathon demo conditions.',
  },
  {
    num: '03',
    title: 'MongoDB Storage',
    body: 'Flexible document model for user financial profiles. Schema designed to accommodate diverse income/expense patterns across different student situations.',
  },
  {
    num: '04',
    title: 'Gemini AI Coach',
    body: 'Google Gemini integration providing personalized financial coaching — explains loan terms, suggests budget adjustments, and answers specific questions in plain language.',
  },
]

const PIPELINE = [
  { step: '01', name: 'React', sub: 'Interactive dashboards + UI' },
  { step: '02', name: 'Express', sub: 'REST API + routing layer' },
  { step: '03', name: 'MongoDB', sub: 'User financial data storage' },
  { step: '04', name: 'Gemini AI', sub: 'Personalized coaching responses' },
]

const TIMELINE = [
  { time: '00:00', event: 'Hackathon begins — problem selected: financial literacy for first-gen students' },
  { time: '02:00', event: 'Architecture decided: MERN stack + Gemini for AI coaching layer' },
  { time: '06:00', event: 'Core API endpoints live, MongoDB schema defined, React scaffolded' },
  { time: '14:00', event: 'Dashboard charts functional, Gemini integration working end-to-end' },
  { time: '20:00', event: 'UI polish, bug fixes, demo flow rehearsed' },
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
            A full-stack financial analytics app with AI coaching built in 24 hours at the UTRGV
            Frontera Gemini Hackathon — first-place finish in the Financial Track.
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
          <h2 className="frontera-section__title">Financial literacy has an access gap</h2>
          <p className="frontera-section__lead">
            First-generation college students navigate student loans, budgeting, and financial
            decisions without the guidance that continuing-generation students take for granted.
            The goal: close that gap with accessible, personalized AI coaching.
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
              "Nobody explained compound interest to me. I just signed the loan forms because everyone else did."
            </p>
            <span className="frontera-quote__attr">— First-gen college student, RGV</span>
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
          <h2 className="frontera-section__title">Four layers. One cohesive product.</h2>
          <p className="frontera-section__lead">
            The full stack — from React charts to Gemini AI responses — was designed, implemented,
            and integrated within the 24-hour window.
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
          <h2 className="frontera-section__title">Full MERN + AI in one weekend.</h2>

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
            Google Gemini was chosen for its generous hackathon API limits and strong performance
            on financial reasoning tasks — critical for producing trustworthy coaching responses.
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
              <li>Complete full-stack app delivered within the 24-hour window</li>
              <li>Live demo with real Gemini AI responses shown to judges</li>
              <li>Real-time spending visualizations with interactive React charts</li>
            </ul>
          </div>
          <div className="frontera-outcome__col">
            <span className="frontera-section__label">// WHAT I LEARNED</span>
            <ul className="frontera-outcome__list">
              <li>Rapid architecture decisions under time pressure — choosing boring, proven tech wins</li>
              <li>Gemini API integration: prompt engineering for domain-specific financial responses</li>
              <li>Demo-driven development: if it doesn't work in front of judges, it doesn't matter</li>
              <li>MERN stack is fast to scaffold precisely because it's well-understood</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  )
}
