import { View, Text, StyleSheet } from 'react-native'
import { useColors } from '../theme'
import type { GameStatus } from '../types'

const STATUS_LABELS: Record<GameStatus, string> = {
  playing:  'Playing',
  played:   'Played',
  unplayed: 'Unplayed',
  dropped:  'Dropped',
}

interface Props {
  status: GameStatus
  small?: boolean
}

export default function StatusBadge({ status, small = false }: Props) {
  const colors = useColors()
  const config = { label: STATUS_LABELS[status], bg: colors.status[status] }

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
    color: '#FFFFFF',
  },
  smallLabel: {
    fontSize: 10,
  },
})
