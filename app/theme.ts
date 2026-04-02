import { Platform, useColorScheme } from 'react-native'
import { useSettingsStore } from './store/useSettingsStore'

export type ColorPalette = {
  bg: string
  card: string
  cardBorder: string
  text: string
  muted: string
  placeholder: string
  border: string
  accent: string
  accentLight: string
  star: string
  status: {
    playing: string
    played: string
    unplayed: string
    dropped: string
  }
}

const lightColors: ColorPalette = {
  bg:          '#FDF8F2',
  card:        '#F2E8D8',
  cardBorder:  '#E6D9C8',
  text:        '#2D1F0E',
  muted:       '#8A7060',
  placeholder: '#BFB0A0',
  border:      '#E8DDD0',
  accent:      '#D4763B',
  accentLight: '#D4763B18',
  star:        '#F0A500',
  status: {
    playing:  '#2D9E7F',
    played:   '#3B8EA5',
    unplayed: '#8A7060',
    dropped:  '#C9513D',
  },
}

const darkColors: ColorPalette = {
  bg:          '#1A1210',
  card:        '#2A1E17',
  cardBorder:  '#3A2C23',
  text:        '#EDE0D0',
  muted:       '#9A8272',
  placeholder: '#5A4A3F',
  border:      '#3A2C23',
  accent:      '#D4763B',
  accentLight: '#D4763B30',
  star:        '#F0A500',
  status: {
    playing:  '#2D9E7F',
    played:   '#3B8EA5',
    unplayed: '#8A7060',
    dropped:  '#C9513D',
  },
}

export function useColors(): ColorPalette {
  const systemScheme = useColorScheme()
  const preference = useSettingsStore((s) => s.theme)
  const scheme = preference === 'system' ? systemScheme : preference
  return scheme === 'dark' ? darkColors : lightColors
}

export function getTabBarStyle(c: ColorPalette) {
  return {
    backgroundColor: c.card,
    borderTopColor: c.border,
    borderTopWidth: 1 as const,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    paddingTop: 8,
  }
}

// Static light palette — only use where hooks aren't available
export const colors = lightColors
