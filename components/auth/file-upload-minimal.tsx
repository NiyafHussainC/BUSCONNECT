"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, File, X, Check } from "lucide-react"

interface FileUploadMinimalProps {
  value: File | null
  onChange: (file: File | null) => void
  accept?: string
  label?: string
}

export function FileUploadMinimal({ 
  value, 
  onChange, 
  accept = ".pdf,.jpg,.jpeg,.png",
  label = "Business License Document"
}: FileUploadMinimalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = (file: File) => {
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
    if (!validTypes.includes(file.type)) {
      return
    }
    
    // Simulate upload animation
    setIsUploading(true)
    setTimeout(() => {
      onChange(file)
      setIsUploading(false)
    }, 600)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleRemove = () => {
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      
      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border border-dashed transition-all cursor-pointer ${
            isDragging 
              ? "border-foreground bg-muted/30" 
              : "border-border hover:border-muted-foreground/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center py-6 px-4">
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Processing...</span>
              </div>
            ) : (
              <>
                <Upload className="h-5 w-5 text-muted-foreground mb-2" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground text-center">
                  Drag and drop or{" "}
                  <span className="text-foreground underline underline-offset-4">browse</span>
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">PDF, JPG, PNG accepted</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between py-3 px-4 border border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-accent/10 rounded-sm">
              <File className="h-4 w-4 text-accent" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{value.name}</p>
              <p className="text-xs text-muted-foreground">
                {(value.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-accent" />
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 hover:bg-muted rounded-sm transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
