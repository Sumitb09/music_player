# 🎵 BajaDo – React Native Music Player

BajaDo is a modern music streaming application built using **React Native + Expo** with the unofficial **JioSaavn API**.

It supports streaming, search, playlists, favorites, queue management, downloads, and drag-and-drop reordering.

---

## 🚀 Features

### 🎧 Playback
- Play / Pause / Resume
- Seek audio
- Next / Previous
- Shuffle mode
- Repeat (Off / One / All)
- Mini player
- Background playback support

### 📂 Music Discovery
- Search Songs
- Search Artists
- Search Albums
- Search Playlists
- Infinite scrolling search

### 📀 Queue Management
- Dynamic queue
- Drag & drop reorder
- Remove from queue
- Highlight current playing track

### ❤️ User Features
- Favorites
- Recently Played
- Create custom playlists
- Add / Remove songs from playlists
- Download songs for offline use
- Light / Dark theme toggle
- Search history

### 📡 API Integration
- Base URL:https://saavn.sumit.co/api

---

## 🏗️ Tech Stack

- React Native (Expo)
- TypeScript
- Zustand (State Management)
- React Navigation
- React Native Gesture Handler
- react-native-draggable-flatlist
- Expo AV (Audio)
- AsyncStorage
- JioSaavn Unofficial API  
  `https://saavn.sumit.co/api`

---

## 📁 Project Structure

music-player/
├── assets/                     # Images & static assets
│
├── src/
│   ├── api/                    # API layer
│   │   └── saavnApi.ts
│   │
│   ├── components/             # Reusable UI components
│   │   ├── AnimatedTabs.tsx
│   │   └── MiniPlayer.tsx
│   │
│   ├── navigation/             # Navigation setup
│   │   └── RootNavigator.tsx
│   │
│   ├── screens/                # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── PlayerScreen.tsx
│   │   ├── QueueScreen.tsx
│   │   ├── PlaylistDetailsScreen.tsx
│   │   ├── FavoritesScreen.tsx
│   │   ├── DownloadsScreen.tsx
│   │   └── ArtistsSongsScreen.tsx
│   │
│   ├── services/               # Business logic services
│   │   ├── audioService.ts
│   │   └── downloadService.ts
│   │
│   ├── store/                  # Zustand store
│   │   └── usePlayerStore.ts
│   │
│   ├── utils/                  # Utility helpers
│   │   └── imageHelper.ts
│   │
│   ├── theme/                  # App design system
│   │   ├── colors.ts
│   │   └── design.ts
│   │
│   └── types/                  # Type definitions
│
├── App.tsx
├── index.js
├── app.json
├── babel.config.js
├── tsconfig.json
├── package.json
├── eas.json
├── .gitignore
└── README.md

---

---

## 🧠 Architecture Overview

---
UI (Screens & Components)
↓
Zustand Store (Global State)
↓
Audio Service (Expo AV)
↓
JioSaavn API

## 🔑 Key Modules Explained

### 🎵 `store/usePlayerStore.ts`
Central state management:
- Queue
- Playback
- Shuffle & Repeat
- Favorites
- Playlists
- Downloads
- Search History
- Persistence (AsyncStorage)

---

### 🎧 `services/audioService.ts`
Handles:
- Play
- Pause
- Resume
- Seek
- Playback listener

---

### 🔍 `api/saavnApi.ts`
Handles:
- Search
- Playlist details
- Song details
- Artist songs
- API base: `https://saavn.sumit.co/api`

---

### 📜 `screens/QueueScreen.tsx`
Supports:
- Drag & drop reorder
- Remove from queue
- Current song highlight

---