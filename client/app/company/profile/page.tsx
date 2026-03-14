"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GlassCard } from "@/components/glass-card"
import { Building2, Globe, MapPin, Save, Users, Link as LinkIcon, Loader2 } from "lucide-react"
import { createCompanyProfile, getCompanyProfile, updateCompanyProfile } from "@/services/companyService"
import { getStoredUser } from "@/utils/storage"

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [profileExists, setProfileExists] = useState(false)
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    website: "",
    location: "",
    description: "",
    industryType: "",
  })

  useEffect(() => {
    async function loadCompany() {
      const user = getStoredUser()

      if (!user?.id) {
        setError("User session not found. Please login again.")
        setLoading(false)
        return
      }

      try {
        const response = await getCompanyProfile(user.id)
        setForm({
          companyName: response.company.companyName || "",
          email: response.company.email || user.email || "",
          website: response.company.website || "",
          location: response.company.location || "",
          description: response.company.description || "",
          industryType: response.company.industryType || "",
        })
        setProfileExists(true)
      } catch (requestError: any) {
        if (requestError.response?.status === 404) {
          setForm((current) => ({ ...current, email: user.email || "" }))
        } else {
          setError(requestError.response?.data?.message || "Failed to load company profile.")
        }
      } finally {
        setLoading(false)
      }
    }

    loadCompany()
  }, [])

  async function handleSave() {
    const user = getStoredUser()

    if (!user?.id) {
      setError("User session not found. Please login again.")
      return
    }

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      if (profileExists) {
        await updateCompanyProfile(user.id, form)
      } else {
        await createCompanyProfile(form)
        setProfileExists(true)
      }
      setSuccess("Company profile saved successfully.")
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Failed to save company profile.")
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
            Loading company profile...
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Company Profile</h1>
        <p className="text-muted-foreground">Manage your company information visible to students.</p>
      </div>

      {error ? <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}
      {success ? <div className="mb-6 rounded-xl border border-secondary/20 bg-secondary/10 p-4 text-sm text-secondary">{success}</div> : null}

      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Basic Information</h2>
              <p className="text-sm text-muted-foreground">Your company&apos;s public identity</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Company Name"><Input value={form.companyName} onChange={(e) => setForm((current) => ({ ...current, companyName: e.target.value }))} /></Field>
              <Field label="Contact Email"><Input type="email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} /></Field>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Website">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={form.website} className="pl-10" onChange={(e) => setForm((current) => ({ ...current, website: e.target.value }))} />
                </div>
              </Field>
              <Field label="Headquarters Location">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={form.location} className="pl-10" onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))} />
                </div>
              </Field>
            </div>
            <Field label="Company Description"><Textarea rows={4} value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} /></Field>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-teal" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Company Details</h2>
              <p className="text-sm text-muted-foreground">Information that improves trust and relevance</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Industry Type"><Input value={form.industryType} onChange={(e) => setForm((current) => ({ ...current, industryType: e.target.value }))} placeholder="Technology, Finance, Healthcare..." /></Field>
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                <LinkIcon className="w-4 h-4 text-primary" />
                Profile tip
              </div>
              <p className="text-sm text-muted-foreground">
                Companies with clear descriptions, websites, and industry tags usually feel more credible to student applicants.
              </p>
            </div>
          </div>
        </GlassCard>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => { setError(""); setSuccess("") }}>Clear Messages</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-secondary to-teal">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
          </Button>
        </div>
      </div>
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
