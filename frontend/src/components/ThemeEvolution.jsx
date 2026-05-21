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

// Color mode: cold near-black → warm charcoal as projects unlock
const COLOR_FROM = {
  text:       '#c8c8c8',
  textMuted:  '#555555',
  cardBg:     '#0b0b0b',
  cardBorder: '#1c1c1c',
  cardTitle:  '#777777',
  cardDesc:   '#484848',
}
const COLOR_TO = {
  text:       '#d4cfc8',
  textMuted:  '#9a9590',
  cardBg:     '#26241f',
  cardBorder: '#4a4640',
  cardTitle:  '#b8b3ac',
  cardDesc:   '#7a7570',
}

// Mono mode: starts white/crisp → warms to parchment as projects unlock
const MONO_FROM = {
  text:       '#111111',
  textMuted:  '#3a3a3a',
  cardBg:     '#ffffff',
  cardBorder: '#e0e0e0',
  cardTitle:  '#1e1e1e',
  cardDesc:   '#3a3a3a',
}
const MONO_TO = {
  text:       '#111111',
  textMuted:  '#3a3a3a',
  cardBg:     '#f7f3ec',
  cardBorder: '#d4cfc6',
  cardTitle:  '#1e1e1e',
  cardDesc:   '#3a3a3a',
}

export default function ThemeEvolution() {
  const { state } = useColorContext()
  const t = state.unlockedIds.size / projects.length
  const { monoMode } = state

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', monoMode ? 'mono' : 'color')
  }, [monoMode])

  useEffect(() => {
    const FROM = monoMode ? MONO_FROM : COLOR_FROM
    const TO   = monoMode ? MONO_TO   : COLOR_TO
    const root = document.documentElement
    root.style.setProperty('--text',        lerpColor(FROM.text,       TO.text,       t))
    root.style.setProperty('--text-muted',  lerpColor(FROM.textMuted,  TO.textMuted,  t))
    root.style.setProperty('--card-bg',     lerpColor(FROM.cardBg,     TO.cardBg,     t))
    root.style.setProperty('--card-border', lerpColor(FROM.cardBorder, TO.cardBorder, t))
    root.style.setProperty('--card-title',  lerpColor(FROM.cardTitle,  TO.cardTitle,  t))
    root.style.setProperty('--card-desc',   lerpColor(FROM.cardDesc,   TO.cardDesc,   t))
  }, [t, monoMode])

  return null
}
