import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { CreditCard, CheckCircle2, AlertTriangle, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Subscription() {
  const { trialActive, trialDaysLeft, subscriptionStatus, renewSubscription, expireSubscription } = useApp();
  const [renewing, setRenewing] = useState(false);

  const handleRenew = () => {
    setRenewing(true);
    setTimeout(() => {
      renewSubscription();
      setRenewing(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold">Subscription</h1>

        {/* Status Card */}
        <div className={cn(
          "rounded-xl p-6 border",
          subscriptionStatus === "expired" ? "border-destructive/30 bg-destructive/5" :
          subscriptionStatus === "renewed" ? "border-primary/30 bg-primary/5" :
          "border-primary/30 bg-primary/5"
        )}>
          <div className="flex items-center gap-3 mb-4">
            {subscriptionStatus === "expired" ? <AlertTriangle className="h-6 w-6 text-destructive" /> :
             subscriptionStatus === "renewed" ? <CheckCircle2 className="h-6 w-6 text-primary" /> :
             <Clock className="h-6 w-6 text-primary" />}
            <div>
              <h2 className="text-lg font-semibold">
                {subscriptionStatus === "expired" ? "Subscription Expired" :
                 subscriptionStatus === "renewed" ? "Premium Plan — Active" :
                 "Free Trial — Active"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {subscriptionStatus === "expired" ? "Your chatbot is offline." :
                 subscriptionStatus === "renewed" ? "All features unlocked." :
                 `${trialDaysLeft} days remaining`}
              </p>
            </div>
          </div>

          {/* Progress bar for trial */}
          {subscriptionStatus === "trial" && (
            <div className="mb-4">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((15 - trialDaysLeft) / 15) * 100}%` }} />
              </div>
            </div>
          )}

          {subscriptionStatus === "trial" && (
            <div className="flex gap-3">
              <Button onClick={handleRenew} disabled={renewing} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {renewing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Upgrade to Premium — ₹2,999/mo"}
              </Button>
              <Button variant="outline" onClick={expireSubscription} className="text-muted-foreground">
                Simulate Expiry
              </Button>
            </div>
          )}

          {subscriptionStatus === "expired" && (
            <Button onClick={handleRenew} disabled={renewing} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {renewing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Renew Subscription — ₹2,999/mo"}
            </Button>
          )}

          {subscriptionStatus === "renewed" && (
            <div className="flex items-center gap-2 text-primary text-sm">
              <CheckCircle2 className="h-4 w-4" />
              Payment confirmed. Thank you!
            </div>
          )}
        </div>

        {/* Plan Details */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">Plan Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span>{subscriptionStatus === "renewed" ? "Premium" : "Free Trial"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className={cn(subscriptionStatus === "expired" ? "text-destructive" : "text-primary")}>{subscriptionStatus === "expired" ? "Expired" : "Active"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Chatbots</span><span>1</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">PDF Uploads</span><span>2</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Messages</span><span>{subscriptionStatus === "renewed" ? "Unlimited" : "Limited"}</span></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
