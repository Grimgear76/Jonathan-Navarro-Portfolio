import { describe, it, expect } from 'vitest'
import { colorReducer } from './ColorContext'

describe('colorReducer', () => {
  const initial = { scrollZone: 1, unlockedIds: new Set() }

  it('SET_ZONE updates scrollZone', () => {
    const result = colorReducer(initial, { type: 'SET_ZONE', zone: 2 })
    expect(result.scrollZone).toBe(2)
  })

  it('SET_ZONE does not mutate unlockedIds', () => {
    const result = colorReducer(initial, { type: 'SET_ZONE', zone: 3 })
    expect(result.unlockedIds).toBe(initial.unlockedIds)
  })

  it('UNLOCK_PROJECT adds id to unlockedIds', () => {
    const result = colorReducer(initial, { type: 'UNLOCK_PROJECT', id: 'test-id' })
    expect(result.unlockedIds.has('test-id')).toBe(true)
  })

  it('UNLOCK_PROJECT returns same reference when id already unlocked', () => {
    const state = { scrollZone: 1, unlockedIds: new Set(['test-id']) }
    const result = colorReducer(state, { type: 'UNLOCK_PROJECT', id: 'test-id' })
    expect(result).toBe(state)
  })

  it('UNLOCK_PROJECT does not mutate existing unlockedIds set', () => {
    const state = { scrollZone: 1, unlockedIds: new Set(['a']) }
    const result = colorReducer(state, { type: 'UNLOCK_PROJECT', id: 'b' })
    expect(state.unlockedIds.has('b')).toBe(false)
    expect(result.unlockedIds.has('b')).toBe(true)
  })
})
