import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

// ─── Typing Indicator Bubble ─────────────────────────────────────────────────


export function TypingIndicator() {
  return (
    <div className="flex items-start gap-4 max-w-4xl">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center border bg-neutral-900 border-white/5">
        <Zap className="text-red-500 fill-current w-4 h-4" />
      </div>

      {/* Bubble */}
      <div className="relative">
        <div className="p-5 rounded-3xl rounded-tl-none shadow-xl bg-neutral-900 border-l-2 border-red-900">
          <div className="flex items-center gap-[6px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                  animation: "typing-bounce 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.18}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Timestamp ghost label */}
        <span className="absolute whitespace-nowrap -bottom-8 -left-0 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Aether AI • thinking…
        </span>
      </div>
    </div>
  );
}

// ─── Usage inside your chat render ───────────────────────────────────────────

/**
 * Props:
 *   chatMsg       – your existing chatMsg object
 *   activeChatId  – your existing activeChatId
 *   isLoading     – boolean: true while waiting for AI response
 *   formatMessageTime – your existing formatter
 */
