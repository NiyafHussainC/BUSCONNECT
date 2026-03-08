"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Bus, ArrowRight, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      await login(email, password)
      // Redirect based on role will be handled by middleware/layout
      router.push("/")
    } catch {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <Bus className="h-10 w-10 text-primary-foreground" strokeWidth={1.5} />
            <span className="text-2xl font-light tracking-tight text-primary-foreground">BusConnect</span>
          </div>
          <h1 className="text-4xl font-light text-primary-foreground leading-tight mb-4 text-balance">
            Effortless bus booking for modern travelers
          </h1>
          <p className="text-primary-foreground/70 text-lg font-light">
            Connect with premium fleet operators. Book with confidence.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-12 lg:hidden">
            <Bus className="h-8 w-8 text-foreground" strokeWidth={1.5} />
            <span className="text-xl font-light tracking-tight">BusConnect</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-light tracking-tight mb-2">Welcome back</h2>
            <p className="text-muted-foreground text-sm">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors text-sm"
                  autoComplete="email"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors text-sm"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <p className="text-destructive text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-4 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/signup" className="text-foreground hover:underline underline-offset-4">
                Create one
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-muted/50 rounded-sm">
            <p className="text-xs text-muted-foreground mb-2">Demo accounts:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Admin: admin@busconnect.com</p>
              <p>Owner: owner@busconnect.com</p>
              <p>Customer: customer@busconnect.com</p>
              <p className="text-muted-foreground/60 italic">Any password works</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
