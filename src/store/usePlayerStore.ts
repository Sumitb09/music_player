import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getSongDetails } from '../api/saavnApi'
import {
  playAudio,
  pauseAudio,
  resumeAudio,
  seekAudio,
  setOnPlaybackStatusUpdate,
} from '../services/audioService'
import { downloadSong } from '../services/downloadService'

type RepeatMode = 'off' | 'one' | 'all'
type ThemeMode = 'light' | 'dark'

interface Playlist {
  id: string
  name: string
  songs: any[]
}

interface PlayerState {
  currentSong: any | null
  queue: any[]
  currentIndex: number

  isPlaying: boolean
  position: number
  duration: number

  shuffle: boolean
  repeatMode: RepeatMode

  downloaded: { [key: string]: string }
  recentlyPlayed: any[]
  searchHistory: string[]
  favorites: any[]
  playlists: Playlist[]

  theme: ThemeMode

  hydrate: () => Promise<void>
  persist: () => Promise<void>

  setQueue: (songs: any[], startIndex: number) => void
  removeFromQueue: (index: number) => void
  reorderQueue: (from: number, to: number) => void

  playSongById: (id: string, index: number) => Promise<void>
  playByIndex: (index: number) => Promise<void>
  next: () => Promise<void>
  previous: () => Promise<void>

  pause: () => Promise<void>
  resume: () => Promise<void>
  seek: (value: number) => Promise<void>

  toggleShuffle: () => void
  toggleRepeat: () => void

  downloadTrack: (id: string) => Promise<void>
  removeDownloaded: (id: string) => Promise<void>

  toggleTheme: () => void

  addSearchHistory: (query: string) => void
  removeSearchHistory: (query: string) => void
  clearSearchHistory: () => void

  addToFavorites: (song: any) => void
  removeFromFavorites: (id: string) => void
  isFavorite: (id: string) => boolean

  createPlaylist: (name: string) => void
  deletePlaylist: (id: string) => void
  addToPlaylist: (playlistId: string, song: any) => void
  removeFromPlaylist: (playlistId: string, songId: string) => void
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  /* ================= PERSIST ================= */

  const persist = async () => {
    const state = get()
    await AsyncStorage.setItem(
      'PLAYER_STATE',
      JSON.stringify({
        queue: state.queue,
        currentIndex: state.currentIndex,
        shuffle: state.shuffle,
        repeatMode: state.repeatMode,
        downloaded: state.downloaded,
        theme: state.theme,
        recentlyPlayed: state.recentlyPlayed,
        searchHistory: state.searchHistory,
        favorites: state.favorites,
        playlists: state.playlists,
      })
    )
  }

  const hydrate = async () => {
    const data = await AsyncStorage.getItem('PLAYER_STATE')
    if (!data) return
    const parsed = JSON.parse(data)

    set({
      queue: parsed.queue || [],
      currentIndex: parsed.currentIndex || 0,
      shuffle: parsed.shuffle ?? false,
      repeatMode: parsed.repeatMode || 'off',
      downloaded: parsed.downloaded || {},
      theme: parsed.theme || 'light',
      recentlyPlayed: parsed.recentlyPlayed || [],
      searchHistory: parsed.searchHistory || [],
      favorites: parsed.favorites || [],
      playlists: parsed.playlists || [],
    })
  }

  /* ================= PLAYBACK LISTENER ================= */

  setOnPlaybackStatusUpdate((status) => {
    if (!status?.isLoaded) return

    set({
      position: status.positionMillis,
      duration: status.durationMillis || 0,
      isPlaying: status.isPlaying,
    })

    if (status.didJustFinish) {
      const { repeatMode } = get()

      if (repeatMode === 'one') {
        get().seek(0)
        get().resume()
      } else {
        get().next()
      }
    }
  })

  /* ================= STORE ================= */

