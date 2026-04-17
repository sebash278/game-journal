import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/StarRating"
import { Gamepad2 } from "lucide-react"

interface GameCardProps {
  game: {
    id: string
    name: string
    coverUrl?: string | null
    rating?: number | null
    status?: string
    genres?: string[]
  }
  href: string
}

const statusColors: Record<string, string> = {
  PLAYING: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30 dark:border-blue-400/30",
  COMPLETED: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 dark:border-green-400/30",
  WANT_TO_PLAY: "bg-primary/30 text-primary border-primary/40",
  BACKLOG: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 dark:border-amber-400/30",
  DROPPED: "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30 dark:border-rose-400/30",
}

const statusLabels: Record<string, string> = {
  PLAYING: "Jugando",
  COMPLETED: "Completado",
  WANT_TO_PLAY: "Quiero Jugar",
  BACKLOG: "Backlog",
  DROPPED: "Abandonado",
}

export function GameCard({ game, href }: GameCardProps) {
  return (
    <Link href={href} className="group cursor-pointer block">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-pastel-lg hover:-translate-y-1 border-border hover:border-primary/50 bg-card/50 backdrop-blur-sm cursor-pointer">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-muted/30 to-muted/20 dark:from-muted/10 dark:to-muted/5">
          {game.coverUrl ? (
            <>
              <Image
                src={game.coverUrl.replace("/t_thumb/", "/t_cover_big/")}
                alt={game.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-primary bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
              <Gamepad2 className="h-16 w-16 opacity-30" />
            </div>
          )}
          {game.status && (
            <div className="absolute top-3 right-3">
              <Badge className={`text-xs font-medium backdrop-blur-md ${statusColors[game.status] || ''}`}>
                {statusLabels[game.status] || game.status}
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
            {game.name}
          </h3>
          {game.genres && game.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {game.genres.slice(0, 2).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs px-2 py-0">
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          {game.rating !== undefined && game.rating !== null && (
            <div className="flex items-center gap-1">
              <StarRating rating={game.rating} readonly size={14} />
              <span className="text-xs text-muted-foreground ml-1">{game.rating}/5</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
