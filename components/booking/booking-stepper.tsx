"use client"

import { Check } from "lucide-react"

const STEPS = [
  { id: 1, label: "Plan Trip" },
  { id: 2, label: "Select Bus" },
  { id: 3, label: "Send Request" },
  { id: 4, label: "Receive Quote" },
  { id: 5, label: "Confirm Booking" },
]

interface BookingStepperProps {
  currentStep: number
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const isLast = index === STEPS.length - 1

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                    ${isCompleted
                      ? "bg-accent text-accent-foreground"
                      : isCurrent
                        ? "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-accent"
                        : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs whitespace-nowrap hidden sm:block
                    ${isCurrent ? "text-foreground font-medium" : "text-muted-foreground"}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`
                    flex-1 h-px mx-2 sm:mx-4 transition-colors
                    ${isCompleted ? "bg-accent" : "bg-border"}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
