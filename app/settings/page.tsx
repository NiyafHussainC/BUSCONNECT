"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/dashboard/sidebar"
import { User, Mail, Lock, Bell, Shield, Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

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

            {/* Security Section */}
            <div className="space-y-4">
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Security</h2>
              
              <div className="p-6 border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Password</p>
                      <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="text-sm text-accent hover:underline underline-offset-4">
                    Enable
                  </button>
                </div>
              </div>
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
