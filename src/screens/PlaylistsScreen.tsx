import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native'
import { usePlayerStore } from '../store/usePlayerStore'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function PlaylistsScreen() {
  const navigation = useNavigation<any>()

  const playlists = usePlayerStore((s) => s.playlists)
  const createPlaylist = usePlayerStore((s) => s.createPlaylist)
  const deletePlaylist = usePlayerStore((s) => s.deletePlaylist)

  const [name, setName] = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    createPlaylist(name.trim())
    setName('')
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Your Playlists</Text>

      {/* Create Playlist */}
      <View style={styles.createRow}>
        <TextInput
          placeholder="New Playlist Name"
          placeholderTextColor="#888"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity onPress={handleCreate}>
          <Ionicons
            name="add-circle"
            size={32}
            color="#FF8C00"
          />
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      {playlists.length === 0 && (
        <View style={styles.empty}>
          <Ionicons
            name="musical-notes-outline"
            size={50}
            color="#555"
          />
          <Text style={styles.emptyText}>
            No playlists yet
          </Text>
        </View>
      )}

      {/* Playlist List */}
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              navigation.navigate('PlaylistDetails', {
                playlistId: item.id,
              })
            }
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {item.name}
              </Text>
              <Text style={styles.count}>
                {item.songs.length} songs
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                deletePlaylist(item.id)
              }
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color="#ff4d4d"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
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

  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },

  createRow: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'center',
  },

  input: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    color: '#fff',
    marginRight: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
  },

  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  count: {
    color: '#9CA3AF',
    marginTop: 4,
  },

  empty: {
    alignItems: 'center',
    marginTop: 60,
  },

  emptyText: {
    color: '#666',
    marginTop: 10,
  },
})