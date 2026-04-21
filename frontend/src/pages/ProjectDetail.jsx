import { useParams, useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = projects.find(p => p.id === id)

  if (!project) {
    return (
      <div className="detail-not-found">
        <p>Project not found.</p>
        <button onClick={() => navigate('/')}>← BACK</button>
      </div>
    )
  }

  return (
    <div className="project-detail">
      <button className="detail-back" onClick={() => navigate(-1)}>← BACK</button>
      <div className="detail-container">
        <h1 className="detail-title" style={{ color: project.accentColor }}>
          {project.title}
        </h1>
        <div className="detail-tags">
          {project.technologies.map(t => (
            <span
              key={t}
              className="card-tag"
              style={{ borderColor: `${project.accentColor}55`, color: project.accentColor }}
            >
              {t}
            </span>
          ))}
        </div>
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
      </div>
    </div>
  )
}
