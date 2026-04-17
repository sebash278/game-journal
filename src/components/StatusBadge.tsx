import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusConfig = {
  BACKLOG: { label: "Backlog", color: "bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30" },
  PLAYING: { label: "Playing", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/30" },
  COMPLETED: { label: "Completed", color: "bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/30" },
  DROPPED: { label: "Dropped", color: "bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/30" },
  WANT_TO_PLAY: { label: "Want to Play", color: "bg-primary/30 text-primary hover:bg-primary/40" },
}

interface StatusBadgeProps {
  status: keyof typeof statusConfig
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.WANT_TO_PLAY

  return (
    <Badge className={cn(config.color, className)} variant="outline">
      {config.label}
    </Badge>
  )
}
