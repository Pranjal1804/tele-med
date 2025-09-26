"use client"

import { useState } from "react"
import { useWebRTC } from "@/hooks/use-webrtc"
import { VideoPlayer } from "./video-player"
import { ControlBar } from "./control-bar"
import { ConnectionStatus } from "./connection-status"
import { CallTimer } from "./call-timer"
import { Text2VideoAvatar } from "./text2video-avatar"
import { Socket } from "socket.io-client"

interface EnhancedVideoInterfaceProps {
  roomId: string
  userId: string
  isDoctor: boolean
  isInitiator: boolean
  socket: Socket | null;
}

export function EnhancedVideoInterface({ roomId, userId, isDoctor, isInitiator, socket }: EnhancedVideoInterfaceProps) {
  const {
    localStream,
    remoteStream,
    connectionState,
    endCall,
    toggleMute,
    toggleVideo,
    isMuted,
    isVideoOff,
  } = useWebRTC({ roomId, userId, isDoctor, isInitiator, socket });

  const [isAvatarMode, setIsAvatarMode] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-screen bg-black relative">
      <ConnectionStatus state={connectionState} />
      <CallTimer isConnected={connectionState === 'connected'} />

      <div className="flex-1 relative flex items-center justify-center">
        {remoteStream && !isAvatarMode ? (
          <VideoPlayer stream={remoteStream} isRemote />
        ) : (
          <div className="text-white text-center">
            {connectionState === 'connecting' && <p>Connecting...</p>}
            {connectionState === 'new' && <p>Initializing...</p>}
            {connectionState === 'failed' && <p className="text-destructive">Connection failed.</p>}
            {isAvatarMode && <Text2VideoAvatar isActive={true} avatarType={isDoctor ? 'patient' : 'doctor'} />}
          </div>
        )}

        {localStream && (
          <div className="absolute bottom-28 right-6 w-48 h-36 rounded-lg overflow-hidden border-2 border-white/20 shadow-2xl">
            <VideoPlayer stream={localStream} isMuted={true} />
          </div>
        )}
      </div>

      <ControlBar
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={false}
        isAvatarMode={isAvatarMode}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={() => alert("Not implemented.")}
        onToggleAvatarMode={() => setIsAvatarMode(!isAvatarMode)}
        onEndCall={endCall}
      />
    </div>
  );
}