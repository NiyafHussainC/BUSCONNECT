"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Bus, Clock, LogOut, Loader2 } from "lucide-react"

export default function PendingApprovalPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login")
      } else if (user.role !== "owner") {
        router.replace("/")
      } else if (user.ownerStatus === "approved") {
        router.replace("/owner/dashboard")
      }
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
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-12">
          <Bus className="h-8 w-8 text-foreground" strokeWidth={1.5} />
          <span className="text-xl font-light tracking-tight">BusConnect</span>
        </div>

        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
          <Clock className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl font-light tracking-tight mb-3">Awaiting Approval</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Your bus owner account is currently under review. Our team will verify your details 
          and approve your account within 24-48 hours. You will receive an email notification 
          once your account is approved.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-sm">
            <p className="text-xs text-muted-foreground mb-1">Registered as</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm text-muted-foreground hover:text-foreground border border-border hover:border-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
