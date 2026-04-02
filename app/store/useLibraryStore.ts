import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Game, GameStatus } from '../types'

interface LibraryState {
  games: Game[]
  addGame: (game: Omit<Game, 'status' | 'rating' | 'completion' | 'notes' | 'addedAt'>) => void
  updateGame: (id: number, updates: Partial<Game>) => void
  removeGame: (id: number) => void
  getGame: (id: number) => Game | undefined
  hasGame: (id: number) => boolean
  mergeGames: (incoming: Game[]) => number
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      games: [],

      addGame: (partial) => {
        if (get().hasGame(partial.id)) return

        const newGame: Game = {
          ...partial,
          status: 'unplayed' as GameStatus,
          rating: 0,
          completion: 0,
          notes: '',
          addedAt: new Date().toISOString(),
        }

        set((state) => ({ games: [...state.games, newGame] }))
      },

      updateGame: (id, updates) => {
        set((state) => ({
          games: state.games.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        }))
      },

      removeGame: (id) => {
        set((state) => ({ games: state.games.filter((g) => g.id !== id) }))
      },

      getGame: (id) => get().games.find((g) => g.id === id),

      hasGame: (id) => get().games.some((g) => g.id === id),

      mergeGames: (incoming) => {
        const existing = new Set(get().games.map((g) => g.id))
        const newGames = incoming.filter((g) => !existing.has(g.id))
        if (newGames.length > 0) {
          set((state) => ({ games: [...state.games, ...newGames] }))
        }
        return newGames.length
      },
    }),
    {
      name: 'backlogged-library',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
