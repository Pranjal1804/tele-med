"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { 
  Users, 
  Video, 
  MessageSquare, 
  Wifi, 
  PlayCircle,
  PauseCircle,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  VideoOff,
  WifiOff,
  Zap,
  Volume2
} from "lucide-react"

interface BandwidthSimulation {
  name: string
  speed: string
  quality: 'excellent' | 'good' | 'poor' | 'critical'
  videoEnabled: boolean
  textToVideoActive: boolean
  maxBitrate: number
  simulatedLatency: number
}

interface TextToVideoMessage {
  id: string
  text: string
  sender: 'doctor' | 'patient'
  timestamp: number
  isConverted?: boolean
}

export function DemoController() {
  const [isRunning, setIsRunning] = useState(false)
  const [demoLogs, setDemoLogs] = useState<string[]>([])
  const [simulatedBandwidth, setSimulatedBandwidth] = useState<BandwidthSimulation>({
    name: 'High Speed (Fiber)',
    speed: '50+ Mbps',
    quality: 'excellent',
    videoEnabled: true,
    textToVideoActive: false,
    maxBitrate: 2000,
    simulatedLatency: 20
  })

  // Video refs
  const doctorVideoRef = useRef<HTMLVideoElement>(null)
  const patientVideoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Streams
  const [originalStream, setOriginalStream] = useState<MediaStream | null>(null)
  const [throttledStream, setThrottledStream] = useState<MediaStream | null>(null)
  const [isStreamActive, setIsStreamActive] = useState(false)
  
  // Text-to-Video simulation
  const [messages, setMessages] = useState<TextToVideoMessage[]>([])
  const [currentSpeaking, setCurrentSpeaking] = useState<string | null>(null)
  const [avatarMode, setAvatarMode] = useState(false)

  // Network throttling
  const [customBandwidth, setCustomBandwidth] = useState([2000])
  const [realTimeStats, setRealTimeStats] = useState({
    bitrate: 0,
    fps: 0,
    latency: 0,
    packetsLost: 0
  })

  const addLog = (message: string) => {
    setDemoLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const bandwidthScenarios: BandwidthSimulation[] = [
    {
      name: 'High Speed (Fiber)',
      speed: '50+ Mbps',
      quality: 'excellent',
      videoEnabled: true,
      textToVideoActive: false,
      maxBitrate: 2000,
      simulatedLatency: 20
    },
    {
      name: 'Medium Speed (Broadband)',
      speed: '5-20 Mbps',
      quality: 'good',
      videoEnabled: true,
      textToVideoActive: false,
      maxBitrate: 800,
      simulatedLatency: 50
    },
    {
      name: 'Low Speed (Mobile 3G)',
      speed: '1-5 Mbps',
      quality: 'poor',
      videoEnabled: false,
      textToVideoActive: true,
      maxBitrate: 200,
      simulatedLatency: 150
    },
    {
      name: 'Very Low Speed (2G)',
      speed: '<1 Mbps',
      quality: 'critical',
      videoEnabled: false,
      textToVideoActive: true,
      maxBitrate: 50,
      simulatedLatency: 300
    }
  ]

  // Initialize camera
  const initializeCamera = async () => {
    try {
      addLog('🎥 Requesting camera and microphone access...')
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      setOriginalStream(stream)
      setIsStreamActive(true)
      
      // Set original quality stream for doctor view
      if (doctorVideoRef.current) {
        doctorVideoRef.current.srcObject = stream
      }

      addLog('✅ Camera and microphone connected successfully')
      addLog(`📊 Video: ${stream.getVideoTracks()[0]?.getSettings().width}x${stream.getVideoTracks()[0]?.getSettings().height}`)
      addLog(`🎙️ Audio: ${stream.getAudioTracks()[0]?.getSettings().sampleRate}Hz`)

      return stream
    } catch (error) {
      addLog(`❌ Camera access failed: ${error}`)
      throw error
    }
  }

  // Apply bandwidth throttling with real visual effects
  const applyBandwidthThrottling = useCallback(async (bandwidth: BandwidthSimulation) => {
    if (!originalStream) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size based on quality
    let width = 640, height = 480
    if (bandwidth.quality === 'excellent') {
      width = 1280; height = 720
    } else if (bandwidth.quality === 'good') {
      width = 854; height = 480  
    } else if (bandwidth.quality === 'poor') {
      width = 320; height = 240
    } else {
      width = 160; height = 120
    }

    canvas.width = width
    canvas.height = height

    if (bandwidth.videoEnabled) {
      // Create video element for processing
      const videoElement = document.createElement('video')
      videoElement.srcObject = originalStream
      videoElement.play()

      const processFrame = () => {
        if (videoElement.readyState >= 2) {
          // Apply quality reduction based on bandwidth
          ctx.save()
          
          // Lower quality = more compression artifacts
          if (bandwidth.quality === 'poor') {
            ctx.filter = 'blur(1px) contrast(0.8)'
          } else if (bandwidth.quality === 'critical') {
            ctx.filter = 'blur(2px) contrast(0.6) saturate(0.5)'
          }

          ctx.drawImage(videoElement, 0, 0, width, height)
          ctx.restore()

          // Add compression artifacts for lower quality
          if (bandwidth.quality === 'poor' || bandwidth.quality === 'critical') {
            const imageData = ctx.getImageData(0, 0, width, height)
            const data = imageData.data
            
            // Reduce color depth to simulate compression
            for (let i = 0; i < data.length; i += 4) {
              if (bandwidth.quality === 'critical') {
                data[i] = Math.floor(data[i] / 32) * 32     // R
                data[i + 1] = Math.floor(data[i + 1] / 32) * 32 // G  
                data[i + 2] = Math.floor(data[i + 2] / 32) * 32 // B
              } else {
                data[i] = Math.floor(data[i] / 16) * 16     // R
                data[i + 1] = Math.floor(data[i + 1] / 16) * 16 // G
                data[i + 2] = Math.floor(data[i + 2] / 16) * 16 // B
              }
            }
            ctx.putImageData(imageData, 0, 0)
          }
        }

        // Adjust frame rate based on quality
        const frameDelay = bandwidth.quality === 'excellent' ? 33 : 
                          bandwidth.quality === 'good' ? 50 :
                          bandwidth.quality === 'poor' ? 100 : 200

        setTimeout(processFrame, frameDelay)
      }

      processFrame()

      // Create new stream from canvas
      const throttledStream = canvas.captureStream(bandwidth.quality === 'excellent' ? 30 : 15)
      
      // Add audio from original stream
      const audioTrack = originalStream.getAudioTracks()[0]
      if (audioTrack) {
        throttledStream.addTrack(audioTrack.clone())
      }

      setThrottledStream(throttledStream)

      // Set to patient view (simulated remote)
      if (patientVideoRef.current) {
        patientVideoRef.current.srcObject = throttledStream
      }

      // Update real-time stats
      setRealTimeStats({
        bitrate: bandwidth.maxBitrate,
        fps: bandwidth.quality === 'excellent' ? 30 : bandwidth.quality === 'good' ? 24 : 15,
        latency: bandwidth.simulatedLatency,
        packetsLost: bandwidth.quality === 'poor' ? 2 : bandwidth.quality === 'critical' ? 8 : 0
      })

      addLog(`📊 Video quality adjusted: ${width}x${height}@${bandwidth.quality === 'excellent' ? 30 : 15}fps`)
    } else {
      // Disable video, show avatar mode
      if (patientVideoRef.current) {
        patientVideoRef.current.srcObject = null
      }
      setAvatarMode(true)
      addLog('📵 Video disabled - Audio only mode')
    }
  }, [originalStream])

  // Simulate text-to-video conversion
  const simulateTextToVideo = async (text: string, sender: 'doctor' | 'patient') => {
    const messageId = `msg_${Date.now()}_${sender}`
    
    // Add original text message
    const textMessage: TextToVideoMessage = {
      id: messageId,
      text,
      sender,
      timestamp: Date.now(),
      isConverted: false
    }
    
    setMessages(prev => [...prev, textMessage])
    addLog(`💬 ${sender}: ${text}`)

    if (simulatedBandwidth.textToVideoActive) {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setCurrentSpeaking(`${sender}-avatar`)
      addLog(`🤖 Converting to ${sender} avatar speech...`)
      
      // Simulate speech synthesis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mark as converted
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, isConverted: true } : m
      ))
      
      setCurrentSpeaking(null)
      addLog(`🎥 Text-to-video conversion completed`)
    }
  }

  // Demo conversation flow
  const runConversationDemo = async () => {
    const conversation = [
      { sender: 'doctor' as const, text: "Hello! How are you feeling today?" },
      { sender: 'patient' as const, text: "Hi Doctor, I've been having headaches for the past week." },
      { sender: 'doctor' as const, text: "I see. Can you describe the pain level from 1 to 10?" },
      { sender: 'patient' as const, text: "It's around 7, especially bad in the mornings." },
      { sender: 'doctor' as const, text: "Any triggers you've noticed? Stress, lack of sleep?" },
      { sender: 'patient' as const, text: "Yes, I've been working late nights recently." }
    ]

    for (const message of conversation) {
      await simulateTextToVideo(message.text, message.sender)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // Initialize demo
  const startDemo = async () => {
    setIsRunning(true)
    try {
      await initializeCamera()
      addLog('🌐 WebRTC peer connection established')
      addLog('🔄 Starting bandwidth simulation...')
      
      // Apply initial bandwidth settings
      await applyBandwidthThrottling(simulatedBandwidth)
      
      addLog('✅ Demo ready! Try changing bandwidth settings.')
    } catch (error) {
      addLog(`❌ Demo initialization failed: ${error}`)
    }
    setIsRunning(false)
  }

  // Handle bandwidth change
  const handleBandwidthChange = async (scenario: BandwidthSimulation) => {
    setSimulatedBandwidth(scenario)
    addLog(`🔄 Switching to: ${scenario.name} (${scenario.speed})`)
    
    if (scenario.textToVideoActive) {
      addLog('⚠️ Low bandwidth detected!')
      addLog('🤖 Activating Text-to-Video mode...')
      setAvatarMode(true)
    } else {
      addLog('✅ Sufficient bandwidth - Full video enabled')
      setAvatarMode(false)
    }
    
    await applyBandwidthThrottling(scenario)
  }

  // Custom bandwidth slider
  const handleCustomBandwidth = async (value: number[]) => {
    setCustomBandwidth(value)
    const kbps = value[0]
    
    let quality: BandwidthSimulation['quality'] = 'critical'
    let videoEnabled = false
    let textToVideoActive = true
    
    if (kbps > 1500) {
      quality = 'excellent'
      videoEnabled = true
      textToVideoActive = false
    } else if (kbps > 800) {
      quality = 'good' 
      videoEnabled = true
      textToVideoActive = false
    } else if (kbps > 200) {
      quality = 'poor'
      videoEnabled = false
      textToVideoActive = true
    }
    
    const customScenario: BandwidthSimulation = {
      name: `Custom (${kbps} Kbps)`,
      speed: `${kbps} Kbps`,
      quality,
      videoEnabled,
      textToVideoActive,
      maxBitrate: kbps,
      simulatedLatency: Math.max(20, 300 - (kbps / 10))
    }
    
    setSimulatedBandwidth(customScenario)
    await applyBandwidthThrottling(customScenario)
  }

  const getBandwidthColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-500'
      case 'good': return 'bg-yellow-500'
      case 'poor': return 'bg-orange-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const resetDemo = () => {
    // Clean up streams
    if (originalStream) {
      originalStream.getTracks().forEach(track => track.stop())
      setOriginalStream(null)
    }
    if (throttledStream) {
      throttledStream.getTracks().forEach(track => track.stop())
      setThrottledStream(null)
    }
    
    setIsStreamActive(false)
    setMessages([])
    setDemoLogs([])
    setCurrentSpeaking(null)
    setAvatarMode(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetDemo()
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Live WebRTC Demo with Real Network Throttling</h1>
        <p className="text-xl text-muted-foreground">
          Real camera feed with actual bandwidth simulation & text-to-video conversion
        </p>
      </div>

      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5" />
            Demo Controller
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <Button
              onClick={startDemo}
              disabled={isRunning || isStreamActive}
              variant="default"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Initializing...
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Demo
                </>
              )}
            </Button>

            <Button
              onClick={runConversationDemo}
              disabled={!isStreamActive}
              variant="outline"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Demo Conversation
            </Button>

            <Button onClick={resetDemo} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Custom Bandwidth Slider */}
          {isStreamActive && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Custom Bandwidth: {customBandwidth[0]} Kbps
              </label>
              <Slider
                value={customBandwidth}
                onValueChange={handleCustomBandwidth}
                max={3000}
                min={50}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>50 Kbps (2G)</span>
                <span>800 Kbps (3G)</span>
                <span>1500 Kbps (4G)</span>
                <span>3000+ Kbps (Fiber)</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Demo Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Live Video Streams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Live WebRTC Video Call
                </span>
                
                <Badge className={`${getBandwidthColor(simulatedBandwidth.quality)} text-white`}>
                  {simulatedBandwidth.name}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Doctor View (Original Quality) */}
                <div className="relative">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                    <video
                      ref={doctorVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      Dr. Smith (Local - Original Quality)
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500 text-white text-xs">
                        HD Local
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Patient View (Throttled Quality) */}
                <div className="relative">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                    {simulatedBandwidth.videoEnabled && !avatarMode ? (
                      <video
                        ref={patientVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
                        {avatarMode && simulatedBandwidth.textToVideoActive ? (
                          <div className="text-center text-white">
                            <div className={`w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto ${
                              currentSpeaking ? 'animate-pulse' : ''
                            }`}>
                              <Users className="w-10 h-10" />
                            </div>
                            <div className="text-sm font-medium">AI Avatar Mode</div>
                            <div className="text-xs opacity-80">
                              {currentSpeaking ? 'Speaking...' : 'Text-to-Video Active'}
                            </div>
                            {currentSpeaking && (
                              <div className="flex justify-center mt-2">
                                <Volume2 className="w-4 h-4 animate-pulse" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-white">
                            <VideoOff className="w-10 h-10 mb-3 mx-auto" />
                            <div className="text-sm font-medium">Video Disabled</div>
                            <div className="text-xs opacity-80">Audio Only Mode</div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      John Doe (Remote - {simulatedBandwidth.quality})
                    </div>
                    
                    {simulatedBandwidth.textToVideoActive && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-purple-500 text-white text-xs animate-pulse">
                          AI Mode
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Real-time Stats */}
              <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-blue-600">{realTimeStats.bitrate}</div>
                  <div className="text-xs text-muted-foreground">Kbps</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-green-600">{realTimeStats.fps}</div>
                  <div className="text-xs text-muted-foreground">FPS</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-yellow-600">{realTimeStats.latency}</div>
                  <div className="text-xs text-muted-foreground">ms</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-red-600">{realTimeStats.packetsLost}</div>
                  <div className="text-xs text-muted-foreground">Lost</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat & Text-to-Video Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Text-to-Video Chat Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-50 rounded-lg p-3 overflow-y-auto space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.sender === 'doctor' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      <div className="text-sm">{message.text}</div>
                      {message.isConverted && (
                        <div className="text-xs mt-1 opacity-75 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Converted to avatar speech
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {currentSpeaking && (
                  <div className="text-center text-purple-600 text-sm animate-pulse">
                    🤖 AI Avatar is speaking...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls & Logs */}
        <div className="space-y-4">
          {/* Bandwidth Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                Network Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {bandwidthScenarios.map((scenario, i) => (
                <Button
                  key={i}
                  variant={simulatedBandwidth.name === scenario.name ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleBandwidthChange(scenario)}
                  disabled={!isStreamActive}
                >
                  <div className={`w-3 h-3 rounded-full mr-2 ${getBandwidthColor(scenario.quality)}`} />
                  <div className="text-left">
                    <div className="font-medium text-xs">{scenario.name}</div>
                    <div className="text-xs text-muted-foreground">{scenario.speed}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Live Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-y-auto text-xs space-y-1 font-mono">
                {demoLogs.map((log, i) => (
                  <div key={i} className={`p-2 rounded text-xs ${
                    log.includes('✅') ? 'bg-green-50 text-green-800' :
                    log.includes('❌') ? 'bg-red-50 text-red-800' :
                    log.includes('⚠️') ? 'bg-yellow-50 text-yellow-800' :
                    log.includes('🤖') ? 'bg-purple-50 text-purple-800' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {log}
                  </div>
                ))}
                {demoLogs.length === 0 && (
                  <div className="text-gray-400 text-center py-8">
                    Click "Start Demo" to begin...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden canvas for video processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}