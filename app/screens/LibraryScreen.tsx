import { useMemo, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useLibraryStore } from '../store/useLibraryStore'
import GameCard from '../components/GameCard'
import { useColors, getTabBarStyle } from '../theme'
import type { Game, GameStatus, LibraryStackParamList } from '../types'
import { Ionicons } from '@expo/vector-icons'
import { exportLibrary, pickAndParseLibrary } from '../services/libraryIO'
import BackupModal from '../components/BackupModal'

type NavProp = NativeStackNavigationProp<LibraryStackParamList, 'LibraryHome'>

const FILTERS: { key: 'all' | GameStatus; label: string }[] = [
  { key: 'all',      label: 'All'      },
  { key: 'playing',  label: 'Playing'  },
  { key: 'played',   label: 'Played'   },
  { key: 'unplayed', label: 'Unplayed' },
  { key: 'dropped',  label: 'Dropped'  },
]

export default function LibraryScreen() {
  const navigation = useNavigation<NavProp>()
  const colors = useColors()
  const games = useLibraryStore((s) => s.games)
  const mergeGames = useLibraryStore((s) => s.mergeGames)

  async function handleExport() {
    if (games.length === 0) {
      Alert.alert('Nothing to export', 'Add some games to your library first.')
      return
    }
    try {
      await exportLibrary(games)
      if (Platform.OS === 'android') Alert.alert('Exported', 'Library saved successfully.')
    } catch (e: unknown) {
      if (e instanceof Error && e.message === 'CANCELLED') return
      Alert.alert('Export failed', e instanceof Error ? e.message : String(e))
    }
  }

  async function handleImport() {
    try {
      const imported = await pickAndParseLibrary()
      const added = mergeGames(imported)
      const skipped = imported.length - added
      const msg =
        added === 0
          ? 'All games already exist in your library.'
          : `Added ${added} game${added !== 1 ? 's' : ''}${skipped > 0 ? `, skipped ${skipped} duplicate${skipped !== 1 ? 's' : ''}` : ''}.`
      Alert.alert('Import complete', msg)
    } catch (e: unknown) {
      if (e instanceof Error && e.message === 'CANCELLED') return
      Alert.alert('Import failed', e instanceof Error ? e.message : 'Could not read the file.')
    }
  }

  const [backupVisible, setBackupVisible] = useState(false)

  function openBackup() {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } })
    setBackupVisible(true)
  }

  function closeBackup() {
    navigation.getParent()?.setOptions({ tabBarStyle: getTabBarStyle(colors) })
    setBackupVisible(false)
  }

  const [activeFilter, setActiveFilter] = useState<'all' | GameStatus>('all')
  const [search, setSearch] = useState('')

  const statusCounts = useMemo(() => ({
    all:      games.length,
    playing:  games.filter((g) => g.status === 'playing').length,
    played:   games.filter((g) => g.status === 'played').length,
    unplayed: games.filter((g) => g.status === 'unplayed').length,
    dropped:  games.filter((g) => g.status === 'dropped').length,
  }), [games])

  const filtered = useMemo(() => {
    let list = games
    if (activeFilter !== 'all') {
      list = list.filter((g) => g.status === activeFilter)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((g) => g.title.toLowerCase().includes(q))
    }
    return list.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
  }, [games, activeFilter, search])

  const filterColor = (key: string) =>
    key === 'all' ? colors.accent : colors.status[key as GameStatus] ?? colors.accent

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.heading, { color: colors.text }]}>My Shelf</Text>
        <TouchableOpacity
          onPress={openBackup}
          style={[styles.backupBtn, { backgroundColor: colors.accentLight }]}
          activeOpacity={0.7}
        >
          <Ionicons name="archive-outline" size={22} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <BackupModal
        visible={backupVisible}
        onClose={closeBackup}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.cardBorder }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search library…"
          placeholderTextColor={colors.placeholder}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={[styles.clearBtn, { color: colors.muted }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter tabs */}
      <View style={[styles.filterRow, { borderBottomColor: colors.border }]}>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(i) => i.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const active = activeFilter === item.key
            const fc = filterColor(item.key)
            return (
              <TouchableOpacity
                style={styles.filterTab}
                onPress={() => setActiveFilter(item.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterLabel, { color: active ? fc : colors.placeholder }, active && styles.filterLabelActive]}>
                  {item.label}
                  <Text style={[styles.filterCount, { color: active ? fc : colors.placeholder }]}>
                    {' '}{statusCounts[item.key]}
                  </Text>
                </Text>
                {active && <View style={[styles.filterUnderline, { backgroundColor: fc }]} />}
              </TouchableOpacity>
            )
          }}
        />
      </View>

      {/* Game list */}
      <FlatList
        data={filtered}
        keyExtractor={(g) => String(g.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎮</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {games.length === 0 ? 'No games yet' : 'No matches'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              {games.length === 0
                ? 'Go to Search to add games to your library'
                : 'Try a different filter or search term'}
            </Text>
          </View>
        }
        renderItem={({ item }: { item: Game }) => (
          <GameCard
            game={item}
            onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  backupBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 4,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearBtn: {
    fontSize: 13,
    paddingHorizontal: 4,
  },
  filterRow: {
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  filterList: {
    paddingHorizontal: 8,
    gap: 0,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 4,
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterLabelActive: {
    fontWeight: '700',
  },
  filterCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  filterUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 2,
    borderRadius: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
})
