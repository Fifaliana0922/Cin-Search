'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-gradient-to-b from-background via-background/95 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-110">
              <span className="text-xl font-black text-accent-foreground">C</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="hidden sm:flex flex-col group-hover:text-primary transition-colors duration-300">
              <span className="font-black text-lg text-foreground">CineSearch</span>
              <span className="text-xs text-muted-foreground">Découvrez vos films</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-6">
            <Link
              href="/favorites"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 text-foreground hover:text-primary group"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline font-semibold">Favoris</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
