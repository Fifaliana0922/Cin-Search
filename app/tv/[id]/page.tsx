'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Heart, Star, Calendar } from 'lucide-react'
import Header from '@/components/Header'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

interface TVDetail {
    id: number
    name: string
    overview: string
    poster_path: string | null
    backdrop_path: string | null
    vote_average: number
    first_air_date: string
    number_of_seasons?: number
    number_of_episodes?: number
    genres?: Array<{ id: number; name: string }>
    networks?: Array<{ name: string }>
    production_companies?: Array<{ name: string }>
}

export default function TVPage({ params }: { params: Promise<{ id: string }> }) {
    const [tvShow, setTVShow] = useState<TVDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false)
    const [showId, setShowId] = useState<string | null>(null)

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params
            setShowId(resolvedParams.id)
        }
        resolveParams()
    }, [params])

    useEffect(() => {
        if (!showId) return
        const saved = localStorage.getItem('favorites')
        if (saved) {
            const favorites = JSON.parse(saved)
            setIsFavorite(favorites.includes(parseInt(showId)))
        }
    }, [showId])

    useEffect(() => {
        if (!showId) return
        const fetchTVShow = async () => {
            if (!TMDB_API_KEY) return

            try {
                const response = await fetch(
                    `${TMDB_BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}&language=fr-FR`
                )
                if (!response.ok) {
                    throw new Error('TV show not found')
                }
                const data = await response.json()
                setTVShow(data)
            } catch (error) {
                console.error('Error fetching TV show:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchTVShow()
    }, [showId])

    const toggleFavorite = () => {
        if (!showId) return
        const saved = localStorage.getItem('favorites')
        const favorites = saved ? JSON.parse(saved) : []
        const showIdNum = parseInt(showId)

        if (isFavorite) {
            const index = favorites.indexOf(showIdNum)
            if (index > -1) favorites.splice(index, 1)
        } else {
            favorites.push(showIdNum)
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

    if (!tvShow) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <p className="text-xl text-muted-foreground">Série TV non trouvée</p>
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
                {tvShow.backdrop_path && (
                    <div className="relative h-96 w-full overflow-hidden">
                        <Image
                            src={`https://image.tmdb.org/t/p/w1280${tvShow.backdrop_path}`}
                            alt={tvShow.name}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/50 to-background" />
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

                    {/* TV Show Detail */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Poster */}
                        <div className="md:col-span-1">
                            <div className="relative rounded-2xl overflow-hidden bg-muted border border-primary/30 h-96 w-full shadow-2xl shadow-primary/20">
                                {tvShow.poster_path ? (
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                                        alt={tvShow.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-accent/10">
                                        Pas d&apos;image
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={toggleFavorite}
                                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-linear-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground transition-all font-bold group"
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
                                    {tvShow.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/20 border border-accent/50">
                                        <Star className="w-5 h-5 fill-accent text-accent" />
                                        <span className="font-black text-lg text-accent">{tvShow.vote_average.toFixed(1)}</span>
                                        <span className="text-muted-foreground">/10</span>
                                    </div>
                                    {tvShow.first_air_date && (
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/50 text-muted-foreground">
                                            <Calendar className="w-5 h-5" />
                                            <span className="font-semibold">{new Date(tvShow.first_air_date).getFullYear()}</span>
                                        </div>
                                    )}
                                    {tvShow.number_of_seasons && (
                                        <div className="px-4 py-2 rounded-lg bg-secondary/50 border border-secondary text-foreground font-semibold">
                                            {tvShow.number_of_seasons} saison{tvShow.number_of_seasons > 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Genres */}
                            {tvShow.genres && tvShow.genres.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-black text-muted-foreground mb-3 tracking-widest">
                                        GENRES
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {tvShow.genres.map((genre) => (
                                            <span
                                                key={genre.id}
                                                className="px-4 py-2 rounded-full bg-linear-to-r from-primary/20 to-accent/20 border border-primary/40 text-primary font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all"
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
                                    {tvShow.overview}
                                </p>
                            </div>

                            {/* Episodes & Seasons */}
                            {(tvShow.number_of_seasons || tvShow.number_of_episodes) && (
                                <div className="grid grid-cols-2 gap-4">
                                    {tvShow.number_of_seasons && (
                                        <div className="bg-linear-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-xl p-5">
                                            <p className="text-xs font-black text-muted-foreground mb-2 tracking-widest">Saisons</p>
                                            <p className="text-2xl font-black text-primary">
                                                {tvShow.number_of_seasons}
                                            </p>
                                        </div>
                                    )}
                                    {tvShow.number_of_episodes && (
                                        <div className="bg-linear-to-br from-accent/10 to-primary/10 border border-accent/30 rounded-xl p-5">
                                            <p className="text-xs font-black text-muted-foreground mb-2 tracking-widest">Épisodes</p>
                                            <p className="text-2xl font-black text-accent">
                                                {tvShow.number_of_episodes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Networks */}
                            {tvShow.networks && tvShow.networks.length > 0 && (
                                <div className="space-y-3 pt-4">
                                    <h3 className="text-xs font-black text-muted-foreground tracking-widest">
                                        RÉSEAUX
                                    </h3>
                                    <p className="text-foreground/80 font-medium">
                                        {tvShow.networks.map((n) => n.name).join(', ')}
                                    </p>
                                </div>
                            )}

                            {/* Production Companies */}
                            {tvShow.production_companies && tvShow.production_companies.length > 0 && (
                                <div className="space-y-3 pt-4">
                                    <h3 className="text-xs font-black text-muted-foreground tracking-widest">
                                        PRODUCTEURS
                                    </h3>
                                    <p className="text-foreground/80 font-medium">
                                        {tvShow.production_companies.map((c) => c.name).join(', ')}
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
