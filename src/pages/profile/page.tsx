import { useState, useEffect } from "react";
import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { User, Mail, Phone, Shield, Lock, Save, Camera } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Admin Administrator",
    email: "admin@futureshop.com",
    phone: "+1 (555) 019-2834",
    gender: "male",
    role: "ADMIN",
    avatar: ""
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Load from localstorage if exists, otherwise save default
  useEffect(() => {
    const saved = localStorage.getItem("admin_profile");
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem("admin_profile", JSON.stringify(profile));
    }
  }, []);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin_profile", JSON.stringify(profile));
    toast.success("Profile details updated successfully!");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordState.currentPassword || !passwordState.newPassword || !passwordState.confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwordState.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    toast.success("Password updated successfully!");
    setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <AdminLayoutWithAuth>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal profile details, contact info, and security credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Side Card - Quick Info */}
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-card/50 backdrop-blur-md">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="relative group cursor-pointer mb-4">
                  <div className="h-24 w-24 rounded-full border-4 border-primary/20 bg-muted flex items-center justify-center overflow-hidden">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{profile.email}</p>
                <div className="mt-3 flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  <Shield className="h-3 w-3" />
                  {profile.role}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Forms */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>
                  Update your contact phone and name information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          value={profile.email}
                          className="pl-9"
                          disabled
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">Registered email address cannot be changed.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={profile.gender}
                        onValueChange={(val) => setProfile({ ...profile, gender: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Details
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Modify the security password used to sign in to this portal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordState.currentPassword}
                        onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                        className="pl-9"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordState.newPassword}
                          onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                          className="pl-9"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordState.confirmPassword}
                          onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                          className="pl-9"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="secondary" className="gap-2">
                      <Lock className="h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayoutWithAuth>
  );
}
