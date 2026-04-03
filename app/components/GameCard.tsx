import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import type { Game } from '../types'
import { useColors } from '../theme'
import StatusBadge from './StatusBadge'
import StarRating from './StarRating'
import CompletionBar from './CompletionBar'

interface Props {
  game: Game
  onPress: () => void
}

export default function GameCard({ game, onPress }: Props) {
  const colors = useColors()

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.coverContainer}>
        {game.cover ? (
          <Image source={{ uri: game.cover }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={[styles.cover, { backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 32, color: colors.muted }}>?</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {game.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={[styles.meta, { color: colors.muted }]}>{game.genre}</Text>
          {game.releaseYear > 0 && (
            <Text style={[styles.meta, { color: colors.muted }]}> · {game.releaseYear}</Text>
          )}
        </View>

        <View style={styles.badgeRow}>
          <StatusBadge status={game.status} small />
          {(game.playedOn?.length ?? 0) > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformScroll} contentContainerStyle={styles.platformChips}>
              {(game.platforms ?? [])
                .filter((p) => game.playedOn.includes(p.id))
                .map((p) => (
                  <View key={p.id} style={[styles.platformChip, { backgroundColor: colors.cardBorder }]}>
                    <Text style={[styles.platformLabel, { color: colors.muted }]}>{p.abbreviation || p.name}</Text>
                  </View>
                ))}
            </ScrollView>
          )}
        </View>

        {game.rating > 0 && (
          <View style={styles.ratingRow}>
            <StarRating rating={game.rating} size={14} readonly />
          </View>
        )}

        <CompletionBar completion={game.completion} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    overflow: 'hidden',
    borderWidth: 1,
  },
  coverContainer: {
    width: 90,
    height: 120,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  platformScroll: {
    flexShrink: 1,
  },
  platformChips: {
    flexDirection: 'row',
    gap: 4,
  },
  platformChip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  platformLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  ratingRow: {
    marginTop: 2,
  },
})
