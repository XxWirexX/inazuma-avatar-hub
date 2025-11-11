'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AvatarGrid } from '@/components/avatar/avatar-grid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter } from 'lucide-react'
import type { Avatar, PaginatedResponse } from '@/types'

export default function GalleryPage() {
  const { data: session } = useSession()
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'name'>('recent')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginatedResponse<Avatar>['pagination']>()

  useEffect(() => {
    fetchAvatars()
  }, [search, sortBy, page])

  const fetchAvatars = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        sortBy,
        page: page.toString(),
        limit: '12',
      })

      const response = await fetch(`/api/avatars?${params}`)
      const data = await response.json()

      if (data.success) {
        setAvatars(data.data.data)
        setPagination(data.data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch avatars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (avatarId: string) => {
    if (!session) {
      alert('Connectez-vous pour voter !')
      return
    }

    try {
      const response = await fetch(`/api/avatars/${avatarId}/vote`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        // Mettre à jour l'avatar dans la liste
        setAvatars((prev) =>
          prev.map((avatar) =>
            avatar._id === avatarId
              ? {
                  ...avatar,
                  votes: data.data.votes,
                  votedBy:
                    data.data.action === 'added'
                      ? [...avatar.votedBy, session.user.id]
                      : avatar.votedBy.filter((id) => id !== session.user.id),
                }
              : avatar
          )
        )
      }
    } catch (error) {
      console.error('Vote error:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Galerie d&apos;Avatars</h1>
        <p className="text-gray-600">
          Découvre et vote pour les meilleurs Codes d&apos;Avatar de la communauté
        </p>
      </div>

      {/* Filtres */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher un avatar..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as typeof sortBy)
              setPage(1)
            }}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Plus récents</option>
            <option value="popular">Plus populaires</option>
            <option value="name">Par nom</option>
          </select>
        </div>
      </div>

      {/* Grid d'avatars */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <AvatarGrid
            avatars={avatars}
            onVote={handleVote}
            currentUserId={session?.user?.id}
          />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Précédent
              </Button>

              <div className="flex items-center gap-2">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
