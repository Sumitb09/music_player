# 🎵 BajaDo – React Native Music Player

BajaDo is a modern music streaming application built using **React Native + Expo** with the unofficial **JioSaavn API**.

It supports streaming, search, playlists, favorites, queue management, downloads, and drag-and-drop reordering.

---

## 🚀 Features

- 🎧 Stream songs using JioSaavn API  
- 🔍 Search (Songs, Artists, Albums)  
- 📂 Playlist support (Create / Delete / Add songs)  
- ❤️ Favorites system  
- 🕘 Recently played  
- 📥 Download songs for offline playback  
- 🔀 Shuffle mode  
- 🔁 Repeat mode (Off / One / All)  
- 🎶 Mini player  
- 📜 Draggable queue (Reorder songs)  
- 🌙 Light/Dark theme support  
- 💾 Persistent storage (AsyncStorage)  

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

---

## 🧠 Architecture Overview

---

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