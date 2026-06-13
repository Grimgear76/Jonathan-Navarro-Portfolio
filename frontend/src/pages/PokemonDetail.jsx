import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'
import './PokemonDetail.css'

const ACCENT_DARK = projects.find(p => p.id === 'pokemon-battle-bot')?.accentColor ?? '#ffa60d'
const ACCENT_MONO = projects.find(p => p.id === 'pokemon-battle-bot')?.monoAccentColor ?? '#9a5c00'

const TAGS = ['Python', 'MaskablePPO', 'Stable-Baselines3', 'Gymnasium', 'poke-env', 'TensorBoard']

const PHASES = [
  {
    num: '01',
    title: 'vs Random Bot',
    body: 'Train from scratch against SimpleRandomBot. Builds basic legal play and move fundamentals.',
  },
  {
    num: '02',
    title: 'vs Heuristic Pool',
    body: 'Seed from Phase 1. Face stronger heuristic opponents. Keeps the bot well-rounded and adaptable.',
  },
  {
    num: '03',
    title: 'Evaluation',
    body: 'Eval against any model or opponent. Win rate tracked with tqdm + TensorBoard logging.',
  },
]

const STATS = [
  { value: '18.4M', label: 'TIMESTEPS TRAINED' },
  { value: '~1.9', label: 'DAYS RUNTIME' },
  { value: '47', label: 'AVG TURNS / BATTLE' },
  { value: '0.56', label: 'EXPLAINED VARIANCE' },
  { value: '~0.021', label: 'KL DIVERGENCE' },
  { value: '839', label: 'OBS DIMENSIONS' },
]

const PIPELINE = [
  { step: '01', name: 'Pokémon Showdown', sub: 'Local Node.js battle server' },
  { step: '02', name: 'poke-env', sub: 'Player & env connector API' },
  { step: '03', name: 'Gymnasium', sub: 'Obs + reward + action mask' },
  { step: '04', name: 'MaskablePPO', sub: 'Policy & value network (SB3)' },
]

