"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, Settings, Maximize, Users, Bot } from "lucide-react"

interface VideoInterfaceProps {
  isDoctor?: boolean
}

export function VideoInterface({ isDoctor = false }: VideoInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isAvatarMode, setIsAvatarMode] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connected")
  const [callDuration, setCallDuration] = useState(0)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  // Simulate call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // WebRTC implementation would go here
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
    // WebRTC implementation would go here
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
    // Screen sharing implementation would go here
  }

  const toggleAvatarMode = () => {
    setIsAvatarMode(!isAvatarMode)
    // Text2Vid avatar implementation would go here
  }

  const endCall = () => {
    // End call implementation
    window.location.href = isDoctor ? "/doctor/dashboard" : "/patient/dashboard"
  }

  return (
    <div className="relative h-full bg-gradient-to-br from-background to-accent/10">
      {/* Connection Status */}
      <div className="absolute top-4 left-4 z-10">
        <Badge
          variant={
            connectionStatus === "connected"
              ? "secondary"
              : connectionStatus === "connecting"
                ? "default"
                : "destructive"
          }
          className="flex items-center gap-2"
        >
          <div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === "connected"
                ? "bg-secondary animate-pulse"
                : connectionStatus === "connecting"
                  ? "bg-primary animate-pulse"
                  : "bg-destructive"
            }`}
          />
          {connectionStatus === "connected"
            ? "Connected"
            : connectionStatus === "connecting"
              ? "Connecting..."
              : "Disconnected"}
        </Badge>
      </div>

      {/* Call Duration */}
      <div className="absolute top-4 right-4 z-10">
        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
          {formatDuration(callDuration)}
        </Badge>
      </div>

      {/* Main Video Area */}
      <div className="h-full flex flex-col">
        {/* Remote Video */}
        <div className="flex-1 relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg m-4 overflow-hidden">
          {isAvatarMode ? (
            // Avatar Mode Display
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="text-center space-y-4">
                <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Bot className="w-16 h-16 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">AI Avatar Mode</h3>
                  <p className="text-muted-foreground">Enhanced privacy consultation</p>
                  <Badge className="bg-primary/20 text-primary">Text2Vid Active</Badge>
                </div>
              </div>
            </div>
          ) : (
            // Regular Video Display
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <Avatar className="w-32 h-32 mx-auto">
                  <AvatarImage
                    src={isDoctor ? "/patient-consultation.jpg" : "/doctor-consultation.jpg"}
                    alt="Participant"
                  />
                  <AvatarFallback className="text-2xl">{isDoctor ? "JD" : "SJ"}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{isDoctor ? "John Doe" : "Dr. Sarah Johnson"}</h3>
                  <p className="text-muted-foreground">{isDoctor ? "Patient" : "Cardiologist"}</p>
                  {isVideoOff && <Badge variant="outline">Camera Off</Badge>}
                </div>
              </div>
            </div>
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

          {/* Participant Info */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">2 participants</span>
            </div>
          </div>
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-24 right-4 w-48 h-36 bg-card rounded-lg border shadow-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-muted/20">
            <div className="text-center">
              <Avatar className="w-16 h-16 mx-auto mb-2">
                <AvatarImage src={isDoctor ? "/doctor-consultation.jpg" : "/patient-consultation.jpg"} alt="You" />
                <AvatarFallback>{isDoctor ? "SJ" : "JD"}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">You</p>
              {isVideoOff && (
                <Badge variant="outline" className="text-xs mt-1">
                  Camera Off
                </Badge>
              )}
            </div>
          </div>

          {/* Local Video Controls */}
          <div className="absolute top-2 right-2">
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Maximize className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Control Bar */}
        <div className="p-4">
          <Card className="p-4 bg-card/95 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-4">
              {/* Audio Controls */}
              <Button
                size="lg"
                variant={isMuted ? "destructive" : "secondary"}
                className="rounded-full w-12 h-12"
                onClick={toggleMute}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>

              {/* Video Controls */}
              <Button
                size="lg"
                variant={isVideoOff ? "destructive" : "secondary"}
                className="rounded-full w-12 h-12"
                onClick={toggleVideo}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </Button>

              {/* Screen Share */}
              <Button
                size="lg"
                variant={isScreenSharing ? "default" : "outline"}
                className="rounded-full w-12 h-12"
                onClick={toggleScreenShare}
              >
                <Monitor className="w-5 h-5" />
              </Button>

              {/* Avatar Mode Toggle */}
              <Button
                size="lg"
                variant={isAvatarMode ? "default" : "outline"}
                className="rounded-full w-12 h-12"
                onClick={toggleAvatarMode}
              >
                <Bot className="w-5 h-5" />
              </Button>

              {/* Settings */}
              <Button size="lg" variant="outline" className="rounded-full w-12 h-12 bg-transparent">
                <Settings className="w-5 h-5" />
              </Button>

              {/* End Call */}
              <Button size="lg" variant="destructive" className="rounded-full w-12 h-12 ml-4" onClick={endCall}>
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
