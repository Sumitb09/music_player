import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { usePlayerStore } from '../store/usePlayerStore'
import { resolveImage } from '../utils/imageHelper'
import { useNavigation } from '@react-navigation/native'

export default function DownloadsScreen() {
  const navigation = useNavigation<any>()

  const downloaded = usePlayerStore((s) => s.downloaded)
  const queue = usePlayerStore((s) => s.queue)
  const setQueue = usePlayerStore((s) => s.setQueue)
  const playSongById = usePlayerStore((s) => s.playSongById)
  const removeDownloaded = usePlayerStore((s) => s.removeDownloaded)

  const songs = queue.filter((song) => downloaded[song.id])

  if (!songs.length) {
    return (
      <View style={styles.empty}>
        <Text style={{ color: '#fff' }}>No downloaded songs</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const imageUri = resolveImage(item)

          return (
            <View style={styles.row}>
              <TouchableOpacity
                style={{ flexDirection: 'row', flex: 1 }}
                onPress={async () => {
                  setQueue(songs, index)
                  await playSongById(item.id, index)
                  navigation.navigate('Player')
                }}
              >
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                  <View style={styles.image} />
                )}

                <View style={{ justifyContent: 'center' }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.artist}>
                    {item.primaryArtists}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* DELETE BUTTON */}
              <TouchableOpacity
                onPress={() => removeDownloaded(item.id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color="#FF4D4D"
                />
              </TouchableOpacity>
            </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: '#1E293B',
  },
  title: {
    color: '#fff',
    fontWeight: '600',
  },
  artist: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
})