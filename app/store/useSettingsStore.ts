import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type ThemePreference = 'system' | 'light' | 'dark'

interface SettingsState {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
  sortAlpha: boolean
  setSortAlpha: (value: boolean) => void
  gridView: boolean
  setGridView: (value: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      sortAlpha: false,
      setSortAlpha: (value) => set({ sortAlpha: value }),
      gridView: false,
      setGridView: (value) => set({ gridView: value }),
    }),
    {
      name: 'backlogged-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
