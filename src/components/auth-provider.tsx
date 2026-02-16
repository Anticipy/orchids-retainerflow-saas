"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

interface UserProfile {
  id: string
  email: string
  name: string | null
  subscription_tier: string
  stripe_account_id?: string | null
  stripe_customer_id?: string | null
  subscription_status?: string | null
  notify_email_80?: boolean
  notify_email_100?: boolean
  notify_email_invoice?: boolean
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = async (userId: string, authUser?: { email?: string | null; user_metadata?: { full_name?: string } }) => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()
    if (data) {
      setProfile(data)
      return
    }
    if (authUser) {
      const { error } = await supabase.from("users").upsert(
        {
          id: userId,
          email: authUser.email ?? "",
          name: authUser.user_metadata?.full_name ?? authUser.email?.split("@")[0] ?? "",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      if (!error) {
        const { data: refetched } = await supabase.from("users").select("*").eq("id", userId).single()
        if (refetched) setProfile(refetched)
      }
    }
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) await fetchProfile(user.id, user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id, session.user)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
