import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { searchSongsPaginated } from '../api/saavnApi'
import { usePlayerStore } from '../store/usePlayerStore'
import he from 'he'
import { resolveImage } from '../utils/imageHelper'

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const playSongById = usePlayerStore((s) => s.playSongById)
  const setQueue = usePlayerStore((s) => s.setQueue)

  /* ================= SEARCH ================= */

  const handleSearch = async (text: string) => {
    setQuery(text)

    if (text.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    setPage(1)
    setHasMore(true)

    const data = await searchSongsPaginated(text, 1)

    setResults(data)
    setHasMore(data.length === 20)
    setLoading(false)
  }

  /* ================= LOAD MORE ================= */

  const loadMore = async () => {
    if (!hasMore || loadingMore || loading) return

    setLoadingMore(true)

    const nextPage = page + 1
    const data = await searchSongsPaginated(query, nextPage)

    if (data.length > 0) {
      setResults((prev) => [...prev, ...data])
      setPage(nextPage)
    }

    if (data.length < 20) {
      setHasMore(false)
    }

    setLoadingMore(false)
  }

  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <TextInput
          placeholder="Search Songs"
          placeholderTextColor="#888"
          style={styles.input}
          value={query}
          onChangeText={handleSearch}
        />

        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery('')
              setResults([])
            }}
          >
            <Ionicons name="close" size={20} color="#FF8C00" />
          </TouchableOpacity>
        )}
      </View>

      {/* INITIAL LOADING */}
      {loading && (
        <ActivityIndicator size="large" color="#FF8C00" />
      )}

      {/* RESULTS */}
      <FlatList
        data={results}
        keyExtractor={(item, index) =>
          item.id?.toString() || index.toString()
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color="#FF8C00"
              style={{ marginVertical: 20 }}
            />
          ) : null
        }
        renderItem={({ item, index }) => {
          const imageUri = resolveImage(item)

          return (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={async () => {
                setQueue(results, index)
                await playSongById(item.id, index)
                navigation.navigate('Player')
              }}
            >
              <Image
                source={{ uri: imageUri }}
                style={styles.resultImage}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.resultTitle}>
                  {he.decode(item.name || '')}
                </Text>

                <Text style={styles.resultArtist}>
                  {item.primaryArtists || ''}
                </Text>
              </View>

              <View style={styles.playButton}>
                <Ionicons
                  name="play"
                  size={14}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    marginLeft: 10,
  },

  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 14,
  },

  resultTitle: {
    color: '#fff',
    fontWeight: '600',
  },

  resultArtist: {
    color: '#9CA3AF',
  },

  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
})