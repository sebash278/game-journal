import { NextRequest, NextResponse } from 'next/server'
import { searchGames } from '@/lib/igdb'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    const games = await searchGames(query, limit)
    return NextResponse.json(games)
  } catch (error) {
    console.error('Error in games search API:', error)
    return NextResponse.json(
      { error: 'Failed to search games' },
      { status: 500 }
    )
  }
}
