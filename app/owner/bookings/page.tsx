"use client"

import { useState } from "react"
import { MapPin, Calendar, Users, DollarSign, MessageSquare } from "lucide-react"

type BookingStatus = "requested" | "quoted" | "confirmed" | "completed" | "cancelled"

interface BookingRequest {
  id: string
  customerName: string
  customerEmail: string
  pickup: string
  destination: string
  date: string
  returnDate?: string
  passengers: number
  busType: "standard" | "luxury" | "sleeper"
  status: BookingStatus
  quotedPrice?: number
  message?: string
}

const initialBookings: BookingRequest[] = [
  { id: "1", customerName: "Rahul Sharma", customerEmail: "rahul@example.com", pickup: "Mumbai, MH", destination: "Pune, MH", date: "Mar 15, 2026", passengers: 42, busType: "luxury", status: "requested", message: "Company retreat for tech team" },
  { id: "2", customerName: "Priya Patel", customerEmail: "priya@example.com", pickup: "Bengaluru, KA", destination: "Mysuru, KA", date: "Mar 18, 2026", passengers: 35, busType: "standard", status: "quoted", quotedPrice: 12500 },
  { id: "3", customerName: "Amit Kumar", customerEmail: "amit@example.com", pickup: "Delhi, DL", destination: "Jaipur, RJ", date: "Mar 20, 2026", returnDate: "Mar 21, 2026", passengers: 48, busType: "luxury", status: "confirmed", quotedPrice: 28000 },
  { id: "4", customerName: "Sneha Reddy", customerEmail: "sneha@example.com", pickup: "Hyderabad, TS", destination: "Vijayawada, AP", date: "Mar 10, 2026", passengers: 30, busType: "sleeper", status: "completed", quotedPrice: 15600 },
]

const statusColors: Record<BookingStatus, string> = {
  requested: "bg-primary/10 text-primary",
  quoted: "bg-accent/10 text-accent",
  confirmed: "bg-accent/10 text-accent",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive"
}

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>(initialBookings)
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null)
  const [quotePrice, setQuotePrice] = useState("")

  const handleQuote = (id: string) => {
    const price = parseFloat(quotePrice)
    if (!isNaN(price) && price > 0) {
      setBookings(prev => prev.map(b =>
        b.id === id ? { ...b, status: "quoted" as BookingStatus, quotedPrice: price } : b
      ))
      setQuotePrice("")
      setSelectedBooking(null)
    }
  }

  const requestedBookings = bookings.filter(b => b.status === "requested")
  const activeBookings = bookings.filter(b => ["quoted", "confirmed"].includes(b.status))
  const pastBookings = bookings.filter(b => ["completed", "cancelled"].includes(b.status))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light tracking-tight">Booking Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and respond to customer booking requests</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* New Requests */}
          {requestedBookings.length > 0 && (
            <div>
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">New Requests ({requestedBookings.length})</h2>
              <div className="space-y-4">
                {requestedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className={`p-4 border cursor-pointer transition-colors ${selectedBooking?.id === booking.id ? "border-foreground" : "border-border hover:border-foreground/50"
                      }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-xs text-muted-foreground">{booking.customerEmail}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {booking.pickup} → {booking.destination}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {booking.passengers}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Bookings */}
          {activeBookings.length > 0 && (
            <div>
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Active Bookings</h2>
              <div className="border border-border divide-y divide-border">
                {activeBookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className="p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{booking.pickup} → {booking.destination}</p>
                        <p className="text-xs text-muted-foreground">{booking.customerName} · {booking.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">₹{booking.quotedPrice?.toLocaleString("en-IN")}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[booking.status]}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Past Bookings</h2>
              <div className="border border-border divide-y divide-border">
                {pastBookings.map((booking) => (
                  <div key={booking.id} className="p-4 opacity-60">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">{booking.pickup} → {booking.destination}</p>
                        <p className="text-xs text-muted-foreground">{booking.customerName} · {booking.date}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedBooking && (
          <div className="lg:w-80 border border-border p-6 h-fit sticky top-6">
            <h3 className="text-lg font-light mb-4">Request Details</h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Customer</p>
                <p className="text-sm font-medium">{selectedBooking.customerName}</p>
                <p className="text-xs text-muted-foreground">{selectedBooking.customerEmail}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Route</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{selectedBooking.pickup} → {selectedBooking.destination}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Date</p>
                  <p className="text-sm">{selectedBooking.date}</p>
                  {selectedBooking.returnDate && (
                    <p className="text-xs text-muted-foreground">Return: {selectedBooking.returnDate}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Passengers</p>
                  <p className="text-sm">{selectedBooking.passengers}</p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Bus Type</p>
                <p className="text-sm capitalize">{selectedBooking.busType}</p>
              </div>

              {selectedBooking.message && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Message</p>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-3">
                    <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p>{selectedBooking.message}</p>
                  </div>
                </div>
              )}

              {selectedBooking.quotedPrice && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Quoted Price</p>
                  <p className="text-lg font-medium">₹{selectedBooking.quotedPrice.toLocaleString("en-IN")}</p>
                </div>
              )}
            </div>

            {selectedBooking.status === "requested" && (
              <div className="mt-6 pt-6 border-t border-border">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Your Quote</label>
                <div className="flex items-center gap-2 mt-2">
                  <div className="relative flex-1">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground w-4 flex justify-center">₹</span>
                    <input
                      type="number"
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-6 pr-0 py-2 bg-transparent border-0 border-b border-border focus:border-foreground focus:outline-none text-sm transition-colors"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleQuote(selectedBooking.id)}
                  disabled={!quotePrice || parseFloat(quotePrice) <= 0}
                  className="w-full mt-4 py-2 px-4 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Quote
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
