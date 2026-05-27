import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'
import './RgvTutorDetail.css'

const ACCENT_DARK = projects.find(p => p.id === 'rgv-tutor')?.accentColor ?? '#3dd6c8'
const ACCENT_MONO = projects.find(p => p.id === 'rgv-tutor')?.monoAccentColor ?? '#007ef3'

const TAGS = ['Flutter', 'Node.js', 'Ollama', 'Hive', 'Llama3.2']

const PIPELINE = [
  { step: '01', name: 'Flutter', sub: 'Cross-platform app UI' },
  { step: '02', name: 'Ollama / Llama3.2', sub: 'Local LLM — no API keys' },
  { step: '03', name: 'Node.js', sub: 'Express book-download proxy' },
  { step: '04', name: 'Hive', sub: 'On-device persistence' },
]

const FEATURES = [
  {
    num: 'BOOK HUB',
    title: 'Offline Reading Library',
    body: 'A catalog of classic texts downloadable for offline reading. Students browse by title or author, download once, and read without any connection.',
  },
  {
    num: 'AI HELPER',
    title: 'Local LLM Chat',
    body: 'Llama3.2:1b runs locally via Ollama, called directly from the Flutter app over localhost. Students ask questions in natural language and get full explanations — no internet, no API cost.',
  },
  {
    num: 'PLANNER',
    title: 'Calendar Study Scheduler',
    body: 'A built-in calendar lets students add and track study tasks by day. Persistent via Hive so progress survives app restarts.',
  },
  {
    num: 'SUBJECTS',
    title: 'Practice & Subject Sharing',
    body: 'Practice problems across multiple subject tracks, plus an Import Subject option to load and share content between devices via QR code.',
  },
]

const SCREENSHOTS = [
  { src: '/screenshots/rgv-tutor/subject-select.png', label: 'SUBJECT SELECTION — PRACTICE TRACKS + QR IMPORT' },
  { src: '/screenshots/rgv-tutor/SignIn.png',         label: 'ACCOUNT CREATION — DATA STORED LOCALLY ON DEVICE' },
  { src: '/screenshots/rgv-tutor/Library.png',        label: 'BOOK HUB — DOWNLOAD CLASSICS FOR OFFLINE READING' },
  { src: '/screenshots/rgv-tutor/Planner.png',        label: 'PLANNER — CALENDAR TASK SCHEDULER WITH HIVE PERSISTENCE' },
  { src: '/screenshots/rgv-tutor/Ollama.png',         label: 'AI HELPER — LLAMA3.2:1B RUNNING LOCALLY VIA OLLAMA' },
]

