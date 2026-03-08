"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OwnerPendingRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/pending-approval")
  }, [router])

  return null
}
