import { getDb } from './mongodb'
import { ObjectId } from 'mongodb'
import type { Avatar, AvatarFilters, PaginatedResponse } from '@/types'

/**
 * Récupère tous les avatars avec filtres et pagination
 */
export async function getAvatars(
  filters: AvatarFilters = {}
): Promise<PaginatedResponse<Avatar>> {
  const db = await getDb()
  const collection = db.collection('avatars')

  const {
    search = '',
    style,
    role,
    tags = [],
    sortBy = 'recent',
    page = 1,
    limit = 12,
  } = filters

  // Construire la query MongoDB
  const query: any = {}

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
    ]
  }

  if (style) {
    query.style = style
  }

  if (role) {
    query.role = role
  }

  if (tags.length > 0) {
    query.tags = { $in: tags }
  }

  // Tri
  let sort: any = { createdAt: -1 }
  if (sortBy === 'popular') {
    sort = { votes: -1, createdAt: -1 }
  } else if (sortBy === 'name') {
    sort = { name: 1 }
  }

  // Pagination
  const skip = (page - 1) * limit
  const total = await collection.countDocuments(query)

  const avatars = await collection
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray()

  return {
    data: avatars.map((avatar) => ({
      ...avatar,
      _id: avatar._id.toString(),
    })) as Avatar[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Récupère un avatar par ID
 */
export async function getAvatarById(id: string): Promise<Avatar | null> {
  const db = await getDb()
  const collection = db.collection('avatars')

  const avatar = await collection.findOne({ _id: new ObjectId(id) })

  if (!avatar) return null

  return {
    ...avatar,
    _id: avatar._id.toString(),
  } as Avatar
}

/**
 * Récupère un avatar par code
 */
export async function getAvatarByCode(code: string): Promise<Avatar | null> {
  const db = await getDb()
  const collection = db.collection('avatars')

  const avatar = await collection.findOne({ code })

  if (!avatar) return null

  return {
    ...avatar,
    _id: avatar._id.toString(),
  } as Avatar
}

/**
 * Crée un nouvel avatar
 */
export async function createAvatar(data: {
  code: string
  name: string
  description?: string
  imageUrl: string
  imagePublicId: string
  userId: string
  tags?: string[]
  style?: string
  role?: string
}): Promise<Avatar> {
  const db = await getDb()
  const collection = db.collection('avatars')

  const now = new Date()
  const avatar = {
    ...data,
    votes: 0,
    votedBy: [],
    tags: data.tags || [],
    createdAt: now,
    updatedAt: now,
  }

  const result = await collection.insertOne(avatar)

  return {
    ...avatar,
    _id: result.insertedId.toString(),
  } as Avatar
}

/**
 * Met à jour un avatar
 */
export async function updateAvatar(
  id: string,
  data: {
    name?: string
    description?: string
    tags?: string[]
  }
): Promise<Avatar | null> {
  const db = await getDb()
  const collection = db.collection('avatars')

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  )

  if (!result) return null

  return {
    ...result,
    _id: result._id.toString(),
  } as Avatar
}

/**
 * Supprime un avatar
 */
export async function deleteAvatar(id: string): Promise<boolean> {
  const db = await getDb()
  const collection = db.collection('avatars')

  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

/**
 * Vote pour un avatar
 */
export async function voteAvatar(
  avatarId: string,
  userId: string
): Promise<{ success: boolean; votes: number; action: 'added' | 'removed' }> {
  const db = await getDb()
  const collection = db.collection('avatars')

  const avatar = await collection.findOne({ _id: new ObjectId(avatarId) })

  if (!avatar) {
    throw new Error('Avatar not found')
  }

  const hasVoted = avatar.votedBy?.includes(userId) || false

  let result
  if (hasVoted) {
    // Retirer le vote
    result = await collection.findOneAndUpdate(
      { _id: new ObjectId(avatarId) },
      {
        $inc: { votes: -1 },
        $pull: { votedBy: userId },
      },
      { returnDocument: 'after' }
    )
    return { success: true, votes: result?.votes || 0, action: 'removed' }
  } else {
    // Ajouter le vote
    result = await collection.findOneAndUpdate(
      { _id: new ObjectId(avatarId) },
      {
        $inc: { votes: 1 },
        $addToSet: { votedBy: userId },
      },
      { returnDocument: 'after' }
    )
    return { success: true, votes: result?.votes || 0, action: 'added' }
  }
}

/**
 * Récupère les avatars d'un utilisateur
 */
export async function getAvatarsByUserId(userId: string): Promise<Avatar[]> {
  const db = await getDb()
  const collection = db.collection('avatars')

  const avatars = await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()

  return avatars.map((avatar) => ({
    ...avatar,
    _id: avatar._id.toString(),
  })) as Avatar[]
}
