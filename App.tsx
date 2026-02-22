import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import RootNavigator from './src/navigation/RootNavigator'
import { usePlayerStore } from './src/store/usePlayerStore'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function App() {
  const hydrate = usePlayerStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [])
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <StatusBar style="light" translucent={false} />
      <RootNavigator />
    </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}