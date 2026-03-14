"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { FloatingIllustration } from "@/components/floating-illustration"
import { Building2, Briefcase, Users, UserCheck, TrendingUp, Clock, ArrowRight, Plus, Eye, Edit, MapPin, Calendar, BarChart3, FileText, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCompanyDashboard, getCompanyProfile } from "@/services/companyService"
import { getCompanyApplications } from "@/services/applicationService"
import { getCompanyInternships } from "@/services/internshipService"
import { getStoredUser } from "@/utils/storage"

export default function CompanyDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [company, setCompany] = useState<any>(null)
  const [dashboard, setDashboard] = useState<any>(null)
  const [internships, setInternships] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const user = getStoredUser()

      if (!user?.id) {
        setError("User session not found. Please login again.")
        setLoading(false)
        return
      }

      try {
        const [profileResponse, dashboardResponse] = await Promise.all([
          getCompanyProfile(user.id),
          getCompanyDashboard(user.id),
        ])

        setCompany(profileResponse.company)
        setDashboard(dashboardResponse.dashboard)

        const companyId = profileResponse.company._id
        const [internshipsResponse, applicationsResponse] = await Promise.all([
          getCompanyInternships(companyId),
          getCompanyApplications(companyId),
        ])

        setInternships(internshipsResponse.internships || [])
        setApplications(applicationsResponse.applications || [])
      } catch (requestError: any) {
        setError(requestError.response?.data?.message || "Failed to load company dashboard.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const stats = useMemo(() => {
    const shortlisted = applications.filter((item) => item.status === "shortlisted" || item.status === "selected").length
    return [
      {
        label: "Total Internships",
        value: String(internships.length),
        icon: Briefcase,
        color: "from-primary to-secondary",
        trend: dashboard?.activePosts ? `${dashboard.activePosts} active` : undefined,
      },
      {
        label: "Total Applications",
        value: String(applications.length),
        icon: FileText,
        color: "from-secondary to-teal",
      },
      {
        label: "Shortlisted",
        value: String(shortlisted),
        icon: UserCheck,
        color: "from-teal to-primary",
      },
      {
        label: "Location",
        value: dashboard?.location || "Not set",
        icon: Clock,
        color: "from-orange to-accent",
      },
    ]
  }, [applications, dashboard, internships.length])

  const recentApplicants = applications.slice(0, 4)

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <GlassCard className="p-10">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading company dashboard...
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {error ? <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

      <section className="mb-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              <Building2 className="w-4 h-4" />
              Company Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Welcome to Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary via-teal to-primary">
                Hiring Workspace
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              {company?.companyName
                ? `${company.companyName} can manage internship listings, review applicants, and track hiring activity from one place.`
                : "Create your company profile, post internships, and review students matched to your roles."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-secondary to-teal" asChild>
                <Link href="/company/internships/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Internship
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/company/applicants">View Applicants</Link>
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-96 h-72">
            <FloatingIllustration variant="hiring" className="w-full h-full" />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <GlassCard key={stat.label} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  {stat.trend ? (
                    <span className="text-xs font-medium text-secondary flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </span>
                  ) : null}
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
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/company/internships/new">
            <GlassCard hover className="p-6">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Internship</h3>
              <p className="text-sm text-muted-foreground mb-4">Post a new internship listing</p>
              <span className="inline-flex items-center text-sm font-medium text-secondary">Get Started <ArrowRight className="w-4 h-4 ml-1" /></span>
            </GlassCard>
          </Link>
          <Link href="/company/applicants">
            <GlassCard hover className="p-6">
              <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-lg font-semibold mb-2">View Applicants</h3>
              <p className="text-sm text-muted-foreground mb-4">Review and manage applications</p>
              <span className="inline-flex items-center text-sm font-medium text-teal">View All <ArrowRight className="w-4 h-4 ml-1" /></span>
            </GlassCard>
          </Link>
          <Link href="/company/profile">
            <GlassCard hover className="p-6">
              <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-4">
                <Edit className="w-6 h-6 text-orange" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Edit Company Profile</h3>
              <p className="text-sm text-muted-foreground mb-4">Update company and industry details</p>
              <span className="inline-flex items-center text-sm font-medium text-orange">Edit Profile <ArrowRight className="w-4 h-4 ml-1" /></span>
            </GlassCard>
          </Link>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Internships</h2>
          </div>
          <div className="space-y-4">
            {internships.length ? internships.slice(0, 5).map((internship) => {
              const internshipApplications = applications.filter((item) => item.internshipId?._id === internship._id)
              const shortlisted = internshipApplications.filter((item) => item.status === "shortlisted" || item.status === "selected").length
              return (
                <GlassCard key={internship._id} hover className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{internship.internshipTitle}</h3>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", "bg-secondary/10 text-secondary")}>Live</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{internship.location || "Location TBD"}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Deadline: {formatDate(internship.applicationDeadline)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{internship.internshipType}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary">{internshipApplications.length}</div>
                        <div className="text-xs text-muted-foreground">Applications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-secondary">{shortlisted}</div>
                        <div className="text-xs text-muted-foreground">Shortlisted</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" asChild><Link href="/company/profile"><Edit className="w-4 h-4" /></Link></Button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              )
            }) : (
              <GlassCard className="p-6">
                <p className="text-sm text-muted-foreground">No internship listings yet. Post your first internship to start receiving applicants.</p>
              </GlassCard>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Applicants</h2>
            <Link href="/company/applicants" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <GlassCard className="p-4">
            <div className="space-y-4">
              {recentApplicants.length ? recentApplicants.map((applicant, index) => (
                <div key={applicant._id} className={cn("flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors", index !== recentApplicants.length - 1 && "border-b border-border")}>
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground", index % 4 === 0 ? "bg-gradient-to-br from-primary to-secondary" : index % 4 === 1 ? "bg-gradient-to-br from-secondary to-teal" : index % 4 === 2 ? "bg-gradient-to-br from-teal to-primary" : "bg-gradient-to-br from-orange to-accent")}>
                    {getInitials(applicant.studentId?.fullName || "CA")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{applicant.studentId?.fullName || "Candidate"}</h4>
                    <p className="text-xs text-muted-foreground truncate">{applicant.internshipId?.internshipTitle || "Internship"}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-primary capitalize">{applicant.status}</div>
                    <span className="text-xs text-muted-foreground">{formatDate(applicant.createdAt)}</span>
                  </div>
                </div>
              )) : <p className="text-sm text-muted-foreground">No applications yet.</p>}
            </div>
          </GlassCard>
        </section>
      </div>

      <section className="mt-12">
        <GlassCard className="p-6 bg-gradient-to-r from-secondary/5 via-teal/5 to-primary/5">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-teal flex items-center justify-center shrink-0">
              <BarChart3 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold mb-1">Hiring Analytics</h3>
              <p className="text-sm text-muted-foreground">
                {dashboard?.industryType
                  ? `${dashboard.industryType} companies on the platform do better when listings clearly mention required skills and deadlines.`
                  : "Clear internship details usually attract more relevant student applications and cleaner matches."}
              </p>
            </div>
            <Button asChild className="shrink-0 bg-gradient-to-r from-secondary to-teal">
              <Link href="/company/internships/new">Create Another Post</Link>
            </Button>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}

function formatDate(value: string) {
  if (!value) {
    return "Not set"
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function getInitials(value: string) {
  return value.split(" ").filter(Boolean).slice(0, 2).map((item) => item[0]?.toUpperCase()).join("")
}
