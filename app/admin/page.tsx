"use client"

import { Users, Truck, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Total Users", value: "2,847", change: "+12%", icon: Users },
  { label: "Active Owners", value: "156", change: "+8%", icon: Truck },
  { label: "Bookings Today", value: "89", change: "+23%", icon: Calendar },
  { label: "Revenue", value: "$24,580", change: "+18%", icon: TrendingUp },
]

const pendingOwners = [
  { id: "1", name: "Metro Express Lines", email: "metro@express.com", date: "2 hours ago" },
  { id: "2", name: "City Transit Co", email: "info@citytransit.com", date: "5 hours ago" },
  { id: "3", name: "Highway Coaches", email: "contact@hwcoaches.com", date: "1 day ago" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="p-6 bg-card border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-2xl font-light">{stat.value}</p>
                </div>
                <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-xs text-accent mt-2">{stat.change} from last week</p>
            </div>
          )
        })}
      </div>

      {/* Pending Approvals Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-light">Pending Approvals</h2>
          <Link 
            href="/admin/approvals"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="border border-border divide-y divide-border">
          {pendingOwners.map((owner) => (
            <div key={owner.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">{owner.name}</p>
                <p className="text-xs text-muted-foreground">{owner.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">{owner.date}</span>
                <div className="flex items-center gap-2">
                  <button className="text-xs text-accent hover:underline underline-offset-4">
                    Approve
                  </button>
                  <span className="text-muted-foreground">|</span>
                  <button className="text-xs text-muted-foreground hover:text-destructive">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
