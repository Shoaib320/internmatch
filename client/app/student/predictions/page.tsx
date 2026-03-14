"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import Link from "next/link"
import {
  Sparkles,
  Target,
  MapPin,
  Clock,
  Building2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Brain,
  Zap,
  ArrowUpRight,
  Briefcase,
  DollarSign,
  Calendar,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { generatePredictions, getPredictionHistory } from "@/services/predictionService"
import { getStudentProfile } from "@/services/studentService"
import { getStoredUser } from "@/utils/storage"
import { createApplication, getStudentApplications } from "@/services/applicationService"

export default function PredictionsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [predictions, setPredictions] = useState<any[]>([])
  const [currentRecommendations, setCurrentRecommendations] = useState<any[]>([])
  const [predictedRoles, setPredictedRoles] = useState<any[]>([])
  const [engine, setEngine] = useState("")
  const [fallbackReason, setFallbackReason] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [applyingId, setApplyingId] = useState("")
  const [appliedInternships, setAppliedInternships] = useState<string[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadPredictionData() {
      const user = getStoredUser()

      if (!user?.id) {
        setError("User session not found. Please login again.")
        setLoading(false)
        return
      }

      try {
        const profileData = await getStudentProfile(user.id)
        setProfile(profileData.profile)

        const historyData = await getPredictionHistory(profileData.profile._id)
        const history = historyData.predictions || []
        setPredictions(history)

        try {
          const applicationsData = await getStudentApplications(profileData.profile._id)
          setAppliedInternships((applicationsData.applications || []).map((item: any) => String(item.internshipId?._id || item.internshipId)))
        } catch {}

        if (history.length) {
          applyPrediction(history[0])
        }
      } catch (requestError: any) {
        setError(requestError.response?.data?.message || "Failed to load predictions.")
      } finally {
        setLoading(false)
      }
    }

    loadPredictionData()
  }, [])

  async function handleGenerate() {
    setGenerating(true)
    setError("")

    try {
      const data = await generatePredictions()
      setCurrentRecommendations(data.recommendations || [])
      setPredictedRoles(data.predictedRoles || [])
      setEngine(data.engine || "")
      setFallbackReason(data.fallbackReason || "")

      if (profile?._id) {
        const historyData = await getPredictionHistory(profile._id)
        setPredictions(historyData.predictions || [])
      }
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Failed to generate recommendations.")
    } finally {
      setGenerating(false)
    }
  }

  async function handleApply(internshipId: string) {
    setApplyingId(internshipId)
    setError("")

    try {
      await createApplication({ internshipId })
      setAppliedInternships((current) => [...new Set([...current, internshipId])])
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Failed to apply for this internship.")
    } finally {
      setApplyingId("")
    }
  }

  const filteredRecommendations = useMemo(() => {
    const byType = currentRecommendations.filter((prediction) => {
      if (selectedType === "all") {
        return true
      }

      return String(prediction.internshipType || "").toLowerCase() === selectedType
    })

    if (selectedFilter === "recent") {
      return byType
    }

    return [...byType].sort((a, b) => b.matchScore - a.matchScore)
  }, [currentRecommendations, selectedFilter, selectedType])

  const bestScore = filteredRecommendations.length
    ? Math.max(...filteredRecommendations.map((item) => item.matchScore))
    : 0

  const hasSkills = Array.isArray(profile?.skills) && profile.skills.length > 0
  const waitingForInternships = engine === "awaiting-internships"
  const isFallback = engine === "rule-based-fallback"

  const emptyStateTitle = waitingForInternships
    ? "No internships have been posted yet"
    : !hasSkills
      ? "Add a few skills to improve your matches"
      : "No recommendations yet"

  const emptyStateDescription = waitingForInternships
    ? "Ask a company user to create internship listings first. As soon as internships are added, your matches will appear here."
    : !hasSkills
      ? "Your profile is saved, but your skills section is still empty. Add your main skills, projects, and preferences to get stronger recommendations."
      : "Complete your profile and refresh your matches to generate recommendations."

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4" />
              AI-Powered Recommendations
            </div>
            <h1 className="text-3xl font-bold mb-2">Your Internship Matches</h1>
            <p className="text-muted-foreground">
              Based on your skills, CGPA, and preferences, here are your top matches
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Work Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Match Score</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-primary to-secondary" onClick={handleGenerate} disabled={generating || !profile}>
              {generating ? "Generating..." : "Refresh Matches"}
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="mb-6 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {engine ? (
        <div
          className={cn(
            "mb-6 p-4 rounded-xl border text-sm",
            engine === "awaiting-internships"
              ? "border-primary/20 bg-primary/10 text-primary"
              : engine === "flask-ml-service"
                ? "border-secondary/20 bg-secondary/10 text-secondary"
                : "border-orange/20 bg-orange/10 text-orange"
          )}
        >
          {engine === "flask-ml-service" && "Live ML service is active for these recommendations."}
          {engine === "awaiting-internships" && (fallbackReason || "No internship posts are available yet.")}
          {isFallback && `Fallback scoring engine is active${fallbackReason ? `: ${fallbackReason}` : "."}`}
        </div>
      ) : null}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <GlassCard className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{filteredRecommendations.length}</div>
              <div className="text-sm text-muted-foreground">Matches Found</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-3xl font-bold text-secondary">{bestScore}%</div>
              <div className="text-sm text-muted-foreground">Best Match</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-3xl font-bold text-teal">{Array.isArray(profile?.skills) ? profile.skills.length : 0}</div>
              <div className="text-sm text-muted-foreground">Skills Added</div>
            </GlassCard>
          </div>

          <div className="space-y-4">
            {filteredRecommendations.map((prediction, index) => {
              const internshipId = String(prediction.internshipId)
              const isApplied = appliedInternships.includes(internshipId)

              return (
              <GlassCard key={`${prediction.internshipId}-${index}`} hover className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-primary-foreground",
                        index === 0
                          ? "bg-gradient-to-br from-primary to-secondary"
                          : index === 1
                            ? "bg-gradient-to-br from-secondary to-teal"
                            : index === 2
                              ? "bg-gradient-to-br from-teal to-primary"
                              : "bg-gradient-to-br from-orange to-accent"
                      )}
                    >
                      {(prediction.companyName || "IN").slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{prediction.internshipTitle}</h3>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {prediction.companyName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "px-4 py-2 rounded-xl text-center",
                            prediction.matchScore >= 90
                              ? "bg-secondary/10"
                              : prediction.matchScore >= 80
                                ? "bg-primary/10"
                                : "bg-orange/10"
                          )}
                        >
                          <div className="flex items-center gap-1">
                            <Target
                              className={cn(
                                "w-4 h-4",
                                prediction.matchScore >= 90
                                  ? "text-secondary"
                                  : prediction.matchScore >= 80
                                    ? "text-primary"
                                    : "text-orange"
                              )}
                            />
                            <span
                              className={cn(
                                "text-2xl font-bold",
                                prediction.matchScore >= 90
                                  ? "text-secondary"
                                  : prediction.matchScore >= 80
                                    ? "text-primary"
                                    : "text-orange"
                              )}
                            >
                              {prediction.matchScore}%
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">Match</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{prediction.location || "Location TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{prediction.internshipType || "Type TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>See company listing</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{prediction.predictedRoleLabel || "General fit"}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Matched Skills</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {(prediction.matchedSkills || []).length ? (
                            prediction.matchedSkills.map((skill: string) => (
                              <span key={skill} className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                              Partial fit
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Skills to Learn</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {(prediction.missingSkills || []).length ? (
                            prediction.missingSkills.map((skill: string) => (
                              <span key={skill} className="inline-flex items-center gap-1 px-2 py-1 bg-orange/10 text-orange rounded-full text-xs font-medium">
                                <XCircle className="w-3 h-3" />
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                              Strong coverage
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        {prediction.predictedRoleLabel
                          ? `Role signal: ${prediction.predictedRoleLabel}`
                          : "Generated from your latest profile"}
                      </span>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/student/applications">Track Status</Link>
                        </Button>
                        {isApplied ? (
                          <Button size="sm" className="bg-gradient-to-r from-primary to-secondary" asChild>
                            <Link href="/student/applications">View Applications</Link>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-primary to-secondary"
                            disabled={applyingId === internshipId}
                            onClick={() => handleApply(internshipId)}
                          >
                            {applyingId === internshipId ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Applying...
                              </>
                            ) : (
                              <>
                                Apply Now
                                <ArrowUpRight className="w-4 h-4 ml-1" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )})}

            {!filteredRecommendations.length && !loading ? (
              <GlassCard className="p-8 text-center">
                <div className="mx-auto max-w-2xl">
                  <h3 className="text-xl font-semibold mb-2">{emptyStateTitle}</h3>
                  <p className="text-muted-foreground mb-6">{emptyStateDescription}</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {!hasSkills ? (
                      <Button asChild>
                        <Link href="/student/profile">Update Profile</Link>
                      </Button>
                    ) : null}
                    <Button variant="outline" asChild>
                      <Link href="/student/applications">View Applications</Link>
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">ML Role Signals</h3>
                <p className="text-xs text-muted-foreground">Your predicted strengths</p>
              </div>
            </div>
            <div className="space-y-4">
              {predictedRoles.length ? (
                predictedRoles.map((strength) => (
                  <div key={strength.role} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{strength.role}</span>
                      <span className="text-muted-foreground">{Math.round(strength.confidence * 100)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${Math.round(strength.confidence * 100)}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Generate recommendations to see role strengths.</p>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange" />
              Quick Insights
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Strongest direction</p>
                    <p className="text-xs text-muted-foreground">
                      {waitingForInternships
                        ? "Internship role signals will appear after companies add openings."
                        : predictedRoles[0]?.role || "Generate recommendations to discover your strongest direction."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-orange/10 border border-orange/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-orange mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Skill Suggestion</p>
                    <p className="text-xs text-muted-foreground">
                      {!hasSkills
                        ? "Add your main tools and technologies in your profile to unlock better matches."
                        : currentRecommendations[0]?.missingSkills?.[0]
                        ? `Learning ${currentRecommendations[0].missingSkills[0]} could improve your top match.`
                        : "You already cover many of the listed requirements in your top result."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Prediction history</p>
                    <p className="text-xs text-muted-foreground">
                      {predictions.length ? `${predictions.length} saved recommendation runs.` : "No saved history yet."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )

  function applyPrediction(prediction: any) {
    setCurrentRecommendations(prediction.recommendations || [])
    setPredictedRoles(prediction.predictedRoles || [])
    setEngine(prediction.engine || "")
    setFallbackReason(prediction.fallbackReason || "")
  }
}
