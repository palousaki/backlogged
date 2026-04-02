# Backlogged

A React Native mobile app for tracking your personal video game library. Search for games via IGDB, add them to your shelf, and track your status, rating, completion, and notes.

## Features

- Search games powered by the IGDB API
- Add games to your personal library
- Track status: Unplayed, Playing, Played, or Dropped
- Rate games with a 5-star system
- Track completion percentage
- Add personal notes
- Filter and search your library
- Export and import your library as a JSON backup

## Tech Stack

- [Expo](https://expo.dev) ~54
- React Native 0.81
- TypeScript
- React Navigation v7
- Zustand (state management)
- AsyncStorage (local persistence)
- IGDB API (game data)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org)
- [Expo Go](https://expo.dev/go) app on your phone (for testing)
- A Twitch developer account for IGDB API access

### IGDB API Setup

1. Go to [dev.twitch.tv](https://dev.twitch.tv) and log in
2. Register a new application to get a **Client ID** and **Client Secret**
3. Copy `.env.example` to `.env` and fill in your credentials:

```
IGDB_CLIENT_ID=your_client_id
IGDB_CLIENT_SECRET=your_client_secret
```

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

Then scan the QR code with Expo Go on your phone.

## Backup & Restore

You can export your library from the archive icon on the My Shelf screen. This saves a `.json` file to your device. To restore, tap the same icon and choose Import.
