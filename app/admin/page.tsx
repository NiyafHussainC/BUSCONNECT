"use client"

import { Users, Truck, Calendar, TrendingUp, AlertCircle, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Total Users", value: "2,847", change: "+12%", icon: Users },
  { label: "Active Owners", value: "156", change: "+8%", icon: Truck },
  { label: "Bookings Today", value: "89", change: "+23%", icon: Calendar },
  { label: "Revenue", value: "₹20,58,000", change: "+18%", icon: TrendingUp },
]

const systemAlerts = [
  {
    id: "1",
    type: "user",
    title: "Payment Input Bug",
    description: "The 'Apply Coupon' button is unresponsive when checking out on iOS Safari.",
    severity: "high",
    date: "10 mins ago"
  },
  {
    id: "2",
    type: "owner",
    title: "Image Upload Failing",
    description: "Server returns a 500 error when trying to upload new fleet photos.",
    severity: "high",
    date: "2 hours ago"
  },
  {
    id: "3",
    type: "owner",
    title: "Feature Request: Export to Excel",
    description: "It would be incredibly helpful to be able to export my bookings list to a spreadsheet.",
    severity: "low",
    date: "5 hours ago"
  },
]

const getAlertIcon = (severity: string) => {
  switch (severity) {
    case 'high': return <AlertCircle className="h-5 w-5 text-destructive" />
    case 'medium': return <AlertTriangle className="h-5 w-5 text-amber-500" />
    case 'low': return <Info className="h-5 w-5 text-blue-500" />
    default: return <Info className="h-5 w-5 text-muted-foreground" />
  }
}

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

      {/* System Alerts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-light">System Alerts</h2>
          <Link
            href="/admin/alerts"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="border border-border divide-y divide-border">
          {systemAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start sm:items-center justify-between p-4 gap-4 flex-col sm:flex-row">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getAlertIcon(alert.severity)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm font-medium ${alert.type === 'user' ? 'bg-blue-500/10 text-blue-600' :
                      alert.type === 'owner' ? 'bg-purple-500/10 text-purple-600' :
                        'bg-slate-500/10 text-slate-600'
                      }`}>
                      {alert.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.date}</span>
                <div className="flex items-center gap-2">
                  <button className="text-xs font-medium hover:underline underline-offset-4">
                    View Details
                  </button>
                  <span className="text-muted-foreground">|</span>
                  <button className="text-xs text-accent hover:underline underline-offset-4 font-medium">
                    Resolve
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
