import { useEffect } from 'react'
import { useColorContext } from '../context/ColorContext'

const COLOR_ZONES = [
  { zone: 1, bg: '#111111', accent: '#e8a838' },
  { zone: 2, bg: '#0d1117', accent: '#3dd6c8' },
  { zone: 3, bg: '#10101a', accent: '#9d7fff' },
]

// Mono: near-white backgrounds — accents shifted darker/richer to pop on light bg
const MONO_ZONES = [
  { zone: 1, bg: '#f9f8f5', accent: '#c07810' },
  { zone: 2, bg: '#f5f8f7', accent: '#0e9e94' },
  { zone: 3, bg: '#f5f5f9', accent: '#6840e0' },
]

export function getZoneIndex(scrollPercent) {
  if (scrollPercent < 0.33) return 0
  if (scrollPercent < 0.66) return 1
  return 2
}

export function interpolateColor(hex1, hex2, t) {
  const r1 = parseInt(hex1.slice(1, 3), 16)
  const g1 = parseInt(hex1.slice(3, 5), 16)
  const b1 = parseInt(hex1.slice(5, 7), 16)
  const r2 = parseInt(hex2.slice(1, 3), 16)
  const g2 = parseInt(hex2.slice(3, 5), 16)
  const b2 = parseInt(hex2.slice(5, 7), 16)
  const r = Math.floor(r1 + (r2 - r1) * t)
  const g = Math.floor(g1 + (g2 - g1) * t)
  const b = Math.floor(b1 + (b2 - b1) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export default function useScrollZone() {
  const { state, dispatch } = useColorContext()

  useEffect(() => {
    const ZONES = state.monoMode ? MONO_ZONES : COLOR_ZONES
    let rafId = null

    function applyZone() {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0

      const zoneIdx = getZoneIndex(scrollPercent)
      const nextIdx = Math.min(zoneIdx + 1, ZONES.length - 1)

      const zoneFraction =
        zoneIdx === 0 ? scrollPercent / 0.33
        : zoneIdx === 1 ? (scrollPercent - 0.33) / 0.33
        : (scrollPercent - 0.66) / 0.34

      const bg     = interpolateColor(ZONES[zoneIdx].bg,     ZONES[nextIdx].bg,     zoneFraction)
      const accent = interpolateColor(ZONES[zoneIdx].accent, ZONES[nextIdx].accent, zoneFraction)

      document.documentElement.style.setProperty('--bg',     bg)
      document.documentElement.style.setProperty('--accent', accent)
      dispatch({ type: 'SET_ZONE', zone: zoneIdx + 1 })
    }

    function handleScroll() {
      if (rafId) return
      rafId = requestAnimationFrame(() => { rafId = null; applyZone() })
    }

    applyZone()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dispatch, state.monoMode])
}
