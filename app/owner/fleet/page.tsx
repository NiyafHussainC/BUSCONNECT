"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Edit2, Trash2, Bus as BusIcon, Users, X, RotateCcw } from "lucide-react"

interface Bus {
  id: string
  name: string
  type: "standard" | "luxury" | "sleeper"
  capacity: number
  plateNumber: string
  status: "active" | "maintenance"
}

const initialBuses: Bus[] = [
  { id: "1", name: "Royal Express", type: "luxury", capacity: 45, plateNumber: "MH-01-AB-1234", status: "active" },
  { id: "2", name: "City Cruiser", type: "standard", capacity: 52, plateNumber: "DL-04-CD-5678", status: "active" },
  { id: "3", name: "Night Rider", type: "sleeper", capacity: 30, plateNumber: "KA-05-EF-9012", status: "active" },
  { id: "4", name: "Kerala Lines", type: "standard", capacity: 48, plateNumber: "KL-07-GH-3456", status: "maintenance" },
]

const typeLabels = {
  standard: "Standard",
  luxury: "Luxury",
  sleeper: "Sleeper"
}

export default function FleetPage() {
  const [buses, setBuses] = useState<Bus[]>(initialBuses)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBus, setEditingBus] = useState<Bus | null>(null)
  const [formData, setFormData] = useState<Partial<Bus>>({
    name: "",
    type: "standard",
    capacity: 45,
    plateNumber: "",
    status: "active"
  })

  // Undo Delete State
  const [deletingBusId, setDeletingBusId] = useState<string | null>(null)
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current)
    }
  }, [])

  const openModal = (bus?: Bus) => {
    if (bus) {
      setEditingBus(bus)
      setFormData(bus)
    } else {
      setEditingBus(null)
      setFormData({ name: "", type: "standard", capacity: 45, plateNumber: "", status: "active" })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingBus) {
      setBuses(prev => prev.map(b => b.id === editingBus.id ? { ...b, ...formData } as Bus : b))
    } else {
      const newBus: Bus = {
        id: Date.now().toString(),
        name: formData.name || "",
        type: formData.type as Bus["type"],
        capacity: formData.capacity || 45,
        plateNumber: formData.plateNumber || "",
        status: formData.status as Bus["status"]
      }
      setBuses(prev => [...prev, newBus])
    }
    setIsModalOpen(false)
  }

  const executeDelete = (id: string) => {
    setBuses(prev => prev.filter(b => b.id !== id))
    setDeletingBusId(null)
  }

  const handleDeleteClick = (id: string) => {
    // If another deletion is already queued, execute it immediately
    if (deletingBusId && deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current)
      executeDelete(deletingBusId)
    }

    setDeletingBusId(id)
    deleteTimeoutRef.current = setTimeout(() => {
      executeDelete(id)
    }, 5000)
  }

  const handleUndoDelete = () => {
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current)
    }
    setDeletingBusId(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">My Fleet</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your bus fleet</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Bus
        </button>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buses.map((bus) => {
          const isDeleting = bus.id === deletingBusId

          if (isDeleting) {
            return (
              <div key={bus.id} className="p-6 border border-destructive/20 bg-destructive/5 flex flex-col items-center justify-center min-h-[180px] transition-all">
                <p className="text-sm font-medium mb-3">Bus removed</p>
                <button
                  onClick={handleUndoDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-background border border-border hover:border-foreground/30 text-sm transition-colors rounded-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  Undo
                </button>
                <div className="w-24 h-0.5 bg-destructive/20 mt-4 rounded-full overflow-hidden">
                  <div className="h-full bg-destructive/60 animate-[shrink_5s_linear_forwards] origin-left" />
                </div>
              </div>
            )
          }

          return (
            <div key={bus.id} className="p-6 border border-border hover:border-foreground/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-muted rounded-sm">
                  <BusIcon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${bus.status === "active"
                  ? "bg-accent/10 text-accent"
                  : bus.status === "maintenance"
                    ? "bg-muted text-muted-foreground"
                    : "bg-destructive/10 text-destructive"
                  }`}>
                  {bus.status}
                </span>
              </div>

              <h3 className="text-lg font-medium mb-1">{bus.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{bus.plateNumber}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>{typeLabels[bus.type]}</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {bus.capacity}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <button
                  onClick={() => openModal(bus)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(bus.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40" onClick={() => setIsModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border p-6 z-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light">{editingBus ? "Edit Bus" : "Add New Bus"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-muted rounded-sm transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Bus Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full mt-1 px-0 py-2 bg-transparent border-0 border-b border-border focus:border-foreground focus:outline-none text-sm transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Plate Number</label>
                <input
                  type="text"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, plateNumber: e.target.value }))}
                  className="w-full mt-1 px-0 py-2 bg-transparent border-0 border-b border-border focus:border-foreground focus:outline-none text-sm transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Bus["type"] }))}
                    className="w-full mt-1 px-0 py-2 bg-transparent border-0 border-b border-border focus:border-foreground focus:outline-none text-sm transition-colors"
                  >
                    <option value="standard">Standard</option>
                    <option value="luxury">Luxury</option>
                    <option value="sleeper">Sleeper</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="w-full mt-1 px-0 py-2 bg-transparent border-0 border-b border-border focus:border-foreground focus:outline-none text-sm transition-colors"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Bus["status"] }))}
                  className="w-full mt-1 px-0 py-2 bg-transparent border-0 border-b border-border focus:border-foreground focus:outline-none text-sm transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 px-4 border border-border text-sm hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                >
                  {editingBus ? "Save Changes" : "Add Bus"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
