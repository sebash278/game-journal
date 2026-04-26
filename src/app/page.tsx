"use client"

import { useEffect, useState } from "react"
import { GameCard } from "@/components/GameCard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Gamepad2, TrendingUp, Award, Clock } from "lucide-react"

interface Journal {
  id: string
  status: string
  rating: number | null
  game: {
    id: string
    name: string
    coverUrl: string | null
    genres: string[]
  }
}

export default function HomePage() {
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJournals() {
      try {
        const response = await fetch('/api/journals')
        if (response.ok) {
          const data = await response.json()
          setJournals(data.slice(0, 12))
        }
      } catch (error) {
        console.error('Failed to fetch journals:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJournals()
  }, [])

  const stats = {
    total: journals.length,
    playing: journals.filter((j) => j.status === "PLAYING").length,
    completed: journals.filter((j) => j.status === "COMPLETED").length,
    wantToPlay: journals.filter((j) => j.status === "WANT_TO_PLAY").length,
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-muted-foreground text-lg">Cargando tu biblioteca de juegos...</p>
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-transparent to-muted/20 dark:from-muted/10 dark:to-muted/5 -z-10" />
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl font-bold tracking-tight sm:text-7xl animate-in">
            Bienvenido a tu{" "}
            <span className="text-gradient">Journal de Jueguitos</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Rastrea tu viaje como jugador, descubre nuevos juegos y guarda notas de tus títulos favoritos.
            Potenciado por la base de datos IGDB con una estética pastel hermosa.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500 hover:from-violet-600 hover:to-purple-700 dark:hover:from-violet-500 dark:hover:to-purple-600 text-white shadow-pastel-lg transition-all items-center hover:scale-105 cursor-pointer"
            >
              <a href="/search" className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5" />
                Buscar Juegos
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 border-primary/50 hover:bg-primary/10 hover:border-primary/80 hover:scale-105 cursor-pointer"
            >
              <a href="/library" className="cursor-pointer">Ver Biblioteca</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {journals.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/50 to-secondary/50">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Estadísticas de tu Biblioteca</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="p-8 hover:shadow-pastel-lg transition-all duration-300 border-border bg-gradient-to-br from-muted/50 to-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="text-5xl font-bold text-gradient">{stats.total}</div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/70 to-secondary/70 flex items-center justify-center">
                  <Gamepad2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground">Total de Juegos</div>
            </Card>
            <Card className="p-8 hover:shadow-pastel-lg transition-all duration-300 border-blue-200/50 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">{stats.playing}</div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-200/70 to-blue-300/70 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground">Jugando</div>
            </Card>
            <Card className="p-8 hover:shadow-pastel-lg transition-all duration-300 border-green-200/50 dark:border-green-900/50 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/30 dark:to-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="text-5xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-200/70 to-green-300/70 dark:from-green-900/50 dark:to-green-800/50 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground">Completados</div>
            </Card>
            <Card className="p-8 hover:shadow-pastel-lg transition-all duration-300 border-purple-200/50 dark:border-purple-900/50 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/30 dark:to-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="text-5xl font-bold text-purple-600 dark:text-purple-400">{stats.wantToPlay}</div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-200/70 to-purple-300/70 dark:from-purple-900/50 dark:to-purple-800/50 flex items-center justify-center">
                  <Gamepad2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground">Quiero Jugar</div>
            </Card>
          </div>
        </section>
      )}

      {/* Recent Games */}
      {journals.length > 0 ? (
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/50 to-secondary/50">
                <Gamepad2 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Juegos Recientes</h2>
            </div>
            {journals.length >= 12 && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-primary/50 hover:bg-primary/10 hover:scale-105 cursor-pointer"
              >
                <a href="/library" className="cursor-pointer">Ver Todos</a>
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {journals.map((journal, index) => (
              <div key={journal.id} className="animate-in" style={{ animationDelay: `${index * 50}ms` }}>
                <GameCard
                  game={{
                    id: journal.game.id,
                    name: journal.game.name,
                    coverUrl: journal.game.coverUrl,
                    rating: journal.rating ?? undefined,
                    status: journal.status,
                    genres: journal.game.genres,
                  }}
                  href={`/games/${journal.game.id}`}
                />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="text-center py-20">
          <Card className="max-w-lg mx-auto p-16 space-y-8 border-dashed border-border bg-gradient-to-br from-muted/30 to-muted/20 dark:from-muted/10 dark:to-muted/5">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/70 to-secondary/70 flex items-center justify-center shadow-pastel">
                <Gamepad2 className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-bold">Aún no hay juegos</h3>
              <p className="text-muted-foreground text-lg">
                Comienza a construir tu biblioteca de juegos buscando títulos en IGDB.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500 hover:from-violet-600 hover:to-purple-700 dark:hover:from-violet-500 dark:hover:to-purple-600 text-white shadow-pastel items-center hover:scale-105 cursor-pointer"
            >
              <a href="/search" className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5" />
                Buscar Tu Primer Juego
              </a>
            </Button>
          </Card>
        </section>
      )}
    </div>
  )
}
