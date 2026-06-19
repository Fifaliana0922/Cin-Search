export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date: string
  genre_ids: number[]
  type?: 'movie' | 'tv'
}

export interface Genre {
  id: number
  name: string
}
