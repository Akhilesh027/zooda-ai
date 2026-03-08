import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { businessName } = useApp();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="glass rounded-xl p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Business Name</label>
            <input defaultValue={businessName} className="w-full mt-1 bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <input defaultValue="owner@greenleafdental.com" className="w-full mt-1 bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Timezone</label>
            <input defaultValue="Asia/Kolkata (IST)" className="w-full mt-1 bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/50" />
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
