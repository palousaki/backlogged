import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import * as DocumentPicker from 'expo-document-picker'
import { Platform } from 'react-native'
import type { Game } from '../types'

const EXPORT_VERSION = 1

export async function exportLibrary(games: Game[]): Promise<void> {
  const json = JSON.stringify({ version: EXPORT_VERSION, games }, null, 2)

  if (Platform.OS === 'android') {
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
    if (!permissions.granted) throw new Error('CANCELLED')
    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      'backlogged-export',
      'application/json'
    )
    await FileSystem.writeAsStringAsync(fileUri, json, { encoding: 'utf8' })
  } else {
    const path = FileSystem.cacheDirectory + 'backlogged-export.json'
    await FileSystem.writeAsStringAsync(path, json, { encoding: 'utf8' })
    await Sharing.shareAsync(path, {
      mimeType: 'application/json',
      dialogTitle: 'Export Library',
      UTI: 'public.json',
    })
  }
}

export async function pickAndParseLibrary(): Promise<Game[]> {
  const result = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    copyToCacheDirectory: true,
  })

  if (result.canceled) throw new Error('CANCELLED')

  const uri = result.assets[0].uri
  const content = await FileSystem.readAsStringAsync(uri, {
    encoding: 'utf8',
  })

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error('File is not valid JSON.')
  }

  // Support both { version, games } and a raw array
  const games: unknown =
    parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) && 'games' in (parsed as object)
      ? (parsed as { games: unknown }).games
      : parsed

  if (!Array.isArray(games)) throw new Error('Invalid format: expected a list of games.')

  for (const g of games) {
    if (typeof (g as Game).id !== 'number' || typeof (g as Game).title !== 'string') {
      throw new Error('Invalid game data in file.')
    }
  }

  return games as Game[]
}
