"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GlassCard } from "@/components/glass-card"
import { Briefcase, Code2, GraduationCap, MapPin, Calendar, DollarSign, Clock, Users, Save, ArrowLeft, Plus, X, Loader2 } from "lucide-react"
import { createInternship } from "@/services/internshipService"
import { getCompanyProfile } from "@/services/companyService"
import { getStoredUser } from "@/utils/storage"

export default function NewInternship() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [form, setForm] = useState({
    internshipTitle: "",
    internshipDescription: "",
    domain: "",
    preferredDegree: "",
    preferredBranch: "",
    minimumCgpa: "",
    yearEligible: "",
    location: "",
    internshipType: "remote",
    stipend: "",
    duration: "",
    openings: "1",
    applicationDeadline: "",
  })

  useEffect(() => {
    async function ensureCompanyProfile() {
      const user = getStoredUser()

      if (!user?.id) {
        setError("User session not found. Please login again.")
        setLoading(false)
        return
      }

      try {
        await getCompanyProfile(user.id)
      } catch (requestError: any) {
        setError(requestError.response?.data?.message || "Create your company profile before posting internships.")
      } finally {
        setLoading(false)
      }
    }

    ensureCompanyProfile()
  }, [])

  function addSkill(skill: string) {
    const trimmed = skill.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((current) => [...current, trimmed])
      setNewSkill("")
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")

    try {
      await createInternship({
        ...form,
        requiredSkills: skills,
        preferredBranch: splitCommaSeparated(form.preferredBranch),
        yearEligible: splitCommaSeparated(form.yearEligible),
        minimumCgpa: form.minimumCgpa ? Number(form.minimumCgpa) : 0,
        openings: form.openings ? Number(form.openings) : 1,
      })
      router.push("/company/dashboard")
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Failed to create internship.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <GlassCard className="p-10">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Checking company profile...
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/company/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-2">Post New Internship</h1>
        <p className="text-muted-foreground">Create a new internship listing to attract talented students.</p>
      </div>

      {error ? <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center"><Briefcase className="w-5 h-5 text-secondary" /></div>
            <div><h2 className="text-lg font-semibold">Role Details</h2><p className="text-sm text-muted-foreground">Basic information about the internship</p></div>
          </div>
          <div className="space-y-6">
            <Field label="Internship Title"><Input value={form.internshipTitle} onChange={(e) => setForm((current) => ({ ...current, internshipTitle: e.target.value }))} required /></Field>
            <Field label="Role Description"><Textarea rows={4} value={form.internshipDescription} onChange={(e) => setForm((current) => ({ ...current, internshipDescription: e.target.value }))} required /></Field>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Domain"><Input value={form.domain} onChange={(e) => setForm((current) => ({ ...current, domain: e.target.value }))} placeholder="Frontend, Data Science, Product..." /></Field>
              <Field label="Duration"><Input value={form.duration} onChange={(e) => setForm((current) => ({ ...current, duration: e.target.value }))} placeholder="3 months" /></Field>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center"><Code2 className="w-5 h-5 text-teal" /></div>
            <div><h2 className="text-lg font-semibold">Required Skills</h2><p className="text-sm text-muted-foreground">Skills needed for this role</p></div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal/10 text-teal rounded-full text-sm font-medium">
                  {skill}
                  <button type="button" onClick={() => setSkills((current) => current.filter((item) => item !== skill))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill..." onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(newSkill) } }} />
              <Button type="button" variant="outline" onClick={() => addSkill(newSkill)}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-primary" /></div>
            <div><h2 className="text-lg font-semibold">Eligibility Criteria</h2><p className="text-sm text-muted-foreground">Who can apply for this internship</p></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Preferred Degree"><Input value={form.preferredDegree} onChange={(e) => setForm((current) => ({ ...current, preferredDegree: e.target.value }))} placeholder="B.Tech, B.Sc, MBA..." /></Field>
            <Field label="Preferred Branch"><Input value={form.preferredBranch} onChange={(e) => setForm((current) => ({ ...current, preferredBranch: e.target.value }))} placeholder="Computer Science, IT, Data Science" /></Field>
            <Field label="Minimum CGPA"><Input type="number" step="0.1" min="0" max="10" value={form.minimumCgpa} onChange={(e) => setForm((current) => ({ ...current, minimumCgpa: e.target.value }))} /></Field>
            <Field label="Eligible Years"><Input value={form.yearEligible} onChange={(e) => setForm((current) => ({ ...current, yearEligible: e.target.value }))} placeholder="2nd Year, 3rd Year, Final Year" /></Field>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center"><MapPin className="w-5 h-5 text-orange" /></div>
            <div><h2 className="text-lg font-semibold">Location & Work Type</h2><p className="text-sm text-muted-foreground">Where and how the intern will work</p></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Location"><Input value={form.location} onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))} placeholder="San Francisco, CA or Remote" /></Field>
            <Field label="Work Type"><Input value={form.internshipType} onChange={(e) => setForm((current) => ({ ...current, internshipType: e.target.value }))} placeholder="remote, onsite, hybrid" /></Field>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-secondary" /></div>
            <div><h2 className="text-lg font-semibold">Compensation & Timeline</h2><p className="text-sm text-muted-foreground">Stipend and deadline details</p></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Monthly Stipend"><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input className="pl-10" value={form.stipend} onChange={(e) => setForm((current) => ({ ...current, stipend: e.target.value }))} /></div></Field>
            <Field label="Number of Openings"><div className="relative"><Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="number" min="1" className="pl-10" value={form.openings} onChange={(e) => setForm((current) => ({ ...current, openings: e.target.value }))} /></div></Field>
            <Field label="Application Deadline"><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="date" className="pl-10" value={form.applicationDeadline} onChange={(e) => setForm((current) => ({ ...current, applicationDeadline: e.target.value }))} /></div></Field>
            <Field label="Duration Notes"><div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input className="pl-10" value={form.duration} onChange={(e) => setForm((current) => ({ ...current, duration: e.target.value }))} placeholder="3 months" /></div></Field>
          </div>
        </GlassCard>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={saving} className="bg-gradient-to-r from-secondary to-teal">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Publishing...</> : <><Save className="w-4 h-4 mr-2" />Publish Internship</>}
          </Button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function splitCommaSeparated(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean)
}
