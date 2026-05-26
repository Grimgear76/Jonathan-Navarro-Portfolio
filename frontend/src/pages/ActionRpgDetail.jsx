import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'
import './ActionRpgDetail.css'

const ACCENT_DARK = projects.find(p => p.id === '2d-action-rpg')?.accentColor ?? '#9d7fff'
const ACCENT_MONO = projects.find(p => p.id === '2d-action-rpg')?.monoAccentColor ?? '#a900ec'

const TAGS = ['Unity', 'C#', 'Game Development', 'OOP']

const SYSTEMS = [
  {
    num: '01',
    title: 'Player Controller',
    body: 'Smooth 8-directional movement with acceleration curves, a dodge-roll with i-frames, and a melee combo system with hitbox activation windows — all driven by a finite state machine.',
  },
  {
    num: '02',
    title: 'Enemy AI',
    body: 'Multiple enemy archetypes each built on a shared state machine base: Patrol → Chase → Attack → Retreat. Enemies read line-of-sight using Physics2D raycasts and aggro at configurable detection radii.',
  },
  {
    num: '03',
    title: 'Combat System',
    body: 'Hit detection via trigger colliders pooled per-attack frame. Damage is event-driven — enemies subscribe to a hit channel and respond with knockback physics, flash feedback, and health drain.',
  },
  {
    num: '04',
    title: 'Progression & UI',
    body: 'Inventory system with scriptable-object items, a heads-up health bar, enemy health indicators, and a win/lose screen flow. All UI panels are driven off a singleton GameManager.',
  },
]

const PIPELINE = [
  { step: '01', name: 'Unity', sub: '2D physics, scene graph, input system' },
  { step: '02', name: 'C#', sub: 'OOP architecture, state machines' },
  { step: '03', name: 'Animator', sub: 'Blend trees + animation events' },
  { step: '04', name: 'Tilemap', sub: 'Level design + collision layers' },
]

