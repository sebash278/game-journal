import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'game-journal-jwt-secret-change-in-production-2024'
const JWT_EXPIRES_IN = '7d' // 7 days

export interface JWTPayload {
  userId: string
  username: string
}

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      userId: decoded.userId,
      username: decoded.username
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export function verifyTokenSync(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      userId: decoded.userId,
      username: decoded.username
    }
  } catch (error) {
    return null
  }
}