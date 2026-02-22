/* ================= BASE URL ================= */

const BASE_URL = 'https://saavn.sumit.co/api'

/* ================= GENERIC FETCH ================= */

const safeFetch = async (url: string) => {
  try {
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error('Network response not ok')
    }

    const json = await res.json()
    return json?.data
  } catch (error) {
    console.log('API Error:', error)
    return null
  }
}

/* ===================================================== */
/* ================= PAGINATED SEARCH ================== */
/* ===================================================== */

/* 🎵 SONGS (Infinite Scroll Ready) */
export const searchSongsPaginated = async (
  query: string,
  page: number = 1,
  limit: number = 20
) => {
  const data = await safeFetch(
    `${BASE_URL}/search/songs?query=${encodeURIComponent(
      query
    )}&page=${page}&limit=${limit}`
  )

  return data?.results || []
}

/* 👤 ARTISTS (Infinite Scroll Ready) */
export const searchArtistsPaginated = async (
  query: string,
  page: number = 1,
  limit: number = 20
) => {
  const data = await safeFetch(
    `${BASE_URL}/search/artists?query=${encodeURIComponent(
      query
    )}&page=${page}&limit=${limit}`
  )

  return data?.results || []
}

/* 💿 ALBUMS (Infinite Scroll Ready) */
export const searchAlbumsPaginated = async (
  query: string,
  page: number = 1,
  limit: number = 20
) => {
  const data = await safeFetch(
    `${BASE_URL}/search/albums?query=${encodeURIComponent(
      query
    )}&page=${page}&limit=${limit}`
  )

  return data?.results || []
}

/* ===================================================== */
/* ================= SONG DETAILS ====================== */
/* ===================================================== */

export const getSongDetails = async (id: string) => {
  const data = await safeFetch(
    `${BASE_URL}/songs/${id}`
  )

  return data?.[0] || null
}

/* ===================================================== */
/* ================= HOME DATA ========================= */
/* ===================================================== */

export const getHomeData = async () => {
  const data = await safeFetch(
    `${BASE_URL}/search?query=bollywood`
  )

  if (!data)
    return {
      playlists: [],
      songs: [],
      artists: [],
      albums: [],
    }

  return {
    playlists: data.playlists?.results || [],
    songs: data.songs?.results || [],
    artists: data.artists?.results || [],
    albums: data.albums?.results || [],
  }
}

/* ===================================================== */
/* ================= PLAYLIST DETAILS ================== */
/* ===================================================== */

export const getPlaylistDetails = async (id: string) => {
  const playlist = await safeFetch(
    `${BASE_URL}/playlists?id=${id}`
  )

  if (!playlist) return null

  const songsData = await safeFetch(
    `${BASE_URL}/search/songs?query=${encodeURIComponent(
      playlist.name
    )}&limit=50`
  )

  return {
    ...playlist,
    songs: songsData?.results || [],
  }
}

/* ===================================================== */
/* ================= ARTIST SONGS ====================== */
/* ===================================================== */

export const getArtistSongsPaginated = async (
  artistName: string,
  page: number = 1,
  limit: number = 20
) => {
  const data = await safeFetch(
    `${BASE_URL}/search/songs?query=${encodeURIComponent(
      artistName
    )}&page=${page}&limit=${limit}`
  )

  return data?.results || []
}