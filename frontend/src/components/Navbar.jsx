import { useCallback, useState, useEffect } from 'react'
import useColorUnlock from '../hooks/useColorUnlock'
import { useColorContext } from '../context/ColorContext'
import './Navbar.css'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const NAV_LINKS = [
  { label: 'About',    id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact',  id: 'contact' },
]

export default function Navbar() {
  const { exploredPercent } = useColorUnlock()
  const { state, dispatch } = useColorContext()
  const toggleMono = useCallback(() => dispatch({ type: 'TOGGLE_MONO' }), [dispatch])
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavClick = useCallback((id) => {
    scrollTo(id)
    setMenuOpen(false)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 700) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className={`navbar${menuOpen ? ' navbar--open' : ''}`}>
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

        <div className="navbar-social">
          <a href="https://github.com/Grimgear76" target="_blank" rel="noopener noreferrer" className="navbar-social-link">GH</a>
          <a href="https://linkedin.com/in/jonathan-navarro-44923b307" target="_blank" rel="noopener noreferrer" className="navbar-social-link">LI</a>
        </div>

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
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`hamburger-bar${menuOpen ? ' hamburger-bar--top-open' : ''}`} />
            <span className={`hamburger-bar${menuOpen ? ' hamburger-bar--mid-open' : ''}`} />
            <span className={`hamburger-bar${menuOpen ? ' hamburger-bar--bot-open' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-menu${menuOpen ? ' mobile-menu--open' : ''}`} aria-hidden={!menuOpen}>
        <ul className="mobile-menu__links">
          {NAV_LINKS.map(({ label, id }) => (
            <li key={id}>
              <button className="mobile-nav-link" onClick={() => handleNavClick(id)}>
                {label}
              </button>
            </li>
          ))}
        </ul>
        <div className="mobile-menu__footer">
          <div className="mobile-menu__progress">
            <span className="progress-label">EXPLORED {exploredPercent}%</span>
            <div className="progress-bar" style={{ width: '120px' }}>
              <div className="progress-fill" style={{ width: `${exploredPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
