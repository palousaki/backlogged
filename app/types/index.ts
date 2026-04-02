export type GameStatus = 'unplayed' | 'playing' | 'played' | 'dropped'

export type Game = {
  id: number
  title: string
  cover: string
  genre: string
  releaseYear: number
  summary: string
  status: GameStatus
  rating: number      // 0–5 stars
  completion: number  // 0–100 percent
  notes: string
  addedAt: string     // ISO date string
}

export type IGDBSearchResult = {
  id: number
  title: string
  cover: string
  genre: string
  releaseYear: number
  summary: string
}

// Navigation param lists
export type LibraryStackParamList = {
  LibraryHome: undefined
  GameDetail: { gameId: number }
}

export type SearchStackParamList = {
  SearchHome: undefined
  GameDetail: { gameId: number; preview?: IGDBSearchResult }
}
