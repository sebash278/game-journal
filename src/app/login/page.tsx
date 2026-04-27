"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gamepad2, Loader2, Sparkles } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setShowSuccess(true)
    }
  }, [searchParams])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!username.trim() || !password.trim()) {
      setError("Usuario y contraseña son requeridos")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: username.trim(),
          password
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Login successful:', data)
        await new Promise(resolve => setTimeout(resolve, 100))
        window.location.href = '/'
      } else {
        const data = await response.json()
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Error al iniciar sesión')
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
                Ingresa tu usuario y contraseña para acceder a tu biblioteca
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {showSuccess && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                <p className="text-sm text-green-600 dark:text-green-400">
                  ¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

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
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="h-12 text-lg border-primary/50 focus:border-primary focus:ring-primary/20"
                />
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
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">¿No tienes cuenta?</span>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="w-full h-12 text-base border-primary/50 hover:bg-primary/10"
            >
              <Link href="/register" className="cursor-pointer">
                Crear Cuenta Nueva
              </Link>
            </Button>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-8">
          Potenciado por IGDB • Construido con 💜
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
