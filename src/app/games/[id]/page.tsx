"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/StatusBadge"
import { StarRating } from "@/components/StarRating"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, Gamepad2 } from "lucide-react"

interface Game {
  id: string
  igdbId: number
  name: string
  summary: string | null
  coverUrl: string | null
  releaseDate: Date | null
  genres: string[]
  platforms: string[]
}

interface Journal {
  id: string
  status: string
  rating: number | null
  notes: string | null
  startDate: string | null
  completedAt: string | null
}

const statusOptions = [
  { value: "BACKLOG", label: "Backlog" },
  { value: "PLAYING", label: "Jugando" },
  { value: "COMPLETED", label: "Completado" },
  { value: "DROPPED", label: "Abandonado" },
  { value: "WANT_TO_PLAY", label: "Quiero Jugar" },
]

export default function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [journal, setJournal] = useState<Journal | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notes, setNotes] = useState("")
  const [gameId, setGameId] = useState<string | null>(null)

  useEffect(() => {
    async function loadParams() {
      const { id } = await params
      setGameId(id)
      fetchGameData(id)
      fetchJournalEntry()
    }
    loadParams()
  }, [params])

  async function fetchGameData(id: string) {
    try {
      const response = await fetch(`/api/journals`)
      if (response.ok) {
        const journals = await response.json()
        const foundJournal = journals.find((j: any) => j.gameId === id)
        if (foundJournal) {
          setGame(foundJournal.game)
          setJournal(foundJournal)
          setNotes(foundJournal.notes || "")
        }
      }
    } catch (error) {
      console.error("Error fetching game:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchJournalEntry() {
    // This is already handled in fetchGameData
  }

  async function updateJournal(updates: Partial<Journal>) {
    if (!journal) return

    setSaving(true)
    try {
      const response = await fetch(`/api/journals/${journal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updated = await response.json()
        setJournal(updated)
      }
    } catch (error) {
      console.error("Error updating journal:", error)
      alert("Error al actualizar la entrada")
    } finally {
      setSaving(false)
    }
  }

  async function deleteJournal() {
    if (!journal) {
      alert("No se encontró la entrada del journal")
      return
    }
    if (!confirm("¿Estás seguro de que quieres eliminar este juego de tu biblioteca?")) {
      return
    }

    console.log("Attempting to delete journal:", journal.id)

    try {
      const response = await fetch(`/api/journals/${journal.id}`, {
        method: "DELETE",
      })

      console.log("Delete response status:", response.status)

      if (response.ok) {
        router.push("/library")
        router.refresh()
      } else {
        let errorMessage = "Unknown error"
        try {
          const error = await response.json()
          errorMessage = error.error || error.message || JSON.stringify(error)
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText || "No details"}`
        }
        console.error("Delete error response:", errorMessage)
        alert(`Error al eliminar el juego: ${errorMessage}`)
      }
    } catch (error) {
      console.error("Error deleting journal:", error)
      alert("Error al eliminar el juego de la biblioteca - revisa la consola para más detalles")
    }
  }

  async function saveNotes() {
    await updateJournal({ notes })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Juego no encontrado</h2>
        <p className="text-muted-foreground mb-4">
          Este juego aún no está en tu biblioteca.
        </p>
        <Button asChild>
          <a href="/search">Buscar Juegos</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()}>
        ← Volver
      </Button>

      {/* Game Header */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cover Image */}
        <div className="flex-shrink-0">
          <div className="w-64 aspect-[3/4] rounded-lg overflow-hidden bg-muted shadow-lg">
            {game.coverUrl ? (
              <img
                src={game.coverUrl.replace("/t_thumb/", "/t_cover_big/")}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Sin portada
              </div>
            )}
          </div>
        </div>

        {/* Game Info */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{game.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {game.genres.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {game.platforms.length > 0 && (
                <div className="flex items-center gap-1">
                  <Gamepad2 className="h-4 w-4" />
                  <span>{game.platforms.join(", ")}</span>
                </div>
              )}
              {game.releaseDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(game.releaseDate).getFullYear()}</span>
                </div>
              )}
            </div>
          </div>

          {game.summary && (
            <Card>
              <CardHeader>
                <CardTitle>Acerca de</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{game.summary}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Journal Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tu Journal</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={journal?.status}
                onValueChange={(value) => updateJournal({ status: value })}
                disabled={saving}
              >
                <SelectTrigger className="border-primary/50 focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent className="glass border-border shadow-pastel-lg">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card>
            <CardHeader>
              <CardTitle>Calificación</CardTitle>
            </CardHeader>
            <CardContent>
              <StarRating
                rating={journal?.rating ?? undefined}
                onChange={(rating) => updateJournal({ rating })}
                readonly={false}
              />
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agrega tus pensamientos, estrategias o recuerdos sobre este juego..."
              rows={6}
              disabled={saving}
            />
            <div className="flex justify-end">
              <Button onClick={saveNotes} disabled={saving} className="bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500 hover:from-violet-600 hover:to-purple-700 dark:hover:from-violet-500 dark:hover:to-purple-600 text-white hover:scale-105 transition-all cursor-pointer">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Guardar Notas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Elimina este juego de tu biblioteca. Esta acción no se puede deshacer.
            </p>
            <Button variant="destructive" onClick={deleteJournal} className="hover:scale-105 transition-all cursor-pointer bg-gradient-to-r from-destructive to-red-600 hover:from-destructive/90 hover:to-red-700 text-white shadow-pastel-lg py-6 text-base font-semibold">
              Eliminar de la Biblioteca
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
