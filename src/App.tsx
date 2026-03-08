import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import MyChatbot from "./pages/MyChatbot";
import UploadData from "./pages/UploadData";
import ChatViewer from "./pages/ChatViewer";
import Subscription from "./pages/Subscription";
import Notifications from "./pages/Notifications";
import SettingsPage from "./pages/SettingsPage";
import ChatbotWizard from "./pages/ChatbotWizard";
import ChatInterface from "./pages/ChatInterface";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/chatbot" element={<MyChatbot />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/dashboard/upload" element={<UploadData />} />
            <Route path="/dashboard/chats" element={<ChatViewer />} />
            <Route path="/dashboard/subscription" element={<Subscription />} />
            <Route path="/dashboard/notifications" element={<Notifications />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/wizard" element={<ChatbotWizard />} />
            <Route path="/chat/demo" element={<ChatInterface />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/panel" element={<AdminPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
