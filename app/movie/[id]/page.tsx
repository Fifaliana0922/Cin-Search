'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Heart, Star, Calendar } from 'lucide-react'
import Header from '@/components/Header'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

interface MovieDetail {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date: string
  runtime?: number
  genres?: Array<{ id: number; name: string }>
  budget?: number
  revenue?: number
  production_companies?: Array<{ name: string }>
}

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [movieId, setMovieId] = useState<string | null>(null)

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setMovieId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (!movieId) return
    const saved = localStorage.getItem('favorites')
    if (saved) {
      const favorites = JSON.parse(saved)
      setIsFavorite(favorites.includes(parseInt(movieId)))
    }
  }, [movieId])

  useEffect(() => {
    if (!movieId) return
    const fetchMovie = async () => {
      if (!TMDB_API_KEY) return

      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=fr-FR`
        )
        if(!response.ok){
          throw new Error("Not movie found")
        }
        const data = await response.json()
        setMovie(data)
      } catch (error) {
        console.error('Error fetching movie:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [movieId])

  const toggleFavorite = () => {
    if (!movieId) return
    const saved = localStorage.getItem('favorites')
    const favorites = saved ? JSON.parse(saved) : []
    const movieIdNum = parseInt(movieId)

    if (isFavorite) {
      const index = favorites.indexOf(movieIdNum)
      if (index > -1) favorites.splice(index, 1)
    } else {
      favorites.push(movieIdNum)
    }

    localStorage.setItem('favorites', JSON.stringify(favorites))
    setIsFavorite(!isFavorite)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-muted-foreground">Chargement en cours...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-xl text-muted-foreground">Film non trouvé</p>
            <Link href="/" className="text-primary hover:underline">
              Retour à l&apos;accueil
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full">
        {/* Backdrop Hero */}
        {movie.backdrop_path && (
          <div className="relative h-96 w-full overflow-hidden">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          </div>
        )}

        <div className="container mx-auto px-4 py-8 relative -mt-32 z-10">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 px-4 py-2.5 rounded-lg bg-card/80 backdrop-blur border border-primary/30 hover:bg-primary/20 hover:border-primary/60 transition-all text-foreground hover:text-primary group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Retour
          </Link>

          {/* Movie Detail */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="md:col-span-1">
              <div className="relative rounded-2xl overflow-hidden bg-muted border border-primary/30 h-96 w-full shadow-2xl shadow-primary/20">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                    Pas d&apos;image
                  </div>
                )}
              </div>
              <button
                onClick={toggleFavorite}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground transition-all font-bold group"
              >
                <Heart
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill={isFavorite ? 'currentColor' : 'none'}
                />
                {isFavorite ? 'En favoris' : 'Ajouter aux favoris'}
              </button>
            </div>

            {/* Details */}
            <div className="md:col-span-2 space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-black text-foreground text-balance">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/20 border border-accent/50">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="font-black text-lg text-accent">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-muted-foreground">/10</span>
                  </div>
                  {movie.release_date && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/50 text-muted-foreground">
                      <Calendar className="w-5 h-5" />
                      <span className="font-semibold">{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                  )}
                  {movie.runtime && (
                    <div className="px-4 py-2 rounded-lg bg-secondary/50 border border-secondary text-foreground font-semibold">
                      {movie.runtime} min
                    </div>
                  )}
                </div>
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div>
                  <h3 className="text-xs font-black text-muted-foreground mb-3 tracking-widest">
                    GENRES
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/40 text-primary font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-muted-foreground tracking-widest">
                  SYNOPSIS
                </h3>
                <p className="text-foreground/90 leading-relaxed text-lg">
                  {movie.overview}
                </p>
              </div>

              {/* Budget & Revenue */}
              {(movie.budget || movie.revenue) && (
                <div className="grid grid-cols-2 gap-4">
                  {movie.budget && movie.budget > 0 && (
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-xl p-5">
                      <p className="text-xs font-black text-muted-foreground mb-2 tracking-widest">Budget</p>
                      <p className="text-2xl font-black text-primary">
                        ${(movie.budget / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  )}
                  {movie.revenue && movie.revenue > 0 && (
                    <div className="bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/30 rounded-xl p-5">
                      <p className="text-xs font-black text-muted-foreground mb-2 tracking-widest">Revenus</p>
                      <p className="text-2xl font-black text-accent">
                        ${(movie.revenue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Production */}
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="text-xs font-black text-muted-foreground tracking-widest">
                    PRODUCTEURS
                  </h3>
                  <p className="text-foreground/80 font-medium">
                    {movie.production_companies.map((c) => c.name).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
