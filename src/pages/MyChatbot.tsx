import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { Bot, Globe, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MyChatbot() {
  const { chatbotCreated, businessName, websiteCrawled, pdfs, trialActive } = useApp();

  if (!chatbotCreated) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Chatbot Yet</h2>
          <p className="text-muted-foreground text-sm mb-6">Create your first AI chatbot to get started.</p>
          <Link to="/dashboard/wizard">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Create Chatbot</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Chatbot</h1>
        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{businessName}</h2>
              <p className="text-sm text-muted-foreground">{trialActive ? "🟢 Active" : "🔴 Inactive"}</p>
            </div>
            <Link to="/chat/demo" className="ml-auto">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Test Chat</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="text-sm">
              <p className="text-muted-foreground mb-1">Website</p>
              <p className="flex items-center gap-1">{websiteCrawled && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />} Connected</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground mb-1">Documents</p>
              <p>{pdfs.length} PDF(s) uploaded</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