export default function PokemonDetail() {
  const navigate = useNavigate()
  const { state } = useColorContext()
  const { monoMode } = state

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const accent = monoMode ? ACCENT_MONO : ACCENT_DARK

  const REWARDS = [
    { value: '+2.0',     label: 'WIN',         color: monoMode ? '#15803d' : '#4ade80' },
    { value: '−2.0',     label: 'LOSS',        color: monoMode ? '#dc2626' : '#f87171' },
    { value: '−1.0',     label: 'DRAW',        color: monoMode ? '#64748b' : '#94a3b8' },
    { value: '+0.25',    label: 'OPPONENT KO', color: monoMode ? '#15803d' : '#4ade80' },
    { value: '−0.25',    label: 'OWN KO',      color: monoMode ? '#dc2626' : '#f87171' },
    { value: '±0.04×HP', label: 'HP DAMAGE',   color: accent },
  ]

  return (
    <div className="poke-page" style={{ '--poke-accent': accent }}>

      {/* ── Ambient glows ── */}
      <div className="poke-glow poke-glow--tr" />
      <div className="poke-glow poke-glow--bl" />

      {/* ════════════════════════════════════ HERO */}
      <section className="poke-hero">
        <div className="poke-hero__inner">
          <button className="poke-back" onClick={() => navigate(-1)}>← BACK</button>

          <p className="poke-eyebrow">// PROJECT — REINFORCEMENT LEARNING</p>

          <h1 className="poke-title">
            <span className="poke-title__line1">Pokémon</span>
            <span className="poke-title__line2">Battle Bot</span>
          </h1>

          <p className="poke-hero__sub">
            Teaching an AI to play competitive Pokémon from scratch — no hand-coded rules, no game knowledge.
            Just trial, error, and 18.4 million training timesteps.
          </p>

          <div className="poke-tags">
            {TAGS.map(t => <span key={t} className="poke-tag">{t}</span>)}
          </div>
        </div>

        <div className="poke-hero__scroll-hint">SCROLL TO EXPLORE ↓</div>
      </section>

      {/* ════════════════════════════════════ RL CONCEPT */}
      <section className="poke-section poke-rl">
        <div className="poke-section__inner">
          <span className="poke-section__label">// THE CORE IDEA</span>
          <h2 className="poke-section__title">Reinforcement Learning</h2>
          <p className="poke-section__lead">
            The agent learns by doing. Every battle it fights, it gets a reward signal and adjusts its
            strategy. No human told it what a good move looks like — it figured it out.
          </p>

          <div className="poke-rl-loop">
            <div className="poke-rl-node poke-rl-node--agent">
              <span className="poke-rl-node__label">AGENT</span>
              <span className="poke-rl-node__sub">Pokémon Bot</span>
            </div>

            <div className="poke-rl-arrows">
              <div className="poke-rl-arrow poke-rl-arrow--top">
                <span>Action (move / switch)</span>
                <div className="poke-rl-arrow__line poke-rl-arrow__line--right" />
              </div>
              <div className="poke-rl-arrow poke-rl-arrow--bottom">
                <div className="poke-rl-arrow__line poke-rl-arrow__line--left" />
                <span>State + Reward</span>
              </div>
            </div>

            <div className="poke-rl-node poke-rl-node--env">
              <span className="poke-rl-node__label">ENVIRONMENT</span>
              <span className="poke-rl-node__sub">Pokémon Battle</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ PROBLEM FRAMING */}
      <section className="poke-section poke-framing">
        <div className="poke-section__inner">
          <span className="poke-section__label">// THE PROBLEM</span>
          <h2 className="poke-section__title">Why is this hard?</h2>
          <p className="poke-section__lead">
            Pokémon battles are deceptively complex. The agent has to parse a massive game state,
            pick from a legal subset of actions, and won't see a meaningful reward until the battle ends ~47 turns later.
          </p>

          <div className="poke-frames">
            <div className="poke-frame">
              <div className="poke-frame__header">
                <span className="poke-frame__num">839</span>
                <span className="poke-frame__kw">OBSERVATION</span>
              </div>
              <p>Numeric vector describing the full battle state: HP, moves, status conditions, and field effects for both sides.</p>
            </div>
            <div className="poke-frame">
              <div className="poke-frame__header">
                <span className="poke-frame__num">11</span>
                <span className="poke-frame__kw">ACTIONS / TURN</span>
              </div>
              <p>4 moves + 6 switches + 1 forced default. Only a subset is ever legal — illegal choices must be masked out or training diverges.</p>
            </div>
            <div className="poke-frame">
              <div className="poke-frame__header">
                <span className="poke-frame__num">±</span>
                <span className="poke-frame__kw">REWARD</span>
              </div>
              <p>Shaped intermediate rewards give earlier signal. Terminal ±2.0 win/loss closes the episode. Without shaping, the agent gets almost no feedback mid-game.</p>
            </div>
            <div className="poke-frame">
              <div className="poke-frame__header">
                <span className="poke-frame__num">47</span>
                <span className="poke-frame__kw">TURNS / EPISODE</span>
              </div>
              <p>Each battle runs ~47 turns before it ends. That's 47 decisions the agent must string together correctly to win.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ PIPELINE */}
      <section className="poke-section poke-pipeline-section">
        <div className="poke-section__inner">
          <span className="poke-section__label">// SYSTEM ARCHITECTURE</span>
          <h2 className="poke-section__title">How it's wired together</h2>

          <div className="poke-pipeline">
            {PIPELINE.map((p, i) => (
              <div key={p.step} className="poke-pipeline__item">
                <div className="poke-pipeline__card">
                  <span className="poke-pipeline__step">{p.step}</span>
                  <span className="poke-pipeline__name">{p.name}</span>
                  <span className="poke-pipeline__sub">{p.sub}</span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <span className="poke-pipeline__arrow">→</span>
                )}
              </div>
            ))}
          </div>

          <p className="poke-pipeline__note">
            The encoder converts raw battle data into the 839-dim observation vector.
            The action mask zeroes out illegal move logits before the policy samples.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════ ACTION MASKING */}
      <section className="poke-section poke-masking">
        <div className="poke-section__inner">
          <span className="poke-section__label">// KEY DESIGN DECISION</span>
          <h2 className="poke-section__title">Action Masking</h2>
          <p className="poke-section__lead">
            Without masking, the policy randomly samples illegal moves — moves you can't actually make.
            That creates garbage gradients and the model never recovers.
          </p>

          <div className="poke-masking__split">
            <div className="poke-masking__side poke-masking__side--bad">
              <div className="poke-masking__badge poke-masking__badge--bad">✕ WITHOUT MASKING</div>
              <ul>
                <li>Illegal actions get sampled</li>
                <li>Noisy, incorrect gradients</li>
                <li>Training diverges or flatlines</li>
                <li>Model never learns basic play</li>
              </ul>
            </div>
            <div className="poke-masking__side poke-masking__side--good">
              <div className="poke-masking__badge poke-masking__badge--good">✓ WITH MASKABLEPPO</div>
              <ul>
                <li>Illegal logits forced to −∞</li>
                <li>Policy only samples valid moves</li>
                <li>Stable, correct gradient updates</li>
                <li>Agent can actually learn strategy</li>
              </ul>
            </div>
          </div>

          <p className="poke-masking__note">
            Masking isn't just an optimization — it's a correctness feature. The model literally cannot
            learn without it in environments with dynamic legal action sets.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════ REWARD */}
      <section className="poke-section poke-rewards">
        <div className="poke-section__inner">
          <span className="poke-section__label">// REWARD DESIGN</span>
          <h2 className="poke-section__title">How the bot knows if it's winning</h2>
          <p className="poke-section__lead">
            Pure win/loss signal would only arrive at the end of a 47-turn game — far too sparse to learn from.
            Shaped rewards give the agent feedback throughout the battle.
          </p>

          <div className="poke-reward-grid">
            {REWARDS.map(r => (
              <div key={r.label} className="poke-reward-card" style={{ '--rcolor': r.color }}>
                <span className="poke-reward-card__value">{r.value}</span>
                <span className="poke-reward-card__label">{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ CURRICULUM */}
      <section className="poke-section poke-curriculum">
        <div className="poke-section__inner">
          <span className="poke-section__label">// TRAINING CURRICULUM</span>
          <h2 className="poke-section__title">Start easy. Get harder.</h2>
          <p className="poke-section__lead">
            A fixed opponent becomes "solved" — the agent memorizes it and stops improving.
            A phased curriculum forces the bot to generalize.
          </p>

          <div className="poke-phases">
            {PHASES.map((ph, i) => (
              <div key={ph.num} className="poke-phase-row">
                <div className="poke-phase">
                  <span className="poke-phase__num">PHASE {ph.num}</span>
                  <h3 className="poke-phase__title">{ph.title}</h3>
                  <p className="poke-phase__body">{ph.body}</p>
                </div>
                {i < PHASES.length - 1 && <span className="poke-phase__arrow">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ STATS */}
      <section className="poke-section poke-stats-section">
        <div className="poke-section__inner">
          <span className="poke-section__label">// AGENT 29 — FINAL MODEL</span>
          <h2 className="poke-section__title">The Numbers</h2>
          <p className="poke-section__lead">
            The most trained and stable model after continuous runs. Tracked live in TensorBoard.
          </p>

          <div className="poke-stats">
            {STATS.map(s => (
              <div key={s.label} className="poke-stat">
                <span className="poke-stat__value">{s.value}</span>
                <span className="poke-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ DEMO */}
      <section className="poke-section poke-demo">
        <div className="poke-section__inner">
          <span className="poke-section__label">// LIVE DEMO</span>
          <h2 className="poke-section__title">Watch it fight</h2>
          <p className="poke-section__lead">
            The bot runs against Pokémon Showdown locally. Spin up the Node.js server, connect the bot,
            open <code>localhost:8000</code>, and challenge it. Every move it picks — that's the policy network.
          </p>

          <div className="poke-demo__gif-wrap">
            <img
              src="/screenshots/pokemon-battle-bot/battle-demo.gif"
              alt="Pokémon Battle Bot agent playing on Pokémon Showdown"
              className="poke-demo__gif"
            />
            <div className="poke-demo__gif-label">AGENT 29 — LIVE INFERENCE ON POKÉMON SHOWDOWN</div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ LIMITATIONS */}
      <section className="poke-section poke-limits">
        <div className="poke-section__inner poke-limits__inner">
          <div className="poke-limits__col">
            <span className="poke-section__label">// LIMITATIONS</span>
            <ul className="poke-limits__list">
              <li>Stability depends heavily on reward shaping — small changes cascade</li>
              <li>Random Battles have inherent type matchup luck the agent can't overcome</li>
              <li>Generalization limited by training distribution</li>
              <li>poke-env / Showdown / SB3 APIs change frequently</li>
            </ul>
          </div>
          <div className="poke-limits__col">
            <span className="poke-section__label">// NEXT STEPS</span>
            <ul className="poke-limits__list">
              <li>Self-play against evolving agent versions</li>
              <li>Longer training runs (50M+ timesteps)</li>
              <li>Experiment with obs space and reward shaping</li>
              <li>Explore transformer-based policy architecture</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  )
}
