"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"

type UserType = "all" | "customer" | "owner" | "admin"

interface User {
  id: string
  name: string
  email: string
  type: "customer" | "owner" | "admin"
  status: "active" | "inactive" | "pending"
  joined: string
  trips?: number
  fleet?: number
}

const mockUsers: User[] = [
  { id: "1", name: "John Customer", email: "john@example.com", type: "customer", status: "active", joined: "Jan 2026", trips: 12 },
  { id: "2", name: "Sarah Traveler", email: "sarah@example.com", type: "customer", status: "active", joined: "Feb 2026", trips: 8 },
  { id: "3", name: "Metro Express", email: "metro@express.com", type: "owner", status: "active", joined: "Dec 2025", fleet: 12 },
  { id: "4", name: "City Transit", email: "info@citytransit.com", type: "owner", status: "pending", joined: "Mar 2026", fleet: 8 },
  { id: "5", name: "Admin User", email: "admin@busconnect.com", type: "admin", status: "active", joined: "Nov 2025" },
  { id: "6", name: "Highway Coaches", email: "contact@hwcoaches.com", type: "owner", status: "active", joined: "Jan 2026", fleet: 25 },
  { id: "7", name: "Mike Wilson", email: "mike@example.com", type: "customer", status: "inactive", joined: "Dec 2025", trips: 3 },
  { id: "8", name: "Lisa Brown", email: "lisa@example.com", type: "customer", status: "active", joined: "Mar 2026", trips: 1 },
]

export default function UsersPage() {
  const [filter, setFilter] = useState<UserType>("all")
  const [search, setSearch] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredUsers = mockUsers.filter(user => {
    const matchesFilter = filter === "all" || user.type === filter
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                          user.email.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filterLabels: Record<UserType, string> = {
    all: "All Users",
    customer: "Customers",
    owner: "Bus Owners",
    admin: "Admins"
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage platform users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border-0 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-border"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border border-border text-sm hover:border-foreground/50 transition-colors min-w-36"
          >
            {filterLabels[filter]}
            <ChevronDown className="h-4 w-4 ml-auto" />
          </button>
          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border z-20 shadow-lg">
                {(["all", "customer", "owner", "admin"] as UserType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => { setFilter(type); setIsFilterOpen(false) }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors ${filter === type ? "bg-muted" : ""}`}
                  >
                    {filterLabels[type]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-border overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs uppercase tracking-wider text-muted-foreground font-normal px-6 py-4">User</th>
              <th className="text-left text-xs uppercase tracking-wider text-muted-foreground font-normal px-6 py-4">Type</th>
              <th className="text-left text-xs uppercase tracking-wider text-muted-foreground font-normal px-6 py-4">Status</th>
              <th className="text-left text-xs uppercase tracking-wider text-muted-foreground font-normal px-6 py-4">Joined</th>
              <th className="text-left text-xs uppercase tracking-wider text-muted-foreground font-normal px-6 py-4">Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{user.type}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user.status === "active" 
                      ? "bg-accent/10 text-accent" 
                      : user.status === "pending"
                      ? "bg-muted text-muted-foreground"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">{user.joined}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    {user.type === "customer" && user.trips !== undefined && `${user.trips} trips`}
                    {user.type === "owner" && user.fleet !== undefined && `${user.fleet} buses`}
                    {user.type === "admin" && "—"}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 border border-border">
          <p className="text-muted-foreground text-sm">No users found</p>
        </div>
      )}
    </div>
  )
}
