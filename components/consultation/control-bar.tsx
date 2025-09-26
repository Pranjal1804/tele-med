"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, Bot } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ControlBarProps {
  isMuted: boolean
  isVideoOff: boolean
  isScreenSharing: boolean
  isAvatarMode: boolean
  onToggleMute: () => void
  onToggleVideo: () => void
  onToggleScreenShare: () => void
  onToggleAvatarMode: () => void
  onEndCall: () => void
}

export function ControlBar({
  isMuted, isVideoOff, isScreenSharing, isAvatarMode,
  onToggleMute, onToggleVideo, onToggleScreenShare, onToggleAvatarMode, onEndCall,
}: ControlBarProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
      <TooltipProvider>
        <Card className="p-3 bg-card/80 backdrop-blur-sm shadow-2xl">
          <div className="flex items-center justify-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" variant={isMuted ? "destructive" : "secondary"} className="rounded-full w-14 h-14" onClick={onToggleMute}>
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" variant={isVideoOff ? "destructive" : "secondary"} className="rounded-full w-14 h-14" onClick={onToggleVideo}>
                  {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isVideoOff ? "Start Video" : "Stop Video"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" variant={isScreenSharing ? "default" : "secondary"} className="rounded-full w-14 h-14" onClick={onToggleScreenShare}>
                  <Monitor className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isScreenSharing ? "Stop Sharing" : "Share Screen"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" variant={isAvatarMode ? "default" : "secondary"} className="rounded-full w-14 h-14" onClick={onToggleAvatarMode}>
                  <Bot className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isAvatarMode ? "Disable AI Avatar" : "Enable AI Avatar"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" variant="destructive" className="rounded-full w-14 h-14 ml-4" onClick={onEndCall}>
                  <PhoneOff className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>End Call</TooltipContent>
            </Tooltip>
          </div>
        </Card>
      </TooltipProvider>
    </div>
  )
}