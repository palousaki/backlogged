import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../theme'
import type { GameStatus } from '../types'

const STATUS_CONFIG: Record<GameStatus, { label: string; bg: string }> = {
  playing:  { label: 'Playing',  bg: colors.status.playing  },
  played:   { label: 'Played',   bg: colors.status.played   },
  unplayed: { label: 'Unplayed', bg: colors.status.unplayed },
  dropped:  { label: 'Dropped',  bg: colors.status.dropped  },
}

interface Props {
  status: GameStatus
  small?: boolean
}

export default function StatusBadge({ status, small = false }: Props) {
  const config = STATUS_CONFIG[status]

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, small && styles.small]}>
      <Text style={[styles.label, small && styles.smallLabel]}>
        {config.label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: colors.card,
  },
  smallLabel: {
    fontSize: 10,
  },
})
