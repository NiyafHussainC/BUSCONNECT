"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "customer" | "owner" | "admin"
export type OwnerStatus = "pending" | "approved" | "rejected"

export interface User {
  id: string
  email: string
  name: string
  mobile: string
  role: UserRole
  ownerStatus?: OwnerStatus
  credits?: number
  trialDaysLeft?: number
  // Bus Owner specific fields
  fleetName?: string
  operatingCity?: string
  licenseDocument?: string // Filename for mock storage
}

export interface SignupData {
  email: string
  password: string
  name: string
  mobile: string
  role: UserRole
  fleetName?: string
  operatingCity?: string
  licenseDocument?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const MOCK_USERS: User[] = [
  { id: "1", email: "admin@busconnect.com", name: "Admin User", mobile: "+91 9876543210", role: "admin" },
  { id: "2", email: "owner@busconnect.com", name: "Fleet Owner", mobile: "+91 9876543211", role: "owner", ownerStatus: "approved", trialDaysLeft: 24, fleetName: "Metro Express Lines", operatingCity: "Mumbai", licenseDocument: "license-metro.pdf" },
  { id: "3", email: "pending@busconnect.com", name: "Pending Owner", mobile: "+91 9876543212", role: "owner", ownerStatus: "pending", trialDaysLeft: 30, fleetName: "City Transit Co", operatingCity: "Delhi", licenseDocument: "license-city.pdf" },
  { id: "4", email: "customer@busconnect.com", name: "John Customer", mobile: "+91 9876543213", role: "customer", credits: 6 },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for existing session
    const stored = localStorage.getItem("busconnect_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem("busconnect_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, _password: string) => {
    setIsLoading(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("busconnect_user", JSON.stringify(foundUser))
    } else {
      // Create a new customer user for demo
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split("@")[0],
        mobile: "",
        role: "customer",
        credits: 0,
      }
      setUser(newUser)
      localStorage.setItem("busconnect_user", JSON.stringify(newUser))
    }
    setIsLoading(false)
  }

  const signup = async (data: SignupData) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      mobile: data.mobile,
      role: data.role,
      ...(data.role === "owner" && {
        ownerStatus: "pending" as OwnerStatus,
        trialDaysLeft: 30,
        fleetName: data.fleetName,
        operatingCity: data.operatingCity,
        licenseDocument: data.licenseDocument,
      }),
      ...(data.role === "customer" && { credits: 0 }),
    }

    setUser(newUser)
    localStorage.setItem("busconnect_user", JSON.stringify(newUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("busconnect_user")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("busconnect_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
