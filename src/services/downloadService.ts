import * as FileSystem from 'expo-file-system/legacy'

const DOWNLOAD_DIR = FileSystem.documentDirectory + 'downloads/'

export const ensureDownloadDir = async () => {
  const dirInfo = await FileSystem.getInfoAsync(DOWNLOAD_DIR)

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(DOWNLOAD_DIR, {
      intermediates: true,
    })
  }
}

export const downloadSong = async (
  url: string,
  id: string
) => {
  try {
    await ensureDownloadDir()

    const fileUri = DOWNLOAD_DIR + `${id}.mp3`

    const fileInfo = await FileSystem.getInfoAsync(fileUri)

    if (fileInfo.exists) {
      return fileUri
    }

    const { uri } =
      await FileSystem.downloadAsync(
        url.replace('http://', 'https://'),
        fileUri
      )

    console.log('Downloaded to:', uri)

    return uri
  } catch (error) {
    console.log('Download error:', error)
    return null
  }
}