  return {
    currentSong: null,
    queue: [],
    currentIndex: 0,
    isPlaying: false,
    position: 0,
    duration: 0,
    shuffle: false,
    repeatMode: 'off',
    downloaded: {},
    recentlyPlayed: [],
    searchHistory: [],
    favorites: [],
    playlists: [],
    theme: 'light',

    hydrate,
    persist,

    /* ================= QUEUE ================= */

    setQueue: (songs, startIndex) => {
      set({ queue: songs, currentIndex: startIndex })
      persist()
    },

    removeFromQueue: (index) => {
      const state = get()
      const newQueue = [...state.queue]
      if (!newQueue[index]) return

      newQueue.splice(index, 1)

      let newIndex = state.currentIndex

      if (index < state.currentIndex) {
        newIndex -= 1
      } else if (index === state.currentIndex) {
        newIndex = Math.max(0, state.currentIndex - 1)
      }

      set({ queue: newQueue, currentIndex: newIndex })
      persist()
    },

    reorderQueue: (from, to) => {
      const state = get()
      const newQueue = [...state.queue]
      if (!newQueue[from]) return

      const movedItem = newQueue.splice(from, 1)[0]
      newQueue.splice(to, 0, movedItem)

      let newIndex = state.currentIndex

      if (from === state.currentIndex) {
        newIndex = to
      } else if (from < state.currentIndex && to >= state.currentIndex) {
        newIndex -= 1
      } else if (from > state.currentIndex && to <= state.currentIndex) {
        newIndex += 1
      }

      set({ queue: newQueue, currentIndex: newIndex })
      persist()
    },

    /* ================= PLAY ================= */

    playSongById: async (id, index) => {
      const song = await getSongDetails(id)
      if (!song) return

      const localFile = get().downloaded[id]

      const remoteUrl =
        song?.downloadUrl?.find((u: any) => u.quality === '320kbps')?.url ||
        song?.downloadUrl?.[0]?.url

      const finalUrl = localFile || remoteUrl
      if (!finalUrl) return

      await playAudio(finalUrl)

      set((state) => ({
        currentSong: song,
        currentIndex: index,
        isPlaying: true,
        position: 0,
        duration: 0,
        recentlyPlayed: [
          song,
          ...state.recentlyPlayed.filter((s) => s.id !== song.id),
        ].slice(0, 15),
      }))

      persist()
    },

    playByIndex: async (index) => {
      const queue = get().queue
      if (!queue[index]) return
      await get().playSongById(queue[index].id, index)
    },

    next: async () => {
      const { currentIndex, queue, shuffle, repeatMode } = get()
      if (!queue.length) return

      if (shuffle) {
        const randomIndex = Math.floor(Math.random() * queue.length)
        await get().playByIndex(randomIndex)
        return
      }

      let nextIndex = currentIndex + 1

      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') nextIndex = 0
        else return
      }

      await get().playByIndex(nextIndex)
    },

    previous: async () => {
      const { currentIndex } = get()
      if (currentIndex <= 0) return
      await get().playByIndex(currentIndex - 1)
    },

    pause: async () => pauseAudio(),
    resume: async () => resumeAudio(),
    seek: async (value) => seekAudio(value),

    /* ================= DOWNLOAD ================= */

    downloadTrack: async (id: string) => {
      if (get().downloaded[id]) return

      const song = await getSongDetails(id)
      if (!song) return

      const url =
        song?.downloadUrl?.find((u: any) => u.quality === '320kbps')?.url ||
        song?.downloadUrl?.[0]?.url

      if (!url) return

      const localUri = await downloadSong(url, id)

      set((state) => ({
        downloaded: { ...state.downloaded, [id]: localUri },
      }))

      persist()
    },

    removeDownloaded: async (id: string) => {
      try {
        const fileUri = get().downloaded[id]
        if (!fileUri) return

        const FileSystem = await import('expo-file-system')
        const file = new FileSystem.File(fileUri)

        if (file.exists) await file.delete()

        set((state) => {
          const updated = { ...state.downloaded }
          delete updated[id]
          return { downloaded: updated }
        })

        persist()
      } catch (e) {
        console.log('Delete download error:', e)
      }
    },

    /* ================= TOGGLES ================= */

    toggleShuffle: () => {
      set((state) => ({ shuffle: !state.shuffle }))
      persist()
    },

    toggleRepeat: () => {
      const order: RepeatMode[] = ['off', 'all', 'one']
      const current = get().repeatMode
      const next = order[(order.indexOf(current) + 1) % order.length]
      set({ repeatMode: next })
      persist()
    },

    toggleTheme: () => {
      set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light',
      }))
      persist()
    },

    /* ================= SEARCH ================= */

    addSearchHistory: (query) => {
      set((state) => ({
        searchHistory: [
          query,
          ...state.searchHistory.filter((q) => q !== query),
        ].slice(0, 10),
      }))
      persist()
    },

    removeSearchHistory: (query) => {
      set((state) => ({
        searchHistory: state.searchHistory.filter((q) => q !== query),
      }))
      persist()
    },

    clearSearchHistory: () => {
      set({ searchHistory: [] })
      persist()
    },

    /* ================= FAVORITES ================= */

    addToFavorites: (song) => {
      set((state) => ({
        favorites: [
          song,
          ...state.favorites.filter((s) => s.id !== song.id),
        ],
      }))
      persist()
    },

    removeFromFavorites: (id) => {
      set((state) => ({
        favorites: state.favorites.filter((s) => s.id !== id),
      }))
      persist()
    },

    isFavorite: (id) => {
      return get().favorites.some((s) => s.id === id)
    },

    /* ================= PLAYLISTS ================= */

    createPlaylist: (name) => {
      const newPlaylist = {
        id: Date.now().toString(),
        name,
        songs: [],
      }

      set((state) => ({
        playlists: [newPlaylist, ...state.playlists],
      }))
      persist()
    },

    deletePlaylist: (id) => {
      set((state) => ({
        playlists: state.playlists.filter((p) => p.id !== id),
      }))
      persist()
    },

    addToPlaylist: (playlistId, song) => {
      set((state) => ({
        playlists: state.playlists.map((p) =>
          p.id === playlistId
            ? { ...p, songs: [song, ...p.songs] }
            : p
        ),
      }))
      persist()
    },

    removeFromPlaylist: (playlistId, songId) => {
      set((state) => ({
        playlists: state.playlists.map((p) =>
          p.id === playlistId
            ? {
                ...p,
                songs: p.songs.filter((s) => s.id !== songId),
              }
            : p
        ),
      }))
      persist()
    },
  }
})