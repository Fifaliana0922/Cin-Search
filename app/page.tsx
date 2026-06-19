'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import MovieGrid from '@/components/MovieGrid'
import FilterPanel from '@/components/FilterPanel'
import { Movie } from '@/types'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export default function Page() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [contentType, setContentType] = useState<'movie' | 'tv'>('movie')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    genre: 'all',
    year: 'all',
    rating: 'all',
  })
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)))
    }
  }, [])

  const fetchMovies = async (
    query: string = '',
    type: string = 'movie',
    genreId: string = 'all',
    year: string = 'all',
    rating: string = 'all',
    page: number = 1
  ) => {
    if (!TMDB_API_KEY) return

    setLoading(true)
    try {
      let endpoint = ''

      if (query) {
        // Mode recherche - ignorer les filtres
        endpoint = `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=fr-FR&page=${page}`
      } else {
        // Mode découverte avec filtres
        let params = new URLSearchParams({
          api_key: TMDB_API_KEY,
          language: 'fr-FR',
          sort_by: 'popularity.desc',
          page: page.toString(),
        })

        // Ajouter le filtre de genre
        if (genreId !== 'all') {
          params.append('with_genres', genreId)
        }

        // Ajouter le filtre d'année
        if (year !== 'all') {
          params.append('primary_release_year', year)
        }

        // Ajouter le filtre de notation
        if (rating !== 'all') {
          params.append('vote_average.gte', rating)
        }

        endpoint = `${TMDB_BASE_URL}/discover/${type}?${params.toString()}`
      }

      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error("Erreur lors de l'ouverture de la page!")
      }
      const data = await response.json()

      const formattedMovies = (data.results || []).map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        overview: item.overview,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average,
        release_date: item.release_date || item.first_air_date,
        genre_ids: item.genre_ids || [],
        type: type as 'movie' | 'tv',
      }))

      setMovies(formattedMovies)
      setTotalPages(data.total_pages || 1)
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Error fetching movies:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    if (query.trim()) {
      fetchMovies(query, contentType, 'all', 'all', 'all', 1)
    } else {
      fetchMovies('', contentType, filters.genre, filters.year, filters.rating, 1)
    }
  }

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    if (!searchQuery) {
      setCurrentPage(1)
      fetchMovies('', contentType, filters.genre, filters.year, filters.rating, 1)
    }
  }, [filters])

  // Changer de type de contenu
  const handleContentTypeChange = (type: 'movie' | 'tv') => {
    setContentType(type)
    setSearchQuery('')
    setCurrentPage(1)
    setFilters({
      genre: 'all',
      year: 'all',
      rating: 'all',
    })
    fetchMovies('', type, 'all', 'all', 'all', 1)
  }

  const handlePageChange = (newPage: number) => {
    fetchMovies(searchQuery, contentType, filters.genre, filters.year, filters.rating, newPage)
  }

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
        <div className="space-y-8">
          {/* Hero Search Section */}
          <div className="relative py-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 blur-3xl opacity-40 -z-10" />
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-balance">
                  Découvrez vos Films et Séries
                </h1>
                <p className="text-lg text-muted-foreground text-balance">
                  Explorez des millions de titres dans une base de données centralisée
                </p>
              </div>

              {/* Content Type Tabs */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleContentTypeChange('movie')}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                    contentType === 'movie'
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/50'
                      : 'bg-card/50 border border-border/50 text-foreground hover:bg-card hover:border-primary/30'
                  }`}
                >
                  Films
                </button>
                <button
                  onClick={() => handleContentTypeChange('tv')}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                    contentType === 'tv'
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/50'
                      : 'bg-card/50 border border-border/50 text-foreground hover:bg-card hover:border-primary/30'
                  }`}
                >
                  Séries TV
                </button>
              </div>

              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <FilterPanel filters={filters} onFilterChange={setFilters} />
            </aside>

            {/* Movies Grid */}
            <div className="flex-1">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-muted-foreground">Chargement en cours...</p>
                  </div>
                </div>
              )}
              {!loading && movies.length === 0 && (
                <div className="text-center py-12 space-y-4">
                  <p className="text-xl text-muted-foreground">
                    Aucun {contentType === 'tv' ? 'série' : 'film'} trouvé
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Essayez une autre recherche ou modifiez vos filtres
                  </p>
                </div>
              )}
              {!loading && movies.length > 0 && (
                <div className="space-y-8">
                  <MovieGrid
                    movies={movies}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    contentType={contentType}
                  />

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-center gap-2 py-8 flex-wrap">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-card/50 border border-primary/30 text-foreground hover:bg-primary/20 hover:border-primary/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ← Précédent
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum: number
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/50'
                                : 'bg-card/50 border border-border/50 text-foreground hover:bg-card hover:border-primary/30'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg bg-card/50 border border-primary/30 text-foreground hover:bg-primary/20 hover:border-primary/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Suivant →
                    </button>
                  </div>

                  {/* Page Info */}
                  <div className="text-center text-sm text-muted-foreground">
                    Page {currentPage} sur {totalPages}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
