import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useColors } from '../theme'
import { useSettingsStore, ThemePreference } from '../store/useSettingsStore'
import { useLibraryStore } from '../store/useLibraryStore'
import { exportLibrary, pickAndParseLibrary } from '../services/libraryIO'
import AppDialog from '../components/AppDialog'
import type { LibraryStackParamList } from '../types'

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: 'contrast-outline' | 'sunny-outline' | 'moon-outline' }[] = [
  { value: 'system', label: 'System', icon: 'contrast-outline' },
  { value: 'light',  label: 'Light',  icon: 'sunny-outline'    },
  { value: 'dark',   label: 'Dark',   icon: 'moon-outline'     },
]

type NavProp = NativeStackNavigationProp<LibraryStackParamList, 'Settings'>

export default function SettingsScreen() {
  const navigation = useNavigation<NavProp>()
  const colors = useColors()
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const games = useLibraryStore((s) => s.games)
  const mergeGames = useLibraryStore((s) => s.mergeGames)

  const [dialog, setDialog] = useState<{ title: string; message: string; goToLibrary?: boolean } | null>(null)

  async function handleExport() {
    if (games.length === 0) {
      setDialog({ title: 'Nothing to export', message: 'Add some games to your library first.' })
      return
    }
    try {
      await exportLibrary(games)
      setDialog({ title: 'Exported', message: 'Library saved successfully.' })
    } catch (e: unknown) {
      if (e instanceof Error && e.message === 'CANCELLED') return
      setDialog({ title: 'Export failed', message: e instanceof Error ? e.message : String(e) })
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
      setDialog({ title: 'Import complete', message: msg, goToLibrary: true })
    } catch (e: unknown) {
      if (e instanceof Error && e.message === 'CANCELLED') return
      setDialog({ title: 'Import failed', message: e instanceof Error ? e.message : 'Could not read the file.' })
    }
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.muted }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.cardPadding}>
<View style={[styles.segmented, { backgroundColor: colors.cardBorder }]}>
            {THEME_OPTIONS.map((opt) => {
              const active = theme === opt.value
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.segment, active && { backgroundColor: colors.accent }]}
                  onPress={() => setTheme(opt.value)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={opt.icon}
                    size={15}
                    color={active ? '#FFFFFF' : colors.muted}
                  />
                  <Text style={[styles.segmentLabel, { color: active ? '#FFFFFF' : colors.muted }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          </View>
        </View>
      </View>

      {/* Library */}
      <View style={[styles.section, styles.sectionSpaced]}>
        <Text style={[styles.sectionLabel, { color: colors.muted }]}>Library</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            onPress={handleExport}
            activeOpacity={0.7}
          >
            <View style={[styles.rowIcon, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="arrow-up-circle-outline" size={20} color={colors.accent} />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>Export library</Text>
              <Text style={[styles.rowSub, { color: colors.muted }]}>Save a backup file to your device</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.placeholder} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={handleImport} activeOpacity={0.7}>
            <View style={[styles.rowIcon, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="arrow-down-circle-outline" size={20} color={colors.accent} />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>Import library</Text>
              <Text style={[styles.rowSub, { color: colors.muted }]}>Restore from a backup file</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.placeholder} />
          </TouchableOpacity>
        </View>
      </View>

      <AppDialog
        visible={dialog !== null}
        title={dialog?.title ?? ''}
        message={dialog?.message ?? ''}
        onDismiss={() => {
          const goToLibrary = dialog?.goToLibrary
          setDialog(null)
          if (goToLibrary) navigation.navigate('LibraryHome')
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  section: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginLeft: 4,
    marginBottom: 4,
  },
  sectionSpaced: {
    marginTop: 24,
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardPadding: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  rowSub: {
    fontSize: 12,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
})
