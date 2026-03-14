"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/glass-card"
import { Search, Users, Mail, Download, Target, GraduationCap, Briefcase, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { getCompanyApplications, updateApplicationStatus } from "@/services/applicationService"
import { getCompanyProfile } from "@/services/companyService"
import { getStoredUser } from "@/utils/storage"

const statusOptions = ["applied", "shortlisted", "rejected", "selected"]

export default function ApplicantsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [applications, setApplications] = useState<any[]>([])
  const [savingId, setSavingId] = useState("")

  useEffect(() => {
    async function loadApplications() {
      const user = getStoredUser()

      if (!user?.id) {
        setError("User session not found. Please login again.")
        setLoading(false)
        return
      }

      try {
        const companyResponse = await getCompanyProfile(user.id)
        const applicationsResponse = await getCompanyApplications(companyResponse.company._id)
        setApplications(applicationsResponse.applications || [])
      } catch (requestError: any) {
        setError(requestError.response?.data?.message || "Failed to load applicants.")
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [])

  const filteredApplicants = useMemo(() => {
    return applications.filter((application) => {
      const name = application.studentId?.fullName || ""
      const email = application.studentId?.userId?.email || ""
      const role = application.internshipId?.internshipTitle || ""

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || application.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [applications, searchQuery, statusFilter])

  async function handleStatusChange(applicationId: string, status: string) {
    setSavingId(applicationId)
    try {
      await updateApplicationStatus(applicationId, status)
      setApplications((current) =>
        current.map((item) => (item._id === applicationId ? { ...item, status } : item))
      )
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Failed to update application status.")
    } finally {
      setSavingId("")
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <GlassCard className="p-10">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading applicants...
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Applicants</h1>
        <p className="text-muted-foreground">Review and manage applications for your internship listings.</p>
      </div>

      {error ? <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={String(applications.length)} />
        <StatCard label="Applied" value={String(applications.filter((item) => item.status === "applied").length)} accent="text-orange" />
        <StatCard label="Shortlisted" value={String(applications.filter((item) => item.status === "shortlisted").length)} accent="text-secondary" />
        <StatCard label="Selected" value={String(applications.filter((item) => item.status === "selected").length)} accent="text-teal" />
      </div>

      <GlassCard className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, or role..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option} value={option}>{capitalize(option)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      <div className="space-y-4">
        {filteredApplicants.map((application, index) => (
          <GlassCard key={application._id} hover className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-primary-foreground", index % 4 === 0 ? "bg-gradient-to-br from-primary to-secondary" : index % 4 === 1 ? "bg-gradient-to-br from-secondary to-teal" : index % 4 === 2 ? "bg-gradient-to-br from-teal to-primary" : "bg-gradient-to-br from-orange to-accent")}>
                  {getInitials(application.studentId?.fullName || "CA")}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{application.studentId?.fullName || "Candidate"}</h3>
                  <p className="text-sm text-muted-foreground">{application.studentId?.userId?.email || "No email available"}</p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoItem label="Role" value={application.internshipId?.internshipTitle || "Internship"} icon={<Briefcase className="w-3 h-3" />} />
                <InfoItem label="College" value={application.studentId?.collegeName || "Not set"} icon={<GraduationCap className="w-3 h-3" />} />
                <InfoItem label="CGPA" value={String(application.studentId?.cgpa || "N/A")} />
                <InfoItem label="Skills" value={String(application.studentId?.skills?.length || 0)} icon={<Target className="w-3 h-3" />} />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className={cn("px-3 py-1 rounded-full text-xs font-medium", application.status === "selected" ? "bg-teal/10 text-teal" : application.status === "shortlisted" ? "bg-secondary/10 text-secondary" : application.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-orange/10 text-orange")}>
                  {capitalize(application.status)}
                </span>
                <Select value={application.status} onValueChange={(value) => handleStatusChange(application._id, value)}>
                  <SelectTrigger className="w-[170px]" disabled={savingId === application._id}>
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option} value={option}>{capitalize(option)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${application.studentId?.userId?.email || ""}`}>
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="w-4 h-4 mr-1" />
                    Resume
                  </Button>
                </div>
              </div>
            </div>

            {Array.isArray(application.studentId?.skills) && application.studentId.skills.length ? (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Skills:</span>
                  {application.studentId.skills.slice(0, 8).map((skill: string) => (
                    <span key={skill} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            ) : null}
          </GlassCard>
        ))}
      </div>

      {!filteredApplicants.length ? (
        <GlassCard className="p-12 text-center mt-6">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No applicants found</h3>
          <p className="text-muted-foreground">Try adjusting your search or wait for new student applications.</p>
        </GlassCard>
      ) : null}
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

function InfoItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      <p className="text-sm font-medium flex items-center gap-1 mt-1">{icon}{value}</p>
    </div>
  )
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function getInitials(value: string) {
  return value.split(" ").filter(Boolean).slice(0, 2).map((item) => item[0]?.toUpperCase()).join("")
}
