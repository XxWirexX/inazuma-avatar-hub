'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Copy, Check, Trash2, Edit, ArrowLeft } from 'lucide-react'
import type { Avatar } from '@/types'
import { copyToClipboard } from '@/lib/utils'

export default function AvatarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [avatar, setAvatar] = useState<Avatar | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [voting, setVoting] = useState(false)
  const [avatarId, setAvatarId] = useState<string>('')

  useEffect(() => {
    params.then(p => {
      setAvatarId(p.id)
    })
  }, [params])

  useEffect(() => {
    if (avatarId) {
      fetchAvatar()
    }
  }, [avatarId])

  const fetchAvatar = async () => {
    try {
      const response = await fetch(`/api/avatars/${avatarId}`)
      const data = await response.json()

      if (data.success) {
        setAvatar(data.data)
      } else {
        router.push('/gallery')
      }
    } catch (error) {
      console.error('Failed to fetch avatar:', error)
      router.push('/gallery')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = async () => {
    if (avatar) {
      try {
        await copyToClipboard(avatar.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        alert('Erreur lors de la copie')
      }
    }
  }

  const handleVote = async () => {
    if (!session) {
      alert('Connectez-vous pour voter !')
      return
    }

    setVoting(true)
    try {
      const response = await fetch(`/api/avatars/${avatarId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      })

      const data = await response.json()

      if (data.success && avatar) {
        setAvatar({
          ...avatar,
          votes: data.data.votes,
          votedBy:
            data.data.action === 'added'
              ? [...avatar.votedBy, session.user.id]
              : avatar.votedBy.filter((id) => id !== session.user.id),
        })
      }
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setVoting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avatar ?')) return

    try {
      const response = await fetch(`/api/avatars/${avatarId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        router.push('/profile')
      } else {
        alert(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!avatar) return null

  const hasVoted = session ? avatar.votedBy.includes(session.user.id) : false
  const isOwner = session && avatar.userId === session.user.id

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={avatar.imageUrl}
            alt={avatar.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Infos */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-4xl font-bold">{avatar.name}</h1>
              {isOwner && (
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {avatar.description && (
              <p className="text-gray-600 text-lg mt-4">{avatar.description}</p>
            )}
          </div>

          {/* Tags */}
          {avatar.tags && avatar.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {avatar.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Métadonnées */}
          <div className="flex gap-4">
            {avatar.style && (
              <Badge variant="outline" className="text-sm">
                Style: {avatar.style}
              </Badge>
            )}
            {avatar.role && (
              <Badge variant="outline" className="text-sm">
                Rôle: {avatar.role}
              </Badge>
            )}
          </div>

          {/* Code d'avatar */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Code d&apos;Avatar</h3>
                <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm break-all">
                  {avatar.code}
                </div>
              </div>

              <Button
                onClick={handleCopyCode}
                className="w-full gap-2"
                variant={copied ? 'secondary' : 'default'}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier le code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Votes */}
          <div className="flex items-center gap-4">
            <Button
              variant={hasVoted ? 'default' : 'outline'}
              size="lg"
              onClick={handleVote}
              disabled={voting || !session}
              className="gap-2"
            >
              <Heart className={`h-5 w-5 ${hasVoted ? 'fill-current' : ''}`} />
              {avatar.votes} {avatar.votes > 1 ? 'votes' : 'vote'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
