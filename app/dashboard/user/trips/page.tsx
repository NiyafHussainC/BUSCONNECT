"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MapPin, Calendar, Check, Clock, CircleDot, CheckCircle2, AlertCircle, Loader2, CreditCard } from "lucide-react"

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
  quoteLockedUntil?: string
}

const statusConfig: Record<TripStatus, { label: string; color: string; icon: React.ElementType }> = {
  requested: { label: "Requested", color: "text-primary bg-primary/10", icon: Clock },
  quoted: { label: "Quoted", color: "text-accent bg-accent/10", icon: CircleDot },
  booked: { label: "Booked", color: "text-accent bg-accent/10", icon: Check },
  completed: { label: "Completed", color: "text-muted-foreground bg-muted", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-destructive bg-destructive/10", icon: AlertCircle },
  declined: { label: "Declined", color: "text-destructive bg-destructive/10", icon: AlertCircle },
}

const statusSteps: TripStatus[] = ["requested", "quoted", "booked", "completed"]

export default function TripsPage() {
  const searchParams = useSearchParams()
  const [trips, setTrips] = useState<Trip[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [now, setNow] = useState<number>(0)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    // Load trips from localStorage
    const stored = localStorage.getItem("busconnect_trips")
    if (stored) {
      setTrips(JSON.parse(stored))
    }

    // Show success message if redirected from checkout
    if (searchParams.get("success") === "true") {
      setShowSuccess(true)
      // Clear the query param
      window.history.replaceState({}, "", "/dashboard/user/trips")
      setTimeout(() => setShowSuccess(false), 5000)
    }

    // Set initial 'now' and start timer for cooldowns
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [searchParams])

  // Add mock trips if none exist
  useEffect(() => {
    if (trips.length === 0) {
      const mockTrips: Trip[] = [
        {
          id: "mock4",
          operator: "Kerala Lines",
          busName: "Volvo Semi-Sleeper",
          searchData: { pickup: "Kochi", destination: "Trivandrum", date: "2026-03-25", passengers: 4 },
          departureTime: "06:00 AM",
          arrivalTime: "11:00 AM",
          status: "quoted",
          totalPaid: 3200,
          bookedAt: new Date().toISOString(),
          quoteLockedUntil: new Date(Date.now() + 4 * 60000 + 30000).toISOString() // Locked for 4m 30s
        },
        {
          id: "mock3",
          operator: "Royal Travels",
          busName: "Super Deluxe AC",
          searchData: { pickup: "Mumbai", destination: "Pune", date: "2026-03-20", passengers: 15 },
          departureTime: "10:00 AM",
          arrivalTime: "02:30 PM",
          status: "quoted",
          totalPaid: 12500,
          bookedAt: new Date().toISOString()
        },
        {
          id: "mock5",
          operator: "National Travels",
          busName: "AC Seater",
          searchData: { pickup: "Chennai", destination: "Madurai", date: "2026-04-02", passengers: 2 },
          departureTime: "08:30 PM",
          arrivalTime: "05:00 AM",
          status: "declined",
          totalPaid: 1500,
          bookedAt: "2026-02-28T10:00:00Z"
        },
        {
          id: "mock1",
          operator: "Metro Express",
          busName: "Express One",
          searchData: { pickup: "Bengaluru", destination: "Mysuru", date: "2026-02-15", passengers: 2 },
          departureTime: "08:00 AM",
          arrivalTime: "12:30 PM",
          status: "completed",
          totalPaid: 1200,
          bookedAt: "2026-02-10T10:00:00Z"
        },
        {
          id: "mock2",
          operator: "City Transit",
          busName: "City Cruiser",
          searchData: { pickup: "Delhi", destination: "Jaipur", date: "2026-03-01", passengers: 1 },
          departureTime: "09:30 AM",
          arrivalTime: "02:15 PM",
          status: "completed",
          totalPaid: 850,
          bookedAt: "2026-02-25T14:00:00Z"
        },
      ]
      setTrips(mockTrips)
      localStorage.setItem("busconnect_trips", JSON.stringify(mockTrips))
    }
  }, [trips.length])

  const activeTrips = trips.filter(t => ["requested", "quoted", "booked"].includes(t.status))
  const pastTrips = trips.filter(t => ["completed", "cancelled", "declined"].includes(t.status))

  const getStepIndex = (status: TripStatus) => statusSteps.indexOf(status)

  // Payment now routes to the checkout page instead of doing it inline
  const handlePaymentRouting = (tripId: string) => {
    window.location.href = `/dashboard/user/payment/${tripId}`
  }

  return (
    <div className="space-y-8">
      {/* Success Banner */}
      {showSuccess && (
        <div className="p-4 bg-accent/10 border border-accent/20 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-accent" />
          <div>
            <p className="text-sm font-medium">Booking confirmed!</p>
            <p className="text-xs text-muted-foreground">You earned 2 credits for this trip</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-light tracking-tight">My Trips</h1>
        <p className="text-sm text-muted-foreground mt-1">View and track your bookings</p>
      </div>

      {/* Active Trips */}
      {activeTrips.length > 0 && (
        <div>
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Upcoming</h2>
          <div className="space-y-4">
            {activeTrips.map((trip) => {
              const StatusIcon = statusConfig[trip.status].icon
              const currentStepIndex = getStepIndex(trip.status)

              // Cooldown timer logic
              const isLocked = trip.quoteLockedUntil && now > 0 ? new Date(trip.quoteLockedUntil).getTime() > now : false
              let lockText = ""
              if (isLocked && trip.quoteLockedUntil) {
                const lockSecondsLeft = Math.ceil((new Date(trip.quoteLockedUntil).getTime() - now) / 1000)
                const mins = Math.floor(lockSecondsLeft / 60)
                const secs = lockSecondsLeft % 60
                lockText = `${mins}:${secs.toString().padStart(2, '0')}`
              }

              return (
                <div key={trip.id} className="p-6 border border-border">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Trip Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[trip.status].color}`}>
                          {statusConfig[trip.status].label}
                        </span>
                      </div>

                      <h3 className="text-lg font-medium mb-1 flex items-center gap-2">
                        {trip.searchData.pickup}
                        <span className="text-muted-foreground">→</span>
                        {trip.searchData.destination}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {trip.operator} · {trip.busName}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(trip.searchData.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {trip.departureTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {trip.searchData.passengers} passenger{trip.searchData.passengers > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Status Stepper */}
                    <div className="lg:w-64">
                      <div className="flex items-center justify-between">
                        {statusSteps.map((step, index) => {
                          const StepIcon = statusConfig[step].icon
                          const isCompleted = index <= currentStepIndex
                          const isCurrent = index === currentStepIndex

                          return (
                            <div key={step} className="flex flex-col items-center relative">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-muted-foreground"
                                }`}>
                                <StepIcon className="h-4 w-4" strokeWidth={1.5} />
                              </div>
                              <span className={`text-xs mt-1 ${isCurrent ? "font-medium" : "text-muted-foreground"}`}>
                                {statusConfig[step].label}
                              </span>
                              {index < statusSteps.length - 1 && (
                                <div className={`absolute top-4 left-full w-8 h-0.5 -translate-y-1/2 ${index < currentStepIndex ? "bg-accent" : "bg-border"
                                  }`} />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Advance Payment Box for Quoted Trips */}
                  {trip.status === "quoted" && (
                    <div className="mt-6 p-4 bg-accent/5 flex-col md:flex-row flex items-start md:items-center justify-between gap-4 rounded-md border border-accent/20 border-dashed">
                      <div>
                        <p className="text-sm font-medium mb-1 line-through text-muted-foreground decoration-muted-foreground/50">Total Quote: ₹{trip.totalPaid.toLocaleString("en-IN")}</p>
                        <p className="font-medium flex items-center gap-1">
                          Advance Required (30%): <span className="text-xl font-semibold text-accent ml-1">₹{Math.round(trip.totalPaid * 0.3).toLocaleString("en-IN")}</span>
                        </p>
                      </div>

                      <div className="w-full md:w-auto flex flex-col items-end gap-1">
                        <button
                          onClick={() => handlePaymentRouting(trip.id)}
                          disabled={isLocked}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors rounded-sm disabled:opacity-50"
                        >
                          <CreditCard className="h-4 w-4" />
                          {isLocked ? "Currently Locked" : "Pay Advance & Book"}
                        </button>
                        {isLocked && (
                          <p className="text-xs text-muted-foreground self-start md:self-end flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Another user is paying. Try again in <strong className="tabular-nums">{lockText}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Past Trips */}
      {pastTrips.length > 0 && (
        <div>
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Past Trips</h2>
          <div className="border border-border divide-y divide-border">
            {pastTrips.map((trip) => (
              <div key={trip.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {trip.searchData.pickup}
                    <span className="text-muted-foreground">→</span>
                    {trip.searchData.destination}
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    {new Date(trip.searchData.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {trip.operator}
                  </p>
                  {trip.status === "declined" && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      This bus has been booked by another customer.
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[trip.status].color}`}>
                    {statusConfig[trip.status].label}
                  </span>
                  <span className="text-sm font-medium">₹{trip.totalPaid.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {trips.length === 0 && (
        <div className="text-center py-12 border border-border">
          <p className="text-muted-foreground">No trips yet</p>
          <p className="text-sm text-muted-foreground mt-1">Book your first trip to get started</p>
        </div>
      )}
    </div>
  )
}
