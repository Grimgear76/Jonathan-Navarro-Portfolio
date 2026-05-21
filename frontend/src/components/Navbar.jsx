import { useCallback } from 'react'
import useColorUnlock from '../hooks/useColorUnlock'
import { useColorContext } from '../context/ColorContext'
import './Navbar.css'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const NAV_LINKS = [
  { label: 'About',    id: 'about' },
  { label: 'Skills',   id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact',  id: 'contact' },
]

export default function Navbar() {
  const { exploredPercent } = useColorUnlock()
  const { state, dispatch } = useColorContext()
  const toggleMono = useCallback(() => dispatch({ type: 'TOGGLE_MONO' }), [dispatch])

  return (
    <nav className="navbar">
      <span className="navbar-logo">JN.DEV</span>

      <ul className="navbar-links">
        {NAV_LINKS.map(({ label, id }) => (
          <li key={id}>
            <button className="nav-link" onClick={() => scrollTo(id)}>
              {label}
            </button>
          </li>
        ))}
      </ul>

      <div className="navbar-right">
        <div className="navbar-progress">
          <span className="progress-label">EXPLORED {exploredPercent}%</span>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={exploredPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="progress-fill" style={{ width: `${exploredPercent}%` }} />
          </div>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleMono}
          aria-label={state.monoMode ? 'Switch to color mode' : 'Switch to mono mode'}
          title={state.monoMode ? 'Color mode' : 'Mono mode'}
        >
          {state.monoMode ? 'COLOR' : 'MONO'}
        </button>
      </div>
    </nav>
  )
}
