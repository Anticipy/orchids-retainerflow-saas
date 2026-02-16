"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

function BillingSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    if (!sessionId) {
      setStatus("error")
      return
    }
    const timer = setTimeout(() => setStatus("success"), 1500)
    return () => clearTimeout(timer)
  }, [sessionId])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Confirming your subscription...</p>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-muted-foreground">Something went wrong. Please check your settings page.</p>
            <Button asChild>
              <Link href="/dashboard/settings">Back to Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#22c55e]/20">
            <CheckCircle className="h-8 w-8 text-[#22c55e]" />
          </div>
          <CardTitle className="text-2xl">Subscription Active!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your plan has been upgraded successfully. You now have access to all the features included in your new plan.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/settings">View Settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { Suspense } from "react"

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    }>
      <BillingSuccessContent />
    </Suspense>
  )
}
