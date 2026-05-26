import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useColorUnlock from '../../hooks/useColorUnlock'
import { useColorContext } from '../../context/ColorContext'
import './ProjectCard.css'

export default function ProjectCard({ project }) {
  const { unlockProject, unlockedIds } = useColorUnlock()
  const { state } = useColorContext()
  const navigate = useNavigate()
  const isUnlocked = unlockedIds.has(project.id)
  const cardRef = useRef(null)

  const accent = state.monoMode && project.monoAccentColor
    ? project.monoAccentColor
    : project.accentColor

  function handleUnlock() {
    unlockProject(project.id)
  }

  function handleNavigate() {
    unlockProject(project.id)
    navigate(`/projects/${project.id}`)
  }

  function handleArrowClick(e) {
    e.stopPropagation()
    handleNavigate()
  }

  function handleMouseMove(e) {
    const card = cardRef.current
    if (!card) return
    const { left, top, width, height } = card.getBoundingClientRect()
    const x = (e.clientX - left) / width   // 0–1
    const y = (e.clientY - top)  / height  // 0–1
    const rotateY =  (x - 0.5) * 16  // –8 to +8 deg
    const rotateX = -(y - 0.5) * 12  // –6 to +6 deg
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
    card.style.setProperty('--shine-x', `${x * 100}%`)
    card.style.setProperty('--shine-y', `${y * 100}%`)
  }

  function handleMouseLeave() {
    const card = cardRef.current
    if (!card) return
    card.style.transform = ''
  }

  const unlockedStyles = isUnlocked
    ? { '--project-accent': accent, borderColor: accent }
    : {}

  return (
    <div
      ref={cardRef}
      className={`project-card${isUnlocked ? ' unlocked' : ''}`}
      style={unlockedStyles}
      onClick={handleUnlock}
      onDoubleClick={handleNavigate}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleNavigate()}
    >
      <div className="card-shine" />
      {isUnlocked && <div className="card-ripple" />}

      {project.award && (
        <div
          className="card-award"
          style={isUnlocked ? { color: accent, borderColor: `${accent}55` } : {}}
        >
          ⬡ {project.award}
        </div>
      )}

      <div className="card-header">
        <h3
          className="card-title"
          style={isUnlocked ? { color: accent } : {}}
        >
          {project.title}
        </h3>
        <button
          className="card-arrow"
          onClick={handleArrowClick}
          aria-label={`View ${project.title} details`}
        >
          →
        </button>
      </div>

      <p className="card-description">{project.description}</p>

      <div className="card-tags">
        {project.technologies.map(tech => (
          <span
            key={tech}
            className="card-tag"
            style={isUnlocked
              ? { borderColor: `${accent}55`, color: accent }
              : {}
            }
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
