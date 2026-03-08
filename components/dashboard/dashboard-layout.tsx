"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/contexts/auth-context"
import { Sidebar } from "./sidebar"
import { Loader2 } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  requireApproval?: boolean
}

export function DashboardLayout({ children, allowedRoles, requireApproval = false }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
        return
      }
      
      if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard
        if (user.role === "admin") {
          router.push("/admin")
        } else if (user.role === "owner") {
          router.push("/owner/dashboard")
        } else {
          router.push("/dashboard/user")
        }
        return
      }

      // Check owner approval status
      if (requireApproval && user.role === "owner" && user.ownerStatus === "pending") {
        router.push("/pending-approval")
      }
    }
  }, [user, isLoading, router, allowedRoles, requireApproval])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user || !allowedRoles.includes(user.role)) {
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
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
