import { NextRequest, NextResponse } from 'next/server'
import { getAvatarById, updateAvatar, deleteAvatar } from '@/lib/db/avatars'
import { deleteImage } from '@/lib/cloudinary'
import type { ApiResponse } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const avatar = await getAvatarById(id)
    if (!avatar) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Avatar not found' },
        { status: 404 }
      )
    }
    return NextResponse.json<ApiResponse>({ success: true, data: avatar })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch avatar' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const avatar = await getAvatarById(id)
    if (!avatar) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Avatar not found' },
        { status: 404 }
      )
    }
    const body = await request.json()
    const updatedAvatar = await updateAvatar(id, body)
    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedAvatar,
      message: 'Avatar updated',
    })
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to update' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const avatar = await getAvatarById(id)
    if (!avatar) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Avatar not found' },
        { status: 404 }
      )
    }
    await deleteImage(avatar.imagePublicId)
    await deleteAvatar(id)
    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Avatar deleted',
    })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to delete' },
      { status: 500 }
    )
  }
}
