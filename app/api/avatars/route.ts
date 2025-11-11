import { NextRequest, NextResponse } from 'next/server'
import { getAvatars, createAvatar, getAvatarByCode } from '@/lib/db/avatars'
import { uploadImage } from '@/lib/cloudinary'
import type { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filters = {
      search: searchParams.get('search') || undefined,
      style: searchParams.get('style') || undefined,
      role: searchParams.get('role') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      sortBy: (searchParams.get('sortBy') as 'recent' | 'popular' | 'name') || 'recent',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
    }
    const result = await getAvatars(filters)
    return NextResponse.json<ApiResponse>({ success: true, data: result })
  } catch (error) {
    console.error('GET /api/avatars error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch avatars' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const code = formData.get('code') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string | null
    const imageFile = formData.get('image') as File
    const tags = formData.get('tags') as string | null
    const style = formData.get('style') as string | null
    const role = formData.get('role') as string | null
    const userId = formData.get('userId') as string || 'anonymous'

    if (!code || !name || !imageFile) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingAvatar = await getAvatarByCode(code)
    if (existingAvatar) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'This avatar code already exists' },
        { status: 409 }
      )
    }

    const uploadResult = await uploadImage(imageFile, 'inazuma-avatars')

    const avatar = await createAvatar({
      code,
      name,
      description: description || undefined,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      userId,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      style: style || undefined,
      role: role || undefined,
    })

    return NextResponse.json<ApiResponse>(
      { success: true, data: avatar, message: 'Avatar created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/avatars error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to create avatar' },
      { status: 500 }
    )
  }
}
