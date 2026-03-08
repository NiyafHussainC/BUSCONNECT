"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, MapPin, Calendar, Users, Send, Map, ClipboardList, Loader2, IndianRupee } from "lucide-react"
import { BookingStepper } from "@/components/booking/booking-stepper"

interface BookingData {
  id: string
  busName: string
  fleetName: string
  seatCapacity: number
  isAC: boolean
  priceRange: { min: number; max: number }
  searchData: {
    pickupState: string
    pickupDistrict: string
    tripType: string
    date: string
    returnDate: string
    passengers: number
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, updateUser } = useAuth()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [requestSent, setRequestSent] = useState(false)

  // Request form state
  const [exactPickup, setExactPickup] = useState("")
  const [exactDestination, setExactDestination] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const stored = sessionStorage.getItem("busconnect_selected")
    if (stored) {
      setBookingData(JSON.parse(stored))
    } else {
      router.push("/dashboard/user")
    }
  }, [router])

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingData || !user) return

    setIsProcessing(true)

    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Store requested trip in session (mock)
    const existingTrips = JSON.parse(localStorage.getItem("busconnect_trips") || "[]")
    const newTrip = {
      ...bookingData,
      id: Date.now().toString(),
      status: "requested",
      requestedAt: new Date().toISOString(),
      details: {
        exactPickup,
        exactDestination,
        notes
      }
    }
    localStorage.setItem("busconnect_trips", JSON.stringify([newTrip, ...existingTrips]))

    // Clear session storage
    sessionStorage.removeItem("busconnect_selected")
    sessionStorage.removeItem("busconnect_search")

    setRequestSent(true)
  }

  if (!bookingData) return null

  // Use average of price range as the estimated price
  const estimatedPrice = (bookingData.priceRange.min + bookingData.priceRange.max) / 2
  const isRoundTrip = bookingData.searchData.tripType === "round-trip"

  if (requestSent) {
    return (
      <div className="max-w-xl mx-auto space-y-8 py-12 text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="h-8 w-8 ml-1" />
        </div>
        <h1 className="text-3xl font-light tracking-tight">Request Sent Successfully</h1>
        <p className="text-muted-foreground mt-4 text-left p-6 border border-border bg-card">
          Your request has been sent to the bus owner. They will review availability and send you a quote shortly.
        </p>
        <Link
          href="/dashboard/user/trips"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          View My Trips
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Stepper */}
      <BookingStepper currentStep={3} />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/user/search-results"
          className="p-2 hover:bg-muted rounded-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-light tracking-tight">Send Booking Request</h1>
          <p className="text-sm text-muted-foreground mt-1">Provide trip details to request a quote from the owner</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Summary Overview */}
          <div className="p-6 border border-border bg-accent/5">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Selected Bus</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-medium text-lg text-primary">{bookingData.busName}</p>
                  <p className="text-sm text-muted-foreground mb-2">{bookingData.fleetName}</p>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md uppercase tracking-wider font-medium">
                    {isRoundTrip ? "Round Trip" : "One-way"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{new Date(bookingData.searchData.date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}</p>
                    {isRoundTrip && bookingData.searchData.returnDate && (
                      <p className="text-xs text-muted-foreground">
                        Return: {new Date(bookingData.searchData.returnDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{bookingData.searchData.passengers} Passenger{bookingData.searchData.passengers > 1 ? "s" : ""}</p>
                    <p className="text-xs text-muted-foreground capitalize">{bookingData.seatCapacity} seats available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Request Details Form */}
          <form id="request-form" onSubmit={handleSendRequest} className="p-6 border border-border bg-card">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-6">Trip Details</h2>

            <div className="space-y-6">
              {/* Exact Pickup */}
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> Exact Pickup Location
                </label>
                <div className="text-xs text-muted-foreground mb-2">
                  Region: {bookingData.searchData.pickupDistrict}, {bookingData.searchData.pickupState}
                </div>
                <input
                  type="text"
                  required
                  value={exactPickup}
                  onChange={(e) => setExactPickup(e.target.value)}
                  placeholder="e.g. Terminal 1, Main Railway Station or full address"
                  className="w-full px-4 py-3 bg-transparent border border-border focus:border-primary focus:outline-none text-sm transition-colors rounded-md"
                />
              </div>

              {/* Exact Destination */}
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                  <Map className="h-3 w-3" /> Destination Location
                </label>
                <input
                  type="text"
                  required
                  value={exactDestination}
                  onChange={(e) => setExactDestination(e.target.value)}
                  placeholder="e.g. Hotel Taj, Mumbai or full address"
                  className="w-full px-4 py-3 bg-transparent border border-border focus:border-primary focus:outline-none text-sm transition-colors rounded-md"
                />
              </div>

              {/* Notes for Owner */}
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                  <ClipboardList className="h-3 w-3" /> Notes for Owner (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any special requirements (e.g. extra luggage space needed, multiple pickup points...)"
                  className="w-full px-4 py-3 bg-transparent border border-border focus:border-primary focus:outline-none text-sm transition-colors rounded-md min-h-[100px] resize-y"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-1">
          <div className="p-6 border border-border sticky top-6 bg-card">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Quote Information</h2>

            <div className="py-4 space-y-4 border-b border-border">
              <p className="text-xs text-muted-foreground">
                The final quote will be provided by the owner after reviewing your request details.
              </p>

              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                <IndianRupee className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                <p>No payment is required right now. You will be asked for a 20% advance only after accepting the owner&apos;s quote.</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                form="request-form"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors rounded-md disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Request to Owner
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

