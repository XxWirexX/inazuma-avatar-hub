import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { voteAvatar } from '@/lib/db/avatars'
import type { ApiResponse } from '@/types'

/**
 * POST /api/avatars/[id]/vote
 * Vote ou retire le vote pour un avatar
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await voteAvatar(params.id, session.user.id)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result,
      message: result.action === 'added' ? 'Vote added' : 'Vote removed',
    })
  } catch (error: any) {
    console.error('POST /api/avatars/[id]/vote error:', error)

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
