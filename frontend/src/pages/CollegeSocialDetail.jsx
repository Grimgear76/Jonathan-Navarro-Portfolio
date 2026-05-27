import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'
import './CollegeSocialDetail.css'

const ACCENT_DARK = projects.find(p => p.id === 'college-social-app')?.accentColor ?? '#f472b6'
const ACCENT_MONO = projects.find(p => p.id === 'college-social-app')?.monoAccentColor ?? '#e70077'

const TAGS = ['MongoDB', 'Express', 'React', 'Node.js', 'Socket.io', 'JWT']

const PROBLEMS = [
  {
    num: '01',
    title: 'No campus-scoped feed',
    body: 'Students bounce between Instagram, GroupMe, and Snapchat to keep up with campus life — none of them campus-scoped. The goal: one place to post, react, and connect with peers.',
  },
  {
    num: '02',
    title: 'Real-time is hard',
    body: 'A social feed that only updates on refresh feels dead. Likes and new posts need to land instantly across every connected client — which means WebSockets, not polling.',
  },
  {
    num: '03',
    title: 'Self-hosting end-to-end',
    body: 'Beyond the app: how do you take a local server public, securely, without a cloud provider? This project doubled as a deep dive into networking, HTTPS, and tunneled deployment.',
  },
]

const FEATURES = [
  {
    num: '01',
    title: 'JWT Authentication',
    body: 'Stateless auth with signed tokens — no server-side sessions. The token carries the user ID and is verified in middleware before any protected route or socket event runs.',
  },
  {
    num: '02',
    title: 'Posts, Likes & Comments',
    body: 'Users create posts with text and images, then like and comment on each other\'s posts. Likes are stored as a Map for O(1) toggles, and image uploads are handled with Multer.',
  },
  {
    num: '03',
    title: 'Real-Time Feed',
    body: 'Socket.io shares the Express server and pushes new posts and like updates to every connected client instantly — the feed stays live without any polling.',
  },
  {
    num: '04',
    title: 'Security Hardening',
    body: 'Helmet security headers, global rate limiting, request sanitization, and express-validator on inputs — defense applied at the middleware layer before requests reach a controller.',
  },
]

const PIPELINE = [
  { step: '01', name: 'MongoDB', sub: 'Users, posts, friends' },
  { step: '02', name: 'Express', sub: 'REST API + JWT middleware' },
  { step: '03', name: 'Socket.io', sub: 'Real-time post + like push' },
  { step: '04', name: 'React', sub: 'Feed, post cards, profile UI' },
]

const SCHEMA = [
  { entity: 'User', fields: ['_id', 'firstName', 'lastName', 'userName', 'email', 'password', 'picturePath', 'friends[]'] },
  { entity: 'Post', fields: ['_id', 'userId', 'description', 'picturePath', 'likes{}', 'comments[]', 'createdAt'] },
]

