'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Avatar } from '@/types'
import { useState } from 'react'

interface AvatarCardProps {
  avatar: Avatar
  onVote?: (avatarId: string) => Promise<void>
  currentUserId?: string
}

export function AvatarCard({ avatar, onVote, currentUserId }: AvatarCardProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [votes, setVotes] = useState(avatar.votes)
  const [hasVoted, setHasVoted] = useState(
    currentUserId ? avatar.votedBy.includes(currentUserId) : false
  )

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!onVote || !currentUserId) return

    setIsVoting(true)
    try {
      await onVote(avatar._id)
      setHasVoted(!hasVoted)
      setVotes(hasVoted ? votes - 1 : votes + 1)
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <Link href={`/avatar/${avatar._id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-105">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={avatar.imageUrl}
            alt={avatar.name}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
          {avatar.style && (
            <Badge className="absolute top-2 left-2" variant="secondary">
              {avatar.style}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{avatar.name}</h3>
          {avatar.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {avatar.description}
            </p>
          )}

          {avatar.tags && avatar.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {avatar.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <Button
            variant={hasVoted ? 'default' : 'ghost'}
            size="sm"
            onClick={handleVote}
            disabled={isVoting || !currentUserId}
            className="gap-1"
          >
            <Heart
              className={`h-4 w-4 ${hasVoted ? 'fill-current' : ''}`}
            />
            <span>{votes}</span>
          </Button>

          {avatar.role && (
            <Badge variant="secondary" className="text-xs">
              {avatar.role}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
