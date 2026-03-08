"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface PortalData {
  month: string
  client: { name: string; monthlyHours: number; monthlyFee: number; overageRate: number; billingDay: number }
  hoursUsed: number
  hoursRemaining: number
  freelancerName: string | null
  freelancerLogoUrl: string | null
  projectedInvoice: { base: number; overage: number; total: number }
  entries: Array<{ id: string; date: string; hours: number; description: string }>
  invoices: Array<{ id: string; billing_period: string; total_amount: number; status: string; created_at: string }>
  activeTimer: { description: string | null; startedAt: string } | null
  pendingApproval: boolean
  approvalMonth: string | null
}

export function usePortalData(uuid: string, selectedMonth: string) {
  const [data, setData] = useState<PortalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // useCallback so fetchData has a stable reference for the subscription callback
  const fetchData = useCallback(async () => {
    try {
      const r = await fetch(`/api/portal/${uuid}?month=${selectedMonth}`)
      if (!r.ok) throw new Error()
      const d = await r.json()
      setData(d)
      setLastUpdated(new Date())
      setLoading(false)
    } catch {
      setError(true)
      setLoading(false)
    }
  }, [uuid, selectedMonth])

  // Initial fetch
  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  // Realtime subscription
  useEffect(() => {
    console.log("[Retallio] setting up realtime for", uuid)

    const channelName = `portal-${uuid}-${selectedMonth}`
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "time_entries",
        },
        (payload) => {
          console.log("[Retallio] realtime fired", payload)
          fetchData()
        }
      )
      .subscribe((status, err) => {
        console.log("[Retallio] channel status:", status, err ?? "")
      })

    return () => {
      console.log("[Retallio] removing channel", channelName)
      supabase.removeChannel(channel)
    }
  }, [uuid, selectedMonth, fetchData])

  return { data, loading, error, lastUpdated, fetchData }
}