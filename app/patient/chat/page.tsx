"use client";

import { ChatInterface } from "@/components/patient/chat/chat-interface";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ChatPage() {
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleMessage = async (message: string, files?: File[]) => {
    try {
      const formData = new FormData();

      // Add session ID if exists
      if (sessionId) {
        formData.append("session_id", sessionId);
      }

      // Add message
      formData.append("texts", message);

      // Add files if any
      if (files?.length) {
        files.forEach((file) => formData.append("files", file));
      }

      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();

      // Store session ID from first response
      if (!sessionId && data.session_id) {
        setSessionId(data.session_id);
      }

      return data.response;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ChatInterface onSendMessage={handleMessage} />
    </div>
  );
}
