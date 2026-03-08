import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { apiForm, apiJson } from "../lib/api";

type BotStatus = "idle" | "processing" | "ready" | "error";

export interface SourceItem {
  type: "website" | "pdf";
  source: string;
  meta?: any;
  score?: number;
  snippet?: string;
}

export interface BotMeta {
  _id: string;
  businessName: string;
  websiteUrl: string;
  status: BotStatus;
  error?: string;
  pagesCrawled?: number;
  chunksCount?: number;
  lastIngest?: any;
  lastPdfError?: string;
  updatedAt?: string;
}

export interface AppState {
  businessName: string;
  websiteUrl: string;

  botId: string | null;
  botStatus: BotStatus;
  botError?: string;

  pdfFiles: File[];
}

interface AppContextType extends AppState {
  setBusinessName: (v: string) => void;
  setWebsiteUrl: (v: string) => void;

  addPdf: (file: File) => { ok: boolean; message?: string };
  removePdf: (index: number) => void;
  clearPdfs: () => void;

  setupBot: () => Promise<{ botId: string }>;

  // ✅ return bot meta so wizard can show progress
  fetchBotStatus: (botId: string) => Promise<{
    status: BotStatus;
    error?: string;
    bot?: BotMeta;
  }>;

  // ✅ align with backend: POST /api/chat expects { botId, question }
  askBot: (payload: {
    botId?: string;
    question: string;
  }) => Promise<{ answer: string; sources: SourceItem[]; debug?: any }>;
}

const Ctx = createContext<AppContextType | undefined>(undefined);

const MAX_FILES = 2;
const MAX_SIZE = 50 * 1024 * 1024;

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [businessName, setBusinessName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [botId, setBotId] = useState<string | null>(null);
  const [botStatus, setBotStatus] = useState<BotStatus>("idle");
  const [botError, setBotError] = useState<string>("");

  const [pdfFiles, setPdfFiles] = useState<File[]>([]);

 const addPdf = useCallback((file: File) => {
  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) return { ok: false, message: "Only PDF files allowed" };
  if (file.size > MAX_SIZE) return { ok: false, message: "Max 50MB per PDF" };
  if (pdfFiles.length >= MAX_FILES) return { ok: false, message: "Max 2 PDFs allowed" };

  setPdfFiles((prev) => [...prev, file]);
  return { ok: true };
}, [pdfFiles.length]);

  const removePdf = useCallback((index: number) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearPdfs = useCallback(() => setPdfFiles([]), []);

  // Wizard → create bot + start ingestion
  const setupBot = useCallback(async () => {
    if (!businessName.trim()) throw new Error("Business name required");
    if (!websiteUrl.trim()) throw new Error("Website URL required");

    const form = new FormData();
    form.append("businessName", businessName.trim());
    form.append("websiteUrl", websiteUrl.trim());
    pdfFiles.forEach((f) => form.append("pdfs", f));

    setBotStatus("processing");
    setBotError("");

    const res = await apiForm<{
      success: boolean;
      botId: string;
      status: BotStatus;
    }>("/api/bot/setup", form);

    setBotId(res.botId);
    setBotStatus(res.status);

    return { botId: res.botId };
  }, [businessName, websiteUrl, pdfFiles]);

  // ✅ Poll status → return bot meta (pages/chunks/lastIngest)
  const fetchBotStatus = useCallback(async (id: string) => {
    const res = await apiJson<{ success: boolean; bot: BotMeta }>(
      `/api/bot/${id}/status`
    );

    const status: BotStatus = res.bot.status;
    setBotStatus(status);
    setBotError(res.bot.error || "");

    return { status, error: res.bot.error || "", bot: res.bot };
  }, []);

  // ✅ Chat → ask question (pass botId + question)
  const askBot = useCallback(
    async (payload: { botId?: string; question: string }) => {
      const useId = payload.botId || botId;
      if (!useId) throw new Error("Bot is not setup yet");

      const res = await apiJson<{
        success: boolean;
        answer: string;
        sources: SourceItem[];
        debug?: any;
      }>("/api/chat", {
        method: "POST",
        body: JSON.stringify({ botId: useId, question: payload.question }),
      });

      return { answer: res.answer, sources: res.sources || [], debug: res.debug };
    },
    [botId]
  );

  const value = useMemo(
    () => ({
      businessName,
      websiteUrl,
      botId,
      botStatus,
      botError,
      pdfFiles,

      setBusinessName,
      setWebsiteUrl,

      addPdf,
      removePdf,
      clearPdfs,

      setupBot,
      fetchBotStatus,
      askBot,
    }),
    [
      businessName,
      websiteUrl,
      botId,
      botStatus,
      botError,
      pdfFiles,
      addPdf,
      removePdf,
      clearPdfs,
      setupBot,
      fetchBotStatus,
      askBot,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useApp = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};