"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { Shield, Users, GraduationCap, Building2, Briefcase, FileText, Sparkles, TrendingUp, ArrowRight, Clock, Activity, BarChart3, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAdminDashboard } from "@/services/adminService"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dashboard, setDashboard] = useState<any>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getAdminDashboard()
        setDashboard(response.dashboard)
      } catch (requestError: any) {
        setError(requestError.response?.data?.message || "Failed to load admin dashboard.")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const stats = [
    { label: "Total Users", value: dashboard?.totalUsers || 0, icon: Users, color: "from-primary to-secondary" },
    { label: "Students", value: dashboard?.totalStudents || 0, icon: GraduationCap, color: "from-secondary to-teal" },
    { label: "Companies", value: dashboard?.totalCompanies || 0, icon: Building2, color: "from-teal to-primary" },
    { label: "Internships", value: dashboard?.totalInternships || 0, icon: Briefcase, color: "from-orange to-accent" },
    { label: "Applications", value: dashboard?.totalApplications || 0, icon: FileText, color: "from-primary to-teal" },
    { label: "Predictions Made", value: dashboard?.totalPredictions || 0, icon: Sparkles, color: "from-secondary to-orange" },
  ]

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <GlassCard className="p-10">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading admin dashboard...
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {error ? <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

      <section className="mb-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 text-orange text-sm font-medium mb-3">
              <Shield className="w-4 h-4" />
              Admin Control Center
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
              Platform
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange via-accent to-primary">
                Administration
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Monitor platform activity, manage users and companies, and keep InternMatch healthy.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              System Status
            </Button>
            <Button className="bg-gradient-to-r from-orange to-accent">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <GlassCard key={stat.label} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-medium text-secondary flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Live
                  </span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </GlassCard>
            )
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction label="Manage Users" href="/admin/users" icon={Users} color="bg-primary/10 text-primary" />
          <QuickAction label="Manage Companies" href="/admin/companies" icon={Building2} color="bg-secondary/10 text-secondary" />
          <QuickAction label="Manage Internships" href="/admin/internships" icon={Briefcase} color="bg-teal/10 text-teal" />
          <QuickAction label="Refresh View" href="/admin/dashboard" icon={BarChart3} color="bg-orange/10 text-orange" />
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Users</h2>
            <Link href="/admin/users" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <GlassCard className="divide-y divide-border">
            {(dashboard?.recentUsers || []).map((user: any) => (
              <div key={user._id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground", user.role === "student" ? "bg-gradient-to-br from-primary to-secondary" : user.role === "company" ? "bg-gradient-to-br from-secondary to-teal" : "bg-gradient-to-br from-orange to-accent")}>
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{user.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">{user.role}</span>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            ))}
          </GlassCard>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Internships</h2>
            <Link href="/admin/internships" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <GlassCard className="divide-y divide-border">
            {(dashboard?.recentInternships || []).map((internship: any) => (
              <div key={internship._id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm">{internship.internshipTitle}</h4>
                    <p className="text-xs text-muted-foreground">{internship.companyName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                    {internship.internshipType}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    New listing
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(internship.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </GlassCard>
        </section>
      </div>

      <section className="mt-12">
        <GlassCard className="p-6 bg-gradient-to-r from-orange/5 via-accent/5 to-primary/5">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange to-accent flex items-center justify-center shrink-0">
              <Activity className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold mb-1">Platform Health</h3>
              <p className="text-sm text-muted-foreground">
                The control center is reading live totals from the backend, so this view updates with your real users, companies, internships, and predictions.
              </p>
            </div>
            <Button variant="outline" className="shrink-0">Monitoring Live</Button>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}

function QuickAction({ label, href, icon: Icon, color }: { label: string; href: string; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <Link href={href}>
      <GlassCard hover className="p-5 text-center h-full">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-sm">{label}</h3>
      </GlassCard>
    </Link>
  )
}

function getInitials(value: string) {
  return value.split(" ").filter(Boolean).slice(0, 2).map((item) => item[0]?.toUpperCase()).join("")
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
