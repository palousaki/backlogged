import { useLayoutEffect, useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Slider from '@react-native-community/slider'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useLibraryStore } from '../store/useLibraryStore'
import StatusBadge from '../components/StatusBadge'
import StarRating from '../components/StarRating'
import { colors } from '../theme'
import type { GameStatus } from '../types'

import type { IGDBSearchResult } from '../types'

// preview is only present when navigating from Search (game not yet in library)
type GameDetailRoute = RouteProp<{ GameDetail: { gameId: number; preview?: IGDBSearchResult } }, 'GameDetail'>

const STATUSES: GameStatus[] = ['unplayed', 'playing', 'played', 'dropped']

const STATUS_COLORS: Record<GameStatus, string> = {
  playing:  colors.status.playing,
  played:   colors.status.played,
  unplayed: colors.status.unplayed,
  dropped:  colors.status.dropped,
}

export default function GameDetailScreen() {
  const route = useRoute<GameDetailRoute>()
  const navigation = useNavigation()
  const { gameId, preview } = route.params

  const game = useLibraryStore((s) => s.games.find((g) => g.id === gameId))
  const addGame = useLibraryStore((s) => s.addGame)
  const updateGame = useLibraryStore((s) => s.updateGame)
  const removeGame = useLibraryStore((s) => s.removeGame)

  // Local edit state
  const [status, setStatus] = useState<GameStatus>(game?.status ?? 'unplayed')
  const [rating, setRating] = useState(game?.rating ?? 0)
  const [completion, setCompletion] = useState(game?.completion ?? 0)
  const [notes, setNotes] = useState(game?.notes ?? '')

  // Keep header title in sync
  useLayoutEffect(() => {
    navigation.setOptions({ title: game?.title ?? preview?.title ?? 'Game Detail' })
  }, [game?.title, preview?.title, navigation])

  // Sync if game changes from outside (unlikely but safe)
  useEffect(() => {
    if (game) {
      setStatus(game.status)
      setRating(game.rating)
      setCompletion(game.completion)
      setNotes(game.notes)
    }
  }, [gameId])

  if (!game && preview) {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroCard}>
            <View style={styles.coverWrapper}>
              {preview.cover ? (
                <Image source={{ uri: preview.cover }} style={styles.cover} resizeMode="cover" />
              ) : (
                <View style={[styles.cover, styles.coverPlaceholder]}>
                  <Text style={styles.coverPlaceholderText}>🎮</Text>
                </View>
              )}
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.title} numberOfLines={3}>{preview.title}</Text>
              <View style={styles.metaRow}>
                {preview.genre !== 'Unknown' && (
                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipText}>{preview.genre}</Text>
                  </View>
                )}
                {preview.releaseYear > 0 && (
                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipText}>{preview.releaseYear}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {preview.summary ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.summary}>{preview.summary}</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => addGame(preview)}
            >
              <Text style={styles.saveBtnText}>Add to Shelf</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  if (!game) {
    return (
      <View style={styles.root}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>🤔</Text>
          <Text style={styles.notFoundText}>Game not found</Text>
        </View>
      </View>
    )
  }

  const handleSave = () => {
    updateGame(gameId, { status, rating, completion, notes })
    navigation.goBack()
  }

  const handleDelete = () => {
    Alert.alert(
      'Remove Game',
      `Remove "${game.title}" from your library?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeGame(gameId)
            navigation.goBack()
          },
        },
      ]
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero section */}
        <View style={styles.heroCard}>
          {/* Cover */}
          <View style={styles.coverWrapper}>
            {game.cover ? (
              <Image source={{ uri: game.cover }} style={styles.cover} resizeMode="cover" />
            ) : (
              <View style={[styles.cover, styles.coverPlaceholder]}>
                <Text style={styles.coverPlaceholderText}>🎮</Text>
              </View>
            )}
          </View>

          {/* Title & meta */}
          <View style={styles.heroInfo}>
            <Text style={styles.title} numberOfLines={3}>
              {game.title}
            </Text>

            <View style={styles.metaRow}>
              {game.genre !== 'Unknown' && (
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>{game.genre}</Text>
                </View>
              )}
              {game.releaseYear > 0 && (
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>{game.releaseYear}</Text>
                </View>
              )}
            </View>

            <StatusBadge status={status} />
          </View>
        </View>

        {/* Summary */}
        {game.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.summary}>{game.summary}</Text>
          </View>
        ) : null}

        {/* Status selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusRow}>
            {STATUSES.map((s) => {
              const active = status === s
              const color = STATUS_COLORS[s]
              return (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusBtn,
                    active
                      ? { backgroundColor: color }
                      : { backgroundColor: colors.bg, borderColor: color, borderWidth: 1.5 },
                  ]}
                  onPress={() => {
                    setStatus(s)
                    if (s === 'played') setCompletion(100)
                  }}
                >
                  <Text
                    style={[
                      styles.statusBtnLabel,
                      active ? { color: colors.card } : { color },
                    ]}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Rating */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Rating</Text>
            {rating > 0 && (
              <Text style={styles.ratingValue}>{rating}/5</Text>
            )}
          </View>
          <StarRating rating={rating} onRate={setRating} size={34} />
          {rating === 0 && (
            <Text style={styles.hint}>Tap a star to rate</Text>
          )}
        </View>

        {/* Completion */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Completion</Text>
            <Text style={styles.completionValue}>
              {Math.round(completion)}%
            </Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={completion}
            onValueChange={setCompletion}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.accent}
          />
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add your thoughts, tips, or progress notes…"
            placeholderTextColor={colors.muted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>Remove from Library</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scrollContent: {
    paddingBottom: 40,
    gap: 12,
    paddingTop: 8,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundEmoji: { fontSize: 48 },
  notFoundText: { fontSize: 18, fontWeight: '600', color: colors.text },

  heroCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    gap: 14,
    backgroundColor: colors.card,
  },
  coverWrapper: {
    width: 110,
    height: 150,
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
    fontSize: 36,
  },
  heroInfo: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 14,
    gap: 8,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaChip: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  metaChipText: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
  },

  section: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    backgroundColor: colors.card,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summary: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
  },

  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  statusBtnLabel: {
    fontSize: 13,
    fontWeight: '700',
  },

  ratingValue: {
    fontSize: 14,
    color: colors.star,
    fontWeight: '700',
  },
  hint: {
    fontSize: 12,
    marginTop: -4,
    color: colors.muted,
  },

  completionValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.accent,
  },
  slider: {
    width: '100%',
    height: 40,
    marginHorizontal: -4,
  },

  notesInput: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 100,
    backgroundColor: colors.cardBorder,
    color: colors.text,
    borderColor: colors.border,
  },

  actions: {
    marginHorizontal: 16,
    gap: 10,
    marginTop: 4,
  },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  deleteBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.status.dropped,
  },
  deleteBtnText: {
    color: colors.status.dropped,
    fontSize: 15,
    fontWeight: '700',
  },
})
