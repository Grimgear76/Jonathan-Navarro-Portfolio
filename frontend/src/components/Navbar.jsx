import useColorUnlock from '../hooks/useColorUnlock'
import './Navbar.css'

export default function Navbar() {
  const { exploredPercent } = useColorUnlock()

  return (
    <nav className="navbar">
      <span className="navbar-logo">JN.DEV</span>
      <div className="navbar-progress">
        <span className="progress-label">EXPLORED {exploredPercent}%</span>
        <div className="progress-bar" role="progressbar" aria-valuenow={exploredPercent} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${exploredPercent}%` }} />
        </div>
      </div>
    </nav>
  )
}
