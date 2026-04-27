import { NextRequest, NextResponse } from 'next/server'
import { getUserByUsername } from '@/lib/auth'
import { verifyPassword } from '@/lib/password'
import { createToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Sanitize username
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')

    if (cleanUsername.length < 2) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await getUserByUsername(cleanUsername)

    // Verify user exists and password is correct
    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    const passwordValid = await verifyPassword(password, user.password)
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = createToken({ userId: user.id, username: user.username })

    // Set cookie in response
    const response = NextResponse.json({
      success: true,
      username: user.username
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