export default function CollegeSocialDetail() {
  const navigate = useNavigate()
  const { state } = useColorContext()
  const { monoMode } = state

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const accent = monoMode ? ACCENT_MONO : ACCENT_DARK

  return (
    <div className="social-page" style={{ '--social-accent': accent }}>

      <div className="social-glow social-glow--tr" />
      <div className="social-glow social-glow--bl" />

      {/* ════════════════════════════════════ HERO */}
      <section className="social-hero">
        <div className="social-hero__inner">
          <button className="social-back" onClick={() => navigate(-1)}>← BACK</button>

          <p className="social-eyebrow">// PROJECT — FULL STACK · MERN</p>

          <h1 className="social-title">
            <span className="social-title__line1">College</span>
            <span className="social-title__line2">Social Life</span>
            <span className="social-title__line3">App</span>
          </h1>

          <p className="social-hero__sub">
            A MERN stack social platform where students post, like, and comment in a real-time feed —
            built with Socket.io live updates, JWT auth, and self-hosted publicly via Cloudflare Tunnel.
          </p>

          <div className="social-tags">
            {TAGS.map(t => <span key={t} className="social-tag">{t}</span>)}
          </div>

          <div className="social-hero__links">
            <a
              href="https://github.com/Grimgear76/College-social-life-app"
              target="_blank"
              rel="noopener noreferrer"
              className="social-hero__cta"
            >
              ↗ VIEW ON GITHUB
            </a>
          </div>
        </div>

        <div className="social-hero__scroll-hint">SCROLL TO EXPLORE ↓</div>
      </section>

      {/* ════════════════════════════════════ THE PROBLEM */}
      <section className="social-section social-problem">
        <div className="social-section__inner">
          <span className="social-section__label">// THE PROBLEM</span>
          <h2 className="social-section__title">A campus feed, built end-to-end</h2>
          <p className="social-section__lead">
            Campus social life is scattered across general-purpose apps that aren't built for it.
            This project set out to build a campus-scoped social feed from scratch — and, just as
            importantly, to learn how to ship and self-host it securely on a home server.
          </p>

          <div className="social-problems-grid">
            {PROBLEMS.map(p => (
              <div key={p.num} className="social-problem-card">
                <span className="social-problem-card__num">// {p.num}</span>
                <h3 className="social-problem-card__title">{p.title}</h3>
                <p className="social-problem-card__body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ DATA MODEL */}
      <section className="social-section social-schema">
        <div className="social-section__inner">
          <span className="social-section__label">// DATA MODEL</span>
          <h2 className="social-section__title">Two collections. One social graph.</h2>
          <p className="social-section__lead">
            MongoDB's document model lets the friends list live directly on the user as an array of
            references — no join table needed. Post likes are a Map keyed by user ID, so toggling a
            like is an O(1) update instead of scanning an array.
          </p>

          <div className="social-schema-grid">
            {SCHEMA.map(s => (
              <div key={s.entity} className="social-schema-card">
                <span className="social-schema-card__entity">{s.entity}</span>
                <ul className="social-schema-card__fields">
                  {s.fields.map(f => (
                    <li key={f} className="social-schema-card__field">
                      <span className="social-schema-card__dot" />
                      <code>{f}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ FEATURES */}
      <section className="social-section social-features">
        <div className="social-section__inner">
          <span className="social-section__label">// WHAT WAS BUILT</span>
          <h2 className="social-section__title">Four systems. One campus feed.</h2>
          <p className="social-section__lead">
            Each feature solves a discrete problem — auth, posting, real-time delivery, security —
            and they're decoupled enough that the feed renders whether or not the socket connection is live.
          </p>

          <div className="social-features-grid">
            {FEATURES.map(f => (
              <div key={f.num} className="social-feature-card">
                <span className="social-feature-card__num">// {f.num}</span>
                <h3 className="social-feature-card__title">{f.title}</h3>
                <p className="social-feature-card__body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ TECH PIPELINE */}
      <section className="social-section social-pipeline-section">
        <div className="social-section__inner">
          <span className="social-section__label">// TECH STACK</span>
          <h2 className="social-section__title">The full MERN stack.</h2>

          <div className="social-pipeline">
            {PIPELINE.map((p, i) => (
              <div key={p.step} className="social-pipeline__item">
                <div className="social-pipeline__card">
                  <span className="social-pipeline__step">{p.step}</span>
                  <span className="social-pipeline__name">{p.name}</span>
                  <span className="social-pipeline__sub">{p.sub}</span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <span className="social-pipeline__arrow">→</span>
                )}
              </div>
            ))}
          </div>

          <p className="social-pipeline__note">
            Socket.io shares the same Express server — the HTTP and WebSocket listeners bind to the
            same port so deployment stays a single process with no separate WebSocket service.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════ OUTCOME */}
      <section className="social-section social-outcome">
        <div className="social-section__inner social-outcome__inner">
          <div className="social-outcome__col">
            <span className="social-section__label">// OUTCOME</span>
            <ul className="social-outcome__list">
              <li>Functional platform: registration, a post feed, likes, comments, and friends</li>
              <li>Socket.io pushes new posts and like updates live to every connected client</li>
              <li>Security middleware — helmet, rate limiting, sanitization, express-validator</li>
              <li>Self-hosted from a home server, exposed publicly via Cloudflare Tunnel</li>
            </ul>
          </div>
          <div className="social-outcome__col">
            <span className="social-section__label">// NEXT STEPS</span>
            <ul className="social-outcome__list">
              <li>Campus verification — require a .edu email to register</li>
              <li>Direct messaging between friends over the existing socket layer</li>
              <li>A questionnaire-driven interest feed to surface relevant posts</li>
              <li>Move image storage off the server to S3 or Cloudflare R2</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  )
}
