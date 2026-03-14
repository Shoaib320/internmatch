"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Briefcase, Building2, Clock, MapPin, CheckCircle2, Loader2, ArrowRight } from "lucide-react"
import { getStudentApplications } from "@/services/applicationService"
import { getStudentProfile } from "@/services/studentService"
import { getStoredUser } from "@/utils/storage"
import { cn } from "@/lib/utils"

export default function StudentApplicationsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    async function loadApplications() {
      const user = getStoredUser()

      if (!user?.id) {
        setError("User session not found. Please login again.")
        setLoading(false)
        return
      }

      try {
        const profileResponse = await getStudentProfile(user.id)
        const applicationsResponse = await getStudentApplications(profileResponse.profile._id)
        setApplications(applicationsResponse.applications || [])
      } catch (requestError: any) {
        setError(requestError.response?.data?.message || "Failed to load your applications.")
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [])

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const title = application.internshipId?.internshipTitle || ""
      const company = application.companyId?.companyName || ""
      return (
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [applications, searchQuery])

  const stats = {
    total: applications.length,
    applied: applications.filter((item) => item.status === "applied").length,
    shortlisted: applications.filter((item) => item.status === "shortlisted").length,
    selected: applications.filter((item) => item.status === "selected").length,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">
          Track every internship you have applied for and follow the current status.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={String(stats.total)} />
        <StatCard label="Applied" value={String(stats.applied)} accent="text-orange" />
        <StatCard label="Shortlisted" value={String(stats.shortlisted)} accent="text-secondary" />
        <StatCard label="Selected" value={String(stats.selected)} accent="text-teal" />
      </div>

      <GlassCard className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by internship or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </GlassCard>

      {loading ? (
        <GlassCard className="p-10">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading applications...
          </div>
        </GlassCard>
      ) : filteredApplications.length ? (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <GlassCard key={application._id} hover className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{application.internshipId?.internshipTitle || "Internship"}</h3>
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                      application.status === "selected"
                        ? "bg-teal/10 text-teal"
                        : application.status === "shortlisted"
                          ? "bg-secondary/10 text-secondary"
                          : application.status === "rejected"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-orange/10 text-orange"
                    )}>
                      {application.status}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {application.companyId?.companyName || "Company"}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {application.internshipId?.location || "Location TBD"}
                    </span>
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {application.internshipId?.internshipType || "Type TBD"}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Applied {formatDate(application.createdAt)}
                    </span>
                  </div>
                  {Array.isArray(application.internshipId?.requiredSkills) && application.internshipId.requiredSkills.length ? (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {application.internshipId.requiredSkills.slice(0, 6).map((skill: string) => (
                        <span key={skill} className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" asChild>
                    <a href={`mailto:${application.companyId?.email || ""}`}>
                      Contact Company
                    </a>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-primary to-secondary">
                    <Link href="/student/predictions">
                      Discover More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-4">
            Generate recommendations and apply to internships to start tracking them here.
          </p>
          <Button asChild className="bg-gradient-to-r from-primary to-secondary">
            <Link href="/student/predictions">Go to Predictions</Link>
          </Button>
        </GlassCard>
      )}
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <GlassCard className="p-4 text-center">
      <div className={cn("text-2xl font-bold text-foreground", accent)}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </GlassCard>
  )
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
