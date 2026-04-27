interface IGDBToken {
  access_token: string
  expires_in: number
  token_type: string
}

let cachedToken: IGDBToken | null = null
let tokenExpiry: number = 0

/**
 * Get an access token from IGDB API using OAuth2 client credentials flow
 */
export async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken.access_token
  }

  const clientId = process.env.IGDB_CLIENT_ID
  const clientSecret = process.env.IGDB_CLIENT_SECRET
  const tokenUrl = process.env.IGDB_ACCESS_TOKEN_URL || 'https://id.twitch.tv/oauth2/token'

  if (!clientId || !clientSecret) {
    throw new Error('IGDB_CLIENT_ID and IGDB_CLIENT_SECRET must be set in environment variables')
  }

  try {
    const response = await fetch(
      `${tokenUrl}?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      { method: 'POST' }
    )

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`)
    }

    const token: IGDBToken = await response.json()
    cachedToken = token
    // Set expiry to 5 minutes before actual expiry to be safe
    tokenExpiry = Date.now() + (token.expires_in - 300) * 1000

    return token.access_token
  } catch (error) {
    console.error('Error getting IGDB access token:', error)
    throw error
  }
}

/**
 * Search for games in the IGDB database
 */
export async function searchGames(query: string, limit: number = 10) {
  const token = await getAccessToken()
  const apiUrl = process.env.IGDB_API_URL || 'https://api.igdb.com/v4'

  try {
    const response = await fetch(`${apiUrl}/games`, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID!,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: `
        search "${query}";
        fields name, cover.url, summary, first_release_date, genres.name, platforms.name, rating, rating_count;
        limit ${limit};
        where version_parent = null;
      `,
    })

    if (!response.ok) {
      throw new Error(`IGDB API error: ${response.statusText}`)
    }

    const games = await response.json()
    return games
  } catch (error) {
    console.error('Error searching games:', error)
    throw error
  }
}

/**
 * Get detailed information about a specific game by IGDB ID
 */
export async function getGameById(igdbId: number) {
  const token = await getAccessToken()
  const apiUrl = process.env.IGDB_API_URL || 'https://api.igdb.com/v4'

  try {
    const response = await fetch(`${apiUrl}/games`, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID!,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: `
        fields name, cover.url, summary, first_release_date, genres.name, platforms.name,
               involved_companies.company.name, involved_companies.developer,
               involved_companies.publisher, rating, rating_count, storyline,
               themes.name, game_modes.name, player_perspectives.name, websites.url, websites.category;
        where id = ${igdbId};
      `,
    })

    if (!response.ok) {
      throw new Error(`IGDB API error: ${response.statusText}`)
    }

    const games = await response.json()
    return games[0] // Returns an array, we want the first (and only) element
  } catch (error) {
    console.error('Error getting game details:', error)
    throw error
  }
}

/**
 * Get popular games (for discovery/home page)
 */
export async function getPopularGames(limit: number = 10) {
  const token = await getAccessToken()
  const apiUrl = process.env.IGDB_API_URL || 'https://api.igdb.com/v4'

  try {
    const response = await fetch(`${apiUrl}/games`, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID!,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: `
        fields name, cover.url, summary, first_release_date, genres.name, platforms.name, rating;
        sort total_rating_count desc;
        limit ${limit};
        where total_rating_count > 100 & cover != null;
      `,
    })

    if (!response.ok) {
      throw new Error(`IGDB API error: ${response.statusText}`)
    }

    const games = await response.json()
    return games
  } catch (error) {
    console.error('Error getting popular games:', error)
    throw error
  }
}
