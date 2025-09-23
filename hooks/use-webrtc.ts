"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseWebRTCProps {
  roomId: string
  userId: string
  isInitiator?: boolean
}

interface BandwidthData {
  bandwidth: number
  timestamp: number
  rtt: number
}

export function useWebRTC({ roomId, userId, isInitiator = false }: UseWebRTCProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [bandwidthData, setBandwidthData] = useState<BandwidthData | null>(null)
  const [shouldUseTextToVideo, setShouldUseTextToVideo] = useState(false)
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new')

  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const bandwidthMonitorRef = useRef<NodeJS.Timeout | null>(null)

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  }

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000')
    setSocket(newSocket)

    newSocket.emit('join-room', roomId, userId)

    return () => {
      newSocket.disconnect()
    }
  }, [roomId, userId])

  // Bandwidth monitoring function
  const monitorBandwidth = useCallback(async () => {
    if (!peerConnection.current) return

    try {
      const stats = await peerConnection.current.getStats()
      let bytesReceived = 0
      let bytesSent = 0
      let rtt = 0

      stats.forEach((report) => {
        if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
          bytesReceived = report.bytesReceived || 0
        }
        if (report.type === 'outbound-rtp' && report.mediaType === 'video') {
          bytesSent = report.bytesSent || 0
        }
        if (report.type === 'candidate-pair' && report.state === 'succeeded') {
          rtt = report.currentRoundTripTime * 1000 || 0 // Convert to ms
        }
      })

      const now = Date.now()
      const timeDiff = now - (bandwidthData?.timestamp || now - 1000)
      const bandwidth = ((bytesReceived + bytesSent) * 8) / (timeDiff / 1000) / 1000 // kbps

      const newBandwidthData: BandwidthData = {
        bandwidth,
        timestamp: now,
        rtt
      }

      setBandwidthData(newBandwidthData)

      // Send bandwidth data to server
      if (socket) {
        socket.emit('bandwidth-update', roomId, {
          bandwidth,
          userId,
          timestamp: now,
          rtt
        })
      }

    } catch (error) {
      console.error('Error monitoring bandwidth:', error)
    }
  }, [socket, roomId, userId, bandwidthData])

  // Start bandwidth monitoring
  useEffect(() => {
    if (isConnected) {
      bandwidthMonitorRef.current = setInterval(monitorBandwidth, 2000) // Monitor every 2 seconds
    }

    return () => {
      if (bandwidthMonitorRef.current) {
        clearInterval(bandwidthMonitorRef.current)
      }
    }
  }, [isConnected, monitorBandwidth])

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(rtcConfig)

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', roomId, event.candidate)
      }
    }

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0])
    }

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState)
      setIsConnected(pc.connectionState === 'connected')
    }

    return pc
  }, [socket, roomId])

  // Get user media
  const getUserMedia = useCallback(async (constraints: MediaStreamConstraints = { video: true, audio: true }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setLocalStream(stream)
      return stream
    } catch (error) {
      console.error('Error accessing media devices:', error)
      throw error
    }
  }, [])

  // Start call
  const startCall = useCallback(async () => {
    try {
      const stream = await getUserMedia()
      
      peerConnection.current = createPeerConnection()
      
      // Add tracks to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream)
      })

      if (isInitiator) {
        const offer = await peerConnection.current.createOffer()
        await peerConnection.current.setLocalDescription(offer)
        
        if (socket) {
          socket.emit('offer', roomId, offer)
        }
      }
    } catch (error) {
      console.error('Error starting call:', error)
    }
  }, [getUserMedia, createPeerConnection, isInitiator, socket, roomId])

  // Handle socket events
  useEffect(() => {
    if (!socket) return

    socket.on('offer', async (offer) => {
      if (!peerConnection.current) {
        const stream = await getUserMedia()
        peerConnection.current = createPeerConnection()
        
        stream.getTracks().forEach((track) => {
          peerConnection.current?.addTrack(track, stream)
        })
      }

      await peerConnection.current.setRemoteDescription(offer)
      const answer = await peerConnection.current.createAnswer()
      await peerConnection.current.setLocalDescription(answer)
      
      socket.emit('answer', roomId, answer)
    })

    socket.on('answer', async (answer) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(answer)
      }
    })

    socket.on('ice-candidate', async (candidate) => {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(candidate)
      }
    })

    socket.on('low-bandwidth-detected', (data) => {
      console.log('Low bandwidth detected:', data)
      if (data.shouldActivateTextToVideo) {
        setShouldUseTextToVideo(true)
      }
    })

    socket.on('text2video-activated', (activatedUserId) => {
      console.log('Text2Video activated by user:', activatedUserId)
    })

    return () => {
      socket.off('offer')
      socket.off('answer')
      socket.off('ice-candidate')
      socket.off('low-bandwidth-detected')
      socket.off('text2video-activated')
    }
  }, [socket, createPeerConnection, getUserMedia, roomId])

  // Toggle Text2Video mode
  const toggleTextToVideo = useCallback((enabled: boolean) => {
    setShouldUseTextToVideo(enabled)
    if (socket) {
      if (enabled) {
        socket.emit('activate-text2video', roomId, userId)
      } else {
        socket.emit('deactivate-text2video', roomId, userId)
      }
    }
  }, [socket, roomId, userId])

  // Mute/unmute audio
  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        return !audioTrack.enabled
      }
    }
    return false
  }, [localStream])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        return !videoTrack.enabled
      }
    }
    return false
  }, [localStream])

  // End call
  const endCall = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    
    if (peerConnection.current) {
      peerConnection.current.close()
    }
    
    if (bandwidthMonitorRef.current) {
      clearInterval(bandwidthMonitorRef.current)
    }
    
    setLocalStream(null)
    setRemoteStream(null)
    setIsConnected(false)
    setBandwidthData(null)
  }, [localStream])

  return {
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
  }
}