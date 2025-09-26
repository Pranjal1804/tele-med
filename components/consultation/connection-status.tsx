"use client"

import { Badge } from "@/components/ui/badge"

interface ConnectionStatusProps {
  state: RTCPeerConnectionState
}

export function ConnectionStatus({ state }: ConnectionStatusProps) {
  const getStatusInfo = () => {
    switch (state) {
      case 'connected':
        return { text: 'Connected', variant: 'secondary', pulse: true, color: 'bg-green-500' }
      case 'connecting':
        return { text: 'Connecting...', variant: 'default', pulse: true, color: 'bg-yellow-500' }
      case 'failed':
      case 'disconnected':
      case 'closed':
        return { text: 'Disconnected', variant: 'destructive', pulse: false, color: 'bg-red-500' }
      default:
        return { text: 'Initializing...', variant: 'outline', pulse: false, color: 'bg-gray-500' }
    }
  }

  const { text, variant, pulse, color } = getStatusInfo()

  return (
    <div className="absolute top-4 left-4 z-10">
      <Badge variant={variant as any} className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color} ${pulse ? 'animate-pulse' : ''}`} />
        {text}
      </Badge>
    </div>
  )
}