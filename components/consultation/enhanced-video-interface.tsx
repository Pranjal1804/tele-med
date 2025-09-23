"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Monitor, 
  Settings, 
  Maximize, 
  Users, 
  Bot,
  Wifi,
  WifiOff,
  Signal
} from "lucide-react"
import { useWebRTC } from "@/hooks/use-webrtc"
import { Text2VideoAvatar } from "./text2video-avatar"

interface EnhancedVideoInterfaceProps {
  roomId: string
  userId: string
  isDoctor?: boolean
  isInitiator?: boolean
}

export function EnhancedVideoInterface({ 
  roomId, 
  userId, 
  isDoctor = false, 
  isInitiator = false 
}: EnhancedVideoInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const {
    localStream,
    remoteStream,
    isConnected,
    connectionState,
    bandwidthData,
    shouldUseTextToVideo,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    toggleTextToVideo,
  } = useWebRTC({
    roomId,
    userId,
    isInitiator
  })

  // Set video streams
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  // Call duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isConnected) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isConnected])

  // Auto-start call
  useEffect(() => {
    startCall()
  }, [startCall])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleMute = () => {
    const muted = toggleMute()
    setIsMuted(muted)
  }

  const handleVideoToggle = () => {
    const videoOff = toggleVideo()
    setIsVideoOff(videoOff)
  }

  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        setIsScreenSharing(true)
        
        // You would replace the video track in the peer connection here
        console.log('Screen sharing started:', screenStream)
      } else {
        setIsScreenSharing(false)
        // Switch back to camera
      }
    } catch (error) {
      console.error('Error sharing screen:', error)
    }
  }

  const handleEndCall = () => {
    endCall()
    window.location.href = isDoctor ? "/doctor/dashboard" : "/patient/dashboard"
  }

  const getConnectionQuality = () => {
    if (!bandwidthData) return { quality: 'unknown', color: 'text-muted-foreground' }
    
    const { bandwidth } = bandwidthData
    if (bandwidth > 500) return { quality: 'excellent', color: 'text-green-500' }
    if (bandwidth > 200) return { quality: 'good', color: 'text-blue-500' }
    if (bandwidth > 100) return { quality: 'fair', color: 'text-yellow-500' }
    return { quality: 'poor', color: 'text-red-500' }
  }

  const connectionQuality = getConnectionQuality()

  return (
    <div className="relative h-full bg-gradient-to-br from-background to-accent/10">
      {/* Connection Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge
            variant={
              connectionState === "connected"
                ? "secondary"
                : connectionState === "connecting"
                  ? "default"
                  : "destructive"
            }
            className="flex items-center gap-2"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                connectionState === "connected"
                  ? "bg-green-500 animate-pulse"
                  : connectionState === "connecting"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
              }`}
            />
            {connectionState === "connected"
              ? "Connected"
              : connectionState === "connecting"
                ? "Connecting..."
                : "Disconnected"}
          </Badge>

          {/* Bandwidth Information */}
          {bandwidthData && (
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              <Signal className={`w-3 h-3 mr-1 ${connectionQuality.color}`} />
              {Math.round(bandwidthData.bandwidth)} kbps
            </Badge>
          )}

          {shouldUseTextToVideo && (
            <Badge className="bg-primary/20 text-primary">
              <Bot className="w-3 h-3 mr-1" />
              Text2Video Active
            </Badge>
          )}
        </div>

        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
          {formatDuration(callDuration)}
        </Badge>
      </div>

      {/* Main Video Area */}
      <div className="h-full flex flex-col">
        <div className="flex-1 relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg m-4 overflow-hidden">
          {shouldUseTextToVideo ? (
            // Text2Video Mode
            <Text2VideoAvatar
              isActive={shouldUseTextToVideo}
              avatarType={isDoctor ? "doctor" : "patient"}
              onTextSubmit={(text) => {
                console.log('Text submitted for avatar:', text)
              }}
            />
          ) : (
            // Regular Video Mode
            <>
              {/* Remote Video */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Fallback when no remote stream */}
              {!remoteStream && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Avatar className="w-32 h-32 mx-auto">
                      <AvatarImage
                        src={isDoctor ? "/patient-consultation.jpg" : "/doctor-consultation.jpg"}
                        alt="Participant"
                      />
                      <AvatarFallback className="text-2xl">
                        {isDoctor ? "PT" : "DR"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">
                        {isDoctor ? "Waiting for patient..." : "Waiting for doctor..."}
                      </h3>
                      <p className="text-muted-foreground">
                        {connectionState === "connecting" ? "Connecting..." : "Connection pending"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Screen Share Indicator */}
          {isScreenSharing && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-chart-4/20 text-chart-4">
                <Monitor className="w-3 h-3 mr-1" />
                Screen Sharing
              </Badge>
            </div>
          )}

          {/* Connection Quality Indicator */}
          {bandwidthData && (
            <div className="absolute top-4 right-4">
              <Card className="p-2 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Wifi className={`w-3 h-3 ${connectionQuality.color}`} />
                    <span className="capitalize">{connectionQuality.quality}</span>
                  </div>
                  <div className="w-16">
                    <Progress 
                      value={Math.min((bandwidthData.bandwidth / 1000) * 100, 100)} 
                      className="h-1"
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        {!shouldUseTextToVideo && (
          <div className="absolute bottom-24 right-4 w-48 h-36 bg-card rounded-lg border shadow-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Local Video Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/20 to-muted/20">
              {!localStream && (
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarImage 
                      src={isDoctor ? "/doctor-consultation.jpg" : "/patient-consultation.jpg"} 
                      alt="You" 
                    />
                    <AvatarFallback>{isDoctor ? "DR" : "PT"}</AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-muted-foreground">You</p>
                </div>
              )}
            </div>

            {isVideoOff && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <Badge variant="outline" className="text-xs">
                  Camera Off
                </Badge>
              </div>
            )}

            <div className="absolute top-2 right-2">
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Maximize className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Control Bar */}
        <div className="p-4">
          <Card className="p-4 bg-card/95 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-4">
              {/* Audio Controls */}
              <Button
                size="lg"
                variant={isMuted ? "destructive" : "secondary"}
                className="rounded-full w-12 h-12"
                onClick={handleMute}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>

              {/* Video Controls */}
              <Button
                size="lg"
                variant={isVideoOff ? "destructive" : "secondary"}
                className="rounded-full w-12 h-12"
                onClick={handleVideoToggle}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </Button>

              {/* Screen Share */}
              <Button
                size="lg"
                variant={isScreenSharing ? "default" : "outline"}
                className="rounded-full w-12 h-12"
                onClick={handleScreenShare}
              >
                <Monitor className="w-5 h-5" />
              </Button>

              {/* Text2Video Toggle */}
              <Button
                size="lg"
                variant={shouldUseTextToVideo ? "default" : "outline"}
                className="rounded-full w-12 h-12"
                onClick={() => toggleTextToVideo(!shouldUseTextToVideo)}
              >
                <Bot className="w-5 h-5" />
              </Button>

              {/* Settings */}
              <Button size="lg" variant="outline" className="rounded-full w-12 h-12 bg-transparent">
                <Settings className="w-5 h-5" />
              </Button>

              {/* End Call */}
              <Button 
                size="lg" 
                variant="destructive" 
                className="rounded-full w-12 h-12 ml-4" 
                onClick={handleEndCall}
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}