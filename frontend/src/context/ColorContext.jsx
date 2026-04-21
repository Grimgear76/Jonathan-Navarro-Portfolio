import { createContext, useContext, useReducer } from 'react'

const ColorContext = createContext(null)

const initialState = {
  scrollZone: 1,
  unlockedIds: new Set(),
}

export function colorReducer(state, action) {
  switch (action.type) {
    case 'SET_ZONE':
      return { ...state, scrollZone: action.zone }
    case 'UNLOCK_PROJECT':
      if (state.unlockedIds.has(action.id)) return state
      return { ...state, unlockedIds: new Set([...state.unlockedIds, action.id]) }
    default:
      return state
  }
}

export function ColorProvider({ children }) {
  const [state, dispatch] = useReducer(colorReducer, initialState)
  return (
    <ColorContext.Provider value={{ state, dispatch }}>
      {children}
    </ColorContext.Provider>
  )
}

export function useColorContext() {
  const ctx = useContext(ColorContext)
  if (!ctx) throw new Error('useColorContext must be used inside ColorProvider')
  return ctx
}
