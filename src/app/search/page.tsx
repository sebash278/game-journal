"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search, Loader2, Gamepad2, Sparkles } from "lucide-react"

interface IGDBGame {
  id: number
  name: string
  cover?: { url: string } | null
  summary?: string | null
  genres?: { name: string }[] | null
  platforms?: { name: string }[] | null
  rating?: number | null
}

const suggestedSearches = [
  "Elden Ring",
  "Zelda",
  "Final Fantasy",
  "The Witcher",
  "God of War",
  "Cyberpunk 2077",
]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<IGDBGame[]>([])
  const [loading, setLoading] = useState(false)
  const [addedGames, setAddedGames] = useState<Set<number>>(new Set())

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 2) {
        searchGames(query)
      } else {
        setResults([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  async function searchGames(searchQuery: string) {
    setLoading(true)
    try {
      const response = await fetch(`/api/games/search?q=${encodeURIComponent(searchQuery)}&limit=12`)
      if (response.ok) {
        const games = await response.json()
        setResults(games)
      }
    } catch (error) {
      console.error("Error searching games:", error)
    } finally {
      setLoading(false)
    }
  }

  async function addGameToLibrary(game: IGDBGame) {
    try {
      const response = await fetch("/api/journals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          igdbId: game.id.toString(),
          status: "WANT_TO_PLAY",
        }),
      })

      if (response.ok) {
        setAddedGames(new Set([...addedGames, game.id]))
      } else {
        const data = await response.json()
        alert(data.error || "Failed to add game to library")
      }
    } catch (error) {
      console.error("Error adding game:", error)
      alert("Failed to add game to library")
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/70 to-secondary/70">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl font-bold">Buscar Juegos</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Busca en la base de datos IGDB para encontrar y agregar juegos a tu biblioteca.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        <Input
          type="text"
          placeholder="Buscar juegos... (ej: 'Elden Ring', 'Zelda')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-14 h-16 text-lg rounded-2xl border-primary/50 focus:border-primary focus:ring-primary/20 shadow-pastel"
        />
        {loading && (
          <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary" />
        )}
      </div>

      {/* Search Results */}
      {query.trim().length > 2 && (
        <div className="space-y-8">
          {results.length > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-sm text-muted-foreground font-medium">
                  {results.length} juego{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {results.map((game, index) => {
                  const isAdded = addedGames.has(game.id)
                  return (
                    <div key={game.id} className="animate-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <Card className="group overflow-hidden hover:shadow-pastel-lg transition-all duration-300 border-border bg-card/50 backdrop-blur-sm">
                        <div className="relative aspect-[3/4] bg-gradient-to-br from-muted/30 to-muted/20 dark:from-muted/10 dark:to-muted/5">
                          {game.cover ? (
                            <img
                              src={game.cover.url.replace("/t_thumb/", "/t_cover_big/")}
                              alt={game.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-primary bg-gradient-to-br from-muted/30 to-muted/20 dark:from-muted/10 dark:to-muted/5">
                              <Gamepad2 className="h-16 w-16 opacity-30" />
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-3">
                          <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                            {game.name}
                          </h3>
                          {game.genres && game.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {game.genres.slice(0, 2).map((genre) => (
                                <Badge key={genre.name} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                  {genre.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <Button
                            onClick={() => addGameToLibrary(game)}
                            disabled={isAdded}
                            className={`w-full gap-2 items-center cursor-pointer hover:scale-105 transition-all ${
                              isAdded
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500 hover:from-violet-600 hover:to-purple-700 dark:hover:from-violet-500 dark:hover:to-purple-600 text-white"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Sparkles className="h-4 w-4" />
                                Agregado
                              </>
                            ) : (
                              <>
                                <Gamepad2 className="h-4 w-4" />
                                Agregar a Biblioteca
                              </>
                            )}
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </>
          ) : !loading ? (
            <div className="text-center py-12">
              <Card className="max-w-md mx-auto p-8 space-y-4 border-dashed border-border">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No se encontraron juegos</h3>
                  <p className="text-muted-foreground text-sm">
                    Prueba con un término de búsqueda diferente o verifica la ortografía
                  </p>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      )}

      {/* Empty State */}
      {query.trim().length <= 2 && (
        <div className="text-center py-16">
          <Card className="max-w-2xl mx-auto p-12 space-y-8 border-dashed border-border bg-gradient-to-br from-muted/20 to-muted/10 dark:from-muted/10 dark:to-muted/5">
            <div className="flex justify-center">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary/70 to-secondary/70 flex items-center justify-center shadow-pastel">
                <Gamepad2 className="h-14 w-14 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">Comienza a Buscar</h3>
              <p className="text-muted-foreground">
                Ingresa el nombre de un juego arriba para buscar en la base de datos IGDB. Puedes buscar por
                título, serie, o incluso nombres parciales.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Búsquedas populares:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedSearches.map((search) => (
                  <Badge
                    key={search}
                    variant="outline"
                    className="cursor-pointer hover:scale-105 hover:shadow-pastel hover:bg-gradient-to-r hover:from-primary/70 hover:to-secondary/70 hover:text-primary hover:border-primary/80 transition-all px-4 py-2 text-sm"
                    onClick={() => setQuery(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
