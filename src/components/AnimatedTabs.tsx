import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width

export default function AnimatedTabs({
  tabs,
  activeIndex,
  onTabPress,
}: any) {
  const translateX = useRef(new Animated.Value(0)).current

  const containerWidth = SCREEN_WIDTH - 40 // because HomeScreen has paddingHorizontal:20
  const tabWidth = containerWidth / tabs.length

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: true,
    }).start()
  }, [activeIndex])

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Sliding Indicator */}
        <Animated.View
          style={[
            styles.slider,
            {
              width: tabWidth,
              transform: [{ translateX }],
            },
          ]}
        />

        {tabs.map((tab: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, { width: tabWidth }]}
            onPress={() => onTabPress(index)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.text,
                activeIndex === index && styles.activeText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 30,
    overflow: 'hidden',
  },
  slider: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#FF8C00',
    borderRadius: 30,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  text: {
    color: '#555',
    fontWeight: '500',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
})