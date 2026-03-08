"use client"

import { useState } from "react"
import { Check, X, Mail, Phone, Building, MapPin, FileText } from "lucide-react"

interface PendingOwner {
  id: string
  name: string
  email: string
  phone: string
  fleetName: string
  operatingCity: string
  licenseDocument: string
  fleetSize: number
  date: string
  status: "pending" | "approved" | "rejected"
}

const initialOwners: PendingOwner[] = [
  { id: "1", name: "John Metro", email: "john@metroexpress.com", phone: "+91 9876543101", fleetName: "Metro Express Lines", operatingCity: "Mumbai", licenseDocument: "license-metro-express.pdf", fleetSize: 12, date: "Mar 5, 2026", status: "pending" },
  { id: "2", name: "Sarah City", email: "sarah@citytransit.com", phone: "+91 9876543102", fleetName: "City Transit Co", operatingCity: "Delhi", licenseDocument: "license-city-transit.pdf", fleetSize: 8, date: "Mar 5, 2026", status: "pending" },
  { id: "3", name: "Mike Highway", email: "mike@hwcoaches.com", phone: "+91 9876543103", fleetName: "Highway Coaches", operatingCity: "Bangalore", licenseDocument: "license-highway.pdf", fleetSize: 25, date: "Mar 4, 2026", status: "pending" },
  { id: "4", name: "Lisa Regional", email: "lisa@regionalbuses.com", phone: "+91 9876543104", fleetName: "Regional Buses", operatingCity: "Chennai", licenseDocument: "license-regional.pdf", fleetSize: 6, date: "Mar 4, 2026", status: "pending" },
  { id: "5", name: "Tom Express", email: "tom@expressways.com", phone: "+91 9876543105", fleetName: "Expressways Inc", operatingCity: "Hyderabad", licenseDocument: "license-expressways.pdf", fleetSize: 15, date: "Mar 3, 2026", status: "pending" },
]

export default function ApprovalsPage() {
  const [owners, setOwners] = useState<PendingOwner[]>(initialOwners)
  const [selectedOwner, setSelectedOwner] = useState<PendingOwner | null>(null)
  const [documentModal, setDocumentModal] = useState<PendingOwner | null>(null)

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setOwners(prev => prev.map(o => o.id === id ? { ...o, status: action } : o))
    setSelectedOwner(null)
  }

  const pendingOwners = owners.filter(o => o.status === "pending")
  const processedOwners = owners.filter(o => o.status !== "pending")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light tracking-tight">Pending Approvals</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and approve bus owner applications</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main List */}
        <div className="flex-1">
          {pendingOwners.length === 0 ? (
            <div className="text-center py-12 border border-border">
              <p className="text-muted-foreground text-sm">No pending approvals</p>
            </div>
          ) : (
            <div className="border border-border overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs uppercase tracking-wider text-muted-foreground font-normal px-6 py-4">Owner</th>
                    <th className="text-left text-xs uppercase tracking-wider text-muted-foreground font-normal px-6 py-4">Fleet Name</th>
                    <th className="text-left text-xs uppercase tracking-wider text-muted-foreground font-normal px-6 py-4">City</th>
                    <th className="text-left text-xs uppercase tracking-wider text-muted-foreground font-normal px-6 py-4">Document</th>
                    <th className="text-left text-xs uppercase tracking-wider text-muted-foreground font-normal px-6 py-4 hidden sm:table-cell">Date</th>
                    <th className="text-right text-xs uppercase tracking-wider text-muted-foreground font-normal px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pendingOwners.map((owner) => (
                    <tr 
                      key={owner.id} 
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedOwner(owner)}
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium">{owner.name}</p>
                        <p className="text-xs text-muted-foreground">{owner.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{owner.fleetName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{owner.operatingCity}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); setDocumentModal(owner) }}
                          className="text-sm text-accent hover:underline underline-offset-4 flex items-center gap-1.5"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          View
                        </button>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <p className="text-sm text-muted-foreground">{owner.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(owner.id, "approved") }}
                            className="p-2 hover:bg-accent/10 rounded-sm transition-colors group"
                            title="Approve"
                          >
                            <Check className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(owner.id, "rejected") }}
                            className="p-2 hover:bg-destructive/10 rounded-sm transition-colors group"
                            title="Reject"
                          >
                            <X className="h-4 w-4 text-muted-foreground group-hover:text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Processed */}
          {processedOwners.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Recently Processed</h2>
              <div className="border border-border divide-y divide-border">
                {processedOwners.map((owner) => (
                  <div key={owner.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm">{owner.name}</p>
                      <p className="text-xs text-muted-foreground">{owner.fleetName} - {owner.operatingCity}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      owner.status === "approved" 
                        ? "bg-accent/10 text-accent" 
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {owner.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedOwner && (
          <div className="lg:w-80 border border-border p-6 h-fit">
            <h3 className="text-lg font-light mb-4">Application Details</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Full Name</p>
                <p className="text-sm">{selectedOwner.name}</p>
              </div>
              
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Fleet Name</p>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  {selectedOwner.fleetName}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Operating City</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selectedOwner.operatingCity}
                </div>
              </div>
              
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Contact</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {selectedOwner.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {selectedOwner.phone}
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Fleet Size</p>
                <p className="text-sm">{selectedOwner.fleetSize} buses</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">License Document</p>
                <button
                  onClick={() => setDocumentModal(selectedOwner)}
                  className="text-sm text-accent hover:underline underline-offset-4 flex items-center gap-1.5"
                >
                  <FileText className="h-4 w-4" />
                  {selectedOwner.licenseDocument}
                </button>
              </div>
              
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Applied</p>
                <p className="text-sm text-muted-foreground">{selectedOwner.date}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border flex gap-3">
              <button
                onClick={() => handleAction(selectedOwner.id, "approved")}
                className="flex-1 py-2 px-4 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(selectedOwner.id, "rejected")}
                className="flex-1 py-2 px-4 border border-border text-sm hover:border-destructive hover:text-destructive transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {documentModal && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setDocumentModal(null)}
          />
          <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-card border border-border shadow-lg z-50 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-light">License Document</h3>
                <p className="text-sm text-muted-foreground">{documentModal.fleetName}</p>
              </div>
              <button
                onClick={() => setDocumentModal(null)}
                className="p-2 hover:bg-muted rounded-sm transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-auto">
              {/* Mock Document Preview */}
              <div className="aspect-[8.5/11] bg-muted/30 border border-border flex flex-col items-center justify-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" strokeWidth={1} />
                <p className="text-sm font-medium">{documentModal.licenseDocument}</p>
                <p className="text-xs text-muted-foreground mt-1">Document Preview</p>
                <div className="mt-6 px-8 text-center">
                  <p className="text-xs text-muted-foreground">
                    This is a mock preview. In production, the actual document would be displayed here.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={() => {
                  handleAction(documentModal.id, "approved")
                  setDocumentModal(null)
                }}
                className="flex-1 py-2 px-4 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
              >
                Approve Application
              </button>
              <button
                onClick={() => {
                  handleAction(documentModal.id, "rejected")
                  setDocumentModal(null)
                }}
                className="flex-1 py-2 px-4 border border-border text-sm hover:border-destructive hover:text-destructive transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
