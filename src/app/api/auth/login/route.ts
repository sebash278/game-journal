import { NextRequest, NextResponse } from 'next/server'
import { setCurrentUser, ensureUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username } = body

    if (!username || username.trim().length < 2) {
      return NextResponse.json(
        { error: 'Username must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Sanitize username
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')

    if (cleanUsername.length < 2) {
      return NextResponse.json(
        { error: 'Invalid username' },
        { status: 400 }
      )
    }

    // Ensure user exists in database
    await ensureUser(cleanUsername)

    // Set cookie
    await setCurrentUser(cleanUsername)

    return NextResponse.json({ success: true, username: cleanUsername })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
