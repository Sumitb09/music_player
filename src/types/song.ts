export interface Song {
    id: string
    name: string
    primaryArtists: string
    image: { link: string }[]
    downloadUrl: { link: string }[]
    duration: string
  }