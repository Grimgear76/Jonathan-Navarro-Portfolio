import { createContext, useContext, useReducer } from 'react'

const ColorContext = createContext(null)

const initialState = {
  scrollZone: 1,
  unlockedIds: new Set(),
  monoMode: false,
}

export function colorReducer(state, action) {
  switch (action.type) {
    case 'SET_ZONE':
      return { ...state, scrollZone: action.zone }
    case 'UNLOCK_PROJECT':
      if (state.unlockedIds.has(action.id)) return state
      return { ...state, unlockedIds: new Set([...state.unlockedIds, action.id]) }
    case 'TOGGLE_MONO':
      return { ...state, monoMode: !state.monoMode }
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
