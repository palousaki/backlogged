import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import type { Game } from '../types'
import { colors } from '../theme'
import StatusBadge from './StatusBadge'
import StarRating from './StarRating'
import CompletionBar from './CompletionBar'

interface Props {
  game: Game
  onPress: () => void
}

export default function GameCard({ game, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Cover image */}
      <View style={styles.coverContainer}>
        {game.cover ? (
          <Image source={{ uri: game.cover }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={[styles.cover, styles.coverPlaceholder]}>
            <Text style={styles.coverPlaceholderText}>?</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {game.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>{game.genre}</Text>
          {game.releaseYear > 0 && (
            <Text style={styles.meta}> · {game.releaseYear}</Text>
          )}
        </View>

        <View style={styles.badgeRow}>
          <StatusBadge status={game.status} small />
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
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  coverContainer: {
    width: 90,
    height: 120,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPlaceholderText: {
    fontSize: 32,
    color: colors.muted,
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
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
  },
  meta: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
  },
  badgeRow: {
    marginTop: 2,
  },
  ratingRow: {
    marginTop: 2,
  },
})
