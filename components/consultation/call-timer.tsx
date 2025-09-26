"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

interface CallTimerProps {
  isConnected: boolean
}

export function CallTimer({ isConnected }: CallTimerProps) {
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isConnected) {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } else {
      setDuration(0)
    }
    return () => clearInterval(timer)
  }, [isConnected])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
        {formatDuration(duration)}
      </Badge>
    </div>
  )
}