export default function RgvTutorDetail() {
  const navigate = useNavigate()
  const { state } = useColorContext()
  const { monoMode } = state

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const accent = monoMode ? ACCENT_MONO : ACCENT_DARK

  return (
    <div className="rgv-page" style={{ '--rgv-accent': accent }}>

      {/* ── Ambient glows ── */}
      <div className="rgv-glow rgv-glow--tr" />
      <div className="rgv-glow rgv-glow--bl" />

      {/* ════════════════════════════════════ HERO */}
      <section className="rgv-hero">
        <div className="rgv-hero__inner">
          <button className="rgv-back" onClick={() => navigate(-1)}>← BACK</button>

          <p className="rgv-eyebrow">// PROJECT — AI · MOBILE · HACKATHON</p>

          <h1 className="rgv-title">
            <span className="rgv-title__line1">RGV</span>
            <span className="rgv-title__line2">Tutor</span>
          </h1>

          <div className="rgv-award">⬡ 2ND PLACE — AI/ML HACKATHON</div>

          <p className="rgv-hero__sub">
            An offline-first AI tutoring app for students in the Rio Grande Valley —
            local LLM inference, zero cloud costs, fully runnable on a standard laptop.
          </p>

          <div className="rgv-tags">
            {TAGS.map(t => <span key={t} className="rgv-tag">{t}</span>)}
          </div>

          <div className="rgv-hero__links">
            <a
              href="https://github.com/Grimgear76/RGV_Tutor"
              target="_blank"
              rel="noopener noreferrer"
              className="rgv-hero__cta"
            >
              ↗ GITHUB
            </a>
            <a
              href="https://youtu.be/N7ju-QHTInc?si=ObeCHINYP1qyJAr9"
              target="_blank"
              rel="noopener noreferrer"
              className="rgv-hero__cta"
            >
              ↗ WATCH DEMO
            </a>
          </div>
        </div>

        <div className="rgv-hero__scroll-hint">SCROLL TO EXPLORE ↓</div>
      </section>

      {/* ════════════════════════════════════ THE PROBLEM */}
      <section className="rgv-section rgv-problem">
        <div className="rgv-section__inner">
          <span className="rgv-section__label">// THE PROBLEM</span>
          <h2 className="rgv-section__title">Tutoring is a privilege in the RGV</h2>
          <p className="rgv-section__lead">
            The Rio Grande Valley has some of the highest poverty rates in Texas. Personalized
            tutoring is expensive, cloud AI apps require reliable internet, and most free tools
            still depend on subscriptions. Students who need help most get the least access.
          </p>

          <div className="rgv-frames">
            <div className="rgv-frame">
              <div className="rgv-frame__header">
                <span className="rgv-frame__kw">COST</span>
              </div>
              <p>Cloud AI tutors (ChatGPT, Khanmigo) cost $20+/month — out of reach for most RGV families.</p>
            </div>
            <div className="rgv-frame">
              <div className="rgv-frame__header">
                <span className="rgv-frame__kw">CONNECTIVITY</span>
              </div>
              <p>Spotty home internet makes real-time AI tutoring apps unreliable when students need them most — late at night, at home.</p>
            </div>
            <div className="rgv-frame">
              <div className="rgv-frame__header">
                <span className="rgv-frame__kw">DEVICE LIMITS</span>
              </div>
              <p>Most students share household devices. The app needed to run on a single laptop without GPU acceleration or cloud dependencies.</p>
            </div>
            <div className="rgv-frame">
              <div className="rgv-frame__header">
                <span className="rgv-frame__kw">PRIVACY</span>
              </div>
              <p>Student data stored locally. No accounts leave the device — "accounts are stored locally on this device" is the first thing the app tells you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ ARCHITECTURE */}
      <section className="rgv-section rgv-arch">
        <div className="rgv-section__inner">
          <span className="rgv-section__label">// SYSTEM ARCHITECTURE</span>
          <h2 className="rgv-section__title">100% local. Zero API keys.</h2>
          <p className="rgv-section__lead">
            The entire stack runs on a single machine. Flutter handles the UI and calls a local
            Ollama LLM directly for inference, a lightweight Node/Express server proxies book
            downloads, and Hive keeps everything persistent — no cloud, no cost, no latency.
          </p>

          <div className="rgv-pipeline">
            {PIPELINE.map((p, i) => (
              <div key={p.step} className="rgv-pipeline__item">
                <div className="rgv-pipeline__card">
                  <span className="rgv-pipeline__step">{p.step}</span>
                  <span className="rgv-pipeline__name">{p.name}</span>
                  <span className="rgv-pipeline__sub">{p.sub}</span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <span className="rgv-pipeline__arrow">→</span>
                )}
              </div>
            ))}
          </div>

          <p className="rgv-pipeline__note">
            Ollama serves <code>llama3.2:1b</code> locally — the model label visible in the app UI.
            The Flutter app hits Ollama on <code>localhost:11434</code> directly, so every inference
            call stays on-device with no network hop and no API key.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════ FEATURES */}
      <section className="rgv-section rgv-features">
        <div className="rgv-section__inner">
          <span className="rgv-section__label">// WHAT WAS BUILT</span>
          <h2 className="rgv-section__title">Four core features. One unified app.</h2>
          <p className="rgv-section__lead">
            Built in a hackathon window, every feature had to pull its weight. No filler — each
            screen solves a specific gap in RGV students' study toolkit.
          </p>

          <div className="rgv-frames">
            {FEATURES.map(f => (
              <div key={f.num} className="rgv-frame">
                <div className="rgv-frame__header">
                  <span className="rgv-frame__kw">{f.num}</span>
                </div>
                <h3 className="rgv-frame__title">{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ SCREENSHOTS */}
      <section className="rgv-section rgv-gallery">
        <div className="rgv-section__inner">
          <span className="rgv-section__label">// APP SCREENSHOTS</span>
          <h2 className="rgv-section__title">Inside the app</h2>
          <p className="rgv-section__lead">
            Five screens. Each one designed for low-friction use by students on shared devices
            in low-connectivity environments.
          </p>

          <div className="rgv-screenshots">
            {SCREENSHOTS.map(s => (
              <div key={s.src} className="rgv-shot">
                <img src={s.src} alt={s.label} className="rgv-shot__img" loading="lazy" />
                <div className="rgv-shot__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ DEMO VIDEO */}
      <section className="rgv-section rgv-demo">
        <div className="rgv-section__inner">
          <span className="rgv-section__label">// LIVE DEMO</span>
          <h2 className="rgv-section__title">Watch it in action</h2>
          <p className="rgv-section__lead">
            Full walkthrough recorded at the hackathon — subject selection, book hub, AI helper,
            and the planner, all running locally with zero internet dependency.
          </p>

          <div className="rgv-video-wrap">
            <iframe
              src="https://www.youtube.com/embed/N7ju-QHTInc"
              title="RGV Tutor demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ OUTCOME / NEXT STEPS */}
      <section className="rgv-section rgv-limits">
        <div className="rgv-section__inner rgv-limits__inner">
          <div className="rgv-limits__col">
            <span className="rgv-section__label">// OUTCOME</span>
            <ul className="rgv-limits__list">
              <li>2nd Place at the AI/ML Hackathon: Intelligent Solutions to Real-World Problems</li>
              <li>Demonstrated real-time AI tutoring with zero cloud API costs</li>
              <li>Fully runnable on a standard laptop — no GPU, no subscriptions</li>
              <li>Complete Flutter app with practice problems, book hub, planner, and AI chat</li>
            </ul>
          </div>
          <div className="rgv-limits__col">
            <span className="rgv-section__label">// NEXT STEPS</span>
            <ul className="rgv-limits__list">
              <li>Flashcard and quiz generation driven by the local LLM</li>
              <li>Teacher dashboard for assigning subject tracks to students</li>
              <li>Expand book catalog with curriculum-aligned texts</li>
              <li>Package as a deployable school-district toolkit — one install, full offline access</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  )
}
