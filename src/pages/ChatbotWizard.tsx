// ChatbotWizard.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Bot,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Upload,
  X,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { Button } from "@/components/ui/button";

type ChatbotWizardProps = {
  navigateTo?: (hash: string) => void;
  user?: any;
  onLoginRequest?: () => void;
};

const BOT_BRAND_NAME = "Zooda AI";
const CHAT_ROUTE = "/chat";
const HOME_ROUTE = "/home";
const POLL_INTERVAL = 1500;
const MAX_PDFS = 2;

const normalizeUrl = (value: string) => {
  const v = (value || "").trim();
  if (!v) return "";
  if (!/^https?:\/\//i.test(v)) return `https://${v}`;
  return v;
};

const isValidUrl = (value: string) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export default function ChatbotWizard({}: ChatbotWizardProps) {
  const navigate = useNavigate();

  const {
    businessName,
    websiteUrl,
    setBusinessName,
    setWebsiteUrl,
    addPdf,
    removePdf,
    pdfFiles,
    setupBot,
    botId,
    botStatus,
    botError,
    fetchBotStatus,
  } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(businessName || "");
  const [url, setUrl] = useState(websiteUrl || "");
  const [localError, setLocalError] = useState("");
  const [completed, setCompleted] = useState(false);

  const [pagesCrawled, setPagesCrawled] = useState<number>(0);
  const [chunksCount, setChunksCount] = useState<number>(0);
  const [lastIngest, setLastIngest] = useState<any>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const pollRef = useRef<number | null>(null);

  const normalizedUrl = useMemo(() => normalizeUrl(url), [url]);
  const urlOk = useMemo(() => isValidUrl(normalizedUrl), [normalizedUrl]);
  const processing = botStatus === "processing";

  const goToChat = () => {
    navigate(CHAT_ROUTE);
  };

  const goToHome = () => {
    navigate(HOME_ROUTE);
  };

  const stopPolling = () => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const updateProgress = (st: any) => {
    if (st?.bot) {
      setPagesCrawled(st.bot.pagesCrawled || 0);
      setChunksCount(st.bot.chunksCount || 0);
      setLastIngest(st.bot.lastIngest || null);
    }
  };

  const handleStatusResult = (st: any) => {
    updateProgress(st);

    if (st?.status === "ready") {
      stopPolling();
      setCompleted(true);

      // small delay so success state can appear briefly before redirect
      setTimeout(() => {
        goToChat();
      }, 400);

      return;
    }

    if (st?.status === "error") {
      stopPolling();
      setLocalError(st.error || "Ingestion failed");
    }
  };

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  useEffect(() => {
    if (botId && botStatus === "ready" && chunksCount > 0) {
      goToChat();
    }
  }, [botId, botStatus, chunksCount]);

  useEffect(() => {
    if (!botId) return;
    if (botStatus === "ready") return;

    stopPolling();

    pollRef.current = window.setInterval(async () => {
      const st: any = await fetchBotStatus(botId);
      handleStatusResult(st);
    }, POLL_INTERVAL);

    return () => {
      stopPolling();
    };
  }, [botId, botStatus, fetchBotStatus]);

  const nextFromName = () => {
    setLocalError("");
    if (!name.trim()) return;

    setBusinessName(name.trim());
    setStep(2);
  };

  const nextFromUrl = () => {
    setLocalError("");
    const fixed = normalizeUrl(url);
    setUrl(fixed);

    if (!isValidUrl(fixed)) {
      setLocalError("Enter a valid website URL (https://...)");
      return;
    }

    setWebsiteUrl(fixed);
    setStep(3);
  };

  const pickPdf = () => fileRef.current?.click();

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setLocalError("");
    const res = addPdf(f);
    if (!res.ok) setLocalError(res.message || "PDF not accepted");

    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLocalError("");

    const f = e.dataTransfer.files?.[0];
    if (!f) return;

    const res = addPdf(f);
    if (!res.ok) setLocalError(res.message || "PDF not accepted");
  };

  const startSetup = async () => {
    setLocalError("");

    const fixed = normalizeUrl(url);

    if (!name.trim()) {
      setLocalError("Business name required");
      return;
    }

    if (!isValidUrl(fixed)) {
      setLocalError("Enter valid website URL (https://...)");
      return;
    }

    setBusinessName(name.trim());
    setWebsiteUrl(fixed);

    try {
      const { botId: id } = await setupBot();

      stopPolling();

      pollRef.current = window.setInterval(async () => {
        const st: any = await fetchBotStatus(id);
        handleStatusResult(st);
      }, POLL_INTERVAL);
    } catch (err: any) {
      setLocalError(err?.message || "Setup failed");
    }
  };

  const progressLine = useMemo(() => {
    if (!processing) return null;

    const parts: string[] = [];

    if (pagesCrawled) parts.push(`Pages: ${pagesCrawled}`);
    if (chunksCount) parts.push(`Chunks: ${chunksCount}`);

    if (lastIngest?.type) {
      if (lastIngest.type === "website") {
        parts.push(`Website: ${lastIngest.current}/${lastIngest.total}`);
      }
      if (lastIngest.type === "pdf") {
        parts.push(`PDF: ${lastIngest.current}/${lastIngest.total}`);
      }
      if (lastIngest.type === "done") {
        parts.push("Done");
      }
    }

    return parts.length ? parts.join(" • ") : "Building knowledge…";
  }, [processing, pagesCrawled, chunksCount, lastIngest]);

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex w-80 border-r border-border bg-card/30 flex-col p-8">
        <div className="flex items-center gap-2 mb-12">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold gradient-text">{BOT_BRAND_NAME}</span>
        </div>

        <div className="space-y-6 flex-1">
          {[
            { num: 1, label: "Business Name" },
            { num: 2, label: "Connect Website" },
            { num: 3, label: "Upload PDFs" },
            { num: 4, label: "Build Knowledge" },
          ].map((s) => (
            <div
              key={s.num}
              className={cn(
                "flex items-center gap-3 text-sm",
                step >= s.num ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors",
                  step > s.num
                    ? "bg-primary text-primary-foreground"
                    : step === s.num
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
              </div>
              <span className={cn(step === s.num && "font-medium")}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={goToHome}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          type="button"
        >
          ← Back to Home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {completed ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Knowledge Ready ✅</h2>
                <p className="text-muted-foreground">Opening chatbot...</p>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                {(localError || botError) && (
                  <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {localError || botError}
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        What's your business name?
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        This will be used in your chatbot.
                      </p>
                    </div>

                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Infipara Pvt Ltd"
                      className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary/50"
                    />

                    <Button
                      onClick={nextFromName}
                      disabled={!name.trim()}
                      className="w-full"
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Connect Your Website
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        We'll crawl your pages and learn from them.
                      </p>
                    </div>

                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onBlur={() => setUrl(normalizeUrl(url))}
                      placeholder="https://yourwebsite.com"
                      className={cn(
                        "w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-1",
                        url.length > 0 && !urlOk
                          ? "focus:ring-destructive/50 ring-1 ring-destructive/20"
                          : "focus:ring-primary/50"
                      )}
                    />

                    {url.length > 0 && !urlOk ? (
                      <div className="text-xs text-destructive">
                        Please enter a valid URL like https://example.com
                      </div>
                    ) : null}

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button
                        onClick={nextFromUrl}
                        className="flex-1"
                        disabled={!urlOk}
                      >
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Upload PDFs (Optional)
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Upload up to {MAX_PDFS} PDFs (max 50MB each).
                      </p>
                    </div>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={onPick}
                    />

                    <div className="space-y-3">
                      {pdfFiles.map((f, i) => (
                        <div
                          key={i}
                          className="glass rounded-lg p-3 flex items-center gap-3"
                        >
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-sm flex-1 truncate">{f.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {(f.size / 1024 / 1024).toFixed(1)} MB
                          </span>
                          <button
                            onClick={() => removePdf(i)}
                            className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center"
                            type="button"
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      ))}

                      {pdfFiles.length < MAX_PDFS && (
                        <button
                          onClick={pickPdf}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={onDrop}
                          type="button"
                          className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors"
                        >
                          <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click or Drag & Drop PDF
                          </p>
                        </button>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(2)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button onClick={() => setStep(4)} className="flex-1">
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <Bot className="h-8 w-8 text-primary" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Build Knowledge Base
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        We’ll learn from your website and PDFs. Then your chatbot
                        will answer from that exact content.
                      </p>
                    </div>

                    <div className="glass rounded-xl p-4 text-left text-sm space-y-2">
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Business</span>
                        <span className="truncate max-w-[60%] text-right">
                          {name}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Website</span>
                        <span className="truncate max-w-[60%] text-right">
                          {normalizedUrl}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">PDFs</span>
                        <span>{pdfFiles.length}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span
                          className={
                            processing ? "text-primary" : "text-muted-foreground"
                          }
                        >
                          {botStatus}
                        </span>
                      </div>

                      {progressLine ? (
                        <div className="text-xs text-muted-foreground">
                          {progressLine}
                        </div>
                      ) : null}

                      {botId ? (
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">Bot ID</span>
                          <span className="text-xs break-all text-right">{botId}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setStep(3)}
                        disabled={processing}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>

                      <Button
                        onClick={startSetup}
                        disabled={processing}
                        className="flex-1"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Start Setup 🚀"
                        )}
                      </Button>
                    </div>

                    {processing && (
                      <p className="text-xs text-muted-foreground">
                        Keep this page open. We are building your knowledge base.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}