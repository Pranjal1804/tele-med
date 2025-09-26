"use client"

import { Bot, User } from "lucide-react"

interface Text2VideoAvatarProps {
  isActive: boolean
  avatarType: 'doctor' | 'patient'
}

export function Text2VideoAvatar({ isActive, avatarType }: Text2VideoAvatarProps) {
  if (!isActive) return null

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="text-center text-white space-y-4">
        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Bot className="w-20 h-20" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">AI Avatar Mode Active</h3>
          <p className="text-muted-foreground text-white/80">
            Video is off to protect privacy.
          </p>
        </div>
      </div>
    </div>
  )
}