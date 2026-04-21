import { useNavigate } from 'react-router-dom'
import useColorUnlock from '../../hooks/useColorUnlock'
import './ProjectCard.css'

export default function ProjectCard({ project }) {
  const { unlockProject, unlockedIds } = useColorUnlock()
  const navigate = useNavigate()
  const isUnlocked = unlockedIds.has(project.id)

  function handleCardClick() {
    unlockProject(project.id)
  }

  function handleExpand(e) {
    e.stopPropagation()
    navigate(`/projects/${project.id}`)
  }

  const unlockedStyles = isUnlocked
    ? { '--project-accent': project.accentColor, borderColor: project.accentColor, boxShadow: `0 0 24px ${project.accentColor}22` }
    : {}

  return (
    <div
      className={`project-card${isUnlocked ? ' unlocked' : ''}`}
      style={unlockedStyles}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleCardClick()}
    >
      <div className="card-header">
        <h3 className="card-title" style={isUnlocked ? { color: project.accentColor } : {}}>
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
            style={isUnlocked ? { borderColor: `${project.accentColor}55`, color: project.accentColor } : {}}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
