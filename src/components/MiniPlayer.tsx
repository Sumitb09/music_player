import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { usePlayerStore } from '../store/usePlayerStore'
import { Ionicons } from '@expo/vector-icons'
import { resolveImage } from '../utils/imageHelper'

export default function MiniPlayer() {
  const navigation = useNavigation<any>()
  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const pause = usePlayerStore((s) => s.pause)
  const resume = usePlayerStore((s) => s.resume)

  if (!currentSong) return null

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Player')}
      activeOpacity={0.9}
    >
      {/* Album Art */}
      <Image
        source={{ uri: resolveImage(currentSong) }}
        style={styles.image}
      />

      {/* Song Name */}
      <Text style={styles.text} numberOfLines={1}>
        {currentSong.name}
      </Text>

      {/* Play / Pause */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation()
          isPlaying ? pause() : resume()
        }}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 65,
    backgroundColor: '#181818',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 8,
    marginRight: 12,
  },
  text: {
    flex: 1,
    color: '#fff',
    fontWeight: '500',
  },
})