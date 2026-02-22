import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { resolveImage } from '../utils/imageHelper'
import { getArtistSongsPaginated } from '../api/saavnApi'
import { usePlayerStore } from '../store/usePlayerStore'
import { Ionicons } from '@expo/vector-icons'

export default function ArtistSongsScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { artistName } = route.params

  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const setQueue = usePlayerStore((s) => s.setQueue)
  const playSongById = usePlayerStore((s) => s.playSongById)

  useEffect(() => {
    loadSongs()
  }, [])

  const loadSongs = async () => {
    try {
      const data = await getArtistSongsPaginated(artistName)
      setSongs(data)
    } catch (e) {
      console.log('Artist songs error:', e)
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{artistName}</Text>

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
              <Image source={{ uri: imageUri }} style={styles.songImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.songTitle}>{item.name}</Text>
                <Text style={styles.songArtist}>
                  {item.primaryArtists}
                </Text>
              </View>
              <Ionicons name="play" size={20} color="#FF8C00" />
            </TouchableOpacity>
          )
        }}
      />
    </View>
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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  songRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 14,
  },
  songTitle: {
    color: '#fff',
    fontWeight: '600',
  },
  songArtist: {
    color: '#9CA3AF',
  },
})