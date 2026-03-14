"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GlassCard } from "@/components/glass-card"
import {
  User,
  GraduationCap,
  Code2,
  Link as LinkIcon,
  Save,
  Plus,
  X,
  CheckCircle2,
  Loader2,
  Briefcase,
  Globe,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { createStudentProfile, getStudentProfile, updateStudentProfile } from "@/services/studentService"
import { getStoredUser } from "@/utils/storage"

const sections = [
  { id: "basic", label: "Basic Details", icon: User },
  { id: "academic", label: "Academic Details", icon: GraduationCap },
  { id: "skills", label: "Skills & Preferences", icon: Code2 },
  { id: "links", label: "Professional Links", icon: LinkIcon },
]

const skillSuggestions = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "Java",
  "C++",
  "Machine Learning",
  "Data Analysis",
  "SQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Git",
  "Figma",
  "UI/UX Design",
]

const preferredRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Data Scientist",
  "ML Engineer",
  "DevOps Engineer",
  "UI/UX Designer",
  "Mobile Developer",
  "Software Engineer",
]

const internshipTypes = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
]

const experienceLevels = [
  "No experience yet",
  "Beginner",
  "Some project experience",
  "Internship experience",
  "Freelance / part-time experience",
]

const initialForm = {
  fullName: "",
  phone: "",
  collegeName: "",
  location: "",
  degree: "",
  branch: "",
  year: "",
  semester: "",
  cgpa: "",
  skills: [] as string[],
  certificationsText: "",
  projectsText: "",
  experienceLevel: "",
  preferredRole: "",
  preferredLocation: "",
  internshipType: "",
  githubLink: "",
  linkedinLink: "",
  portfolioLink: "",
  languagesText: "",
}

