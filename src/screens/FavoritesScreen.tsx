import React from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { usePlayerStore } from '../store/usePlayerStore'
import { resolveImage } from '../utils/imageHelper'
import { Ionicons } from '@expo/vector-icons'
import he from 'he'

export default function FavoritesScreen() {
  const favorites = usePlayerStore((s) => s.favorites)
  const setQueue = usePlayerStore((s) => s.setQueue)
  const playSongById = usePlayerStore((s) => s.playSongById)

  if (!favorites.length) {
    return (
      <View style={styles.empty}>
        <Text style={{ color: '#fff' }}>
          No Favorites Yet
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const imageUri = resolveImage(item)

          return (
            <TouchableOpacity
              style={styles.row}
              onPress={async () => {
                setQueue(favorites, index)
                await playSongById(item.id, index)
              }}
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.image} />
              )}

              <View style={{ flex: 1 }}>
                <Text style={styles.title}>
                  {he.decode(item.name)}
                </Text>
                <Text style={styles.artist}>
                  {item.primaryArtists}
                </Text>
              </View>

              <Ionicons
                name="play"
                size={20}
                color="#FF8C00"
              />
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

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 14,
    backgroundColor: '#1E293B',
  },

  title: {
    color: '#fff',
    fontWeight: '600',
  },

  artist: {
    color: '#9CA3AF',
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
})