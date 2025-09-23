"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Mic, MicOff, Volume2, VolumeX, FileText, ImageIcon } from "lucide-react"

interface Message {
  id: string
  sender: "doctor" | "patient" | "system"
  content: string
  timestamp: Date
  type: "text" | "voice" | "file"
  isTranscribed?: boolean
}

interface ChatPanelProps {
  isDoctor?: boolean
}

export function ChatPanel({ isDoctor = false }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "system",
      content: "Consultation started. All messages are encrypted and HIPAA compliant.",
      timestamp: new Date(Date.now() - 300000),
      type: "text",
    },
    {
      id: "2",
      sender: isDoctor ? "patient" : "doctor",
      content: "Hello! I'm ready to begin our consultation.",
      timestamp: new Date(Date.now() - 240000),
      type: "text",
    },
    {
      id: "3",
      sender: isDoctor ? "doctor" : "patient",
      content: "Great! I've reviewed your medical history. Let's discuss your symptoms.",
      timestamp: new Date(Date.now() - 180000),
      type: "text",
    },
    {
      id: "4",
      sender: isDoctor ? "patient" : "doctor",
      content: "I've been experiencing chest pain for the past few days.",
      timestamp: new Date(Date.now() - 120000),
      type: "voice",
      isTranscribed: true,
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: isDoctor ? "doctor" : "patient",
      content: newMessage,
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate response (in real app, this would be handled by WebSocket)
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: isDoctor ? "patient" : "doctor",
        content: "Thank you for that information. I understand your concern.",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Speech-to-Text implementation would go here
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        setIsRecording(false)
        const voiceMessage: Message = {
          id: Date.now().toString(),
          sender: isDoctor ? "doctor" : "patient",
          content: "This is a voice message that was transcribed using Speech-to-Text.",
          timestamp: new Date(),
          type: "voice",
          isTranscribed: true,
        }
        setMessages((prev) => [...prev, voiceMessage])
      }, 3000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getSenderName = (sender: string) => {
    if (sender === "system") return "System"
    if (sender === "doctor") return isDoctor ? "You" : "Dr. Sarah Johnson"
    return isDoctor ? "John Doe" : "You"
  }

  const getSenderAvatar = (sender: string) => {
    if (sender === "system") return null
    if (sender === "doctor") return isDoctor ? "/doctor-consultation.jpg" : "/doctor-consultation.jpg"
    return isDoctor ? "/patient-consultation.jpg" : "/patient-consultation.jpg"
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">Chat</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <FileText className="w-3 h-3 mr-1" />
              Encrypted
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              className="h-8 w-8 p-0"
            >
              {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === (isDoctor ? "doctor" : "patient") ? "flex-row-reverse" : ""
                }`}
              >
                {message.sender !== "system" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={getSenderAvatar(message.sender) || "/placeholder.svg"} alt="Avatar" />
                    <AvatarFallback className="text-xs">
                      {getSenderName(message.sender)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`flex-1 space-y-1 ${
                    message.sender === (isDoctor ? "doctor" : "patient") ? "text-right" : ""
                  }`}
                >
                  {message.sender !== "system" && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{getSenderName(message.sender)}</span>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.type === "voice" && (
                        <Badge variant="outline" className="text-xs">
                          <Mic className="w-2 h-2 mr-1" />
                          Voice
                        </Badge>
                      )}
                    </div>
                  )}

                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-lg text-sm ${
                      message.sender === "system"
                        ? "bg-muted text-muted-foreground text-center w-full"
                        : message.sender === (isDoctor ? "doctor" : "patient")
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                    }`}
                  >
                    {message.content}
                    {message.isTranscribed && (
                      <div className="text-xs opacity-75 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Transcribed
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isRecording && (
              <div className="flex justify-center">
                <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  Recording... Speak now
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1"
              />
              <Button size="sm" variant="outline" className="px-3 bg-transparent">
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>

            <Button
              size="sm"
              variant={isRecording ? "destructive" : "outline"}
              onClick={toggleRecording}
              className="px-3"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            <Button size="sm" onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mt-2 text-center">
            Messages are encrypted and HIPAA compliant • STT/TTS enabled
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
