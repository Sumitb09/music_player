import { Audio } from 'expo-av'

let sound: Audio.Sound | null = null
let statusCallback: any = null

export const playAudio = async (uri: string) => {
  if (sound) {
    await sound.unloadAsync()
    sound = null
  }

  await Audio.setAudioModeAsync({
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  })

  const { sound: newSound } = await Audio.Sound.createAsync(
    { uri },
    { shouldPlay: true },
    statusCallback
  )

  sound = newSound
}

export const pauseAudio = async () => {
  if (sound) await sound.pauseAsync()
}

export const resumeAudio = async () => {
  if (sound) await sound.playAsync()
}

export const seekAudio = async (position: number) => {
  if (sound) await sound.setPositionAsync(position)
}

export const setOnPlaybackStatusUpdate = (callback: any) => {
  statusCallback = callback
}