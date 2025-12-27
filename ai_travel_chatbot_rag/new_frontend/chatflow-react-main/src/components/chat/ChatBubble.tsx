import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

/**
 * Props for the ChatBubble component
 */
interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

/**
 * ChatBubble Component
 * Premium chat bubble with glassmorphism and gradient effects
 */
const ChatBubble = ({ message, isUser, timestamp }: ChatBubbleProps) => {
  const formattedTime = timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 max-w-[85%] md:max-w-[75%] animate-message-slide-in",
        isUser ? "items-end self-end" : "items-start self-start"
      )}
    >
      {/* Message bubble with premium styling */}
      <div
        className={cn(
          "relative px-4 py-3 rounded-2xl transition-all duration-300",
          isUser
            ? "user-bubble-gradient text-chat-user-foreground rounded-br-sm glow-primary"
            : "glass border border-border/50 text-chat-bot-foreground rounded-bl-sm message-shadow"
        )}
      >
        {/* Shimmer effect for bot messages */}
        {!isUser && (
          <div className="absolute inset-0 rounded-2xl rounded-bl-sm overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" 
                 style={{ backgroundSize: '200% 100%' }} />
          </div>
        )}
        
        <p className="text-sm leading-relaxed whitespace-pre-wrap relative z-10">
          {message}
        </p>
      </div>

      {/* Timestamp with delivery indicator for user messages */}
      <div className={cn(
        "flex items-center gap-1.5 px-1",
        isUser && "flex-row-reverse"
      )}>
        <span className="text-xs text-muted-foreground/70">{formattedTime}</span>
        {isUser && (
          <div className="flex -space-x-1">
            <Check className="w-3 h-3 text-primary" />
            <Check className="w-3 h-3 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
