import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import type { Game } from '../types'
import { useColors } from '../theme'
import StatusBadge from './StatusBadge'

interface Props {
  game: Game
  onPress: () => void
}

export default function GameGridCard({ game, onPress }: Props) {
  const colors = useColors()
  const selectedPlatforms = (game.platforms ?? []).filter((p) => (game.playedOn ?? []).includes(p.id))

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {game.cover ? (
        <Image source={{ uri: game.cover }} style={styles.cover} resizeMode="cover" />
      ) : (
        <View style={[styles.cover, { backgroundColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ fontSize: 32 }}>🎮</Text>
        </View>
      )}
      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{game.title}</Text>
        <View style={styles.badgeRow}>
          <StatusBadge status={game.status} small />
          {selectedPlatforms.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.platforms}>
              {selectedPlatforms.map((p) => (
                <View key={p.id} style={[styles.platformChip, { backgroundColor: colors.cardBorder }]}>
                  <Text style={[styles.platformLabel, { color: colors.muted }]}>{p.abbreviation || p.name}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cover: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  footer: {
    flex: 1,
    padding: 8,
    gap: 6,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  platforms: {
    flexDirection: 'row',
    gap: 4,
  },
  platformChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  platformLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
})
