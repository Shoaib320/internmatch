"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GlassCard } from "@/components/glass-card"
import { User, GraduationCap, Briefcase, Award, Code2, FolderOpen, Plus, X, Download, Save, Eye, Mail, Phone, MapPin, Link as LinkIcon, Github, Linkedin, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { createResume, getResume, updateResume } from "@/services/resumeService"
import { getStudentProfile } from "@/services/studentService"
import { getStoredUser } from "@/utils/storage"

const sections = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "experience", label: "Experience", icon: Briefcase },
]

export default function ResumeBuilder() {
  const [activeSection, setActiveSection] = useState("personal")
  const [studentId, setStudentId] = useState("")
  const [resumeExists, setResumeExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [personal, setPersonal] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
  })
  const [education, setEducation] = useState([{ id: "education-1", institution: "", degree: "", field: "", years: "", gpa: "" }])
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [projects, setProjects] = useState([{ id: "project-1", name: "", description: "", technologies: "", link: "" }])
  const [certifications, setCertifications] = useState([{ id: "certification-1", name: "", issuer: "", date: "" }])
  const [experience, setExperience] = useState([{ id: "experience-1", company: "", position: "", duration: "", description: "" }])
  const previewRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    async function loadData() {
      const user = getStoredUser()

      if (!user?.id) {
        setError("User session not found. Please login again.")
        setLoading(false)
        return
      }

      try {
        const profileResponse = await getStudentProfile(user.id)
        const profile = profileResponse.profile
        setStudentId(profile._id)
        setPersonal({
          fullName: profile.fullName || user.name || "",
          email: profile.userId?.email || user.email || "",
          phone: profile.phone || "",
          location: profile.location || "",
          website: profile.portfolioLink || "",
          linkedin: profile.linkedinLink || "",
          github: profile.githubLink || "",
          summary: buildSummary(profile),
        })
        setEducation([{ id: "education-1", institution: profile.collegeName || "", degree: profile.degree || "", field: profile.branch || "", years: profile.year || "", gpa: profile.cgpa ? String(profile.cgpa) : "" }])
        setSkills(Array.isArray(profile.skills) ? profile.skills : [])

        try {
          const resumeResponse = await getResume(profile._id)
          const resume = resumeResponse.resume
          setResumeExists(true)
          setPersonal((current) => ({
            fullName: resume?.personalInfo?.fullName || current.fullName,
            email: resume?.personalInfo?.email || current.email,
            phone: resume?.personalInfo?.phone || current.phone,
            location: resume?.personalInfo?.location || current.location,
            website: resume?.personalInfo?.portfolio || current.website,
            linkedin: resume?.personalInfo?.linkedin || current.linkedin,
            github: resume?.personalInfo?.github || current.github,
            summary: current.summary,
          }))
          if (Array.isArray(resume?.education) && resume.education.length) {
            setEducation(resume.education.map((item: any, index: number) => ({ id: `education-${index + 1}`, institution: item.institution || "", degree: item.degree || "", field: item.fieldOfStudy || "", years: [item.startYear, item.endYear].filter(Boolean).join(" - "), gpa: item.cgpa || "" })))
          }
          if (Array.isArray(resume?.skills) && resume.skills.length) {
            setSkills(resume.skills)
          }
          if (Array.isArray(resume?.projects) && resume.projects.length) {
            setProjects(resume.projects.map((item: any, index: number) => ({ id: `project-${index + 1}`, name: item.title || "", description: item.description || "", technologies: Array.isArray(item.technologies) ? item.technologies.join(", ") : "", link: item.projectLink || "" })))
          }
          if (Array.isArray(resume?.certifications) && resume.certifications.length) {
            setCertifications(resume.certifications.map((item: any, index: number) => ({ id: `certification-${index + 1}`, name: item.name || "", issuer: item.issuer || "", date: item.year || "" })))
          }
          if (Array.isArray(resume?.experience) && resume.experience.length) {
            setExperience(resume.experience.map((item: any, index: number) => ({ id: `experience-${index + 1}`, company: item.organization || "", position: item.role || "", duration: item.duration || "", description: item.description || "" })))
          }
        } catch (requestError: any) {
          if (requestError.response?.status !== 404) {
            setError(requestError.response?.data?.message || "Failed to load existing resume.")
          }
        }
      } catch (requestError: any) {
        setError(requestError.response?.data?.message || "Failed to load profile for resume.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  function addSkill() {
    const value = skillInput.trim()
    if (value && !skills.includes(value)) {
      setSkills((current) => [...current, value])
      setSkillInput("")
    }
  }

  async function handleSave() {
    if (!studentId) {
      setError("Student profile not loaded yet.")
      return
    }

    setSaving(true)
    setError("")
    setSuccess("")

    const payload = {
      personalInfo: {
        fullName: personal.fullName,
        email: personal.email,
        phone: personal.phone,
        location: personal.location,
        linkedin: personal.linkedin,
        github: personal.github,
        portfolio: personal.website,
      },
      education: education.filter((item) => item.institution || item.degree).map((item) => ({ institution: item.institution, degree: item.degree, fieldOfStudy: item.field, startYear: item.years.split(" - ")[0] || "", endYear: item.years.split(" - ")[1] || "", cgpa: item.gpa })),
      skills,
      projects: projects.filter((item) => item.name || item.description).map((item) => ({ title: item.name, description: item.description, technologies: item.technologies.split(",").map((value) => value.trim()).filter(Boolean), projectLink: item.link })),
      certifications: certifications.filter((item) => item.name || item.issuer).map((item) => ({ name: item.name, issuer: item.issuer, year: item.date })),
      experience: experience.filter((item) => item.company || item.position || item.description).map((item) => ({ role: item.position, organization: item.company, duration: item.duration, description: item.description })),
      templateName: "classic",
    }

    try {
      if (resumeExists) {
        await updateResume(studentId, payload)
      } else {
        await createResume(payload)
        setResumeExists(true)
      }
      setSuccess("Resume saved successfully.")
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Failed to save resume.")
    } finally {
      setSaving(false)
    }
  }

  function handlePreview() {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleDownloadPdf() {
    const printWindow = window.open("", "_blank", "width=900,height=1200")

    if (!printWindow) {
      setError("Unable to open print window. Please allow popups and try again.")
      return
    }

    const html = buildResumePrintHtml({
      personal,
      education,
      skills,
      projects,
      certifications,
      experience,
    })

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    window.setTimeout(() => {
      printWindow.print()
    }, 400)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <GlassCard className="p-10">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading resume builder...
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Resume Builder</h1>
          <p className="text-muted-foreground">Create a professional resume that stays synced with your real profile.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePreview}><Eye className="w-4 h-4 mr-2" />Preview</Button>
          <Button variant="outline" onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save Draft</Button>
          <Button className="bg-gradient-to-r from-primary to-secondary" onClick={handleDownloadPdf}><Download className="w-4 h-4 mr-2" />Download PDF</Button>
        </div>
      </div>

      {error ? <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}
      {success ? <div className="mb-6 rounded-xl border border-secondary/20 bg-secondary/10 p-4 text-sm text-secondary">{success}</div> : null}

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <GlassCard className="p-2">
            <div className="flex gap-1 overflow-x-auto pb-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button key={section.id} onClick={() => setActiveSection(section.id)} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors", activeSection === section.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                )
              })}
            </div>
          </GlassCard>

          {activeSection === "personal" ? (
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <Field label="Full Name"><Input value={personal.fullName} onChange={(e) => setPersonal((current) => ({ ...current, fullName: e.target.value }))} /></Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email"><Input type="email" value={personal.email} onChange={(e) => setPersonal((current) => ({ ...current, email: e.target.value }))} /></Field>
                  <Field label="Phone"><Input value={personal.phone} onChange={(e) => setPersonal((current) => ({ ...current, phone: e.target.value }))} /></Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Location"><Input value={personal.location} onChange={(e) => setPersonal((current) => ({ ...current, location: e.target.value }))} /></Field>
                  <Field label="Portfolio"><Input value={personal.website} onChange={(e) => setPersonal((current) => ({ ...current, website: e.target.value }))} /></Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="LinkedIn"><Input value={personal.linkedin} onChange={(e) => setPersonal((current) => ({ ...current, linkedin: e.target.value }))} /></Field>
                  <Field label="GitHub"><Input value={personal.github} onChange={(e) => setPersonal((current) => ({ ...current, github: e.target.value }))} /></Field>
                </div>
                <Field label="Professional Summary"><Textarea rows={4} value={personal.summary} onChange={(e) => setPersonal((current) => ({ ...current, summary: e.target.value }))} /></Field>
              </div>
            </GlassCard>
          ) : null}

          {activeSection === "education" ? (
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">Education</h2>
              {education.map((item, index) => (
                <div key={item.id} className="p-4 rounded-lg bg-muted/50 mb-4 space-y-4">
                  <Field label="Institution"><Input value={item.institution} onChange={(e) => updateArray(setEducation, index, "institution", e.target.value)} /></Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Degree"><Input value={item.degree} onChange={(e) => updateArray(setEducation, index, "degree", e.target.value)} /></Field>
                    <Field label="Field"><Input value={item.field} onChange={(e) => updateArray(setEducation, index, "field", e.target.value)} /></Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Years"><Input value={item.years} onChange={(e) => updateArray(setEducation, index, "years", e.target.value)} placeholder="2023 - 2027" /></Field>
                    <Field label="CGPA"><Input value={item.gpa} onChange={(e) => updateArray(setEducation, index, "gpa", e.target.value)} /></Field>
                  </div>
                </div>
              ))}
            </GlassCard>
          ) : null}

          {activeSection === "skills" ? (
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">Skills</h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                      {skill}
                      <button type="button" onClick={() => setSkills((current) => current.filter((item) => item !== skill))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill..." onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill() } }} />
                  <Button type="button" variant="outline" onClick={addSkill}><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
            </GlassCard>
          ) : null}

          {activeSection === "projects" ? (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Projects</h2>
                <Button variant="outline" size="sm" onClick={() => setProjects((current) => [...current, { id: `project-${Date.now()}`, name: "", description: "", technologies: "", link: "" }])}><Plus className="w-4 h-4 mr-1" />Add Project</Button>
              </div>
              {projects.map((item, index) => (
                <div key={item.id} className="p-4 rounded-lg bg-muted/50 mb-4 space-y-4">
                  <div className="flex justify-end">{projects.length > 1 ? <button type="button" onClick={() => setProjects((current) => current.filter((project) => project.id !== item.id))}><X className="w-4 h-4 text-muted-foreground hover:text-destructive" /></button> : null}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Project Name"><Input value={item.name} onChange={(e) => updateArray(setProjects, index, "name", e.target.value)} /></Field>
                    <Field label="Link"><Input value={item.link} onChange={(e) => updateArray(setProjects, index, "link", e.target.value)} /></Field>
                  </div>
                  <Field label="Technologies"><Input value={item.technologies} onChange={(e) => updateArray(setProjects, index, "technologies", e.target.value)} placeholder="React, Node.js" /></Field>
                  <Field label="Description"><Textarea rows={3} value={item.description} onChange={(e) => updateArray(setProjects, index, "description", e.target.value)} /></Field>
                </div>
              ))}
            </GlassCard>
          ) : null}

          {activeSection === "certifications" ? (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Certifications</h2>
                <Button variant="outline" size="sm" onClick={() => setCertifications((current) => [...current, { id: `certification-${Date.now()}`, name: "", issuer: "", date: "" }])}><Plus className="w-4 h-4 mr-1" />Add Certification</Button>
              </div>
              {certifications.map((item, index) => (
                <div key={item.id} className="p-4 rounded-lg bg-muted/50 mb-4 space-y-4">
                  <div className="flex justify-end">{certifications.length > 1 ? <button type="button" onClick={() => setCertifications((current) => current.filter((certification) => certification.id !== item.id))}><X className="w-4 h-4 text-muted-foreground hover:text-destructive" /></button> : null}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Certification Name"><Input value={item.name} onChange={(e) => updateArray(setCertifications, index, "name", e.target.value)} /></Field>
                    <Field label="Issuer"><Input value={item.issuer} onChange={(e) => updateArray(setCertifications, index, "issuer", e.target.value)} /></Field>
                  </div>
                  <Field label="Date / Year"><Input value={item.date} onChange={(e) => updateArray(setCertifications, index, "date", e.target.value)} /></Field>
                </div>
              ))}
            </GlassCard>
          ) : null}

          {activeSection === "experience" ? (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Experience</h2>
                <Button variant="outline" size="sm" onClick={() => setExperience((current) => [...current, { id: `experience-${Date.now()}`, company: "", position: "", duration: "", description: "" }])}><Plus className="w-4 h-4 mr-1" />Add Experience</Button>
              </div>
              {experience.map((item, index) => (
                <div key={item.id} className="p-4 rounded-lg bg-muted/50 mb-4 space-y-4">
                  <div className="flex justify-end">{experience.length > 1 ? <button type="button" onClick={() => setExperience((current) => current.filter((entry) => entry.id !== item.id))}><X className="w-4 h-4 text-muted-foreground hover:text-destructive" /></button> : null}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Company"><Input value={item.company} onChange={(e) => updateArray(setExperience, index, "company", e.target.value)} /></Field>
                    <Field label="Position"><Input value={item.position} onChange={(e) => updateArray(setExperience, index, "position", e.target.value)} /></Field>
                  </div>
                  <Field label="Duration"><Input value={item.duration} onChange={(e) => updateArray(setExperience, index, "duration", e.target.value)} placeholder="May 2025 - Aug 2025" /></Field>
                  <Field label="Description"><Textarea rows={3} value={item.description} onChange={(e) => updateArray(setExperience, index, "description", e.target.value)} /></Field>
                </div>
              ))}
            </GlassCard>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]" ref={previewRef}>
          <GlassCard className="h-full overflow-auto">
            <div className="p-8 bg-background min-h-full">
              <div className="max-w-xl mx-auto">
                <div className="text-center mb-6 pb-6 border-b border-border">
                  <h1 className="text-2xl font-bold mb-2">{personal.fullName || "Your Name"}</h1>
                  <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
                    {personal.email ? <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personal.email}</span> : null}
                    {personal.phone ? <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personal.phone}</span> : null}
                    {personal.location ? <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personal.location}</span> : null}
                  </div>
                  <div className="flex justify-center gap-3 mt-2 text-sm">
                    {personal.website ? <span className="flex items-center gap-1 text-primary"><LinkIcon className="w-3 h-3" />{stripProtocol(personal.website)}</span> : null}
                    {personal.linkedin ? <span className="flex items-center gap-1 text-primary"><Linkedin className="w-3 h-3" />{stripProtocol(personal.linkedin)}</span> : null}
                    {personal.github ? <span className="flex items-center gap-1 text-primary"><Github className="w-3 h-3" />{stripProtocol(personal.github)}</span> : null}
                  </div>
                </div>

                {personal.summary ? <ResumeSection title="Summary"><p className="text-sm text-muted-foreground leading-relaxed">{personal.summary}</p></ResumeSection> : null}
                <ResumeSection title="Education">
                  {education.filter((item) => item.institution || item.degree).map((item) => (
                    <div key={item.id} className="mb-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-semibold text-sm">{item.institution}</h3>
                          <p className="text-sm text-muted-foreground">{[item.degree, item.field].filter(Boolean).join(" in ")}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{item.years}</p>
                          {item.gpa ? <p>CGPA: {item.gpa}</p> : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </ResumeSection>
                {skills.length ? <ResumeSection title="Skills"><p className="text-sm text-muted-foreground">{skills.join(", ")}</p></ResumeSection> : null}
                {experience.filter((item) => item.company || item.position || item.description).length ? (
                  <ResumeSection title="Experience">
                    {experience.filter((item) => item.company || item.position || item.description).map((item) => (
                      <div key={item.id} className="mb-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-semibold text-sm">{item.position}</h3>
                            <p className="text-sm text-muted-foreground">{item.company}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.duration}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    ))}
                  </ResumeSection>
                ) : null}
                {projects.filter((item) => item.name || item.description).length ? (
                  <ResumeSection title="Projects">
                    {projects.filter((item) => item.name || item.description).map((item) => (
                      <div key={item.id} className="mb-3">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                          {item.link ? <span className="text-xs text-primary">{stripProtocol(item.link)}</span> : null}
                        </div>
                        {item.technologies ? <p className="text-xs text-muted-foreground mb-1">{item.technologies}</p> : null}
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </ResumeSection>
                ) : null}
                {certifications.filter((item) => item.name || item.issuer).length ? (
                  <ResumeSection title="Certifications">
                    {certifications.filter((item) => item.name || item.issuer).map((item) => (
                      <div key={item.id} className="flex justify-between items-start mb-2 gap-4">
                        <div>
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.issuer}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                    ))}
                  </ResumeSection>
                ) : null}
              </div>
            </div>
          </GlassCard>
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

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">{title}</h2>
      {children}
    </div>
  )
}

function buildSummary(profile: any) {
  const degreeLine = [profile?.degree, profile?.branch].filter(Boolean).join(" in ")
  const roleLine = profile?.preferredRole ? `Interested in ${profile.preferredRole} opportunities.` : ""
  const skillsLine = Array.isArray(profile?.skills) && profile.skills.length ? `Comfortable with ${profile.skills.slice(0, 5).join(", ")}.` : ""
  return [degreeLine, roleLine, skillsLine].filter(Boolean).join(" ")
}

function buildResumePrintHtml({
  personal,
  education,
  skills,
  projects,
  certifications,
  experience,
}: {
  personal: any
  education: any[]
  skills: string[]
  projects: any[]
  certifications: any[]
  experience: any[]
}) {
  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${escapeHtml(personal.fullName || "Resume")}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #111827; }
        h1 { font-size: 28px; margin-bottom: 6px; }
        h2 { font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #2563eb; margin-top: 28px; margin-bottom: 10px; }
        p { margin: 4px 0; line-height: 1.5; }
        .muted { color: #6b7280; }
        .row { display: flex; justify-content: space-between; gap: 20px; }
        .item { margin-bottom: 12px; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(personal.fullName || "Resume")}</h1>
      <p class="muted">${escapeHtml([personal.email, personal.phone, personal.location].filter(Boolean).join(" | "))}</p>
      <p class="muted">${escapeHtml([personal.website, personal.linkedin, personal.github].filter(Boolean).join(" | "))}</p>
      ${personal.summary ? `<h2>Summary</h2><p>${escapeHtml(personal.summary)}</p>` : ""}
      <h2>Education</h2>
      ${education.filter((item) => item.institution || item.degree).map((item) => `<div class="item"><div class="row"><div><strong>${escapeHtml(item.institution)}</strong><p class="muted">${escapeHtml([item.degree, item.field].filter(Boolean).join(" in "))}</p></div><div class="muted">${escapeHtml(item.years || "")}${item.gpa ? `<p>CGPA: ${escapeHtml(item.gpa)}</p>` : ""}</div></div></div>`).join("")}
      ${skills.length ? `<h2>Skills</h2><p>${escapeHtml(skills.join(", "))}</p>` : ""}
      ${experience.filter((item) => item.company || item.position || item.description).length ? `<h2>Experience</h2>${experience.filter((item) => item.company || item.position || item.description).map((item) => `<div class="item"><div class="row"><div><strong>${escapeHtml(item.position)}</strong><p class="muted">${escapeHtml(item.company)}</p></div><div class="muted">${escapeHtml(item.duration || "")}</div></div><p>${escapeHtml(item.description || "")}</p></div>`).join("")}` : ""}
      ${projects.filter((item) => item.name || item.description).length ? `<h2>Projects</h2>${projects.filter((item) => item.name || item.description).map((item) => `<div class="item"><div class="row"><strong>${escapeHtml(item.name)}</strong><span class="muted">${escapeHtml(item.link || "")}</span></div>${item.technologies ? `<p class="muted">${escapeHtml(item.technologies)}</p>` : ""}<p>${escapeHtml(item.description || "")}</p></div>`).join("")}` : ""}
      ${certifications.filter((item) => item.name || item.issuer).length ? `<h2>Certifications</h2>${certifications.filter((item) => item.name || item.issuer).map((item) => `<div class="item"><div class="row"><div><strong>${escapeHtml(item.name)}</strong><p class="muted">${escapeHtml(item.issuer || "")}</p></div><div class="muted">${escapeHtml(item.date || "")}</div></div></div>`).join("")}` : ""}
    </body>
  </html>`
}

function stripProtocol(value: string) {
  return value.replace(/^https?:\/\//, "")
}

function updateArray<T extends Record<string, unknown>>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number, field: keyof T, value: string) {
  setter((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)))
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
