"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Gift, Star, Copy, Check, Ticket, ArrowRight, Info } from "lucide-react"

interface Reward {
  id: string
  code: string
  discount: number
  expiresAt: string
  used: boolean
}

export default function RewardsPage() {
  const { user } = useAuth()
  const credits = user?.credits || 0
  const creditsToNextReward = 10 - (credits % 10)
  const availableRewards = Math.floor(credits / 10)

  const [rewards, setRewards] = useState<Reward[]>([
    { id: "1", code: "LOYALTY20-ABC123", discount: 20, expiresAt: "2026-04-15", used: false },
  ])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [showNewReward, setShowNewReward] = useState(false)

  const handleClaimReward = () => {
    if (availableRewards > 0) {
      const newReward: Reward = {
        id: Date.now().toString(),
        code: `LOYALTY20-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        discount: 20,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        used: false
      }
      setRewards(prev => [newReward, ...prev])
      setShowNewReward(true)
      setTimeout(() => setShowNewReward(false), 3000)
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const activeRewards = rewards.filter(r => !r.used)
  const usedRewards = rewards.filter(r => r.used)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light tracking-tight">Rewards</h1>
        <p className="text-sm text-muted-foreground mt-1">Earn credits and unlock discounts</p>
      </div>

      {/* Credits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Credits */}
        <div className="p-6 border border-border bg-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Your Credits</p>
              <p className="text-4xl font-light">{credits}</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-full">
              <Star className="h-6 w-6 text-accent" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next reward at</span>
              <span className="font-medium">10 credits</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all"
                style={{ width: `${((credits % 10) / 10) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {creditsToNextReward} more credit{creditsToNextReward !== 1 ? "s" : ""} to unlock a 20% discount
            </p>
          </div>
        </div>

        {/* Available Rewards */}
        <div className="p-6 border border-border bg-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Available Rewards</p>
              <p className="text-4xl font-light">{availableRewards}</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-full">
              <Gift className="h-6 w-6 text-accent" strokeWidth={1.5} />
            </div>
          </div>

          {availableRewards > 0 ? (
            <button
              onClick={handleClaimReward}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Gift className="h-4 w-4" />
              Claim 20% Discount
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Complete more trips to earn rewards. You earn 2 credits per trip.
            </p>
          )}
        </div>
      </div>

      {/* How it Works */}
      <div className="p-6 border border-border bg-muted/30">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium">How it works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-sm font-medium flex-shrink-0">
              1
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Book a trip</p>
              <p className="text-xs text-muted-foreground">Complete any bus booking on BusConnect</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-sm font-medium flex-shrink-0">
              2
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Earn 2 credits</p>
              <p className="text-xs text-muted-foreground">Credits are added after successful booking</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-sm font-medium flex-shrink-0">
              3
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Get 20% off</p>
              <p className="text-xs text-muted-foreground">Claim a discount coupon at 10 credits</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Reward Animation */}
      {showNewReward && (
        <div className="fixed bottom-8 right-8 p-4 bg-accent text-accent-foreground shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <Gift className="h-5 w-5" />
          <span className="text-sm font-medium">New reward claimed!</span>
        </div>
      )}

      {/* Your Coupons */}
      {activeRewards.length > 0 && (
        <div>
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Your Coupons</h2>
          <div className="space-y-3">
            {activeRewards.map((reward) => (
              <div key={reward.id} className="p-4 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-accent/10 rounded-sm">
                    <Ticket className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-medium">{reward.discount}% Off</p>
                    <p className="text-xs text-muted-foreground">Expires {new Date(reward.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <code className="text-sm bg-muted px-3 py-1.5 font-mono">{reward.code}</code>
                  <button
                    onClick={() => handleCopyCode(reward.code)}
                    className="p-2 hover:bg-muted rounded-sm transition-colors"
                  >
                    {copiedCode === reward.code ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Used Coupons */}
      {usedRewards.length > 0 && (
        <div>
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Used Coupons</h2>
          <div className="border border-border divide-y divide-border opacity-60">
            {usedRewards.map((reward) => (
              <div key={reward.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ticket className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-sm line-through">{reward.code}</span>
                </div>
                <span className="text-xs text-muted-foreground">Used</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {credits < 10 && (
        <div className="p-6 border border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Book {Math.ceil((10 - credits) / 2)} more trip{Math.ceil((10 - credits) / 2) !== 1 ? "s" : ""} to unlock your first reward
          </p>
          <a
            href="/dashboard/user"
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
          >
            Book a Trip
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  )
}
