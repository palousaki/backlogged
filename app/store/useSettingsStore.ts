import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type ThemePreference = 'system' | 'light' | 'dark'

interface SettingsState {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'backlogged-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
