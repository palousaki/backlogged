import AsyncStorage from '@react-native-async-storage/async-storage'
import { IGDB_CLIENT_ID, IGDB_CLIENT_SECRET } from '@env'
import type { IGDBSearchResult, Platform } from '../types'

const IGDB_BASE = 'https://api.igdb.com/v4'
const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token'

const TOKEN_STORAGE_KEY = 'igdb_access_token'
const TOKEN_EXPIRY_KEY = 'igdb_token_expiry'

// ── Token management ──────────────────────────────────────────────────────────

async function fetchNewToken(): Promise<string> {
  const url =
    `${TWITCH_TOKEN_URL}?client_id=${IGDB_CLIENT_ID}` +
    `&client_secret=${IGDB_CLIENT_SECRET}&grant_type=client_credentials`

  const res = await fetch(url, { method: 'POST' })
  if (!res.ok) throw new Error(`Twitch token request failed: ${res.status}`)

  const data = await res.json()
  const token: string = data.access_token
  // Store token with 5-minute buffer before actual expiry
  const expiry = Date.now() + (data.expires_in - 300) * 1000

  await AsyncStorage.multiSet([
    [TOKEN_STORAGE_KEY, token],
    [TOKEN_EXPIRY_KEY, String(expiry)],
  ])

  return token
}

async function getAccessToken(): Promise<string> {
  const [[, token], [, expiry]] = await AsyncStorage.multiGet([
    TOKEN_STORAGE_KEY,
    TOKEN_EXPIRY_KEY,
  ])

  if (token && expiry && Date.now() < Number(expiry)) {
    return token
  }

  return fetchNewToken()
}

// ── Request helper ────────────────────────────────────────────────────────────

async function igdbPost(endpoint: string, body: string): Promise<any[]> {
  const token = await getAccessToken()

  const res = await fetch(`${IGDB_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': IGDB_CLIENT_ID,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body,
  })

  if (res.status === 401) {
    // Token rejected — force refresh once
    await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, TOKEN_EXPIRY_KEY])
    const freshToken = await fetchNewToken()

    const retry = await fetch(`${IGDB_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        Authorization: `Bearer ${freshToken}`,
        'Content-Type': 'text/plain',
      },
      body,
    })
    return retry.json()
  }

  if (!res.ok) throw new Error(`IGDB request failed: ${res.status}`)
  return res.json()
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function searchGames(query: string): Promise<IGDBSearchResult[]> {
  if (!query.trim()) return []

  // Escape double quotes in query to prevent Apicalypse injection
  const safeQuery = query.replace(/"/g, '\\"')

  const games = await igdbPost(
    '/games',
    `fields id,name,cover,genres.name,first_release_date,summary,platforms.name,platforms.abbreviation;
     search "${safeQuery}";
     limit 20;
     where version_parent = null;`
  )

  if (!Array.isArray(games) || games.length === 0) return []

  // Batch-fetch covers for games that have one
  const coverIds = games
    .filter((g: any) => g.cover != null)
    .map((g: any) => g.cover)

  const coverMap: Record<number, string> = {}

  if (coverIds.length > 0) {
    const covers = await igdbPost(
      '/covers',
      `fields id,url; where id = (${coverIds.join(',')});`
    )

    for (const c of covers) {
      if (c.url) {
        coverMap[c.id] = `https:${c.url.replace('/t_thumb/', '/t_cover_big/')}`
      }
    }
  }

  return games.map((game: any): IGDBSearchResult => ({
    id: game.id,
    title: game.name ?? 'Unknown',
    cover: game.cover != null ? (coverMap[game.cover] ?? '') : '',
    genre: game.genres?.[0]?.name ?? 'Unknown',
    releaseYear: game.first_release_date
      ? new Date(game.first_release_date * 1000).getFullYear()
      : 0,
    summary: game.summary ?? '',
    platforms: Array.isArray(game.platforms)
      ? game.platforms.map((p: any): Platform => ({
          id: p.id,
          name: p.name ?? '',
          abbreviation: p.abbreviation ?? p.name ?? '',
        }))
      : [],
  }))
}
