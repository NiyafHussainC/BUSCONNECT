"use client"

import { Bus, Users, Snowflake, Fan, Star, Info } from "lucide-react"

export type BusAvailability = "available" | "requested" | "booked"

export interface BusResult {
  id: string
  busName: string
  fleetName: string
  seatCapacity: number
  isAC: boolean
  availability: BusAvailability
  priceRange: { min: number; max: number }
  rating: number
  amenities: string[]
}

interface BusCardProps {
  bus: BusResult
  passengerCount: number
  onRequest: (bus: BusResult) => void
}

function AvailabilityBadge({ status }: { status: BusAvailability }) {
  const config = {
    available: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      text: "text-emerald-700 dark:text-emerald-400",
      label: "Available",
    },
    requested: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      text: "text-amber-700 dark:text-amber-400",
      label: "Requested by other users",
    },
    booked: {
      bg: "bg-red-50 dark:bg-red-950/30",
      text: "text-red-700 dark:text-red-400",
      label: "Booked",
    },
  }

  const { bg, text, label } = config[status]

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-sm ${bg} ${text}`}>
      {label}
    </span>
  )
}

export function BusCard({ bus, passengerCount, onRequest }: BusCardProps) {
  const isBestFit = bus.seatCapacity <= passengerCount + 10 && bus.seatCapacity >= passengerCount
  const isBooked = bus.availability === "booked"
  const isRequested = bus.availability === "requested"

  return (
    <div className="relative p-6 border border-border bg-card hover:border-foreground/30 transition-colors">
      {/* Availability Badge - Top Right */}
      <div className="absolute top-4 right-4">
        <AvailabilityBadge status={bus.availability} />
      </div>

      {/* Best Fit Label */}
      {isBestFit && (
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 text-xs font-medium rounded-sm bg-accent/10 text-accent">
            Best fit for your group
          </span>
        </div>
      )}

      <div className="pt-6">
        {/* Bus Info Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-muted rounded-sm">
            <Bus className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-medium text-lg">{bus.busName}</h3>
            <p className="text-sm text-muted-foreground">{bus.fleetName}</p>
          </div>
        </div>

        {/* Features Row */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{bus.seatCapacity} Seats</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {bus.isAC ? (
              <>
                <Snowflake className="h-4 w-4" />
                <span>AC</span>
              </>
            ) : (
              <>
                <Fan className="h-4 w-4" />
                <span>Non-AC</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span>{bus.rating}</span>
          </div>
        </div>

        {/* Amenities */}
        {bus.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {bus.amenities.map((amenity) => (
              <span
                key={amenity}
                className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}



        {/* Request Button & Helper Text */}
        <div className="space-y-2">
          {isBooked ? (
            <>
              <button
                disabled
                className="w-full py-3 bg-muted text-muted-foreground text-sm font-medium cursor-not-allowed"
              >
                Booked
              </button>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                This bus is already booked for the selected date. Please choose another bus or change the date.
              </p>
            </>
          ) : isRequested ? (
            <>
              <button
                onClick={() => onRequest(bus)}
                className="w-full py-3 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Request Anyway
              </button>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                This bus already has requests for this date. The first confirmed booking will secure the bus.
              </p>
            </>
          ) : (
            <button
              onClick={() => onRequest(bus)}
              className="w-full py-3 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Request This Bus
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
