"use client"

import { useState, useEffect } from "react"
import { EnhancedVideoInterface } from "@/components/consultation/enhanced-video-interface"
import { ChatPanel } from "@/components/consultation/chat-panel"
import { ConsultationSidebar } from "@/components/consultation/consultation-sidebar"
import { Button } from "@/components/ui/button"
import { MessageSquare, FileText, X, TestTube } from "lucide-react"
import { useSession } from "@/hooks/use-session"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function ConsultationRoom() {
  const [activePanel, setActivePanel] = useState<"chat" | "sidebar" | null>("chat")
  const { user, isLoading } = useSession()
  const searchParams = useSearchParams()
  
  const roomId = searchParams.get('roomId') || `room_${Date.now()}`
  const isDoctor = user?.userType === 'doctor'
  const userId = user?.id || 'anonymous'

  const togglePanel = (panel: "chat" | "sidebar") => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  useEffect(() => {
    // Set page title based on user type
    document.title = `${isDoctor ? 'Doctor' : 'Patient'} Consultation - Sahayta`
  }, [isDoctor])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Authentication Required</p>
          <p className="text-sm text-muted-foreground">Please log in to access the consultation room.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Test Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 border-b border-yellow-200 p-2">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <TestTube className="w-4 h-4" />
              <span>Development Mode - Testing Available</span>
            </div>
            <Link href="/test">
              <Button variant="outline" size="sm">
                Run Tests
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          <EnhancedVideoInterface 
            roomId={roomId}
            userId={userId}
            isDoctor={isDoctor} 
          />

          {/* Panel Toggle Buttons */}
          <div className="absolute bottom-20 left-4 flex flex-col gap-2">
            <Button
              variant={activePanel === "chat" ? "default" : "secondary"}
              size="sm"
              onClick={() => togglePanel("chat")}
              className="w-12 h-12 rounded-full"
              data-testid="panel-toggle"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>

            <Button
              variant={activePanel === "sidebar" ? "default" : "secondary"}
              size="sm"
              onClick={() => togglePanel("sidebar")}
              className="w-12 h-12 rounded-full"
              data-testid="panel-toggle"
            >
              <FileText className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Side Panels */}
        {activePanel && (
          <div className="w-80 border-l bg-background/95 backdrop-blur-sm relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActivePanel(null)}
              className="absolute top-2 right-2 z-10 w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Panel Content */}
            <div className="h-full">
              {activePanel === "chat" && <ChatPanel isDoctor={isDoctor} />}
              {activePanel === "sidebar" && <ConsultationSidebar isDoctor={isDoctor} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
