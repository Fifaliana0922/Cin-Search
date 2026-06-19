'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition duration-300" />
        <div className="relative bg-card rounded-2xl border border-border/50 focus-within:border-primary/50 transition">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Recherchez un film, une série..."
            className="w-full px-6 py-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-primary/20 rounded-lg transition text-muted-foreground hover:text-primary"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  )
}
