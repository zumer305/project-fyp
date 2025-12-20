import { useRef, useEffect } from "react";
import { MapPin, Compass, Globe } from "lucide-react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";

/**
 * Message interface
 */
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
}

/**
 * ChatContainer Component
 * Premium scrollable chat area with decorative background elements
 */
const ChatContainer = ({ messages, isTyping }: ChatContainerProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 chat-gradient" />
      
      {/* Decorative floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      {/* Decorative icons */}
      <div className="absolute top-24 right-16 text-muted-foreground/10 animate-float" style={{ animationDelay: '-1s' }}>
        <MapPin className="w-8 h-8" />
      </div>
      <div className="absolute bottom-32 left-20 text-muted-foreground/10 animate-float" style={{ animationDelay: '-4s' }}>
        <Compass className="w-10 h-10" />
      </div>
      <div className="absolute top-1/3 right-1/4 text-muted-foreground/10 animate-float" style={{ animationDelay: '-2s' }}>
        <Globe className="w-6 h-6" />
      </div>

      {/* Scrollable messages area */}
      <div className="relative z-10 h-full overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-5 max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}

          {isTyping && <TypingIndicator />}

          <div ref={bottomRef} className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
