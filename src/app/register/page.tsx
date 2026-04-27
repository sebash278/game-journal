"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gamepad2, Loader2, Sparkles, UserPlus } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setErrors([])

    if (!formData.username.trim() || !formData.email.trim() ||
        !formData.password || !formData.confirmPassword) {
      setErrors(["All fields are required"])
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors(["Passwords do not match"])
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/login?registered=true')
      } else {
        setErrors([data.error || 'Error al crear cuenta'])
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors(['Error al crear cuenta'])
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
                <UserPlus className="h-14 w-14 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-bold">Crear Cuenta</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Únete a Journal de Jueguitos y comienza tu biblioteca
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 space-y-2">
                {errors.map((error, i) => (
                  <p key={i} className="text-sm text-destructive">{error}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base font-medium">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="tu_usuario"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  disabled={loading}
                  autoFocus
                  required
                  minLength={2}
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={loading}
                  required
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres, mayúscula, minúscula y número"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  disabled={loading}
                  required
                  minLength={8}
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base font-medium">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  disabled={loading}
                  required
                  className="h-12 text-lg"
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
                    Creando Cuenta...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Crear Cuenta
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">¿Ya tienes cuenta?</span>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="w-full h-12 text-base border-primary/50 hover:bg-primary/10"
            >
              <Link href="/login" className="cursor-pointer">
                Iniciar Sesión
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}