"use client"

import { AuthProvider } from "@/components/auth-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AppSidebar>{children}</AppSidebar>
      <Toaster />
    </AuthProvider>
  )
}
