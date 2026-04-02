import { useState, useCallback, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { searchGames } from '../services/igdb'
import { useLibraryStore } from '../store/useLibraryStore'
import { colors } from '../theme'
import type { IGDBSearchResult, SearchStackParamList } from '../types'

type NavProp = NativeStackNavigationProp<SearchStackParamList, 'SearchHome'>

export default function SearchScreen() {
  const navigation = useNavigation<NavProp>()
  const { hasGame } = useLibraryStore()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<IGDBSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (!text.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true)
      setError(null)
      setHasSearched(true)
      try {
        const data = await searchGames(text.trim())
        setResults(data)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to search. Check your connection.')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 500)
  }, [])

  const handleSelectGame = useCallback(
    (game: IGDBSearchResult) => {
      Keyboard.dismiss()
      navigation.navigate('GameDetail', { gameId: game.id, preview: game })
    },
    [navigation]
  )

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.heading}>Discover</Text>
      </View>

      {/* Search input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a game…"
          placeholderTextColor={colors.placeholder}
          value={query}
          onChangeText={handleSearch}
          returnKeyType="search"
          autoFocus={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setHasSearched(false) }}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.statusText}>Searching…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            hasSearched ? (
              <View style={styles.center}>
                <Text style={styles.emptyEmoji}>🕹️</Text>
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySubtitle}>Try a different title or spelling</Text>
              </View>
            ) : (
              <View style={styles.center}>
                <Text style={styles.emptyEmoji}>🎮</Text>
                <Text style={styles.emptyTitle}>Find your next game</Text>
                <Text style={styles.emptySubtitle}>Type above to search the IGDB database</Text>
              </View>
            )
          }
          renderItem={({ item }) => {
            const inLibrary = hasGame(item.id)
            return (
              <TouchableOpacity
                style={styles.resultRow}
                onPress={() => handleSelectGame(item)}
                activeOpacity={0.8}
              >
                {/* Cover */}
                <View style={styles.coverContainer}>
                  {item.cover ? (
                    <Image
                      source={{ uri: item.cover }}
                      style={styles.cover}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.cover, styles.coverPlaceholder]}>
                      <Text style={styles.coverPlaceholderText}>?</Text>
                    </View>
                  )}
                </View>

                {/* Info */}
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.resultMeta}>
                    {[item.genre, item.releaseYear > 0 ? String(item.releaseYear) : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                  {item.summary ? (
                    <Text style={styles.resultSummary} numberOfLines={2}>
                      {item.summary}
                    </Text>
                  ) : null}
                </View>

                {/* In-library badge */}
                {inLibrary && (
                  <View style={styles.inLibraryBadge}>
                    <Text style={styles.inLibraryText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: colors.cardBorder,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    color: colors.text,
  },
  clearBtn: {
    fontSize: 14,
    color: colors.muted,
    paddingHorizontal: 4,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  statusText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  errorEmoji: { fontSize: 40, marginBottom: 12 },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    color: colors.text,
  },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 16,
    gap: 8,
  },
  resultRow: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
  },
  coverContainer: {
    width: 72,
    height: 96,
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
    fontSize: 24,
    color: colors.muted,
  },
  resultInfo: {
    flex: 1,
    padding: 10,
    gap: 4,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    color: colors.text,
  },
  resultMeta: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
  },
  resultSummary: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
    marginTop: 2,
  },
  inLibraryBadge: {
    backgroundColor: colors.status.playing,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  inLibraryText: {
    color: colors.card,
    fontWeight: '700',
    fontSize: 14,
  },
})
