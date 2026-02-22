import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import AnimatedTabs from '../components/AnimatedTabs'
import { getHomeData } from '../api/saavnApi'
import { usePlayerStore } from '../store/usePlayerStore'
import { resolveImage } from '../utils/imageHelper'

export default function HomeScreen() {
  const navigation = useNavigation<any>()

  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)

  const [playlists, setPlaylists] = useState<any[]>([])
  const [songs, setSongs] = useState<any[]>([])
  const [artists, setArtists] = useState<any[]>([])
  const [albums, setAlbums] = useState<any[]>([])

  const recentlyPlayed = usePlayerStore((s) => s.recentlyPlayed)

  const tabs = ['Suggested', 'Songs', 'Artists', 'Albums']

  useEffect(() => {
    loadHome()
  }, [])

  const loadHome = async () => {
    try {
      const data = await getHomeData()
      setPlaylists(data.playlists || [])
      setSongs(data.songs || [])
      setArtists(data.artists || [])
      setAlbums(data.albums || [])
    } catch (e) {
      console.log('Home error:', e)
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
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="musical-notes" size={22} color="#FF8C00" />
          <Text style={styles.logo}>  BajaDo</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <AnimatedTabs
        tabs={tabs}
        activeIndex={activeTab}
        onTabPress={setActiveTab}
      />

      {/* ================= SUGGESTED ================= */}
      {activeTab === 0 && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Section title="Recently Played" data={recentlyPlayed} />
          <Section title="Made For You" data={playlists} />
          <Section title="Artists" data={artists} />
        </ScrollView>
      )}

      {/* ================= SONGS ================= */}
      {activeTab === 1 && (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <SongRow item={item} index={index} data={songs} />
          )}
        />
      )}

      {/* ================= ARTISTS TAB ================= */}
      {activeTab === 2 && (
        <FlatList
          numColumns={2}
          data={artists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ArtistGridItem item={item} />
          )}
        />
      )}

      {/* ================= ALBUMS TAB ================= */}
      {activeTab === 3 && (
        <FlatList
          numColumns={2}
          data={albums}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GridItem item={item} />
          )}
        />
      )}
    </SafeAreaView>
  )
}

/* ================= SECTION ================= */

const Section = ({ title, data }: any) => {
  const navigation = useNavigation<any>()
  const setQueue = usePlayerStore((s) => s.setQueue)
  const playSongById = usePlayerStore((s) => s.playSongById)

  const handlePress = async (item: any, index: number) => {
    // Recently Played → play directly
    if (title === 'Recently Played') {
      if (!item.id) return
      setQueue(data, index)
      await playSongById(item.id, index)
      navigation.navigate('Player')
      return
    }

    // Playlists
    if (title === 'Made For You') {
      navigation.navigate('PlaylistDetails', {
        playlistId: item.id,
      })
      return
    }

    // Artists
    if (title === 'Artists') {
      navigation.navigate('ArtistSongs', {
        artistName: item.name || item.title,
      })
      return
    }
  }

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item, index }) => {
          const imageUri = resolveImage(item)

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePress(item, index)}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.cardImage} />
              ) : (
                <View style={styles.cardImage} />
              )}

              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title || item.name}
              </Text>
            </TouchableOpacity>
          )
        }}
      />
    </>
  )
}

/* ================= SONG ROW ================= */

const SongRow = ({ item, index, data }: any) => {
  const navigation = useNavigation<any>()
  const setQueue = usePlayerStore((s) => s.setQueue)
  const playSongById = usePlayerStore((s) => s.playSongById)
  const imageUri = resolveImage(item)

  return (
    <TouchableOpacity
      style={styles.songRow}
      onPress={async () => {
        setQueue(data, index)
        await playSongById(item.id, index)
        navigation.navigate('Player')
      }}
    >
      <Image source={{ uri: imageUri }} style={styles.songImage} />

      <View style={{ flex: 1 }}>
        <Text style={styles.songTitle}>{item.name}</Text>
        <Text style={styles.songArtist}>{item.primaryArtists}</Text>
      </View>

      <Ionicons name="play" size={20} color="#FF8C00" />
    </TouchableOpacity>
  )
}

/* ================= ARTIST GRID ITEM ================= */

const ArtistGridItem = ({ item }: any) => {
  const navigation = useNavigation<any>()
  const imageUri = resolveImage(item)

  return (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() =>
        navigation.navigate('ArtistSongs', {
          artistName: item.name || item.title,
        })
      }
    >
      <Image source={{ uri: imageUri }} style={styles.gridImage} />
      <Text style={styles.gridText} numberOfLines={1}>
        {item.name || item.title}
      </Text>
    </TouchableOpacity>
  )
}

/* ================= GRID ITEM ================= */

const GridItem = ({ item }: any) => {
  const imageUri = resolveImage(item)

  return (
    <View style={styles.gridItem}>
      <Image source={{ uri: imageUri }} style={styles.gridImage} />
      <Text style={styles.gridText} numberOfLines={1}>
        {item.name || item.title}
      </Text>
    </View>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  sectionHeader: {
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    width: 140,
    marginRight: 16,
  },
  cardImage: {
    width: 140,
    height: 140,
    borderRadius: 20,
    marginBottom: 8,
    backgroundColor: '#1E293B',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
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
  gridItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 25,
  },
  gridImage: {
    width: 110,
    height: 110,
    borderRadius: 18,
    marginBottom: 8,
  },
  gridText: {
    color: '#fff',
  },
})