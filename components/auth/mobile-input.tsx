"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface MobileInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const COUNTRY_CODES = [
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
]

export function MobileInput({ value, onChange, placeholder = "Mobile number" }: MobileInputProps) {
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0])
  const [isOpen, setIsOpen] = useState(false)
  const [number, setNumber] = useState(value.replace(/^\+\d+\s*/, ""))

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10)
    setNumber(val)
    onChange(`${countryCode.code} ${val}`)
  }

  const handleCountrySelect = (country: typeof COUNTRY_CODES[0]) => {
    setCountryCode(country)
    setIsOpen(false)
    if (number) {
      onChange(`${country.code} ${number}`)
    }
  }

  return (
    <div className="relative flex items-center border-0 border-b border-border focus-within:border-foreground transition-colors">
      {/* Country Code Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 py-3 pr-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>{countryCode.flag}</span>
          <span>{countryCode.code}</span>
          <ChevronDown className="h-3 w-3" />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border shadow-lg min-w-[140px]">
              {COUNTRY_CODES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors ${
                    country.code === countryCode.code ? "bg-muted/30" : ""
                  }`}
                >
                  <span>{country.flag}</span>
                  <span>{country.code}</span>
                  <span className="text-muted-foreground text-xs">{country.country}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Number Input */}
      <input
        type="tel"
        value={number}
        onChange={handleNumberChange}
        placeholder={placeholder}
        className="flex-1 px-0 py-3 bg-transparent border-0 text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-sm"
        autoComplete="tel"
      />
    </div>
  )
}
