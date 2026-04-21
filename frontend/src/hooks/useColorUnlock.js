import { useCallback } from 'react'
import { useColorContext } from '../context/ColorContext'
import { projects } from '../data/projects'

export default function useColorUnlock() {
  const { state, dispatch } = useColorContext()

  const unlockProject = useCallback((id) => {
    dispatch({ type: 'UNLOCK_PROJECT', id })
  }, [dispatch])

  const exploredPercent = Math.round((state.unlockedIds.size / projects.length) * 100)
  const isFullyUnlocked = state.unlockedIds.size === projects.length
  const unlockedProjects = projects.filter(p => state.unlockedIds.has(p.id))

  return {
    unlockProject,
    exploredPercent,
    isFullyUnlocked,
    unlockedProjects,
    unlockedIds: state.unlockedIds,
  }
}
