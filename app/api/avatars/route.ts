import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAvatars, createAvatar, getAvatarByCode } from '@/lib/db/avatars'
import { uploadImage } from '@/lib/cloudinary'
import type { ApiResponse } from '@/types'

/**
 * GET /api/avatars
 * Récupère la liste des avatars avec filtres
 */
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

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('GET /api/avatars error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch avatars' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/avatars
 * Crée un nouvel avatar
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const code = formData.get('code') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string | null
    const imageFile = formData.get('image') as File
    const tags = formData.get('tags') as string | null
    const style = formData.get('style') as string | null
    const role = formData.get('role') as string | null

    // Validation
    if (!code || !name || !imageFile) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Vérifier si le code existe déjà
    const existingAvatar = await getAvatarByCode(code)
    if (existingAvatar) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'This avatar code already exists' },
        { status: 409 }
      )
    }

    // Upload de l'image sur Cloudinary
    const uploadResult = await uploadImage(imageFile, 'inazuma-avatars')

    // Créer l'avatar en DB
    const avatar = await createAvatar({
      code,
      name,
      description: description || undefined,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      userId: session.user.id,
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
