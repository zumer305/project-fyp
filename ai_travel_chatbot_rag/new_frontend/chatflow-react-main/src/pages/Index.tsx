import { useState, useCallback } from "react";
import axios from "axios";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatContainer, { Message } from "@/components/chat/ChatContainer";
import ChatInput from "@/components/chat/ChatInput";

/**
 * API endpoint for the chat backend
 */
const API_URL = "http://127.0.0.1:8000/api/chat/";

/**
 * Generates a unique ID for each message
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Index Page - Premium Chatbot Interface
 */
const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      text: "Hello! ✈️ I'm your AI Travel Assistant. Whether you're dreaming of tropical beaches, mountain adventures, or city explorations, I'm here to help plan your perfect journey. Where shall we begin?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: generateId(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await axios.post(API_URL, {
        query: text,
      });

      const botMessage: Message = {
        id: generateId(),
        text: response.data.reply || "I'm sorry, I couldn't understand that.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: generateId(),
        text: "I'm having trouble connecting right now. Please check your connection and try again. In the meantime, feel free to tell me about your dream destination! 🌍",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Premium header */}
      <ChatHeader />

      {/* Chat messages with decorative background */}
      <ChatContainer messages={messages} isTyping={isTyping} />

      {/* Premium input area */}
      <ChatInput onSend={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default Index;
