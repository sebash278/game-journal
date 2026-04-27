import { cookies } from 'next/headers'
import { createToken, verifyToken, type JWTPayload } from './jwt'

export async function getCurrentUser(): Promise<{ userId: string; username: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) return null

  const payload = verifyToken(token)
  return payload || null
}

export async function setCurrentUser(userId: string, username: string) {
  const cookieStore = await cookies()
  const token = createToken({ userId, username })

  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearCurrentUser() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}

export async function getUserById(userId: string) {
  const { prisma } = await import('@/lib/prisma')
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, name: true }
  })
}

export async function getUserByUsername(username: string) {
  const { prisma } = await import('@/lib/prisma')
  return prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, email: true, name: true, password: true }
  })
}