export default function ActionRpgDetail() {
  const navigate = useNavigate()
  const { state } = useColorContext()
  const { monoMode } = state

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const accent = monoMode ? ACCENT_MONO : ACCENT_DARK

  return (
    <div className="rpg-page" style={{ '--rpg-accent': accent }}>

      {/* ── Ambient glows ── */}
      <div className="rpg-glow rpg-glow--tr" />
      <div className="rpg-glow rpg-glow--bl" />

      {/* ════════════════════════════════════ HERO */}
      <section className="rpg-hero">
        <div className="rpg-hero__inner">
          <button className="rpg-back" onClick={() => navigate(-1)}>← BACK</button>

          <p className="rpg-eyebrow">// PROJECT — GAME DEVELOPMENT</p>

          <h1 className="rpg-title">
            <span className="rpg-title__line1">2D Action</span>
            <span className="rpg-title__line2">RPG</span>
          </h1>

          <p className="rpg-hero__sub">
            A fully playable action RPG built from scratch in Unity — custom combat, enemy AI,
            inventory, and a complete win/lose loop. No assets kits, no tutorials followed:
            every system hand-rolled in C#.
          </p>

          <div className="rpg-tags">
            {TAGS.map(t => <span key={t} className="rpg-tag">{t}</span>)}
          </div>

          <div className="rpg-hero__links">
            <a
              href="https://github.com/Grimgear76/2D-Action-RPG"
              target="_blank"
              rel="noopener noreferrer"
              className="rpg-hero__cta"
            >
              ↗ VIEW ON GITHUB
            </a>
          </div>
        </div>

        <div className="rpg-hero__scroll-hint">SCROLL TO EXPLORE ↓</div>
      </section>

      {/* ════════════════════════════════════ SCREENSHOT */}
      <section className="rpg-section rpg-preview">
        <div className="rpg-section__inner">
          <span className="rpg-section__label">// IN-GAME</span>
          <h2 className="rpg-section__title">The world in action</h2>
          <p className="rpg-section__lead">
            Hand-crafted tilemap levels with layered collision, multiple enemy types on screen,
            and real-time combat feedback — built in Unity's 2D pipeline.
          </p>

          <div className="rpg-screenshot-main">
            <img
              src="/screenshots/2d-action-rpg/screenshot.png"
              alt="2D Action RPG gameplay screenshot"
              className="rpg-screenshot__img"
            />
            <div className="rpg-screenshot__label">2D ACTION RPG — GAMEPLAY · UNITY 2D</div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ THE PROBLEM */}
      <section className="rpg-section rpg-problem">
        <div className="rpg-section__inner">
          <span className="rpg-section__label">// THE CHALLENGE</span>
          <h2 className="rpg-section__title">Games are systems of systems</h2>
          <p className="rpg-section__lead">
            Building a game is an exercise in making dozens of independent systems work in
            concert. Player movement, enemy AI, combat feel, UI, and progression all have to
            integrate cleanly — and a bug in any one system breaks the entire experience.
            The challenge: design all of it from first principles.
          </p>

          <div className="rpg-challenge-grid">
            <div className="rpg-challenge-card">
              <span className="rpg-challenge-card__label">// PROBLEM 01</span>
              <h3 className="rpg-challenge-card__title">Combat feel</h3>
              <p className="rpg-challenge-card__body">
                Melee combat needs frame-accurate hit detection, hitbox timing that feels punchy,
                and damage feedback (flash, knockback, audio) that arrives in the same frame the
                swing connects.
              </p>
            </div>
            <div className="rpg-challenge-card">
              <span className="rpg-challenge-card__label">// PROBLEM 02</span>
              <h3 className="rpg-challenge-card__title">Enemy decision-making</h3>
              <p className="rpg-challenge-card__body">
                Enemies that sit still feel dead; enemies that always chase feel unfair. Each
                archetype needed a believable behavior loop — patrol, detect, chase, engage,
                retreat — without hard-coded scripts.
              </p>
            </div>
            <div className="rpg-challenge-card">
              <span className="rpg-challenge-card__label">// PROBLEM 03</span>
              <h3 className="rpg-challenge-card__title">Shared architecture</h3>
              <p className="rpg-challenge-card__body">
                Player, enemies, items, and UI all need to talk to each other. Without a clean
                event/message layer, logic bleeds across classes and the codebase becomes
                impossible to extend.
              </p>
            </div>
            <div className="rpg-challenge-card">
              <span className="rpg-challenge-card__label">// PROBLEM 04</span>
              <h3 className="rpg-challenge-card__title">Animation sync</h3>
              <p className="rpg-challenge-card__body">
                Attack animations must trigger hitboxes at exactly the right frame — too early
                and hits feel unfair, too late and nothing registers. Blend trees and animation
                events needed careful configuration per-clip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ ANIMATIONS */}
      <section className="rpg-section rpg-anims">
        <div className="rpg-section__inner">
          <span className="rpg-section__label">// ANIMATIONS</span>
          <h2 className="rpg-section__title">Every frame is intentional</h2>
          <p className="rpg-section__lead">
            Character animations are split by action type and wired to Unity's Animator blend
            trees — state transitions trigger automatically based on velocity and combat state.
          </p>

          <div className="rpg-anim-grid">
            <div className="rpg-anim-card">
              <div className="rpg-anim-card__media">
                <video
                  src="/screenshots/2d-action-rpg/attack-anim.mp4"
                  className="rpg-anim-card__gif"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <div className="rpg-anim-card__info">
                <span className="rpg-anim-card__label">// COMBAT STATE</span>
                <h3 className="rpg-anim-card__title">Idle → Attack</h3>
                <p className="rpg-anim-card__body">
                  The attack clip triggers a hitbox collider at the swing frame via an animation
                  event. The idle loop blends out instantly on input — zero input lag.
                </p>
              </div>
            </div>

            <div className="rpg-anim-card">
              <div className="rpg-anim-card__media">
                <video
                  src="/screenshots/2d-action-rpg/water-anim.mp4"
                  className="rpg-anim-card__gif"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <div className="rpg-anim-card__info">
                <span className="rpg-anim-card__label">// ENVIRONMENT STATE</span>
                <h3 className="rpg-anim-card__title">Idle → Water</h3>
                <p className="rpg-anim-card__body">
                  Entering a water tile swaps the physics layer and transitions the character
                  into a swim animation — movement speed is scaled down and the clip loops
                  until the player exits the trigger zone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ WHAT WAS BUILT */}
      <section className="rpg-section rpg-built">
        <div className="rpg-section__inner">
          <span className="rpg-section__label">// WHAT WAS BUILT</span>
          <h2 className="rpg-section__title">Four core systems. One game loop.</h2>
          <p className="rpg-section__lead">
            Every system is object-oriented and decoupled — adding a new enemy type means
            extending the base AI class, not touching the player or UI code.
          </p>

          <div className="rpg-systems-grid">
            {SYSTEMS.map(s => (
              <div key={s.num} className="rpg-system-card">
                <span className="rpg-system-card__num">// {s.num}</span>
                <h3 className="rpg-system-card__title">{s.title}</h3>
                <p className="rpg-system-card__body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ TECH PIPELINE */}
      <section className="rpg-section rpg-pipeline-section">
        <div className="rpg-section__inner">
          <span className="rpg-section__label">// TECH STACK</span>
          <h2 className="rpg-section__title">Unity's full 2D toolkit.</h2>

          <div className="rpg-pipeline">
            {PIPELINE.map((p, i) => (
              <div key={p.step} className="rpg-pipeline__item">
                <div className="rpg-pipeline__card">
                  <span className="rpg-pipeline__step">{p.step}</span>
                  <span className="rpg-pipeline__name">{p.name}</span>
                  <span className="rpg-pipeline__sub">{p.sub}</span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <span className="rpg-pipeline__arrow">→</span>
                )}
              </div>
            ))}
          </div>

          <p className="rpg-pipeline__note">
            All game logic is driven by C# scripts following SOLID principles — scriptable objects
            for item/enemy data, event channels for cross-system communication, and a singleton
            <code> GameManager</code> for scene-global state.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════ OUTCOME */}
      <section className="rpg-section rpg-outcome">
        <div className="rpg-section__inner rpg-outcome__inner">
          <div className="rpg-outcome__col">
            <span className="rpg-section__label">// OUTCOME</span>
            <ul className="rpg-outcome__list">
              <li>Fully playable vertical slice with multiple enemy types and a boss encounter</li>
              <li>Complete win/lose loop — goal state, death screen, and restart flow</li>
              <li>Smooth player combat with dodge roll, melee combo, and frame-accurate hitboxes</li>
              <li>Enemy AI reacts to line-of-sight, distances, and health thresholds</li>
              <li>Inventory system with pickups, item stacking, and UI integration</li>
            </ul>
          </div>
          <div className="rpg-outcome__col">
            <span className="rpg-section__label">// WHAT I LEARNED</span>
            <ul className="rpg-outcome__list">
              <li>State machine patterns for both player and AI — portable to any game genre</li>
              <li>Unity's Physics2D layer matrix for precise collision filtering</li>
              <li>Animation event system for frame-accurate gameplay triggers</li>
              <li>Scriptable objects as data containers — keeps designers out of code</li>
              <li>Event-driven architecture cuts coupling between unrelated systems</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  )
}
