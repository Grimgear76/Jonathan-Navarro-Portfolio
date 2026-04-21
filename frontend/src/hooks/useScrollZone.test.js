import { describe, it, expect } from 'vitest'
import { interpolateColor, getZoneIndex } from './useScrollZone'

describe('interpolateColor', () => {
  it('returns start color at t=0', () => {
    expect(interpolateColor('#000000', '#ffffff', 0)).toBe('#000000')
  })

  it('returns end color at t=1', () => {
    expect(interpolateColor('#000000', '#ffffff', 1)).toBe('#ffffff')
  })

  it('interpolates midpoint correctly', () => {
    expect(interpolateColor('#000000', '#ffffff', 0.5)).toBe('#7f7f7f')
  })

  it('interpolates between two real zone colors', () => {
    const result = interpolateColor('#111111', '#0d1117', 0)
    expect(result).toBe('#111111')
  })
})

describe('getZoneIndex', () => {
  it('returns 0 for scroll at 0%', () => {
    expect(getZoneIndex(0)).toBe(0)
  })

  it('returns 0 for scroll at 32%', () => {
    expect(getZoneIndex(0.32)).toBe(0)
  })

  it('returns 1 for scroll at 33%', () => {
    expect(getZoneIndex(0.33)).toBe(1)
  })

  it('returns 1 for scroll at 65%', () => {
    expect(getZoneIndex(0.65)).toBe(1)
  })

  it('returns 2 for scroll at 66%', () => {
    expect(getZoneIndex(0.66)).toBe(2)
  })

  it('returns 2 for scroll at 100%', () => {
    expect(getZoneIndex(1)).toBe(2)
  })
})
