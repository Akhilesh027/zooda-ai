// ChatInterface.tsx (FULL UPDATED)
import { useState, useRef, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import {
  Bot,
  Send,
  ArrowLeft,
  CheckCheck,
  User,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

type ChatMsg = {
  id: string;
  text: string;
  sender: "user" | "bot" | "system";
  timestamp: Date;
  read: boolean;
  sources?: Array<{
    type: "website" | "pdf";
    source: string;
    meta?: any;
    score?: number;
    snippet?: string;
  }>;
  debug?: any;
};

export default function ChatInterface() {
  const { businessName, trialActive, botSuspended, botId, botStatus, askBot } =
    useApp() as any;

  const online = useMemo(
    () =>
      Boolean(botId) &&
      botStatus === "ready" &&
      (botSuspended ? false : true) &&
      (trialActive === false ? false : true),
    [botId, botStatus, botSuspended, trialActive]
  );

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "welcome",
      text: `Hello! Welcome to ${businessName || "our business"}. How can I help you today?`,
      sender: "bot",
      timestamp: new Date(),
      read: true,
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const pushMsg = (msg: ChatMsg) => setMessages((prev) => [...prev, msg]);

  const sendMessage = async () => {
    const q = input.trim();
    if (!q || typing) return;

    pushMsg({
      id: `u-${Date.now()}`,
      text: q,
      sender: "user",
      timestamp: new Date(),
      read: true,
    });

    setInput("");

    // subscription / suspension
    if (trialActive === false || botSuspended === true) {
      pushMsg({
        id: `sys-${Date.now()}`,
        text:
          "⚠️ This business has not renewed its subscription. Your message has been stored and will be delivered once the subscription is active.",
        sender: "system",
        timestamp: new Date(),
        read: true,
      });
      return;
    }

    // bot existence
    if (!botId) {
      pushMsg({
        id: `sys-${Date.now()}`,
        text: "⚠️ Bot is not setup yet. Please complete the setup wizard first.",
        sender: "system",
        timestamp: new Date(),
        read: true,
      });
      return;
    }

    // processing state
    if (botStatus !== "ready") {
      pushMsg({
        id: `sys-${Date.now()}`,
        text: "⏳ Knowledge base is still processing. Please wait a moment and try again.",
        sender: "system",
        timestamp: new Date(),
        read: true,
      });
      return;
    }

    setTyping(true);

    try {
      // ✅ correct signature (payload)
      const res = await askBot({ botId, question: q });

      pushMsg({
        id: `b-${Date.now()}`,
        text: res?.answer || "No answer",
        sender: "bot",
        timestamp: new Date(),
        read: false,
        sources: Array.isArray(res?.sources) ? res.sources : [],
        debug: res?.debug,
      });
    } catch (err: any) {
      pushMsg({
        id: `sys-${Date.now()}`,
        text: `❌ ${err?.message || "Chat failed"}`,
        sender: "system",
        timestamp: new Date(),
        read: true,
      });
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card/80 backdrop-blur-xl flex items-center px-4 gap-3">
        <Link
          to="/dashboard"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>

        <div className="flex-1">
          <p className="font-semibold text-sm">{businessName}</p>
          <p className={cn("text-xs", online ? "text-primary" : "text-muted-foreground")}>
            {online
              ? "Online"
              : botStatus === "processing"
              ? "Building knowledge..."
              : "Offline"}
          </p>
        </div>

        {botId ? (
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            Bot: {String(botId).slice(-8)}
          </span>
        ) : null}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2",
              msg.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.sender === "bot" && (
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
            )}

            <div
              className={cn(
                "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm",
                msg.sender === "user"
                  ? "bg-primary/10 border border-primary/20 rounded-tr-md"
                  : msg.sender === "system"
                  ? "bg-destructive/10 border border-destructive/20 text-destructive rounded-tl-md"
                  : "bg-muted rounded-tl-md"
              )}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {msg.sender === "bot" && msg.sources?.length ? (
                <div className="mt-3 space-y-2">
                  <div className="text-[11px] text-muted-foreground font-medium">Sources</div>

                  {msg.sources.slice(0, 3).map((s, idx) => {
                    const isWeb = s.type === "website";
                    const href = isWeb ? s.meta?.url || s.source : null;

                    return (
                      <div key={idx} className="rounded-xl border border-border bg-card/40 p-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[11px] text-muted-foreground">
                            <span className="capitalize">{s.type}</span>
                            {typeof s.score === "number" ? (
                              <span className="ml-2">score: {s.score}</span>
                            ) : null}
                          </div>

                          {href ? (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-primary inline-flex items-center gap-1 hover:underline"
                            >
                              Open <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">
                              {String(s.source || "").slice(0, 28)}
                            </span>
                          )}
                        </div>

                        {s.snippet ? (
                          <div className="mt-1 text-[11px] text-muted-foreground whitespace-pre-wrap">
                            {s.snippet}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* Optional: show debug (remove in production) */}
              {msg.sender === "bot" && msg.debug ? (
                <details className="mt-2 text-[10px] text-muted-foreground">
                  <summary className="cursor-pointer">Debug</summary>
                  <pre className="whitespace-pre-wrap">{JSON.stringify(msg.debug, null, 2)}</pre>
                </details>
              ) : null}

              <div
                className={cn(
                  "flex items-center gap-1 mt-2",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <span className="text-[10px] text-muted-foreground">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                {msg.sender === "user" && <CheckCheck className="h-3 w-3 text-primary" />}
              </div>
            </div>

            {msg.sender === "user" && (
              <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                <User className="h-3.5 w-3.5 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="flex gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/80 backdrop-blur-xl p-4">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={botStatus !== "ready" ? "Bot is not ready yet..." : "Type a message..."}
            className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
            disabled={typing}
          />
          <button
            onClick={sendMessage}
            disabled={typing || !input.trim()}
            className={cn(
              "h-11 w-11 rounded-xl flex items-center justify-center transition-colors",
              typing || !input.trim()
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {typing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}