import { NextRequest, NextResponse } from 'next/server'
import { voteAvatar } from '@/lib/db/avatars'
import type { ApiResponse } from '@/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const userId = body.userId || 'anonymous'
    const result = await voteAvatar(id, userId)
    return NextResponse.json<ApiResponse>({
      success: true,
      data: result,
      message: result.action === 'added' ? 'Vote added' : 'Vote removed',
    })
  } catch (error: any) {
    console.error('POST vote error:', error)
    if (error.message === 'Avatar not found') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Avatar not found' },
        { status: 404 }
      )
    }
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to vote' },
      { status: 500 }
    )
  }
}
