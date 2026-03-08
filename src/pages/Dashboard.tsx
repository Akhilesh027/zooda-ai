import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "../context/AppContext";
import {
  Bot,
  Users,
  MessageSquare,
  Globe,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Database,
  ArrowRight,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const {
    trialDaysLeft,
    subscriptionStatus,
    totalUsers,
    totalMessages,
    businessName,
    botId,
    botStatus,
    botError,
    websiteUrl,
    pdfFiles,
    pagesCrawled,
    chunksCount,
  } = useApp() as any;

  const hasBot = Boolean(botId);
  const ready = botStatus === "ready";
  const processing = botStatus === "processing";
  const errored = botStatus === "error";

  const websiteConnected = Boolean(websiteUrl);
  const pdfCount = Array.isArray(pdfFiles) ? pdfFiles.length : 0;

  const knowledgeLabel = !hasBot
    ? "Not created"
    : ready
    ? "Ready"
    : processing
    ? "Building..."
    : errored
    ? "Error"
    : "Idle";

  const stats = [
    {
      label: "Total Users",
      value: totalUsers ?? 0,
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Total Messages",
      value: totalMessages ?? 0,
      icon: MessageSquare,
      color: "text-primary",
    },
    {
      label: "Website",
      value: websiteConnected ? "Connected" : "Not Set",
      icon: Globe,
      color: websiteConnected ? "text-primary" : "text-muted-foreground",
    },
    {
      label: "PDFs Uploaded",
      value: `${pdfCount}/2`,
      icon: FileText,
      color: pdfCount > 0 ? "text-primary" : "text-muted-foreground",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            {businessName || "Your Business"}
          </p>
        </div>

        {/* Trial / Subscription Banner */}
        {subscriptionStatus ? (
          <div
            className={cn(
              "rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border",
              subscriptionStatus === "expired"
                ? "border-destructive/30 bg-destructive/5"
                : subscriptionStatus === "renewed"
                ? "border-primary/30 bg-primary/5"
                : Number(trialDaysLeft ?? 0) <= 5
                ? "border-amber-500/30 bg-amber-500/5"
                : "border-primary/30 bg-primary/5"
            )}
          >
            <div className="flex items-start gap-3">
              {subscriptionStatus === "expired" ? (
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              ) : (
                <Clock className="h-5 w-5 text-primary mt-0.5" />
              )}

              <div>
                <p className="font-semibold text-sm">
                  {subscriptionStatus === "expired"
                    ? "Subscription Expired"
                    : subscriptionStatus === "renewed"
                    ? "Premium Active"
                    : `Trial Active — ${trialDaysLeft ?? 0} days left`}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {subscriptionStatus === "expired"
                    ? "Renew your plan to restore chatbot access."
                    : subscriptionStatus === "renewed"
                    ? "All premium features are active."
                    : "Upgrade to premium for uninterrupted access and more usage."}
                </p>
              </div>
            </div>

            {subscriptionStatus !== "renewed" && (
              <Link to="/dashboard/subscription">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {subscriptionStatus === "expired" ? "Renew Now" : "Upgrade"}
                </Button>
              </Link>
            )}
          </div>
        ) : null}

        {/* Bot Status Card */}
        <div className="glass rounded-xl p-5 border border-border">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
            <div className="flex items-start gap-3 min-w-0">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/20 flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-semibold truncate">
                    {businessName || "My Chatbot"}
                  </p>

                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium border",
                      ready
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : processing
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-600"
                        : errored
                        ? "border-destructive/20 bg-destructive/10 text-destructive"
                        : "border-border bg-muted text-muted-foreground"
                    )}
                  >
                    {knowledgeLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {ready ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-primary">Knowledge base is ready</span>
                    </>
                  ) : processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                      <span className="text-amber-500">
                        Building your knowledge base...
                      </span>
                    </>
                  ) : errored ? (
                    <>
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-destructive">Build failed</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      Create your chatbot to get started
                    </span>
                  )}
                </div>

                {hasBot ? (
                  <p className="text-[11px] text-muted-foreground mt-2 break-all">
                    Bot ID: {String(botId)}
                  </p>
                ) : null}

                {errored && botError ? (
                  <p className="text-xs text-destructive mt-2">{botError}</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {!hasBot ? (
                <Link to="/dashboard/wizard">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Create Chatbot
                  </Button>
                </Link>
              ) : (
                <>
                  {ready ? (
                    <Link to="/chat">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Test Chat
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="bg-primary text-primary-foreground">
                      Test Chat
                    </Button>
                  )}

                  <Link to="/dashboard/wizard">
                    <Button variant="outline">
                      {processing
                        ? "View Build"
                        : ready
                        ? "Update Knowledge"
                        : "Build / Rebuild"}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Meta */}
          {hasBot ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-border text-sm">
              <div className="rounded-lg bg-background/40 p-3">
                <p className="text-muted-foreground flex items-center gap-2 mb-1">
                  <Globe className="h-4 w-4" />
                  Website
                </p>
                <p className="truncate font-medium">{websiteUrl || "Not set"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Pages crawled:{" "}
                  <span className="font-medium">{pagesCrawled ?? 0}</span>
                </p>
              </div>

              <div className="rounded-lg bg-background/40 p-3">
                <p className="text-muted-foreground flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4" />
                  PDFs
                </p>
                <p className="font-medium">{pdfCount} file(s)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max allowed: 2 PDFs
                </p>
              </div>

              <div className="rounded-lg bg-background/40 p-3">
                <p className="text-muted-foreground flex items-center gap-2 mb-1">
                  <Database className="h-4 w-4" />
                  Knowledge
                </p>
                <p className="font-medium">
                  Chunks: <span>{chunksCount ?? 0}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: <span className="font-medium">{knowledgeLabel}</span>
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <s.icon className={cn("h-4 w-4", s.color)} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {ready ? (
              <Link to="/chat" className="glass-hover rounded-xl p-5 block border border-border">
                <Bot className="h-5 w-5 text-primary mb-2" />
                <p className="font-medium text-sm">Test Your Chatbot</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Open the real chat interface
                </p>
              </Link>
            ) : (
              <div className="rounded-xl p-5 border border-border bg-muted/30 opacity-70 cursor-not-allowed">
                <Bot className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="font-medium text-sm">Test Your Chatbot</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Available after the knowledge base is ready
                </p>
              </div>
            )}

            <Link
              to="/dashboard/chats"
              className="glass-hover rounded-xl p-5 block border border-border"
            >
              <MessageSquare className="h-5 w-5 text-primary mb-2" />
              <p className="font-medium text-sm">View Conversations</p>
              <p className="text-xs text-muted-foreground mt-1">
                See all user chats
              </p>
            </Link>

            <Link
              to="/dashboard/wizard"
              className="glass-hover rounded-xl p-5 block border border-border"
            >
              <FileText className="h-5 w-5 text-primary mb-2" />
              <p className="font-medium text-sm">
                {hasBot ? "Build / Update Knowledge" : "Create Chatbot"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Website + PDFs → knowledge base
              </p>
            </Link>
          </div>
        </div>

        {/* Empty / CTA Section */}
        {!hasBot && (
          <div className="rounded-xl border border-dashed border-border p-6 text-center bg-card/30">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Create your first chatbot</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
              Add your business name, connect your website, upload PDFs, and build
              a knowledge base for your AI assistant.
            </p>
            <Link to="/dashboard/wizard">
              <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                Start Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}