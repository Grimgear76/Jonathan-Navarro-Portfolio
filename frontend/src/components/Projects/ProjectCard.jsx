import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useColorUnlock from '../../hooks/useColorUnlock'
import { useColorContext } from '../../context/ColorContext'
import './ProjectCard.css'

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

  function handleDoubleClick(e) {
    e.stopPropagation()
    unlockProject(project.id)
    navigate(`/projects/${project.id}`)
  }

  function handleNavigate(e) {
    e.stopPropagation()
    unlockProject(project.id)
    navigate(`/projects/${project.id}`)
  }

  function handleMouseMove(e) {
    if (REDUCED_MOTION) return
    const card = cardRef.current
    if (!card) return
    const { left, top, width, height } = card.getBoundingClientRect()
    const x = (e.clientX - left) / width   // 0–1
    const y = (e.clientY - top)  / height  // 0–1
    const rotateY =  (x - 0.5) * 8   // –4 to +4 deg
    const rotateX = -(y - 0.5) * 6   // –3 to +3 deg
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
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
      onDoubleClick={handleDoubleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-shine" />
      {isUnlocked && <div className="card-ripple" />}

      {/* Reserved meta row keeps card titles aligned across a row whether or not an award exists */}
      <div
        className={`card-award${project.award ? '' : ' card-award--empty'}`}
        style={project.award && isUnlocked ? { color: accent, borderColor: `${accent}55` } : {}}
        aria-hidden={!project.award}
      >
        {project.award && <><span aria-hidden="true">★ </span>{project.award}</>}
      </div>

      <h3
        className="card-title"
        style={isUnlocked ? { color: accent } : {}}
      >
        {project.title}
      </h3>

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

      <button
        className="card-cta"
        onClick={handleNavigate}
        style={isUnlocked ? { color: accent, borderColor: `${accent}66` } : {}}
        aria-label={`View ${project.title} project details`}
      >
        VIEW PROJECT <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}
