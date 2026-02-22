import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { usePlayerStore } from '../store/usePlayerStore'
import { resolveImage } from '../utils/imageHelper'

export default function CategorySongsScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()

  const { title, songs } = route.params

  const setQueue = usePlayerStore((s) => s.setQueue)
  const playSongById = usePlayerStore((s) => s.playSongById)

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{title}</Text>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const imageUri = resolveImage(item)

          return (
            <TouchableOpacity
              style={styles.row}
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

              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.artist}>{item.primaryArtists}</Text>
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
  header: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
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
  },
})