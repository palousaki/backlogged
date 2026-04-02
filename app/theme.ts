import { Platform } from 'react-native'

export const colors = {
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
} as const

export const TAB_BAR_STYLE = {
  backgroundColor: colors.card,
  borderTopColor: colors.border,
  borderTopWidth: 1,
  height: Platform.OS === 'ios' ? 88 : 68,
  paddingBottom: Platform.OS === 'ios' ? 28 : 14,
  paddingTop: 8,
} as const