export default function StudentProfile() {
  const [activeSection, setActiveSection] = useState("basic")
  const [form, setForm] = useState(initialForm)
  const [newSkill, setNewSkill] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [profileExists, setProfileExists] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    async function loadProfile() {
      const user = getStoredUser()

      if (!user?.id) {
        setError("User session not found. Please login again.")
        setLoading(false)
        return
      }

      setUserEmail(user.email || "")
      setUserName(user.name || "")

      try {
        const response = await getStudentProfile(user.id)
        setForm(mapProfileToForm(response.profile))
        setProfileExists(true)
      } catch (requestError: any) {
        if (requestError.response?.status !== 404) {
          setError(requestError.response?.data?.message || "Failed to load your profile.")
        } else {
          setForm((current) => ({
            ...current,
            fullName: user.name || "",
          }))
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const completion = useMemo(() => getProfileCompletion(form), [form])

  function addSkill(skill: string) {
    const trimmed = skill.trim()
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm((current) => ({ ...current, skills: [...current.skills, trimmed] }))
      setNewSkill("")
    }
  }

  function removeSkill(skill: string) {
    setForm((current) => ({
      ...current,
      skills: current.skills.filter((item) => item !== skill),
    }))
  }

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
      const payload = buildProfilePayload(form, userName)

      if (profileExists) {
        await updateStudentProfile(user.id, payload)
      } else {
        await createStudentProfile(payload)
        setProfileExists(true)
      }

      setSuccess("Profile saved successfully.")
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Failed to save your profile.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Complete your profile to get better internship recommendations and stronger ML matches.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mb-6 rounded-xl border border-secondary/20 bg-secondary/10 p-4 text-sm text-secondary">
          {success}
        </div>
      ) : null}

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <GlassCard className="p-4 sticky top-24">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      activeSection === section.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                )
              })}
            </nav>

            <div className="mt-6 pt-6 border-t border-border space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm font-bold text-primary">{completion}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-primary/5 p-3">
                  <div className="font-semibold">{form.skills.length}</div>
                  <div className="text-muted-foreground">Skills</div>
                </div>
                <div className="rounded-xl bg-secondary/5 p-3">
                  <div className="font-semibold">{splitLines(form.projectsText).length}</div>
                  <div className="text-muted-foreground">Projects</div>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                    {getInitials(form.fullName || userName || "U")}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{form.fullName || userName || "Student"}</div>
                    <div className="text-xs text-muted-foreground truncate">{userEmail || "Add email from account"}</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Strong profiles usually have clear skills, project highlights, and a defined preferred role.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <GlassCard className="p-10">
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading profile...
              </div>
            </GlassCard>
          ) : (
            <>
              <GlassCard className={cn("p-6", activeSection !== "basic" && "hidden lg:block")}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Basic Details</h2>
                    <p className="text-sm text-muted-foreground">Your personal and contact information</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-secondary ml-auto" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 rounded-2xl border border-border/60 bg-muted/30 p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                        {getInitials(form.fullName || userName || "U")}
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{form.fullName || userName || "Student"}</div>
                        <div className="text-sm text-muted-foreground">{userEmail}</div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Your account email is fixed from signup. Use the fields below for your career profile.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => setForm((current) => ({ ...current, fullName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collegeName">College / University</Label>
                    <Input
                      id="collegeName"
                      value={form.collegeName}
                      onChange={(e) => setForm((current) => ({ ...current, collegeName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Current Location</Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))}
                    />
                  </div>
                </div>
              </GlassCard>

              <GlassCard className={cn("p-6", activeSection !== "academic" && "hidden lg:block")}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Academic Details</h2>
                    <p className="text-sm text-muted-foreground">Your education profile for matching</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                      id="degree"
                      value={form.degree}
                      onChange={(e) => setForm((current) => ({ ...current, degree: e.target.value }))}
                      placeholder="e.g. B.Tech"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch / Major</Label>
                    <Input
                      id="branch"
                      value={form.branch}
                      onChange={(e) => setForm((current) => ({ ...current, branch: e.target.value }))}
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year of Study</Label>
                    <Input
                      id="year"
                      value={form.year}
                      onChange={(e) => setForm((current) => ({ ...current, year: e.target.value }))}
                      placeholder="e.g. 3rd Year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Input
                      id="semester"
                      value={form.semester}
                      onChange={(e) => setForm((current) => ({ ...current, semester: e.target.value }))}
                      placeholder="e.g. 6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cgpa">CGPA</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={form.cgpa}
                      onChange={(e) => setForm((current) => ({ ...current, cgpa: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel">Experience Level</Label>
                    <Select
                      value={form.experienceLevel || "__none"}
                      onValueChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          experienceLevel: value === "__none" ? "" : value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">Select experience level</SelectItem>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className={cn("p-6", activeSection !== "skills" && "hidden lg:block")}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Skills & Preferences</h2>
                    <p className="text-sm text-muted-foreground">Show what you know and what you want next</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Your Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {form.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-destructive transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addSkill(newSkill)
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={() => addSkill(newSkill)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillSuggestions
                        .filter((skill) => !form.skills.includes(skill))
                        .slice(0, 8)
                        .map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => addSkill(skill)}
                            className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            + {skill}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="preferredRole">Preferred Role</Label>
                      <Select
                        value={form.preferredRole || "__none"}
                        onValueChange={(value) =>
                          setForm((current) => ({
                            ...current,
                            preferredRole: value === "__none" ? "" : value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none">Select preferred role</SelectItem>
                          {preferredRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="internshipType">Preferred Work Type</Label>
                      <Select
                        value={form.internshipType || "__none"}
                        onValueChange={(value) =>
                          setForm((current) => ({
                            ...current,
                            internshipType: value === "__none" ? "" : value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select work type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none">Select work type</SelectItem>
                          {internshipTypes.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="preferredLocation">Preferred Location</Label>
                      <Input
                        id="preferredLocation"
                        value={form.preferredLocation}
                        onChange={(e) => setForm((current) => ({ ...current, preferredLocation: e.target.value }))}
                        placeholder="e.g. Bangalore or Remote"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="languagesText">Languages Known</Label>
                      <Input
                        id="languagesText"
                        value={form.languagesText}
                        onChange={(e) => setForm((current) => ({ ...current, languagesText: e.target.value }))}
                        placeholder="English, Hindi"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectsText">Projects</Label>
                    <Textarea
                      id="projectsText"
                      rows={4}
                      value={form.projectsText}
                      onChange={(e) => setForm((current) => ({ ...current, projectsText: e.target.value }))}
                      placeholder="Add one project per line"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certificationsText">Certifications</Label>
                    <Textarea
                      id="certificationsText"
                      rows={3}
                      value={form.certificationsText}
                      onChange={(e) => setForm((current) => ({ ...current, certificationsText: e.target.value }))}
                      placeholder="Add one certification per line"
                    />
                  </div>
                </div>
              </GlassCard>

              <GlassCard className={cn("p-6", activeSection !== "links" && "hidden lg:block")}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-orange" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Professional Links</h2>
                    <p className="text-sm text-muted-foreground">Help companies discover your work online</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinLink">LinkedIn</Label>
                    <Input
                      id="linkedinLink"
                      value={form.linkedinLink}
                      onChange={(e) => setForm((current) => ({ ...current, linkedinLink: e.target.value }))}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubLink">GitHub</Label>
                    <Input
                      id="githubLink"
                      value={form.githubLink}
                      onChange={(e) => setForm((current) => ({ ...current, githubLink: e.target.value }))}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="portfolioLink">Portfolio Website</Label>
                    <Input
                      id="portfolioLink"
                      value={form.portfolioLink}
                      onChange={(e) => setForm((current) => ({ ...current, portfolioLink: e.target.value }))}
                      placeholder="https://your-portfolio.com"
                    />
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border/60 bg-primary/5 p-4">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Internship readiness
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Profiles with portfolio links and clear projects often convert better on company review pages.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-secondary/5 p-4">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                      <Globe className="w-4 h-4 text-secondary" />
                      Discoverability
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Strong LinkedIn and GitHub links make your profile feel more complete and credible.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setError("")
                    setSuccess("")
                  }}
                >
                  Clear Messages
                </Button>
                <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-primary to-secondary">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function mapProfileToForm(profile: any) {
  return {
    fullName: profile?.fullName || "",
    phone: profile?.phone || "",
    collegeName: profile?.collegeName || "",
    location: profile?.location || "",
    degree: profile?.degree || "",
    branch: profile?.branch || "",
    year: profile?.year || "",
    semester: profile?.semester || "",
    cgpa: profile?.cgpa?.toString?.() || "",
    skills: Array.isArray(profile?.skills) ? profile.skills : [],
    certificationsText: joinLines(profile?.certifications),
    projectsText: joinLines(profile?.projects),
    experienceLevel: profile?.experienceLevel || "",
    preferredRole: profile?.preferredRole || "",
    preferredLocation: profile?.preferredLocation || "",
    internshipType: profile?.internshipType || "",
    githubLink: profile?.githubLink || "",
    linkedinLink: profile?.linkedinLink || "",
    portfolioLink: profile?.portfolioLink || "",
    languagesText: joinLines(profile?.languagesKnown),
  }
}

function buildProfilePayload(form: typeof initialForm, fallbackName: string) {
  return {
    fullName: form.fullName || fallbackName || "Student",
    phone: form.phone,
    collegeName: form.collegeName,
    location: form.location,
    degree: form.degree,
    branch: form.branch,
    year: form.year,
    semester: form.semester,
    cgpa: form.cgpa ? Number(form.cgpa) : 0,
    skills: form.skills,
    certifications: splitLines(form.certificationsText),
    projects: splitLines(form.projectsText),
    experienceLevel: form.experienceLevel,
    preferredRole: form.preferredRole,
    preferredLocation: form.preferredLocation,
    internshipType: form.internshipType,
    githubLink: form.githubLink,
    linkedinLink: form.linkedinLink,
    portfolioLink: form.portfolioLink,
    languagesKnown: splitCommaSeparated(form.languagesText),
  }
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
}

function joinLines(value: unknown) {
  return Array.isArray(value) ? value.join("\n") : ""
}

function splitCommaSeparated(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function getProfileCompletion(form: typeof initialForm) {
  const fields = [
    form.fullName,
    form.phone,
    form.collegeName,
    form.location,
    form.degree,
    form.branch,
    form.year,
    form.semester,
    form.cgpa,
    form.skills.length,
    splitLines(form.projectsText).length,
    form.preferredRole,
    form.preferredLocation,
    form.internshipType,
    form.githubLink,
    form.linkedinLink,
  ]

  const completed = fields.filter(Boolean).length
  return Math.round((completed / fields.length) * 100)
}
