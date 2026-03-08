import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@zooda.ai");
  const [password, setPassword] = useState("admin123");

  const handleLogin = () => {
    navigate("/admin/panel");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Zooda AI Agent Admin Panel</p>
        </div>
        <div className="glass rounded-xl p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full mt-1 bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/50" />
          </div>
          <Button onClick={handleLogin} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Sign In <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
