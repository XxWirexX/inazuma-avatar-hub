// ==========================================
// Types pour les avatars
// ==========================================

export interface Avatar {
  _id: string
  code: string
  name: string
  description?: string
  imageUrl: string
  imagePublicId: string
  userId: string
  user?: User
  votes: number
  votedBy: string[]
  tags: string[]
  style?: string
  role?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateAvatarInput {
  code: string
  name: string
  description?: string
  imageFile: File
  tags?: string[]
  style?: string
  role?: string
}

export interface UpdateAvatarInput {
  name?: string
  description?: string
  tags?: string[]
}

// ==========================================
// Types pour les utilisateurs
// ==========================================

export interface User {
  _id: string
  email: string
  username: string
  name?: string
  image?: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// Types pour les filtres et recherche
// ==========================================

export interface AvatarFilters {
  search?: string
  style?: string
  role?: string
  tags?: string[]
  sortBy?: 'recent' | 'popular' | 'name'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ==========================================
// Types pour les réponses API
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  success: false
  error: string
  statusCode: number
}
