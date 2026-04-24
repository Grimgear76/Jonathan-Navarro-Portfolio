import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'
import './ProjectDetail.css'

const AWARDS = {
  'rgv-tutor': '2ND PLACE — AI/ML HACKATHON',
  'frontera-hackathon': '1ST PLACE — FINANCIAL TRACK',
}

// Derive a very dark tinted background from an accent hex color
function darkTint(hex, mix = 0.22) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgb(${Math.round(r * mix)}, ${Math.round(g * mix)}, ${Math.round(b * mix)})`
}

// Dim version of accent for muted text / borders
function dimAccent(hex, opacity) {
  return `${hex}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`
}

function getYouTubeId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&]+)/)
  return m?.[1]
}

function MediaSlot({ label }) {
  return (
    <div className="detail-media-slot">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="1" />
        <path d="M8 21h8M12 17v4" />
      </svg>
      {label}
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = projects.find(p => p.id === id)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (!project) {
    return (
      <div className="detail-not-found">
        <p>Project not found.</p>
        <button onClick={() => navigate('/')}>← BACK</button>
      </div>
    )
  }

  const accent = project.accentColor
  const award = AWARDS[project.id]

  const themeVars = {
    '--accent':        accent,
    '--page-bg':       darkTint(accent, 0.18),
    '--hero-bg':       darkTint(accent, 0.30),
    '--section-line':  dimAccent(accent, 0.2),
    '--tag-border':    dimAccent(accent, 0.35),
    '--tag-color':     accent,
  }

  return (
    <div className="project-detail" style={themeVars}>
      {/* Hero Banner */}
      <div className="detail-hero">
        <div className="detail-hero-inner">
          <button className="detail-back" onClick={() => navigate(-1)}>← BACK</button>
          <p className="detail-eyebrow">// PROJECT</p>
          <h1 className="detail-title">{project.title}</h1>
          <div className="detail-tags">
            {project.technologies.map(t => (
              <span key={t} className="card-tag detail-tag">{t}</span>
            ))}
          </div>
          {award && <div className="detail-award">⬡ {award}</div>}
          {(project.github || project.demo) && (
            <div className="detail-links">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="detail-link">
                  ↗ GITHUB
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="detail-link">
                  ↗ DEMO
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="detail-body">
        <div className="detail-section">
          <h2>THE PROBLEM</h2>
          <p>{project.detail.problem}</p>
        </div>
        <div className="detail-section">
          <h2>WHAT WAS BUILT</h2>
          <p>{project.detail.built}</p>
        </div>
        <div className="detail-section">
          <h2>OUTCOME</h2>
          <p>{project.detail.outcome}</p>
        </div>

        <div className="detail-media">
          <h2>DEMO &amp; GALLERY</h2>
          {project.demo ? (
            <div className="detail-video-container">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(project.demo)}`}
                title={`${project.title} demo`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="detail-media-grid" style={{ marginBottom: '1rem' }}>
              <MediaSlot label="DEMO VIDEO" />
            </div>
          )}
          {project.images?.length > 0 ? (
            <div className="detail-screenshots">
              {project.images.map((src, i) => (
                <div key={i} className="detail-screenshot">
                  <img src={src} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          ) : (
            <div className="detail-media-grid">
              <MediaSlot label="SCREENSHOT 01" />
              <MediaSlot label="SCREENSHOT 02" />
              <MediaSlot label="SCREENSHOT 03" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
