"use client";

import { ChatInterface } from "@/components/patient/chat/chat-interface";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ChatPage() {
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleMessage = async (
    message: string,
    files?: File[],
    audio?: File
  ) => {
    try {
      const formData = new FormData();

      if (sessionId) formData.append("session_id", sessionId);
      if (message) formData.append("texts", message);
      if (audio) formData.append("audios", audio);
      if (files?.length) files.forEach((f) => formData.append("files", f));

      const response = await fetch("https://sih-chat-bot.onrender.com/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to send message");
      const data = await response.json();
      if (!sessionId && data.session_id) setSessionId(data.session_id);

      return data.response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ChatInterface onSendMessage={handleMessage} />
    </div>
  );
}
