import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { resolveImage } from '../utils/imageHelper'
import { usePlayerStore } from '../store/usePlayerStore'
import { getPlaylistDetails } from '../api/saavnApi'

export default function PlaylistDetailsScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { playlistId } = route.params

  const [loading, setLoading] = useState(true)
  const [playlist, setPlaylist] = useState<any>(null)
  const [songs, setSongs] = useState<any[]>([])

  const setQueue = usePlayerStore((s) => s.setQueue)
  const playSongById = usePlayerStore((s) => s.playSongById)

  useEffect(() => {
    loadPlaylist()
  }, [])

  const loadPlaylist = async () => {
    try {
      console.log("Playlist ID:", playlistId)
  
      const data = await getPlaylistDetails(playlistId)
  
      console.log("Playlist API Response:", data)
  
      setPlaylist(data)
      setSongs(data?.songs || [])
    } catch (e) {
      console.log('Playlist error:', e)
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    )
  }

  if (!playlist) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: '#fff' }}>Playlist not found</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{playlist.title}</Text>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const imageUri = resolveImage(item)

          return (
            <TouchableOpacity
              style={styles.songRow}
              onPress={async () => {
                setQueue(songs, index)
                await playSongById(item.id, index)
                navigation.navigate('Player')
              }}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.songImage} />
              ) : (
                <View style={styles.songImage} />
              )}

              <View style={{ flex: 1 }}>
                <Text style={styles.songTitle}>{item.name}</Text>
                <Text style={styles.songArtist}>
                  {item.primaryArtists}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  songRow: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'center',
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 14,
    backgroundColor: '#1E293B',
  },
  songTitle: {
    color: '#fff',
    fontWeight: '600',
  },
  songArtist: {
    color: '#9CA3AF',
  },
})