"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BookingStepper } from "@/components/booking/booking-stepper"
import { BusCard, type BusResult, type BusAvailability } from "@/components/booking/bus-card"

interface SearchData {
  pickupState: string
  pickupDistrict: string
  tripType: string
  date: string
  returnDate: string
  passengers: number
  busType: string
}

// Mock bus data with capacity and availability
const mockBuses: BusResult[] = [
  {
    id: "1",
    busName: "Express One",
    fleetName: "Metro Express Lines",
    seatCapacity: 20,
    isAC: true,
    availability: "available",
    priceRange: { min: 12000, max: 15000 },
    rating: 4.8,
    amenities: ["WiFi", "USB Charging", "Water Bottles"]
  },
  {
    id: "2",
    busName: "City Cruiser",
    fleetName: "City Transit Co",
    seatCapacity: 25,
    isAC: true,
    availability: "requested",
    priceRange: { min: 14000, max: 18000 },
    rating: 4.5,
    amenities: ["AC", "Reclining Seats"]
  },
  {
    id: "3",
    busName: "Highway King",
    fleetName: "Highway Coaches",
    seatCapacity: 30,
    isAC: false,
    availability: "available",
    priceRange: { min: 10000, max: 13000 },
    rating: 4.3,
    amenities: ["Fan", "Music System"]
  },
  {
    id: "4",
    busName: "Luxury Liner",
    fleetName: "Premium Travels",
    seatCapacity: 35,
    isAC: true,
    availability: "booked",
    priceRange: { min: 22000, max: 28000 },
    rating: 4.9,
    amenities: ["WiFi", "AC", "Sleeper Beds", "Blankets", "Snacks"]
  },
  {
    id: "5",
    busName: "Budget Express",
    fleetName: "Economy Lines",
    seatCapacity: 40,
    isAC: false,
    availability: "available",
    priceRange: { min: 8000, max: 11000 },
    rating: 4.0,
    amenities: ["Fan"]
  },
  {
    id: "6",
    busName: "Super Deluxe",
    fleetName: "Royal Travels",
    seatCapacity: 50,
    isAC: true,
    availability: "requested",
    priceRange: { min: 25000, max: 32000 },
    rating: 4.7,
    amenities: ["WiFi", "AC", "TV", "Toilet", "Refreshments"]
  },
  {
    id: "7",
    busName: "Mini Coach",
    fleetName: "Metro Express Lines",
    seatCapacity: 15,
    isAC: true,
    availability: "available",
    priceRange: { min: 9000, max: 12000 },
    rating: 4.4,
    amenities: ["AC", "Music System"]
  },
  {
    id: "8",
    busName: "Tempo Traveller",
    fleetName: "Quick Transit",
    seatCapacity: 12,
    isAC: true,
    availability: "available",
    priceRange: { min: 7000, max: 9500 },
    rating: 4.2,
    amenities: ["AC", "Pushback Seats"]
  },
]

export default function SearchResultsPage() {
  const router = useRouter()
  const [searchData, setSearchData] = useState<SearchData | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("busconnect_search")
    if (stored) {
      setSearchData(JSON.parse(stored))
    } else {
      router.push("/dashboard/user")
    }
  }, [router])

  // Filter buses by capacity >= passengers and sort by closest capacity match
  const filteredAndSortedBuses = useMemo(() => {
    if (!searchData) return []

    const passengers = searchData.passengers

    // Filter buses that can accommodate the group
    const eligible = mockBuses.filter(bus => bus.seatCapacity >= passengers)

    // Sort by closest capacity (smaller capacity that fits comes first)
    return eligible.sort((a, b) => a.seatCapacity - b.seatCapacity)
  }, [searchData])

  const handleRequest = (bus: BusResult) => {
    if (!searchData) return

    // Store selected bus and search data for checkout
    sessionStorage.setItem("busconnect_selected", JSON.stringify({
      ...bus,
      searchData
    }))
    router.push("/dashboard/user/checkout")
  }

  if (!searchData) return null

  return (
    <div className="space-y-6">
      {/* Progress Stepper */}
      <BookingStepper currentStep={2} />

      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/dashboard/user"
          className="p-2 hover:bg-muted rounded-sm transition-colors mt-1"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-light tracking-tight flex items-center gap-2">
            {searchData.pickupDistrict}, {searchData.pickupState}
          </h1>
          <div className="mt-2 mb-1">
            <span className="text-xs px-2 py-1 bg-muted rounded-md uppercase tracking-wider font-medium text-muted-foreground">
              {searchData.tripType === "round-trip" ? "Round Trip" : "One-way"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(searchData.date).toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })} · {searchData.passengers} passenger{searchData.passengers > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {filteredAndSortedBuses.length} bus{filteredAndSortedBuses.length !== 1 ? "es" : ""} found for {searchData.passengers} passengers
        </p>

        {filteredAndSortedBuses.length === 0 ? (
          <div className="p-12 border border-border text-center">
            <p className="text-muted-foreground">No buses available for {searchData.passengers} passengers.</p>
            <p className="text-sm text-muted-foreground mt-1">Try reducing the passenger count or searching different dates.</p>
            <Link
              href="/dashboard/user"
              className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
            >
              Modify Search
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAndSortedBuses.map((bus) => (
              <BusCard
                key={bus.id}
                bus={bus}
                passengerCount={searchData.passengers}
                onRequest={handleRequest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
