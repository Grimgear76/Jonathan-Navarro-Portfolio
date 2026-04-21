import { useEffect, useRef, useState } from 'react'
import './Skills.css'

const SKILL_CATEGORIES = [
  {
    label: 'Languages',
    skills: [
      { name: 'Python', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'C#', level: 75 },
      { name: 'Dart / Flutter', level: 70 },
    ],
  },
  {
    label: 'Frameworks & Libraries',
    skills: [
      { name: 'React', level: 85 },
      { name: 'Node.js / Express', level: 80 },
      { name: 'Unity', level: 75 },
      { name: 'Stable-Baselines3', level: 70 },
    ],
  },
  {
    label: 'Tools & Platforms',
    skills: [
      { name: 'Git / GitHub', level: 90 },
      { name: 'Figma', level: 80 },
      { name: 'MongoDB', level: 75 },
      { name: 'Vite', level: 70 },
    ],
  },
  {
    label: 'AI / ML',
    skills: [
      { name: 'Reinforcement Learning', level: 75 },
      { name: 'Ollama / Local LLMs', level: 75 },
      { name: 'Gemini API', level: 70 },
      { name: 'Gymnasium', level: 70 },
    ],
  },
]

function SkillBar({ name, level, animate }) {
  return (
    <div className="skill-item">
      <div className="skill-meta">
        <span className="skill-name">{name}</span>
        <span className="skill-level">{level}%</span>
      </div>
      <div className="skill-track">
        <div className="skill-fill" style={{ width: animate ? `${level}%` : '0%' }} />
      </div>
    </div>
  )
}

export default function Skills() {
  const ref = useRef(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="skills" id="skills" ref={ref}>
      <div className="skills-container">
        <h2 className="section-label">// SKILLS</h2>
        <div className="skills-grid">
          {SKILL_CATEGORIES.map(cat => (
            <div key={cat.label} className="skill-category">
              <h3 className="category-label">{cat.label}</h3>
              {cat.skills.map(s => (
                <SkillBar key={s.name} name={s.name} level={s.level} animate={animate} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
