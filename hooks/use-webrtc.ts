"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';

interface WebRTCHookProps {
  roomId: string;
  userId: string;
  isDoctor: boolean;
  isInitiator: boolean;
  socket: Socket | null;
}

export const useWebRTC = ({ roomId, userId, isDoctor, isInitiator, socket }: WebRTCHookProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const router = useRouter();

  const endCall = useCallback(() => {
    if (pcRef.current) pcRef.current.close();
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    router.push(isDoctor ? '/doctor/dashboard' : '/patient/dashboard');
  }, [isDoctor, router, localStream]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
        setIsMuted(prev => !prev);
      });
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
        setIsVideoOff(prev => !prev);
      });
    }
  }, [localStream]);

  useEffect(() => {
    if (!socket) return;

    const initialize = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        pcRef.current = pc;

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', { roomId, candidate: event.candidate, senderId: userId });
          }
        };

        pc.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
        };

        pc.onconnectionstatechange = () => {
          if (pcRef.current) setConnectionState(pcRef.current.connectionState);
        };

        if (isInitiator) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('offer', { roomId, offer, senderId: userId });
        }
      } catch (error) {
        console.error("WebRTC Initialization Failed:", error);
      }
    };

    initialize();

    const handleOffer = async (data: { senderId: string; offer: RTCSessionDescriptionInit }) => {
      if (data.senderId === userId || isInitiator || !pcRef.current) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      socket.emit('answer', { roomId, answer, senderId: userId });
    };

    const handleAnswer = async (data: { senderId: string; answer: RTCSessionDescriptionInit }) => {
      if (data.senderId === userId || !pcRef.current || pcRef.current.remoteDescription) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    };

    const handleIceCandidate = async (data: { senderId: string; candidate: RTCIceCandidateInit }) => {
      if (data.senderId === userId || !pcRef.current) return;
      await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    };

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      if (pcRef.current) pcRef.current.close();
      if (localStream) localStream.getTracks().forEach(track => track.stop());
    };
  }, [socket, roomId, userId, isInitiator]);

  return { localStream, remoteStream, connectionState, endCall, toggleMute, toggleVideo, isMuted, isVideoOff };
};