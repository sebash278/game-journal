"use client"

import { useState, useEffect } from "react"
import { GameCard } from "@/components/GameCard"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter, ArrowUpDown, Gamepad2, Loader2 } from "lucide-react"

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

const statusFilters = {
  all: { label: "Todos los Juegos", value: "all" },
  playing: { label: "Jugando", value: "PLAYING" },
  completed: { label: "Completados", value: "COMPLETED" },
  backlog: { label: "Backlog", value: "BACKLOG" },
  wantToPlay: { label: "Quiero Jugar", value: "WANT_TO_PLAY" },
  dropped: { label: "Abandonados", value: "DROPPED" },
}

const sortOptions = {
  recent: { label: "Actualizados Recientemente", value: "recent" },
  rating: { label: "Mejor Valorados", value: "rating" },
  name: { label: "Alfabéticamente", value: "name" },
}

export default function LibraryPage() {
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    fetchJournals()
  }, [statusFilter, sortBy])

  async function fetchJournals() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }

      const response = await fetch(`/api/journals?${params.toString()}`)
      if (response.ok) {
        let data = await response.json()

        // Sort data
        if (sortBy === "rating") {
          data = data.sort((a: Journal, b: Journal) => {
            const ratingA = a.rating ?? 0
            const ratingB = b.rating ?? 0
            return ratingB - ratingA
          })
        } else if (sortBy === "name") {
          data = data.sort((a: Journal, b: Journal) =>
            a.game.name.localeCompare(b.game.name)
          )
        }

        setJournals(data)
      }
    } catch (error) {
      console.error("Error fetching journals:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">Biblioteca</h1>
          <p className="text-muted-foreground">
            {journals.length} juego{journals.length !== 1 ? "s" : ""} en tu colección
          </p>
        </div>
        <Button asChild className="gap-2 items-center hover:scale-105 cursor-pointer bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500 hover:from-violet-600 hover:to-purple-700 dark:hover:from-violet-500 dark:hover:to-purple-600 text-white shadow-pastel">
          <a href="/search" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            Agregar Juegos
          </a>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-primary/50 focus:border-primary focus:ring-primary/20">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent className="glass border-border shadow-pastel-lg">
              {Object.values(statusFilters).map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] border-primary/50 focus:border-primary focus:ring-primary/20">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent className="glass border-border shadow-pastel-lg">
              {Object.values(sortOptions).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Games Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando tu biblioteca...</p>
        </div>
      ) : journals.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {journals.map((journal, index) => (
            <div key={journal.id} className="animate-in" style={{ animationDelay: `${index * 30}ms` }}>
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
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto p-12 space-y-6 border-dashed border rounded-lg">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Gamepad2 className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">No se encontraron juegos</h3>
              <p className="text-muted-foreground">
                {statusFilter === "all"
                  ? "Tu biblioteca está vacía. ¡Comienza agregando algunos juegos!"
                  : "No hay juegos que coincidan con este filtro. Prueba con un estado diferente."}
              </p>
            </div>
            <Button asChild size="lg" className="gap-2 hover:scale-105 cursor-pointer bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500 hover:from-violet-600 hover:to-purple-700 dark:hover:from-violet-500 dark:hover:to-purple-600 text-white shadow-pastel-lg items-center">
              <a href="/search" className="flex items-center gap-2 cursor-pointer">
                <Gamepad2 className="h-5 w-5" />
                Buscar Juegos
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
