'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star } from 'lucide-react'
import { Movie } from '@/types'

interface MovieGridProps {
  movies: Movie[]
  favorites: Set<number>
  onToggleFavorite: (movieId: number) => void
  contentType?: 'movie' | 'tv'
}

export default function MovieGrid({
  movies,
  favorites,
  onToggleFavorite,
  contentType = 'movie',
}: MovieGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-card via-card to-secondary border border-primary/20 backdrop-blur-xl hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Image Container */}
          <div className="relative h-72 w-full overflow-hidden bg-muted">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover group-hover:scale-125 transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/10 to-accent/10">
                <span className="text-center">Pas d&apos;image disponible</span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Floating Rating Badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent/90 backdrop-blur text-accent-foreground text-sm font-bold shadow-lg flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              {movie.vote_average.toFixed(1)}
            </div>

            {/* Heart Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite(movie.id)
              }}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-background/70 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:scale-110 hover:shadow-primary/50"
              aria-label={favorites.has(movie.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className="w-5 h-5"
                fill={favorites.has(movie.id) ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          {/* Content */}
          <Link href={`/${movie.type === 'tv' ? 'tv' : 'movie'}/${movie.id}`} className="block h-full">
            <div className="p-5 space-y-3 cursor-pointer h-full flex flex-col">
              <div className="flex-1">
                <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300 text-lg">
                  {movie.title}
                </h3>
              </div>

              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground/80">
                  {movie.release_date?.split('-')[0] || 'N/A'}
                </span>
                <span className="px-2 py-1 rounded-md bg-primary/15 text-primary">
                  {movie.genre_ids?.length > 0 ? `${movie.genre_ids.length} genres` : 'Genres'}
                </span>
              </div>

              <p className="text-xs text-muted-foreground/70 line-clamp-2">
                {movie.overview || 'Pas de description disponible'}
              </p>

              {/* CTA Button */}
              <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold text-center">
                  Voir les détails
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
