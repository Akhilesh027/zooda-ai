import { useApp } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { Bot, Users, MessageSquare, Shield, ArrowLeft, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminPanel() {
  const { businessName, totalUsers, totalMessages, subscriptionStatus, trialDaysLeft, chatSessions, botSuspended, toggleBotSuspension } = useApp();

  const stats = [
    { label: "Total Bots", value: "1", icon: Bot },
    { label: "Total Users", value: totalUsers, icon: Users },
    { label: "Total Messages", value: totalMessages, icon: MessageSquare },
    { label: "Active Plans", value: subscriptionStatus === "expired" ? "0" : "1", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-7 w-7 rounded bg-primary flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">Admin Panel</span>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">Logout</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        <h1 className="text-2xl font-bold">Overview</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <s.icon className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Bot Management */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Bot Management</h2>
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Bot Name</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Subscription</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Users</th>
                  <th className="text-right px-5 py-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-5 py-4 font-medium">{businessName}</td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full",
                      botSuspended ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                    )}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", botSuspended ? "bg-destructive" : "bg-primary")} />
                      {botSuspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "text-xs",
                      subscriptionStatus === "expired" ? "text-destructive" : "text-primary"
                    )}>
                      {subscriptionStatus === "expired" ? "Expired" : subscriptionStatus === "renewed" ? "Premium" : `Trial (${trialDaysLeft}d)`}
                    </span>
                  </td>
                  <td className="px-5 py-4">{totalUsers}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={toggleBotSuspension} className="text-xs">
                        {botSuspended ? <ToggleLeft className="h-4 w-4 mr-1" /> : <ToggleRight className="h-4 w-4 mr-1" />}
                        {botSuspended ? "Activate" : "Suspend"}
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Chat Sessions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Chats</h2>
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">User</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Messages</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Started</th>
                </tr>
              </thead>
              <tbody>
                {chatSessions.map(s => (
                  <tr key={s.id} className="border-b border-border/50 last:border-0">
                    <td className="px-5 py-3 font-medium">{s.userName}</td>
                    <td className="px-5 py-3 text-muted-foreground">{s.messages.length}</td>
                    <td className="px-5 py-3 text-muted-foreground">{s.startedAt.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
