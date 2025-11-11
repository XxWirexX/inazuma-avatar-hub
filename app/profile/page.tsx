'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AvatarGrid } from '@/components/avatar/avatar-grid'
import { Button } from '@/components/ui/button'
import { Upload, User } from 'lucide-react'
import Link from 'next/link'
import type { Avatar } from '@/types'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin')
    } else if (session?.user) {
      fetchUserAvatars()
    }
  }, [status, session])

  const fetchUserAvatars = async () => {
    try {
      // On va filtrer côté client pour l'instant
      const response = await fetch('/api/avatars?limit=100')
      const data = await response.json()

      if (data.success) {
        const userAvatars = data.data.data.filter(
          (avatar: Avatar) => avatar.userId === session?.user?.id
        )
        setAvatars(userAvatars)
      }
    } catch (error) {
      console.error('Failed to fetch avatars:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{session.user.name || session.user.email}</h1>
            <p className="text-gray-600">
              {avatars.length} avatar{avatars.length > 1 ? 's' : ''} partagé{avatars.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <Link href="/upload">
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Nouveau
          </Button>
        </Link>
      </div>

      {avatars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Upload className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Aucun avatar pour l&apos;instant</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            Partage ton premier Code d&apos;Avatar avec la communauté !
          </p>
          <Link href="/upload">
            <Button size="lg" className="gap-2">
              <Upload className="h-5 w-5" />
              Partager mon avatar
            </Button>
          </Link>
        </div>
      ) : (
        <AvatarGrid avatars={avatars} currentUserId={session.user.id} />
      )}
    </div>
  )
}
