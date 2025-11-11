import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAvatarById, updateAvatar, deleteAvatar } from '@/lib/db/avatars'
import { deleteImage } from '@/lib/cloudinary'
import type { ApiResponse } from '@/types'

/**
 * GET /api/avatars/[id]
 * Récupère un avatar par ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const avatar = await getAvatarById(params.id)

    if (!avatar) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Avatar not found' },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: avatar,
    })
  } catch (error) {
    console.error('GET /api/avatars/[id] error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch avatar' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/avatars/[id]
 * Met à jour un avatar
 */
export async function PATCH(
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

    const avatar = await getAvatarById(params.id)

    if (!avatar) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Avatar not found' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (avatar.userId !== session.user.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, tags } = body

    const updatedAvatar = await updateAvatar(params.id, {
      name,
      description,
      tags,
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedAvatar,
      message: 'Avatar updated successfully',
    })
  } catch (error) {
    console.error('PATCH /api/avatars/[id] error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to update avatar' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/avatars/[id]
 * Supprime un avatar
 */
export async function DELETE(
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

    const avatar = await getAvatarById(params.id)

    if (!avatar) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Avatar not found' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (avatar.userId !== session.user.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Supprimer l'image de Cloudinary
    await deleteImage(avatar.imagePublicId)

    // Supprimer l'avatar de la DB
    await deleteAvatar(params.id)

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Avatar deleted successfully',
    })
  } catch (error) {
    console.error('DELETE /api/avatars/[id] error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to delete avatar' },
      { status: 500 }
    )
  }
}
