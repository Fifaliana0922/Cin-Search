'use client'

import { ChevronDown } from 'lucide-react'

interface FilterPanelProps {
  filters: {
    genre: string
    year: string
    rating: string
  }
  onFilterChange: (filters: any) => void
}

export default function FilterPanel({
  filters,
  onFilterChange,
}: FilterPanelProps) {
  const genres = [
    { id: 'all', name: 'Tous les genres' },
    { id: '28', name: 'Action' },
    { id: '12', name: 'Aventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comédie' },
    { id: '80', name: 'Criminel' },
    { id: '99', name: 'Documentaire' },
    { id: '18', name: 'Drame' },
    { id: '10751', name: 'Famille' },
    { id: '14', name: 'Fantastique' },
    { id: '27', name: 'Horreur' },
    { id: '36', name: 'Historique' },
    { id: '10402', name: 'Musique' },
    { id: '9648', name: 'Mystère' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Science-Fiction' },
    { id: '53', name: 'Thriller' },
  ]

  const years = ['all', ...Array.from({ length: 30 }, (_, i) => (2024 - i).toString())]

  const ratings = [
    { value: 'all', label: 'Toutes les notes' },
    { value: '9', label: '9+ ⭐' },
    { value: '8', label: '8+ ⭐' },
    { value: '7', label: '7+ ⭐' },
    { value: '6', label: '6+ ⭐' },
  ]

  return (
    <div className="sticky top-20 space-y-6">
      {/* Genre Filter */}
      <div className="bg-card border border-border/40 rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <span>Genre</span>
          <ChevronDown className="w-4 h-4" />
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {genres.map((genre) => (
            <label key={genre.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="genre"
                value={genre.id}
                checked={filters.genre === genre.id}
                onChange={() =>
                  onFilterChange({ ...filters, genre: genre.id })
                }
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-muted-foreground hover:text-foreground transition">
                {genre.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Year Filter */}
      <div className="bg-card border border-border/40 rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <span>Année</span>
          <ChevronDown className="w-4 h-4" />
        </h3>
        <select
          value={filters.year}
          onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-muted border border-border/40 text-foreground focus:outline-none focus:border-primary/50 transition"
        >
          <option value="all">Toutes les années</option>
          {years.slice(1).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div className="bg-card border border-border/40 rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <span>Note</span>
          <ChevronDown className="w-4 h-4" />
        </h3>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <label key={rating.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating.value}
                checked={filters.rating === rating.value}
                onChange={() =>
                  onFilterChange({ ...filters, rating: rating.value })
                }
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-muted-foreground hover:text-foreground transition">
                {rating.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
