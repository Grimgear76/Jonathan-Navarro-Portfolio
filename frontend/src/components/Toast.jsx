import { useEffect, useState } from 'react'
import useColorUnlock from '../hooks/useColorUnlock'
import './Toast.css'

export default function Toast() {
  const { isFullyUnlocked } = useColorUnlock()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isFullyUnlocked) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [isFullyUnlocked])

  if (!visible) return null

  return (
    <div className="toast" role="status">
      ALL PROJECTS UNLOCKED — FULL SPECTRUM ACHIEVED
    </div>
  )
}
