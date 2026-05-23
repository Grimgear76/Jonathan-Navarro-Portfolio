import { useNavigate } from 'react-router-dom'
import useColorUnlock from '../../hooks/useColorUnlock'
import { useColorContext } from '../../context/ColorContext'
import './ProjectCard.css'

export default function ProjectCard({ project }) {
  const { unlockProject, unlockedIds } = useColorUnlock()
  const { state } = useColorContext()
  const navigate = useNavigate()
  const isUnlocked = unlockedIds.has(project.id)

  const accent = state.monoMode && project.monoAccentColor
    ? project.monoAccentColor
    : project.accentColor

  function handleCardClick() {
    unlockProject(project.id)
  }

  function handleExpand(e) {
    e.stopPropagation()
    unlockProject(project.id)
    navigate(`/projects/${project.id}`)
  }

  const unlockedStyles = isUnlocked
    ? { '--project-accent': accent, borderColor: accent }
    : {}

  return (
    <div
      className={`project-card${isUnlocked ? ' unlocked' : ''}`}
      style={unlockedStyles}
      onClick={handleCardClick}
      onDoubleClick={handleExpand}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleCardClick()}
    >
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
          onClick={handleExpand}
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
