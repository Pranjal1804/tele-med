"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Bot, Send, Volume2, VolumeX, Loader2 } from 'lucide-react'

interface Text2VideoAvatarProps {
  isActive: boolean
  onTextSubmit?: (text: string) => void
  avatarType?: 'doctor' | 'patient'
}

export function Text2VideoAvatar({ isActive, onTextSubmit, avatarType = 'doctor' }: Text2VideoAvatarProps) {
  const [inputText, setInputText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  // Generate avatar video from text
  const generateAvatarVideo = async (text: string) => {
    setIsGenerating(true)
    
    try {
      // This would integrate with a Text2Video service like D-ID, Synthesia, or HeyGen
      // For demo purposes, we'll simulate the API call
      
      const response = await fetch('/api/text2video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          avatarType,
          voice: avatarType === 'doctor' ? 'professional' : 'friendly'
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Set the generated video source
        if (videoRef.current && data.videoUrl) {
          videoRef.current.src = data.videoUrl
          videoRef.current.play()
        }
      }
    } catch (error) {
      console.error('Error generating avatar video:', error)
      
      // Fallback to text-to-speech
      if (audioEnabled && synthRef.current) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.pitch = avatarType === 'doctor' ? 0.8 : 1.0
        
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        
        synthRef.current.speak(utterance)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    await generateAvatarVideo(inputText)
    onTextSubmit?.(inputText)
    setInputText('')
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    if (!audioEnabled && synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  if (!isActive) {
    return null
  }

  return (
    <Card className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <Badge className="bg-primary/20 text-primary">
              Text2Video Active
            </Badge>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={toggleAudio}
            className="h-8 w-8 p-0"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        {/* Avatar Video Display */}
        <div className="relative aspect-video bg-gradient-to-br from-accent/20 to-muted/20 rounded-lg overflow-hidden">
          {isGenerating || isSpeaking ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <Bot className="w-12 h-12 text-primary" />
                  </div>
                  {(isGenerating || isSpeaking) && (
                    <div className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {isGenerating ? 'Generating Avatar...' : 'Speaking...'}
                  </p>
                  {isGenerating && (
                    <div className="flex items-center justify-center gap-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs text-muted-foreground">
                        Creating video from text
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                controls={false}
                autoPlay
                muted={!audioEnabled}
                onEnded={() => setIsSpeaking(false)}
              />
              
              {/* Fallback when no video */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AI Avatar Ready
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Text Input */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message to generate avatar video..."
            className="min-h-[80px] resize-none"
            disabled={isGenerating}
          />
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Low bandwidth mode • Audio: {audioEnabled ? 'On' : 'Off'}
            </p>
            
            <Button
              type="submit"
              size="sm"
              disabled={!inputText.trim() || isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Generate
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}