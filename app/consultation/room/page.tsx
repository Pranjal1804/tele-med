"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "@/hooks/use-session"
import { EnhancedVideoInterface } from "@/components/consultation/enhanced-video-interface"
import { ChatPanel } from "@/components/consultation/chat-panel"
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"
import io, { Socket } from 'socket.io-client';

export default function ConsultationRoom() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const { user, isLoading } = useSession();
  const searchParams = useSearchParams();
  const socketRef = useRef<Socket | null>(null);

  const roomId = searchParams.get('roomId');

  useEffect(() => {
    if (!user || !roomId || socketRef.current) return;

    const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    const socket = io(backendUrl);
    socketRef.current = socket;

    socket.emit('join-room', {
      roomId,
      userId: user.id,
      userType: user.userType,
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, roomId]);

  if (isLoading || !user || !roomId) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Preparing your secure consultation...</p>
        </div>
      </div>
    );
  }

  const isDoctor = user.userType === 'doctor';
  const userId = user.id;
  const isInitiator = isDoctor;

  return (
    <div className="h-screen w-screen flex bg-background">
      <div className="flex-1 flex flex-col">
        <EnhancedVideoInterface
          roomId={roomId}
          userId={userId}
          isDoctor={isDoctor}
          isInitiator={isInitiator}
          socket={socketRef.current}
        />
      </div>

      {isChatOpen && (
        <div className="w-[350px] border-l flex flex-col">
          <ChatPanel
            socket={socketRef.current}
            userId={userId}
            roomId={roomId}
          />
        </div>
      )}

      <div className="absolute top-4 right-4 z-20">
        <Button size="icon" variant={isChatOpen ? "secondary" : "ghost"} onClick={() => setIsChatOpen(!isChatOpen)}>
          {isChatOpen ? <X /> : <MessageSquare />}
        </Button>
      </div>
    </div>
  );
}
