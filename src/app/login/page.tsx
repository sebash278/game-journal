"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gamepad2, Loader2, Sparkles } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      })

      if (response.ok) {
        router.push('/')
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Error al iniciar sesión')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/30 via-background to-muted/20 dark:from-muted/10 dark:to-muted/5 p-4">
      <div className="w-full max-w-md animate-in">
        <Card className="border-2 border-border shadow-pastel-lg bg-gradient-to-br from-card/80 to-muted/30 backdrop-blur-xl dark:from-card/80 dark:to-muted/20">
          <CardHeader className="space-y-6 text-center pb-8">
            <div className="flex justify-center">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/70 to-secondary/70 ring-4 ring-primary/30 shadow-pastel">
                <Gamepad2 className="h-14 w-14 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-bold">Bienvenido a Journal de Jueguitos</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Ingresa tu nombre de usuario para acceder a tu biblioteca de juegos
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base font-medium">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingresa tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoFocus
                  required
                  minLength={2}
                  className="h-12 text-lg border-primary/50 focus:border-primary focus:ring-primary/20"
                />
                <p className="text-xs text-muted-foreground">
                  Debe tener al menos 2 caracteres. Solo letras, números, guiones y guiones bajos.
                </p>
              </div>
              <Button
                type="submit"
                className="w-full h-14 text-base gap-2 bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500 hover:from-violet-600 hover:to-purple-700 dark:hover:from-violet-500 dark:hover:to-purple-600 text-white shadow-pastel-lg transition-all items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Ingresar a la Biblioteca
                  </>
                )}
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">No se necesita contraseña</span>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              ¡Solo elige un nombre de usuario y comienza a rastrear tus juegos! 🎮
            </p>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-8">
          Potenciado por IGDB • Construido con 💜
        </p>
      </div>
    </div>
  )
}
