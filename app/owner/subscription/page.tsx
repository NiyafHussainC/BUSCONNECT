"use client"

import { useAuth } from "@/contexts/auth-context"
import { Check, ShieldCheck } from "lucide-react"

export default function SubscriptionPage() {
    const { user } = useAuth()

    // Calculate mock expiry date based on trialDaysLeft
    const mockExpiryDate = new Date()
    mockExpiryDate.setDate(mockExpiryDate.getDate() + (user?.trialDaysLeft || 30))
    const formattedExpiry = mockExpiryDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    })

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl lg:text-3xl font-light tracking-tight">Choose a plan that fits your fleet size and growth goals.</h1>
            </div>

            {/* Current Plan Banner */}
            <div className="bg-card border-l-4 border-l-foreground border-y-border border-r-border border rounded-r-md p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-sm uppercase tracking-wider text-muted-foreground">CURRENT PLAN</h2>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-medium">Free Trial</span>
                        <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 font-medium rounded-sm tracking-wide">
                            ACTIVE
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        Bus Limit: <strong className="text-foreground font-medium">2 Buses</strong> • Active: 0
                    </p>
                </div>

                <div className="flex flex-col items-start sm:items-end text-sm">
                    <span className="text-muted-foreground">Expires on</span>
                    <span className="font-medium">{formattedExpiry}</span>
                </div>
            </div>

            {/* Pricing Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

                {/* Basic Plan */}
                <div className="bg-card border border-border rounded-xl p-8 flex flex-col h-full">
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4">Basic Plan</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-semibold tracking-tight">₹499</span>
                            <span className="text-muted-foreground text-sm">/ month</span>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 mb-8">
                        <div className="flex items-center gap-3 text-sm text-foreground/80">
                            <div className="bg-green-500/10 p-0.5 rounded-full flex-shrink-0">
                                <Check className="h-4 w-4 text-green-600" strokeWidth={2.5} />
                            </div>
                            <span>Up to 2 Buses</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-foreground/80">
                            <div className="bg-green-500/10 p-0.5 rounded-full flex-shrink-0">
                                <Check className="h-4 w-4 text-green-600" strokeWidth={2.5} />
                            </div>
                            <span>Standard Listing</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-foreground/80">
                            <div className="bg-green-500/10 p-0.5 rounded-full flex-shrink-0">
                                <Check className="h-4 w-4 text-green-600" strokeWidth={2.5} />
                            </div>
                            <span>Email Support</span>
                        </div>
                    </div>

                    <button className="w-full py-2.5 px-4 rounded-md border border-border hover:bg-muted transition-colors text-sm font-medium">
                        Upgrade Now
                    </button>
                </div>

                {/* Standard Plan (Most Popular) */}
                <div className="relative bg-card border-[1.5px] border-foreground rounded-xl p-8 shadow-sm flex flex-col h-[calc(100%+16px)]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase">
                        MOST POPULAR
                    </div>

                    <div className="mb-6 mt-2">
                        <h3 className="text-lg font-bold mb-4">Standard Plan</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold tracking-tight">₹999</span>
                            <span className="text-muted-foreground text-sm">/ month</span>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 mb-8">
                        <div className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
                            <div className="bg-green-500/10 p-0.5 rounded-full flex-shrink-0">
                                <Check className="h-4 w-4 text-green-600" strokeWidth={2.5} />
                            </div>
                            <span>Up to 5 Buses</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
                            <div className="bg-green-500/10 p-0.5 rounded-full flex-shrink-0">
                                <Check className="h-4 w-4 text-green-600" strokeWidth={2.5} />
                            </div>
                            <span>Priority Listing</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
                            <div className="bg-green-500/10 p-0.5 rounded-full flex-shrink-0">
                                <Check className="h-4 w-4 text-green-600" strokeWidth={2.5} />
                            </div>
                            <span>Direct Customer Contact</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
                            <div className="bg-green-500/10 p-0.5 rounded-full flex-shrink-0">
                                <Check className="h-4 w-4 text-green-600" strokeWidth={2.5} />
                            </div>
                            <span>24/7 Support</span>
                        </div>
                    </div>

                    <button className="w-full py-2.5 px-4 rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-semibold">
                        Upgrade Now
                    </button>
                </div>

                {/* Premium Plan */}
                <div className="bg-card border border-border rounded-xl p-8 flex flex-col h-full">
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4">Premium Plan</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-semibold tracking-tight">₹1999</span>
                            <span className="text-muted-foreground text-sm">/ month</span>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 mb-8">
                        <div className="flex items-center gap-3 text-sm text-foreground/80">
                            <div className="bg-green-500/10 p-0.5 rounded-full flex-shrink-0">
                                <Check className="h-4 w-4 text-green-600" strokeWidth={2.5} />
                            </div>
                            <span>Up to 10 Buses</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-foreground/80">
                            <div className="bg-green-500/10 p-0.5 rounded-full flex-shrink-0">
                                <Check className="h-4 w-4 text-green-600" strokeWidth={2.5} />
                            </div>
                            <span>Top Search Results</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-foreground/80">
                            <div className="bg-green-500/10 p-0.5 rounded-full flex-shrink-0">
                                <Check className="h-4 w-4 text-green-600" strokeWidth={2.5} />
                            </div>
                            <span>Dedicated Manager</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-foreground/80">
                            <div className="bg-green-500/10 p-0.5 rounded-full flex-shrink-0">
                                <Check className="h-4 w-4 text-green-600" strokeWidth={2.5} />
                            </div>
                            <span>Analytics Dashboard</span>
                        </div>
                    </div>

                    <button className="w-full py-2.5 px-4 rounded-md border border-border hover:bg-muted transition-colors text-sm font-medium">
                        Upgrade Now
                    </button>
                </div>

            </div>

            {/* Footer Guarantees */}
            <div className="pt-8 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure Payment • Cancel Anytime • Money Back Guarantee</span>
            </div>

        </div>
    )
}
