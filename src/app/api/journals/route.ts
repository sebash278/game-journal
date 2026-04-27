import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getGameById } from '@/lib/igdb'
import { getCurrentUser } from '@/lib/auth'

// Get all journal entries
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const where: any = { userId: currentUser.userId }

    if (status) {
      where.status = status
    }

    const journals = await prisma.journal.findMany({
      where,
      include: {
        game: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(journals)
  } catch (error) {
    console.error('Error fetching journals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journals' },
      { status: 500 }
    )
  }
}

// Add a new game to the journal
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { igdbId, status = 'WANT_TO_PLAY' } = body

    if (!igdbId) {
      return NextResponse.json(
        { error: 'IGDB ID is required' },
        { status: 400 }
      )
    }

    // Fetch game details from IGDB
    const igdbGame = await getGameById(parseInt(igdbId))

    // Check if game already exists in our database
    let game = await prisma.game.findUnique({
      where: { igdbId: parseInt(igdbId) },
    })

    // If not, create it
    if (!game) {
      // Convert protocol-relative URL to absolute URL
      const coverUrl = igdbGame.cover?.url
        ? (igdbGame.cover.url.startsWith('//')
            ? 'https:' + igdbGame.cover.url
            : igdbGame.cover.url)
        : null

      game = await prisma.game.create({
        data: {
          igdbId: parseInt(igdbId),
          name: igdbGame.name,
          summary: igdbGame.summary || igdbGame.storyline || null,
          coverUrl,
          releaseDate: igdbGame.first_release_date
            ? new Date(igdbGame.first_release_date * 1000)
            : null,
          genres: igdbGame.genres?.map((g: any) => g.name) || [],
          platforms: igdbGame.platforms?.map((p: any) => p.name) || [],
        },
      })
    }

    // Check if journal entry already exists
    const existingJournal = await prisma.journal.findUnique({
      where: {
        userId_gameId: {
          userId: currentUser.userId,
          gameId: game.id,
        },
      },
    })

    if (existingJournal) {
      return NextResponse.json(
        { error: 'Game already in your journal' },
        { status: 409 }
      )
    }

    // Create journal entry
    const journal = await prisma.journal.create({
      data: {
        userId: currentUser.userId,
        gameId: game.id,
        status,
      },
      include: {
        game: true,
      },
    })

    return NextResponse.json(journal, { status: 201 })
  } catch (error) {
    console.error('Error creating journal entry:', error)
    return NextResponse.json(
      { error: 'Failed to add game to journal' },
      { status: 500 }
    )
  }
}
