"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating?: number | null
  onChange?: (rating: number) => void
  readonly?: boolean
  max?: number
  size?: number
  className?: string
}

export function StarRating({
  rating = 0,
  onChange,
  readonly = false,
  max = 10,
  size = 20,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= (rating || 0)

        return (
          <Star
            key={i}
            size={size}
            className={cn(
              "transition-all",
              isFilled
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-gray-300",
              !readonly &&
                onChange &&
                "cursor-pointer hover:scale-110 hover:text-yellow-300"
            )}
            onClick={() => !readonly && onChange?.(starValue)}
          />
        )
      })}
      {rating !== null && rating !== undefined && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {rating}/10
        </span>
      )}
    </div>
  )
}
