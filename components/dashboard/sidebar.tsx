"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth, type UserRole } from "@/contexts/auth-context"
import { 
  Bus, 
  LayoutDashboard, 
  Users, 
  Truck, 
  Calendar, 
  Gift, 
  Settings, 
  LogOut,
  CheckCircle,
  Search,
  ClipboardList,
  X,
  Menu
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles: UserRole[]
}

const navItems: NavItem[] = [
  // Admin
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["admin"] },
  { label: "Pending Approvals", href: "/admin/approvals", icon: CheckCircle, roles: ["admin"] },
  { label: "Users", href: "/admin/users", icon: Users, roles: ["admin"] },
  
  // Owner
  { label: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard, roles: ["owner"] },
  { label: "My Fleet", href: "/owner/fleet", icon: Truck, roles: ["owner"] },
  { label: "Booking Requests", href: "/owner/bookings", icon: ClipboardList, roles: ["owner"] },
  
  // Customer
  { label: "Book a Trip", href: "/dashboard/user", icon: Search, roles: ["customer"] },
  { label: "My Trips", href: "/dashboard/user/trips", icon: Calendar, roles: ["customer"] },
  { label: "Rewards", href: "/dashboard/user/rewards", icon: Gift, roles: ["customer"] },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  if (!user) return null

  const filteredNav = navItems.filter(item => item.roles.includes(user.role))

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6 border-b border-sidebar-border">
        <Bus className="h-6 w-6 text-sidebar-foreground" strokeWidth={1.5} />
        <span className="text-lg font-light tracking-tight text-sidebar-foreground">BusConnect</span>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-sidebar-border">
        <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
        {user.role === "owner" && user.ownerStatus === "pending" && (
          <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full">
            Pending Approval
          </span>
        )}
        {user.role === "owner" && user.ownerStatus === "approved" && user.trialDaysLeft && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Trial</span>
              <span>{user.trialDaysLeft} days left</span>
            </div>
            <div className="h-1 bg-sidebar-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all"
                style={{ width: `${(user.trialDaysLeft / 30) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-sm",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors rounded-sm"
        >
          <Settings className="h-4 w-4" strokeWidth={1.5} />
          Settings
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors rounded-sm"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bus className="h-5 w-5" strokeWidth={1.5} />
          <span className="font-light tracking-tight">BusConnect</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 hover:bg-muted rounded-sm transition-colors"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 p-2 hover:bg-sidebar-accent rounded-sm transition-colors"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 z-30 h-screen w-64 bg-sidebar border-r border-sidebar-border flex-col">
        <NavContent />
      </aside>
    </>
  )
}
