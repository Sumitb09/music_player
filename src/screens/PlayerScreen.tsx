import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
} from 'react-native'
import Slider from '@react-native-community/slider'
import { Ionicons } from '@expo/vector-icons'
import { usePlayerStore } from '../store/usePlayerStore'
import { useNavigation } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import { LightTheme, DarkTheme } from '../theme/colors'
import { resolveImage } from '../utils/imageHelper'

export default function PlayerScreen() {
  const navigation = useNavigation<any>()

  const [playlistModal, setPlaylistModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')

  const currentSong = usePlayerStore((s) => s.currentSong)
  const playlists = usePlayerStore((s) => s.playlists)
  const createPlaylist = usePlayerStore((s) => s.createPlaylist)
  const addToPlaylist = usePlayerStore((s) => s.addToPlaylist)

  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const position = usePlayerStore((s) => s.position)
  const duration = usePlayerStore((s) => s.duration)
  const pause = usePlayerStore((s) => s.pause)
  const resume = usePlayerStore((s) => s.resume)
  const seek = usePlayerStore((s) => s.seek)
  const next = usePlayerStore((s) => s.next)
  const previous = usePlayerStore((s) => s.previous)
  const shuffle = usePlayerStore((s) => s.shuffle)
  const repeatMode = usePlayerStore((s) => s.repeatMode)
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle)
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat)
  const downloadTrack = usePlayerStore((s) => s.downloadTrack)
  const downloaded = usePlayerStore((s) => s.downloaded)
  const themeMode = usePlayerStore((s) => s.theme)

  const addToFavorites = usePlayerStore((s) => s.addToFavorites)
  const removeFromFavorites = usePlayerStore((s) => s.removeFromFavorites)
  const isFavorite = usePlayerStore((s) => s.isFavorite)

  const theme = themeMode === 'light' ? LightTheme : DarkTheme

  if (!currentSong) {
    return (
      <View style={styles.empty}>
        <Text>No song playing</Text>
      </View>
    )
  }

  const imageUri = resolveImage(currentSong)
  const isDownloaded = downloaded[currentSong.id]
  const favorite = isFavorite(currentSong.id)

  const handleFavorite = () => {
    favorite
      ? removeFromFavorites(currentSong.id)
      : addToFavorites(currentSong)
  }

  const formatTime = (millis: number) => {
    if (!millis) return '0:00'
    const minutes = Math.floor(millis / 60000)
    const seconds = Math.floor((millis % 60000) / 1000)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <View style={{ flex: 1 }}>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.backgroundImage}
          blurRadius={60}
        />
      )}

      <BlurView intensity={90} style={styles.blurOverlay} />

      <View
        style={[
          styles.container,
          { backgroundColor: theme.background + 'DD' },
        ]}
      >
        {/* Top Row */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-down" size={28} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.topRight}>
            <TouchableOpacity
              onPress={() => setPlaylistModal(true)}
              style={{ marginRight: 18 }}
            >
              <Ionicons
                name="add-circle-outline"
                size={26}
                color={theme.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleFavorite}
              style={{ marginRight: 18 }}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={26}
                color={favorite ? theme.primary : theme.text}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Queue')}>
              <Ionicons name="list" size={26} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Album Art */}
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.art} />
        ) : (
          <View style={[styles.art, { backgroundColor: '#1E293B' }]} />
        )}

        <Text style={[styles.title, { color: theme.text }]}>
          {currentSong.name}
        </Text>

        <Text style={[styles.artist, { color: theme.secondaryText }]}>
          {currentSong?.artists?.primary?.[0]?.name ||
            currentSong?.primaryArtists ||
            'Unknown Artist'}
        </Text>

        {/* Download */}
        <TouchableOpacity
          onPress={() => downloadTrack(currentSong.id)}
          style={{ marginBottom: 20 }}
        >
          <Ionicons
            name={isDownloaded ? 'checkmark-circle' : 'download'}
            size={28}
            color={theme.primary}
          />
        </TouchableOpacity>

        {/* Slider */}
        <Slider
          style={{ width: '100%' }}
          minimumValue={0}
          maximumValue={duration || 1}
          value={position}
          onSlidingComplete={(value) => seek(value)}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.border}
          thumbTintColor={theme.primary}
        />

        <View style={styles.timeRow}>
          <Text style={{ color: theme.secondaryText }}>
            {formatTime(position)}
          </Text>
          <Text style={{ color: theme.secondaryText }}>
            {formatTime(duration)}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controlBar}>
          <TouchableOpacity onPress={toggleShuffle}>
            <Ionicons
              name="shuffle"
              size={26}
              color={shuffle ? theme.primary : theme.border}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={previous}>
            <Ionicons name="play-skip-back" size={32} color={theme.secondaryText} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => (isPlaying ? pause() : resume())}
            style={[styles.playButton, { backgroundColor: theme.primary }]}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={34}
              color="#000"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={next}>
            <Ionicons name="play-skip-forward" size={32} color={theme.secondaryText} />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleRepeat}>
            <Ionicons
              name="repeat"
              size={26}
              color={repeatMode !== 'off' ? theme.primary : theme.border}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* PLAYLIST MODAL */}
      <Modal visible={playlistModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add to Playlist</Text>

            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.playlistItem}
                  onPress={() => {
                    addToPlaylist(item.id, currentSong)
                    setPlaylistModal(false)
                  }}
                >
                  <Text style={{ color: '#fff' }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            {!isCreating && (
              <TouchableOpacity
                style={styles.createBtn}
                onPress={() => setIsCreating(true)}
              >
                <Text style={styles.createText}>
                  ➕ Create New Playlist
                </Text>
              </TouchableOpacity>
            )}

            {isCreating && (
              <View style={{ marginTop: 15 }}>
                <TextInput
                  placeholder="Playlist name"
                  placeholderTextColor="#888"
                  value={newPlaylistName}
                  onChangeText={setNewPlaylistName}
                  style={styles.input}
                />

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={() => {
                    if (!newPlaylistName.trim()) return

                    createPlaylist(newPlaylistName.trim())

                    const newList =
                      usePlayerStore.getState().playlists[0]

                    addToPlaylist(newList.id, currentSong)

                    setNewPlaylistName('')
                    setIsCreating(false)
                    setPlaylistModal(false)
                  }}
                >
                  <Text style={{ color: '#000', fontWeight: '600' }}>
                    Create & Add
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                setIsCreating(false)
                setPlaylistModal(false)
              }}
              style={styles.closeBtn}
            >
              <Text style={{ color: '#FF8C00' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  backgroundImage: { ...StyleSheet.absoluteFillObject },
  blurOverlay: { ...StyleSheet.absoluteFillObject },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  topRow: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topRight: { flexDirection: 'row', alignItems: 'center' },
  art: {
    width: 300,
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  artist: { marginBottom: 20 },
  timeRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    marginTop: 20,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F172A',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '65%',
  },
  modalTitle: { color: '#fff', fontSize: 18, marginBottom: 20 },
  playlistItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  createBtn: { marginTop: 20 },
  createText: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 10,
    color: '#fff',
    marginBottom: 10,
  },
  confirmBtn: {
    backgroundColor: '#FF8C00',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeBtn: { alignItems: 'center', marginTop: 15 },
})