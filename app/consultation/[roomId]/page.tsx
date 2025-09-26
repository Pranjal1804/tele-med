"use client"

import { useParams } from "next/navigation"
import { EnhancedVideoInterface } from "@/components/consultation/enhanced-video-interface"
import { useSession } from "@/hooks/use-session"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ConsultationRoom() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading } = useSession()
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  if (isLoading || !user || !roomId) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Preparing your consultation...</h1>
          <p className="text-muted-foreground">Please wait a moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen">
      <EnhancedVideoInterface
        roomId={roomId}
        userId={user.id}
        isDoctor={user.userType === "doctor"}
      />
    </div>
  )
}