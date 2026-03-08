"use client"

import { useAuth } from "@/contexts/auth-context"
import { Truck, Calendar, DollarSign, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Active Buses", value: "8", icon: Truck },
  { label: "Bookings This Month", value: "34", icon: Calendar },
  { label: "Revenue", value: "₹9,36,000", icon: DollarSign },
  { label: "Growth", value: "+24%", icon: TrendingUp },
]

const recentBookings = [
  { id: "1", route: "Mumbai → Pune", date: "Mar 8, 2026", passengers: 42, status: "confirmed" },
  { id: "2", route: "Bengaluru → Mysuru", date: "Mar 9, 2026", passengers: 38, status: "pending" },
  { id: "3", route: "Delhi → Jaipur", date: "Mar 10, 2026", passengers: 45, status: "quoted" },
]

export default function OwnerDashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Header with Trial Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.name}</p>
        </div>
        {user?.trialDaysLeft && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent text-sm rounded-full">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            {user.trialDaysLeft} days left in trial
          </div>
        )}
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
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/owner/fleet"
          className="p-6 border border-border hover:border-foreground/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium mb-1">Manage Fleet</h3>
              <p className="text-xs text-muted-foreground">Add, edit, or remove buses from your fleet</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </Link>
        <Link
          href="/owner/bookings"
          className="p-6 border border-border hover:border-foreground/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium mb-1">Booking Requests</h3>
              <p className="text-xs text-muted-foreground">View and respond to customer requests</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-light">Recent Bookings</h2>
          <Link
            href="/owner/bookings"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="border border-border divide-y divide-border">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2 sm:gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium">{booking.route}</p>
                <p className="text-xs text-muted-foreground">{booking.date} · {booking.passengers} passengers</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${booking.status === "confirmed"
                  ? "bg-accent/10 text-accent"
                  : booking.status === "pending"
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-primary"
                }`}>
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
