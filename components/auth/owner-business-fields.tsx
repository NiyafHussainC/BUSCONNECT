"use client"

import { FileUploadMinimal } from "./file-upload-minimal"

interface OwnerBusinessFieldsProps {
  fleetName: string
  operatingCity: string
  licenseDocument: File | null
  onFleetNameChange: (value: string) => void
  onOperatingCityChange: (value: string) => void
  onLicenseDocumentChange: (file: File | null) => void
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

export function OwnerBusinessFields({
  fleetName,
  operatingCity,
  licenseDocument,
  onFleetNameChange,
  onOperatingCityChange,
  onLicenseDocumentChange,
}: OwnerBusinessFieldsProps) {
  return (
    <div className="space-y-4 pt-2 border-t border-border">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Business Information</p>
      
      <div className="relative">
        <input
          type="text"
          value={fleetName}
          onChange={(e) => onFleetNameChange(e.target.value)}
          placeholder="Fleet name"
          className="w-full px-0 py-3 bg-transparent border-0 border-b border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors text-sm"
        />
      </div>

      <div className="relative">
        <select
          value={operatingCity}
          onChange={(e) => onOperatingCityChange(e.target.value)}
          className="w-full px-0 py-3 bg-transparent border-0 border-b border-border text-foreground focus:outline-none focus:border-foreground transition-colors text-sm appearance-none cursor-pointer"
        >
          <option value="" className="text-muted-foreground">Select operating state</option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state} className="text-foreground bg-background">
              {state}
            </option>
          ))}
        </select>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <FileUploadMinimal
        value={licenseDocument}
        onChange={onLicenseDocumentChange}
      />
    </div>
  )
}
