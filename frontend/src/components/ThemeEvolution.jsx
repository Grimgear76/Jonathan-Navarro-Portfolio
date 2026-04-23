import { useEffect } from 'react'
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function lerpColor(from, to, t) {
  const [r1, g1, b1] = hexToRgb(from)
  const [r2, g2, b2] = hexToRgb(to)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r},${g},${b})`
}

// 0 unlocked — cold near-black
const DARK = {
  bg:         '#0f0f0f',
  text:       '#c8c8c8',
  textMuted:  '#555555',
  cardBg:     '#0b0b0b',
  cardBorder: '#1c1c1c',
  cardTitle:  '#777777',
  cardDesc:   '#484848',
}

// All unlocked — warm dark retro charcoal (think old CRT casing / vintage hardware)
const LIGHT = {
  bg:         '#2e2b28',
  text:       '#d4cfc8',
  textMuted:  '#9a9590',
  cardBg:     '#26241f',
  cardBorder: '#4a4640',
  cardTitle:  '#b8b3ac',
  cardDesc:   '#7a7570',
}

export default function ThemeEvolution() {
  const { state } = useColorContext()
  const t = state.unlockedIds.size / projects.length

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--bg',           lerpColor(DARK.bg,         LIGHT.bg,         t))
    root.style.setProperty('--text',         lerpColor(DARK.text,       LIGHT.text,       t))
    root.style.setProperty('--text-muted',   lerpColor(DARK.textMuted,  LIGHT.textMuted,  t))
    root.style.setProperty('--card-bg',      lerpColor(DARK.cardBg,     LIGHT.cardBg,     t))
    root.style.setProperty('--card-border',  lerpColor(DARK.cardBorder, LIGHT.cardBorder, t))
    root.style.setProperty('--card-title',   lerpColor(DARK.cardTitle,  LIGHT.cardTitle,  t))
    root.style.setProperty('--card-desc',    lerpColor(DARK.cardDesc,   LIGHT.cardDesc,   t))
  }, [t])

  return null
}
