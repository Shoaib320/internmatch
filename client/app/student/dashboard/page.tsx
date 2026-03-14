"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { FloatingIllustration } from "@/components/floating-illustration"
import {
  User,
  Sparkles,
  FileText,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Award,
  BarChart3,
} from "lucide-react"
import { getStudentApplications } from "@/services/applicationService"
import { getPredictionHistory } from "@/services/predictionService"
import { getResume } from "@/services/resumeService"
import { getStudentProfile } from "@/services/studentService"
import { getStoredUser } from "@/utils/storage"

const quickActions = [
  {
    title: "Complete Profile",
    description: "Add your skills and academic details",
    icon: User,
    href: "/student/profile",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Get Predictions",
    description: "View AI-powered internship matches",
    icon: Sparkles,
    href: "/student/predictions",
    color: "bg-secondary/10 text-secondary",
  },
  {
    title: "Track Applications",
    description: "See every internship you applied to",
    icon: Briefcase,
    href: "/student/applications",
    color: "bg-orange/10 text-orange",
  },
  {
    title: "Build Resume",
    description: "Create a professional resume",
    icon: FileText,
    href: "/student/resume",
    color: "bg-teal/10 text-teal",
  },
]

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [latestPrediction, setLatestPrediction] = useState<any>(null)
  const [resumeReady, setResumeReady] = useState(false)
  const [applicationCount, setApplicationCount] = useState(0)

  useEffect(() => {
    async function loadDashboard() {
      const user = getStoredUser()

      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const profileData = await getStudentProfile(user.id)
        const studentProfile = profileData.profile
        setProfile(studentProfile)

        try {
          const predictionData = await getPredictionHistory(studentProfile._id)
          if (predictionData.predictions?.length) {
            setLatestPrediction(predictionData.predictions[0])
          }
        } catch {}

        try {
          const resumeData = await getResume(studentProfile._id)
          setResumeReady(Boolean(resumeData.resume))
        } catch {}

        try {
          const applicationsData = await getStudentApplications(studentProfile._id)
          setApplicationCount(applicationsData.applications?.length || 0)
        } catch {}
      } catch {
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const stats = buildStats(profile, latestPrediction, resumeReady, applicationCount)
  const recentMatches = latestPrediction?.recommendations?.slice(0, 3) || []

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Matching
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Find Internships That
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-teal">
                Match Your Skills
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              {profile
                ? "Your profile is active. Keep refining your skills and preferences to unlock sharper internship matches."
                : "Start by completing your profile so the platform can recommend internships that fit your goals."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary" asChild>
                <Link href="/student/predictions">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Predictions
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/student/profile">
                  {profile ? "Update Profile" : "Complete Profile"}
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-96 h-72">
            <FloatingIllustration variant="analytics" className="w-full h-full" />
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
                {stat.progress ? (
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                ) : null}
              </GlassCard>
            )
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <GlassCard hover className="p-6 h-full">
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Get Started <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-bold mb-6">Your Journey</h2>
          <GlassCard className="p-6">
            <div className="space-y-6">
              {buildJourney(profile, resumeReady, latestPrediction).map((step, index, steps) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                        step.status === "completed"
                          ? "bg-secondary text-secondary-foreground"
                          : step.status === "current"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : step.step}
                    </div>
                    {index < steps.length - 1 ? (
                      <div
                        className={`w-0.5 h-12 mt-2 ${
                          step.status === "completed" ? "bg-secondary" : "bg-muted"
                        }`}
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      {step.status === "current" ? (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          In Progress
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Matches</h2>
            <Link href="/student/predictions" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentMatches.length ? (
              recentMatches.map((match: any) => (
                <GlassCard key={`${match.internshipId}-${match.internshipTitle}`} hover className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{match.internshipTitle}</h3>
                      <p className="text-sm text-muted-foreground">{match.companyName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{match.matchScore}%</div>
                        <div className="text-xs text-muted-foreground">Match</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(match.matchedSkills || []).slice(0, 4).map((skill: string) => (
                      <span key={skill} className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {match.internshipType || "Type not specified"}
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/student/predictions">View Details</Link>
                    </Button>
                  </div>
                </GlassCard>
              ))
            ) : (
              <GlassCard className="p-6">
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? "Loading your dashboard..."
                    : "No recommendations yet. Complete your profile and generate your first set of matches."}
                </p>
              </GlassCard>
            )}
          </div>
        </section>
      </div>

      <section className="mt-12">
        <GlassCard className="p-6 bg-gradient-to-r from-primary/5 via-secondary/5 to-teal/5">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
              <BarChart3 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold mb-1">Boost Your Match Score</h3>
              <p className="text-sm text-muted-foreground">
                Keep your profile, projects, and resume current. Fresh inputs usually produce better ranking and stronger ML role signals.
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/student/profile">Complete Profile</Link>
            </Button>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}

function buildStats(profile: any, latestPrediction: any, resumeReady: boolean, applicationCount: number) {
  const skillCount = Array.isArray(profile?.skills) ? profile.skills.length : 0
  const bestMatch = latestPrediction?.recommendations?.length
    ? Math.max(...latestPrediction.recommendations.map((item: any) => item.matchScore))
    : 0
  const completion = getProfileCompletion(profile)

  return [
    {
      label: "Profile Completion",
      value: `${completion}%`,
      icon: User,
      color: "from-primary to-secondary",
      progress: completion,
    },
    {
      label: "Skills Added",
      value: `${skillCount}`,
      icon: Award,
      color: "from-secondary to-teal",
    },
    {
      label: "Resume Status",
      value: resumeReady ? "Ready" : "Draft",
      icon: Briefcase,
      color: "from-teal to-primary",
    },
    {
      label: "Applications",
      value: String(applicationCount),
      icon: Target,
      color: "from-orange to-accent",
      trend: bestMatch ? `Best ${bestMatch}%` : undefined,
    },
  ]
}

function buildJourney(profile: any, resumeReady: boolean, latestPrediction: any) {
  const hasProfile = Boolean(profile)
  const hasPrediction = Boolean(latestPrediction?.recommendations?.length)

  return [
    {
      step: 1,
      title: "Create Profile",
      description: "Add your academic details, skills, and preferences",
      status: hasProfile ? "completed" : "current",
    },
    {
      step: 2,
      title: "Build Resume",
      description: "Create a professional resume with our builder",
      status: !hasProfile ? "upcoming" : resumeReady ? "completed" : "current",
    },
    {
      step: 3,
      title: "Get Matched",
      description: "Our AI finds internships matching your profile",
      status: !hasProfile || !resumeReady ? "upcoming" : hasPrediction ? "completed" : "current",
    },
    {
      step: 4,
      title: "Apply & Succeed",
      description: "Apply to matched internships and land your dream role",
      status: hasPrediction ? "current" : "upcoming",
    },
  ]
}

function getProfileCompletion(profile: any) {
  if (!profile) {
    return 0
  }

  const fields = [
    profile.fullName,
    profile.phone,
    profile.collegeName,
    profile.location,
    profile.degree,
    profile.branch,
    profile.year,
    profile.cgpa,
    Array.isArray(profile.skills) && profile.skills.length,
    profile.preferredRole,
    profile.preferredLocation,
    profile.internshipType,
    profile.githubLink,
    profile.linkedinLink,
  ]

  const completed = fields.filter(Boolean).length
  return Math.round((completed / fields.length) * 100)
}
