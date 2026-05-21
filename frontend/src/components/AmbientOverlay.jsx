import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'
import './AmbientOverlay.css'

const POSITIONS = {
  'pokemon-battle-bot': '20% 30%',
  'rgv-tutor': '75% 55%',
  'frontera-hackathon': '50% 15%',
  '2d-action-rpg': '30% 75%',
  'college-social-app': '80% 40%',
  'roblox-ux-redesign': '10% 85%',
}

export default function AmbientOverlay() {
  const { state } = useColorContext()
  const unlockedProjects = projects.filter(p => state.unlockedIds.has(p.id))

  if (unlockedProjects.length === 0) return null

  // Mono mode: slightly higher opacity so glows are visible on light background
  const alpha = state.monoMode ? '26' : '1a'

  const gradients = unlockedProjects
    .map(p => `radial-gradient(ellipse 50% 40% at ${POSITIONS[p.id]}, ${p.accentColor}${alpha} 0%, transparent 70%)`)
    .join(', ')

  return <div className="ambient-overlay" style={{ background: gradients }} />
}
