import { NextRequest, NextResponse } from 'next/server'
import { getGameById } from '@/lib/igdb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ igdbId: string }> }
) {
  try {
    const { igdbId } = await params
    const gameId = parseInt(igdbId)

    if (isNaN(gameId)) {
      return NextResponse.json(
        { error: 'Invalid IGDB ID' },
        { status: 400 }
      )
    }

    const game = await getGameById(gameId)
    return NextResponse.json(game)
  } catch (error) {
    console.error('Error in game details API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch game details' },
      { status: 500 }
    )
  }
}
