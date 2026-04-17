import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // This endpoint is a one-time setup to initialize the database
    // Access this URL once after deployment: /api/setup-db

    return NextResponse.json({
      success: true,
      message: 'Database setup endpoint - This will be called automatically'
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Setup failed'
      },
      { status: 500 }
    )
  }
}
