import { Plane } from "lucide-react";

/**
 * TypingIndicator Component
 * Premium animated typing indicator with floating effect
 */
const TypingIndicator = () => {
  return (
    <div className="flex items-end gap-3 self-start animate-fade-in">
      {/* Mini avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border/50">
        <Plane className="w-4 h-4 text-primary" />
      </div>
      
      {/* Typing bubble */}
      <div className="glass border border-border/50 px-5 py-3.5 rounded-2xl rounded-bl-sm message-shadow">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-primary to-accent animate-typing-bounce"
              style={{
                animationDelay: `${index * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
