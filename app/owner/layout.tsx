"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout allowedRoles={["owner"]} requireApproval>
      {children}
    </DashboardLayout>
  )
}
