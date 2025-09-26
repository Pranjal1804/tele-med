"use client"

import { useEffect, useRef } from "react"

interface VideoPlayerProps {
  stream: MediaStream
  isMuted?: boolean
  isRemote?: boolean
}

export function VideoPlayer({ stream, isMuted = false, isRemote = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={isMuted}
      className={`h-full w-full object-cover ${isRemote ? '' : 'scale-x-[-1]'}`} // Mirror local video
    />
  )
}