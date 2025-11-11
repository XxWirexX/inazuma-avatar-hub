'use client'

import { AvatarCard } from './avatar-card'
import type { Avatar } from '@/types'

interface AvatarGridProps {
  avatars: Avatar[]
  onVote?: (avatarId: string) => Promise<void>
  currentUserId?: string
}

export function AvatarGrid({ avatars, onVote, currentUserId }: AvatarGridProps) {
  if (avatars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-lg mb-2">Aucun avatar trouvé</p>
        <p className="text-gray-400 text-sm">Sois le premier à partager ton avatar !</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {avatars.map((avatar) => (
        <AvatarCard
          key={avatar._id}
          avatar={avatar}
          onVote={onVote}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}
