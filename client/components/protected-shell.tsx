"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { BackgroundDecoration } from "@/components/background-decoration"
import { Navbar } from "@/components/navbar"
import { getHomeRouteForRole } from "@/utils/routes"
import { getStoredUser, getToken } from "@/utils/storage"

interface ProtectedShellProps {
  requiredRole: "student" | "company" | "admin"
  children: React.ReactNode
}

export function ProtectedShell({ requiredRole, children }: ProtectedShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [userName, setUserName] = useState("User")

  const session = useMemo(() => {
    if (typeof window === "undefined") {
      return { token: null, user: null }
    }

    return {
      token: getToken(),
      user: getStoredUser(),
    }
  }, [pathname])

  useEffect(() => {
    if (!session.token || !session.user) {
      router.replace("/login")
      return
    }

    if (session.user.role !== requiredRole) {
      router.replace(getHomeRouteForRole(session.user.role))
      return
    }

    setUserName(session.user.name || "User")
    setReady(true)
  }, [requiredRole, router, session.token, session.user])

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BackgroundDecoration variant="dashboard" />
        <div className="relative z-10 px-6 py-4 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-lg">
          Loading workspace...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <BackgroundDecoration variant="dashboard" />
      <Navbar userType={requiredRole} userName={userName} />
      <main className="relative z-10">{children}</main>
    </div>
  )
}
