'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import MovieGrid from '@/components/MovieGrid'
import { Movie } from '@/types'
import { ArrowLeft } from 'lucide-react'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export default function FavoritesPage() {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    const favoriteIds = saved ? JSON.parse(saved) : []
    setFavorites(new Set(favoriteIds))
    setLoading(false)
  }, [])

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      if (favorites.size === 0) {
        setFavoriteMovies([])
        return
      }

      if (!TMDB_API_KEY) return

      setLoading(true)
      try {
        // Essayer d'abord les films, puis les séries
        const fetchItemWithFallback = async (id: number) => {
          try {
            // Essayer comme film d'abord
            const movieRes = await fetch(
              `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=fr-FR`
            )
            const movieData = await movieRes.json()

            // Si c'est un film valide, retourner les données du film
            if (movieData && !movieData.status_code && movieData.id) {
              return {
                id: movieData.id,
                title: movieData.title,
                overview: movieData.overview,
                poster_path: movieData.poster_path,
                backdrop_path: movieData.backdrop_path,
                vote_average: movieData.vote_average,
                release_date: movieData.release_date,
                genre_ids: movieData.genres?.map((g: any) => g.id) || [],
                type: 'movie' as const,
              }
            }

            // Sinon, essayer comme série TV
            const tvRes = await fetch(
              `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=fr-FR`
            )
            const tvData = await tvRes.json()

            if (tvData && !tvData.status_code && tvData.id) {
              return {
                id: tvData.id,
                title: tvData.name,
                overview: tvData.overview,
                poster_path: tvData.poster_path,
                backdrop_path: tvData.backdrop_path,
                vote_average: tvData.vote_average,
                release_date: tvData.first_air_date,
                genre_ids: tvData.genres?.map((g: any) => g.id) || [],
                type: 'tv' as const,
              }
            }

            return null
          } catch (error) {
            console.error(`Error fetching item ${id}:`, error)
            return null
          }
        }

        const favoritePromises = Array.from(favorites).map((id) =>
          fetchItemWithFallback(id)
        )

        const results = await Promise.all(favoritePromises)
        const formattedMovies = results.filter((item) => item !== null)

        setFavoriteMovies(formattedMovies)
      } catch (error) {
        console.error('Error fetching favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavoriteMovies()
  }, [favorites])

  const toggleFavorite = (movieId: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(movieId)) {
      newFavorites.delete(movieId)
    } else {
      newFavorites.add(movieId)
    }
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 px-4 py-2.5 rounded-lg bg-card/80 backdrop-blur border border-primary/30 hover:bg-primary/20 hover:border-primary/60 transition-all text-foreground hover:text-primary group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Retour
        </Link>

        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-5xl font-black text-foreground">
              Mes Favoris
            </h1>
            <p className="text-lg text-muted-foreground/80 font-medium">
              {favoriteMovies.length} film{favoriteMovies.length !== 1 ? 's' : ''} en favoris
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-muted-foreground">Chargement en cours...</p>
              </div>
            </div>
          )}

          {!loading && favoriteMovies.length === 0 && (
            <div className="text-center py-16 space-y-6">
              <div className="text-6xl opacity-30">❤️</div>
              <p className="text-2xl font-bold text-foreground">Aucun favoris pour le moment</p>
              <p className="text-muted-foreground/70">Commencez à ajouter vos films préférés!</p>
              <Link
                href="/"
                className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground transition-all font-bold"
              >
                Découvrir des films
              </Link>
            </div>
          )}

          {!loading && favoriteMovies.length > 0 && (
            <MovieGrid
              movies={favoriteMovies}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </div>
      </main>
    </div>
  )
}
