import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// Update a journal entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if journal exists and belongs to user
    const journal = await prisma.journal.findUnique({
      where: { id },
    })

    if (!journal) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 })
    }

    if (journal.userId !== currentUser.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { status, rating, notes, startDate, completedAt } = body

    const updatedJournal = await prisma.journal.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(rating !== undefined && { rating }),
        ...(notes !== undefined && { notes }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(completedAt !== undefined && { completedAt: completedAt ? new Date(completedAt) : null }),
      },
      include: {
        game: true,
      },
    })

    return NextResponse.json(updatedJournal)
  } catch (error) {
    console.error('Error updating journal entry:', error)
    return NextResponse.json(
      { error: 'Failed to update journal entry' },
      { status: 500 }
    )
  }
}

// Delete a journal entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = await getCurrentUser()
    console.log('Delete request - CurrentUser:', currentUser)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if journal exists and belongs to user
    const journal = await prisma.journal.findUnique({
      where: { id },
    })
    console.log('Delete request - Journal found:', journal?.id, 'Owner:', journal?.userId)

    if (!journal) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 })
    }

    if (journal.userId !== currentUser.userId) {
      console.log('Delete request - Forbidden: journal.userId=', journal.userId, 'currentUser.userId=', currentUser.userId)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.log('Delete request - Deleting journal:', id)
    await prisma.journal.delete({
      where: { id },
    })

    console.log('Delete request - Success')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to delete journal entry', details: String(error) },
      { status: 500 }
    )
  }
}
