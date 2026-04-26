"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Loader2 } from "lucide-react"

export function UserMenu() {
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)

  async function fetchUsername() {
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setUsername(data.username)
      } else {
        setUsername(null)
      }
    } catch (error) {
      console.error('Failed to fetch username:', error)
      setUsername(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsername()

    // Set up multiple triggers to refresh username
    const interval = setInterval(fetchUsername, 5000)
    const handleFocus = () => fetchUsername()
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchUsername()
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  async function handleLogout() {
    setLogoutLoading(true)
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (response.ok) {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLogoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-end w-32">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 hover:bg-accent/50 hover:scale-105 border border-transparent hover:border-border transition-all cursor-pointer"
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center ring-2 ring-primary/30 dark:ring-primary/20">
            <User className="h-4 w-4 text-primary dark:text-primary-foreground" />
          </div>
          <span className="hidden sm:inline font-medium text-foreground">{username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Sesión iniciada como</p>
            <p className="text-xs leading-none text-muted-foreground">{username}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={logoutLoading}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer hover:scale-105 transition-all"
        >
          {logoutLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          Cambiar Usuario
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
