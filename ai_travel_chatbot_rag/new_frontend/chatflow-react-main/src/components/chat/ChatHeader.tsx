import { Plane, Sparkles } from "lucide-react";

/**
 * ChatHeader Component
 * Premium header with glassmorphism and animated elements
 */
const ChatHeader = () => {
  return (
    <header className="relative flex items-center gap-4 p-5 glass-strong border-b border-border/50 overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 header-gradient opacity-50" />
      
      {/* Animated glow orb */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      
      {/* Bot avatar with glow effect */}
      <div className="relative z-10">
        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
          <Plane className="w-6 h-6 text-primary-foreground" />
        </div>
        {/* Online pulse indicator */}
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card">
          <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
        </span>
      </div>

      {/* Bot name and status */}
      <div className="flex flex-col relative z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            AI Travel Assistant
          </h1>
          <Sparkles className="w-4 h-4 text-accent animate-pulse-glow" />
        </div>
        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Ready to plan your adventure
        </span>
      </div>
    </header>
  );
};

export default ChatHeader;
