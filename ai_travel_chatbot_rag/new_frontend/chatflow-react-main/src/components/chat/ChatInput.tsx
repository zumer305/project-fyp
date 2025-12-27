import { useState, KeyboardEvent } from "react";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

/**
 * ChatInput Component
 * Premium input area with glassmorphism and animated send button
 */
const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !disabled) {
      onSend(trimmedInput);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim().length > 0 && !disabled;

  return (
    <div className="relative p-4 md:p-6">
      {/* Gradient border effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative max-w-3xl mx-auto">
        <div className="flex items-center gap-3 p-2 rounded-2xl glass-strong border border-border/50 input-shadow">
          {/* Sparkle decoration */}
          <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
            <Sparkles className="w-5 h-5 text-primary/60" />
          </div>
          
          {/* Text input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Where would you like to go?"
            disabled={disabled}
            className={cn(
              "flex-1 px-2 md:px-4 py-3 bg-transparent",
              "text-foreground placeholder:text-muted-foreground/60",
              "focus:outline-none",
              "transition-all duration-200",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />

          {/* Send button with gradient and glow */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={cn(
              "relative p-3 rounded-xl transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              canSend
                ? "bg-gradient-to-br from-primary to-accent text-primary-foreground glow-primary hover:scale-105 active:scale-95"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            aria-label="Send message"
          >
            <Send className={cn(
              "w-5 h-5 transition-transform duration-300",
              canSend && "translate-x-0.5 -translate-y-0.5"
            )} />
          </button>
        </div>
        
        {/* Hint text */}
        <p className="text-center text-xs text-muted-foreground/50 mt-3">
          Press Enter to send • Powered by AI
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
