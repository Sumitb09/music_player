import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { Ionicons } from '@expo/vector-icons'
import { usePlayerStore } from '../store/usePlayerStore'

export default function QueueScreen() {
  const queue = usePlayerStore((s) => s.queue)
  const currentIndex = usePlayerStore((s) => s.currentIndex)
  const playByIndex = usePlayerStore((s) => s.playByIndex)
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue)
  const reorderQueue = usePlayerStore((s) => s.reorderQueue)

  if (!queue.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No songs in queue</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Up Next</Text>

      <DraggableFlatList
        data={queue}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onDragEnd={({ from, to }) => {
          reorderQueue(from, to)
        }}
        renderItem={({ item, index, drag, isActive }) => (
          <View
            style={[
              styles.item,
              index === currentIndex && styles.activeItem,
              isActive && styles.draggingItem,
            ]}
          >
            {/* Drag Handle */}
            <TouchableOpacity
              onLongPress={drag}
              style={styles.dragHandle}
            >
              <Ionicons
                name="menu"
                size={20}
                color="#888"
              />
            </TouchableOpacity>

            {/* Song Info */}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => playByIndex(index)}
            >
              <Text
                style={[
                  styles.title,
                  index === currentIndex && styles.activeText,
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <Text style={styles.artist} numberOfLines={1}>
                {item.primaryArtists}
              </Text>
            </TouchableOpacity>

            {/* Remove */}
            <TouchableOpacity
              onPress={() => removeFromQueue(index)}
            >
              <Ionicons
                name="close-circle"
                size={22}
                color="#FF4D4D"
              />
            </TouchableOpacity>
          </View>
        )}
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
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#1E293B',
  },
  activeItem: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  draggingItem: {
    backgroundColor: '#1A2238',
  },
  dragHandle: {
    marginRight: 10,
  },
  title: {
    fontWeight: '600',
    color: '#fff',
  },
  activeText: {
    color: '#FF8C00',
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
  emptyText: {
    color: '#fff',
  },
})