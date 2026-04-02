import { View, Text, StyleSheet } from 'react-native'
import { useColors } from '../theme'

interface Props {
  completion: number  // 0–100
  showLabel?: boolean
}

export default function CompletionBar({ completion, showLabel = true }: Props) {
  const colors = useColors()

  if (completion <= 0) return null

  const pct = Math.min(100, Math.max(0, completion))
  const color = pct >= 80 ? colors.status.playing : pct >= 40 ? colors.star : '#74B9FF'

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View style={[styles.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: colors.muted }]}>{pct}%</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
})
