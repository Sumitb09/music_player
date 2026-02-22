import React from 'react'
import { View } from 'react-native'
import {
  NavigationContainer,
  DefaultTheme,
} from '@react-navigation/native'
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'

import HomeScreen from '../screens/HomeScreen'
import PlayerScreen from '../screens/PlayerScreen'
import QueueScreen from '../screens/QueueScreen'
import DownloadsScreen from '../screens/DownloadsScreen'
import SearchScreen from '../screens/SearchScreen'
import FavoritesScreen from '../screens/FavoritesScreen'
import PlaylistsScreen from '../screens/PlaylistsScreen'
import MiniPlayer from '../components/MiniPlayer'
import PlaylistDetailsScreen from '../screens/PlaylistDetailsScreen'
import CategorySongsScreen from '../screens/CategorySongsScreen' 
import ArtistSongsScreen from '../screens/ArtistSongsScreen'

/* ================= TYPES ================= */

type RootStackParamList = {
  MainTabs: undefined
  Player: undefined
  Queue: undefined
  Search: undefined
  PlaylistDetails: { playlistId: string }
  CategorySongs: { title: string; songs: any[] } 
}

type BottomTabParamList = {
  Home: undefined
  Favorites: undefined
  Playlists: undefined
  Downloads: undefined
}

/* ================= NAVIGATORS ================= */

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<BottomTabParamList>()

/* ================= TABS ================= */

function MainTabs() {
  const insets = useSafeAreaInsets()

  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: '#FF8C00',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color }) => {
          let iconName: any

          if (route.name === 'Home') iconName = 'home'
          else if (route.name === 'Favorites') iconName = 'heart-outline'
          else if (route.name === 'Playlists') iconName = 'list'
          else if (route.name === 'Downloads') iconName = 'download'

          return <Ionicons name={iconName} size={22} color={color} />
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Playlists" component={PlaylistsScreen} />
      <Tab.Screen name="Downloads" component={DownloadsScreen} />
    </Tab.Navigator>
  )
}

/* ================= ROOT ================= */

export default function RootNavigator() {
  const insets = useSafeAreaInsets()

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: '#0F172A',
        },
      }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ flex: 1 }}>
          <Stack.Navigator
            id="RootStack"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Player" component={PlayerScreen} />
            <Stack.Screen name="Queue" component={QueueScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="PlaylistDetails" component={PlaylistDetailsScreen}/>
            <Stack.Screen name="CategorySongs" component={CategorySongsScreen}/>
            <Stack.Screen name="ArtistSongs" component={ArtistSongsScreen}/>
            </Stack.Navigator>

          {/* Mini Player */}
          <View
            style={{
              position: 'absolute',
              bottom: 60 + insets.bottom,
              left: 0,
              right: 0,
            }}
          >
            <MiniPlayer />
          </View>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  )
}