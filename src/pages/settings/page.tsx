import { useState, useEffect } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { Save, RefreshCw, Shield, Landmark, Globe } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "Future Shop Multivendor",
    supportEmail: "support@futureshop.com",
    currency: "USD",
    baseCommission: 10,
    shippingFee: 5.99,
    freeShippingThreshold: 50,
    maintenanceMode: false,
    guestCheckout: true,
    vendorAutoApprove: false,
    taxPercentage: 15,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("app_settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem("app_settings", JSON.stringify(settings));
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    localStorage.setItem("app_settings", JSON.stringify(settings));
    setIsSaving(false);
    toast.success("Settings saved successfully!");
  };

  return (
    <AdminLayoutWithAuth>
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            <p className="text-muted-foreground">
              Configure store commission percentages, shipping costs, and security options.
            </p>
          </div>
          <Button type="submit" disabled={isSaving} className="w-full sm:w-auto gap-2">
            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: General Info */}
          <Card className="bg-card/50 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center gap-2.5">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>General Store Details</CardTitle>
                <CardDescription>Basic public brand profile details.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(val) => setSettings({ ...settings, currency: val })}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="BDT">BDT (৳)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baseCommission">Admin Commission (%)</Label>
                  <Input
                    id="baseCommission"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.baseCommission}
                    onChange={(e) => setSettings({ ...settings, baseCommission: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Shipping & Tax */}
          <Card className="bg-card/50 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center gap-2.5">
              <Landmark className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Fulfillment & Shipping</CardTitle>
                <CardDescription>Tax structures and logistics pricing.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingFee">Flat Shipping Fee</Label>
                  <Input
                    id="shippingFee"
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.shippingFee}
                    onChange={(e) => setSettings({ ...settings, shippingFee: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Min</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    min="0"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxPercentage">Standard Tax Percentage (%)</Label>
                <Input
                  id="taxPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.taxPercentage}
                  onChange={(e) => setSettings({ ...settings, taxPercentage: Number(e.target.value) })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Security & Flags */}
          <Card className="md:col-span-2 bg-card/50 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center gap-2.5">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>System & Security Toggles</CardTitle>
                <CardDescription>Manage user registration pathways and system availability.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Maintenance Mode</Label>
                  <p className="text-[10px] text-muted-foreground">Locks storefront for buyers.</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Guest Checkout</Label>
                  <p className="text-[10px] text-muted-foreground">Allows buying without account.</p>
                </div>
                <Switch
                  checked={settings.guestCheckout}
                  onCheckedChange={(checked) => setSettings({ ...settings, guestCheckout: checked })}
                />
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Auto-Approve Sellers</Label>
                  <p className="text-[10px] text-muted-foreground">Skips seller approval queue.</p>
                </div>
                <Switch
                  checked={settings.vendorAutoApprove}
                  onCheckedChange={(checked) => setSettings({ ...settings, vendorAutoApprove: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </AdminLayoutWithAuth>
  );
}
