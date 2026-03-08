import { useNavigate, useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Bot, Upload, MessageSquare, CreditCard,
  Bell, Settings, LogOut, ChevronLeft, Menu,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "My Chatbot", icon: Bot, path: "/dashboard/chatbot" },
  { title: "Upload Data", icon: Upload, path: "/dashboard/upload" },
  { title: "Chat Viewer", icon: MessageSquare, path: "/dashboard/chats" },
  { title: "Subscription", icon: CreditCard, path: "/dashboard/subscription" },
  { title: "Notifications", icon: Bell, path: "/dashboard/notifications" },
  { title: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card/50 backdrop-blur-xl transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-bold text-lg gradient-text">Zooda AI</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r" />}
                <item.icon className={cn("h-4 w-4 flex-shrink-0", active && "text-primary")} />
                {!collapsed && <span>{item.title}</span>}
                {item.title === "Notifications" && unreadCount > 0 && (
                  <span className={cn("ml-auto bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center", collapsed ? "h-4 w-4 absolute -top-1 -right-1" : "h-5 min-w-5 px-1.5")}>
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Back to Home</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={cn("flex-1 transition-all duration-300", collapsed ? "ml-16" : "ml-64")}>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
