"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, Ticket, Check, AlertCircle, Loader2, Bus } from "lucide-react"

// Trip Interface matches the one in trips/page.tsx
type TripStatus = "requested" | "quoted" | "booked" | "completed" | "cancelled" | "declined"

interface Trip {
    id: string
    operator: string
    busName: string
    searchData: {
        pickup: string
        destination: string
        date: string
        passengers: number
    }
    departureTime: string
    arrivalTime: string
    status: TripStatus
    totalPaid: number
    bookedAt: string
}

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const [trip, setTrip] = useState<Trip | null>(null)

    const [couponCode, setCouponCode] = useState("")
    const [discountPercent, setDiscountPercent] = useState(0)
    const [couponStatus, setCouponStatus] = useState<"idle" | "success" | "error">("idle")

    const [isProcessing, setIsProcessing] = useState(false)

    // Load the specific trip
    useEffect(() => {
        const stored = localStorage.getItem("busconnect_trips")
        if (stored) {
            const parsed: Trip[] = JSON.parse(stored)
            const foundTrip = parsed.find(t => t.id === resolvedParams.id)

            // If trip doesn't exist or isn't in 'quoted' state, redirect back
            if (!foundTrip || foundTrip.status !== "quoted") {
                router.push("/dashboard/user/trips")
            } else {
                setTrip(foundTrip)
            }
        } else {
            router.push("/dashboard/user/trips")
        }
    }, [resolvedParams.id, router])

    if (!trip) return null

    const totalQuote = trip.totalPaid
    const advanceRequired = Math.round(totalQuote * 0.3)
    const discountAmount = Math.round(advanceRequired * (discountPercent / 100))
    const finalAmount = advanceRequired - discountAmount

    const applyCoupon = () => {
        if (!couponCode) return

        if (couponCode.toUpperCase() === "BUS10") {
            setDiscountPercent(10)
            setCouponStatus("success")
        } else {
            setDiscountPercent(0)
            setCouponStatus("error")
        }
    }

    const handlePayment = async () => {
        setIsProcessing(true)

        // Simulate payment processing time
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Update persistent storage to booked
        const stored = localStorage.getItem("busconnect_trips")
        if (stored) {
            const parsed: Trip[] = JSON.parse(stored)
            const updated = parsed.map(t =>
                t.id === trip.id ? { ...t, status: "booked" as TripStatus } : t
            )
            localStorage.setItem("busconnect_trips", JSON.stringify(updated))
        }

        router.push("/dashboard/user/trips?success=true")
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/user/trips"
                    className="p-2 hover:bg-muted rounded-sm transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-light tracking-tight">Advance Payment</h1>
                    <p className="text-sm text-muted-foreground mt-1">Pay 30% to instantly lock in your booked bus</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Col - Summary */}
                <div className="space-y-6">
                    <div className="p-6 border border-border bg-card">
                        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Trip Details</h2>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-muted rounded-sm mt-1">
                                    <Bus className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg flex items-center gap-2">
                                        {trip.searchData.pickup} <span className="text-muted-foreground">→</span> {trip.searchData.destination}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{trip.operator} • {trip.busName}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Date</p>
                                    <p className="text-sm font-medium">
                                        {new Date(trip.searchData.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Passengers</p>
                                    <p className="text-sm font-medium">
                                        {trip.searchData.passengers}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col - Payment Breakdown */}
                <div className="space-y-6">
                    <div className="p-6 border border-border bg-accent/5">
                        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Payment Summary</h2>

                        <div className="space-y-3 pb-4 border-b border-border/50">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Total Trip Quote</span>
                                <span>₹{totalQuote.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span>Advance Required (30%)</span>
                                <span>₹{advanceRequired.toLocaleString("en-IN")}</span>
                            </div>
                        </div>

                        {/* Coupons */}
                        <div className="py-4 border-b border-border/50 space-y-3">
                            <label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Ticket className="h-3 w-3" /> Add Coupon Code
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => {
                                        setCouponCode(e.target.value)
                                        setCouponStatus("idle")
                                    }}
                                    disabled={discountPercent > 0}
                                    placeholder="e.g. BUS10"
                                    className="w-full px-3 py-2 bg-transparent border border-border focus:border-primary focus:outline-none text-sm transition-colors rounded-sm disabled:opacity-50"
                                />
                                <button
                                    onClick={applyCoupon}
                                    disabled={!couponCode || discountPercent > 0}
                                    className="px-4 py-2 bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors rounded-sm disabled:opacity-50"
                                >
                                    Apply
                                </button>
                            </div>

                            {couponStatus === "success" && (
                                <p className="text-xs text-emerald-600 flex items-center gap-1">
                                    <Check className="h-3 w-3" /> Coupon applied! {discountPercent}% off your advance.
                                </p>
                            )}
                            {couponStatus === "error" && (
                                <p className="text-xs text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> Invalid coupon code.
                                </p>
                            )}

                            {discountAmount > 0 && (
                                <div className="flex items-center justify-between text-sm text-emerald-600 pt-2">
                                    <span>Discount</span>
                                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                                </div>
                            )}
                        </div>

                        {/* Total */}
                        <div className="pt-4 flex items-end justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Amount Due Now</p>
                                <p className="text-xs text-muted-foreground">Remaining 70% paid later</p>
                            </div>
                            <p className="text-2xl font-semibold text-accent">₹{finalAmount.toLocaleString("en-IN")}</p>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50"
                    >
                        {isProcessing ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <CreditCard className="h-5 w-5" />
                                Confirm Payment & Book
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
