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
    title: 'Event discovery is broken',
    body: 'Campus events live on flyers, GroupMe chats, Instagram stories, and department emails — no single place to find what\'s happening this weekend. Students miss events they\'d actually care about.',
  },
  {
    num: '02',
    title: 'No interest filtering',
    body: 'Generic bulletin boards dump everything on everyone. A computer science student doesn\'t need a flyer for a nursing mixer — but they\'re stuck sifting through it anyway.',
  },
  {
    num: '03',
    title: 'No social signal',
    body: 'You can\'t tell if an event has 3 attendees or 300. No RSVP visibility means no social proof — the information that actually drives attendance decisions.',
  },
]

const FEATURES = [
  {
    num: '01',
    title: 'JWT Authentication',
    body: 'Stateless auth with signed tokens — no server-side sessions. Tokens include user ID and interests, scoping the feed query at the middleware level before it hits the database.',
  },
  {
    num: '02',
    title: 'Event Creation & RSVP',
    body: 'Any student can post an event: name, date, location, category, cap. RSVP atomically increments the attendee count and adds the user to the event\'s attendee list — race-condition safe via MongoDB atomic updates.',
  },
  {
    num: '03',
    title: 'Interest-Based Feed',
    body: 'Feed queries filter events by the user\'s interest tags — set at registration, editable in profile. MongoDB aggregation pipeline sorts by proximity, then by RSVP momentum.',
  },
  {
    num: '04',
    title: 'Real-Time Notifications',
    body: 'Socket.io pushes live updates when a new event matches a user\'s interests, or when an RSVP\'d event gets a significant attendee spike — keeping the feed feeling alive without polling.',
  },
]

const PIPELINE = [
  { step: '01', name: 'MongoDB', sub: 'Events, users, RSVPs' },
  { step: '02', name: 'Express', sub: 'REST API + JWT middleware' },
  { step: '03', name: 'Socket.io', sub: 'Real-time event push' },
  { step: '04', name: 'React', sub: 'Feed, event cards, profile UI' },
]

const SCHEMA = [
  { entity: 'User', fields: ['_id', 'name', 'email', 'passwordHash', 'interests[]', 'rsvpd[]'] },
  { entity: 'Event', fields: ['_id', 'title', 'date', 'location', 'category', 'hostId', 'attendees[]', 'cap'] },
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
            A MERN stack social platform that solves campus event discovery — interest-based feeds,
            real-time RSVP, and Socket.io notifications so students never miss what's happening on campus.
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
          <h2 className="social-section__title">Campus social life is fragmented</h2>
          <p className="social-section__lead">
            College students rely on a patchwork of platforms to find out what's happening —
            and still miss most of it. The problem isn't a lack of events, it's a lack of a
            single discoverable, filterable, social signal.
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
          <h2 className="social-section__title">Two collections. One relationship.</h2>
          <p className="social-section__lead">
            MongoDB's document model lets the interest array live directly on the user —
            no join table needed. RSVP is an atomic array push that doubles as an attendee list.
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
            Each feature solves a discrete problem — auth, creation, discovery, real-time — and
            they're decoupled enough that the feed renders whether or not the socket connection is live.
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
              <li>Functional MVP: registration, event discovery, RSVP, and live-updating feed</li>
              <li>Interest filtering reduces irrelevant events from the feed at the query level</li>
              <li>Socket.io notifications fire on new event creation matching user interests</li>
              <li>Atomic RSVP prevents double-booking at the database level</li>
            </ul>
          </div>
          <div className="social-outcome__col">
            <span className="social-section__label">// NEXT STEPS</span>
            <ul className="social-outcome__list">
              <li>Image uploads for event banners via S3 or Cloudflare R2</li>
              <li>Campus verification — .edu email required to post events</li>
              <li>Map view for events within walking distance of campus</li>
              <li>Friend system — see which friends RSVP'd to an event</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  )
}
