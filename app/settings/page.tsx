"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Lock, Bell, Shield, Loader2, Eye, EyeOff, ChevronUp, ChevronDown, Sun, Moon, Monitor } from "lucide-react"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isSecurityExpanded, setIsSecurityExpanded] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) return
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match" })
      return
    }

    toast({ title: "Success", description: "Password updated successfully" })
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-light tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your account preferences</p>
          </div>

          <div className="space-y-8">
            {/* Profile Section */}
            <div className="space-y-4">
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Profile</h2>

              <div className="p-6 border border-border space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full mt-1 px-0 py-2 bg-transparent border-0 border-b border-border focus:border-foreground focus:outline-none text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full mt-1 pl-6 pr-0 py-2 bg-transparent border-0 border-b border-border focus:border-foreground focus:outline-none text-sm transition-colors"
                    />
                  </div>
                </div>

                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Appearance Section */}
            <div className="space-y-4">
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Appearance</h2>

              <div className="p-6 border border-border space-y-4 bg-card shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-muted/60 rounded-lg">
                    <Sun className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Theme Preferences</h3>
                    <p className="text-xs text-muted-foreground">Select your interface color scheme</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center justify-center p-4 rounded-md border text-sm transition-all
                      ${theme === "light"
                        ? "border-foreground bg-foreground/5 text-foreground font-medium"
                        : "border-border text-muted-foreground hover:bg-muted"}`}
                  >
                    <Sun className="h-5 w-5 mb-2" />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center justify-center p-4 rounded-md border text-sm transition-all
                      ${theme === "dark"
                        ? "border-foreground bg-foreground/5 text-foreground font-medium"
                        : "border-border text-muted-foreground hover:bg-muted"}`}
                  >
                    <Moon className="h-5 w-5 mb-2" />
                    Dark
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center justify-center p-4 rounded-md border text-sm transition-all
                      ${theme === "system"
                        ? "border-foreground bg-foreground/5 text-foreground font-medium"
                        : "border-border text-muted-foreground hover:bg-muted"}`}
                  >
                    <Monitor className="h-5 w-5 mb-2" />
                    System
                  </button>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted/60 rounded-lg">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Security</h3>
                    <p className="text-xs text-muted-foreground">Update your account password</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSecurityExpanded(!isSecurityExpanded)}
                  className="p-1.5 border border-border rounded-md hover:bg-muted transition-colors"
                >
                  {isSecurityExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>

              {isSecurityExpanded && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-transparent focus:outline-none focus:border-foreground text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md bg-transparent focus:outline-none focus:border-foreground text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1.5 block">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md bg-transparent focus:outline-none focus:border-foreground text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handlePasswordUpdate}
                      disabled={!currentPassword || !newPassword || !confirmPassword}
                      className="px-6 py-2.5 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:bg-muted-foreground disabled:text-muted"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Section */}
            <div className="space-y-4">
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Notifications</h2>

              <div className="p-6 border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Booking confirmations and updates</p>
                    </div>
                  </div>
                  <button
                    className="relative w-11 h-6 bg-accent rounded-full transition-colors"
                    role="switch"
                    aria-checked="true"
                  >
                    <span className="absolute right-1 top-1 w-4 h-4 bg-accent-foreground rounded-full transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Marketing Emails</p>
                      <p className="text-xs text-muted-foreground">Promotions and special offers</p>
                    </div>
                  </div>
                  <button
                    className="relative w-11 h-6 bg-muted rounded-full transition-colors"
                    role="switch"
                    aria-checked="false"
                  >
                    <span className="absolute left-1 top-1 w-4 h-4 bg-muted-foreground rounded-full transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-4">
              <h2 className="text-sm uppercase tracking-wider text-destructive">Danger Zone</h2>

              <div className="p-6 border border-destructive/20 bg-destructive/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Delete Account</p>
                    <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <button className="px-4 py-2 border border-destructive text-destructive text-sm hover:bg-destructive hover:text-destructive-foreground transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
