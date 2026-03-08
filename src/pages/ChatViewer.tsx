import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { MessageSquare, User, Bot, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatViewer() {
  const { chatSessions, trialActive, subscriptionStatus } = useApp();
  const canView = trialActive || subscriptionStatus === "renewed";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Chat Viewer</h1>
          <p className="text-muted-foreground text-sm">View all conversations with your chatbot.</p>
        </div>

        {!canView && (
          <div className="glass rounded-xl p-8 text-center border border-destructive/20">
            <Lock className="h-8 w-8 mx-auto text-destructive mb-3" />
            <h3 className="font-semibold mb-1">Subscription Expired</h3>
            <p className="text-sm text-muted-foreground">Renew your subscription to view chat history. Messages sent during expiry will appear after renewal.</p>
          </div>
        )}

        {canView && chatSessions.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No conversations yet.</p>
          </div>
        )}

        {canView && chatSessions.map(session => (
          <div key={session.id} className="glass rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{session.userName}</p>
                <p className="text-xs text-muted-foreground">{session.startedAt.toLocaleDateString()} · {session.messages.length} messages</p>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {session.messages.map(msg => (
                <div key={msg.id} className={cn("flex gap-2", msg.sender === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[70%] rounded-2xl px-3 py-2 text-sm",
                    msg.sender === "user" ? "bg-primary/10 border border-primary/20 rounded-tr-md" : "bg-muted rounded-tl-md"
                  )}>
                    <p>{msg.text}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
