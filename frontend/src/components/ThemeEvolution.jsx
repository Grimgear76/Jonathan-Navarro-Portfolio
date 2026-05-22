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
  text:       '#d0d0d0',
  textMuted:  '#848484',
  cardBg:     '#0b0b0b',
  cardBorder: '#1c1c1c',
  cardTitle:  '#9e9e9e',
  cardDesc:   '#707070',
}
const COLOR_TO = {
  text:       '#d4cfc8',
  textMuted:  '#9a9590',
  cardBg:     '#26241f',
  cardBorder: '#4a4640',
  cardTitle:  '#b8b3ac',
  cardDesc:   '#7a7570',
}

// Mono mode: soft off-white — dark neutral text on lightly tinted cards
const MONO_FROM = {
  text:       '#201c18',
  textMuted:  '#585450',
  cardBg:     '#f0ece4',
  cardBorder: '#d4cec4',
  cardTitle:  '#201c18',
  cardDesc:   '#585450',
}
const MONO_TO = {
  text:       '#1a1612',
  textMuted:  '#504c48',
  cardBg:     '#e8e2d8',
  cardBorder: '#c8c0b2',
  cardTitle:  '#1a1612',
  cardDesc:   '#504c48',
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
