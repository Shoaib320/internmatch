"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Briefcase,
  Building2,
  CheckCircle2,
  Code2,
  FileText,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function MatchScoreCard() {
  return (
    <div className="absolute right-8 top-8 z-30 animate-float-slow">
      <div className="group relative">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-teal/40 to-primary/40 opacity-60 blur-lg transition-opacity group-hover:opacity-80" />
        <div className="relative rounded-2xl border border-white/20 bg-card/95 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal to-secondary">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Match Score</p>
              <p className="text-lg font-bold text-foreground">94%</p>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-teal to-secondary" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Excellent match for your profile</p>
        </div>
      </div>
    </div>
  );
}

function RecommendationCard() {
  return (
    <div className="absolute -right-4 top-32 z-20 animate-float-medium">
      <div className="group relative">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/30 to-orange/30 opacity-50 blur-lg transition-opacity group-hover:opacity-70" />
        <div className="relative w-64 rounded-2xl border border-white/15 bg-card/90 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">Software Engineer Intern</p>
              <p className="text-xs text-muted-foreground">Google - Mountain View</p>
              <div className="mt-1 flex items-center gap-1">
                <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-medium text-teal">
                  Remote OK
                </span>
                <span className="rounded-full bg-orange/10 px-2 py-0.5 text-[10px] font-medium text-orange">
                  $8k/mo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="absolute bottom-24 right-16 z-20 animate-float-fast">
      <div className="group relative">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-secondary/30 to-teal/30 opacity-50 blur-lg transition-opacity group-hover:opacity-70" />
        <div className="relative rounded-2xl border border-white/15 bg-card/90 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange to-orange/70 text-sm font-semibold text-white">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">CS @ Stanford</p>
            </div>
            <CheckCircle2 className="ml-2 h-5 w-5 text-teal" />
          </div>
          <div className="mt-3 flex gap-1.5">
            <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">React</span>
            <span className="rounded-md bg-secondary/10 px-2 py-1 text-[10px] font-medium text-secondary">Python</span>
            <span className="rounded-md bg-teal/10 px-2 py-1 text-[10px] font-medium text-teal">ML</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard() {
  return (
    <div className="absolute -left-8 bottom-48 z-10 animate-float-slow">
      <div className="group relative">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange/30 to-primary/30 opacity-50 blur-lg transition-opacity group-hover:opacity-70" />
        <div className="relative rounded-2xl border border-white/15 bg-card/85 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-orange" />
            <p className="text-xs font-medium text-muted-foreground">This Week</p>
          </div>
          <div className="flex h-12 items-end gap-1.5">
            {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
              <div
                key={i}
                className="w-3 rounded-t-sm bg-gradient-to-t from-primary/80 to-teal/80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">+23% profile views</p>
        </div>
      </div>
    </div>
  );
}

function SkillTags() {
  const skills = [
    { icon: Code2, label: "Full Stack", color: "from-primary to-primary/70" },
    { icon: Brain, label: "Machine Learning", color: "from-teal to-secondary" },
    { icon: FileText, label: "Resume Ready", color: "from-orange to-orange/70" },
  ];

  return (
    <div className="absolute left-4 top-56 z-10 animate-float-medium">
      <div className="relative flex flex-col gap-2">
        {skills.map((skill) => (
          <div
            key={skill.label}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-card/80 px-3 py-2 shadow-lg backdrop-blur-xl transition-transform duration-300 hover:scale-105"
          >
            <div className={`flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br ${skill.color}`}>
              <skill.icon className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-xs font-medium text-foreground">{skill.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero3DVisual() {
  return (
    <div className="relative h-[500px] w-full lg:h-[600px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-80 w-80 rounded-full bg-gradient-to-br from-primary/20 via-teal/15 to-secondary/20 blur-3xl" />
      </div>
      <div className="absolute right-20 top-20 h-48 w-48 rounded-full bg-orange/10 blur-3xl" />
      <div className="relative h-full w-full" style={{ perspective: "1200px" }}>
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          <MatchScoreCard />
          <RecommendationCard />
          <ProfileCard />
          <AnalyticsCard />
          <SkillTags />
        </div>
      </div>
      <div className="absolute left-1/4 top-12 h-3 w-3 animate-pulse rounded-full bg-teal/60" />
      <div className="absolute bottom-32 right-1/4 h-2 w-2 animate-pulse rounded-full bg-orange/60 delay-300" />
      <div className="absolute right-8 top-1/3 h-2 w-2 animate-pulse rounded-full bg-primary/60 delay-500" />
    </div>
  );
}

export function Hero3D() {
  return (
    <section className="relative z-10 overflow-hidden py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-teal/5 blur-3xl" />
        <div className="absolute left-0 top-1/2 h-64 w-64 rounded-full bg-orange/5 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 via-teal/10 to-secondary/10 px-4 py-2 shadow-lg backdrop-blur-sm">
            <div className="relative">
              <Sparkles className="h-4 w-4 text-primary" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="h-4 w-4 text-primary opacity-40" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-primary via-secondary to-teal bg-clip-text text-sm font-medium text-transparent">
              AI-Powered Career Matching
            </span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Find Your Perfect{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-secondary to-teal bg-clip-text text-transparent">
                Internship
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path
                  d="M2 6C50 2 150 2 198 6"
                  stroke="url(#underline-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="underline-gradient" x1="0" y1="0" x2="200" y2="0">
                    <stop stopColor="var(--primary)" />
                    <stop offset="0.5" stopColor="var(--secondary)" />
                    <stop offset="1" stopColor="var(--teal)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{" "}
            Match
          </h1>

          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl">
            InternMatch uses advanced machine learning to analyze your profile and connect you with internships that align perfectly with your skills, goals, and career aspirations.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-12 gap-2 bg-gradient-to-r from-primary to-primary/90 px-6 text-base shadow-lg shadow-primary/25 transition-all duration-300 hover:from-primary/90 hover:to-primary hover:shadow-xl hover:shadow-primary/30"
            >
              <Link href="/signup">
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="group h-12 border-border/60 px-6 text-base backdrop-blur-sm hover:bg-muted/50"
            >
              <Link href="/signup?role=company">
                <Building2 className="mr-2 h-4 w-4 transition-colors group-hover:text-primary" />
                For Companies
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              {[
                { initials: "SC", gradient: "from-primary to-secondary" },
                { initials: "MP", gradient: "from-teal to-secondary" },
                { initials: "ER", gradient: "from-orange to-orange/70" },
                { initials: "JK", gradient: "from-secondary to-teal" },
                { initials: "+", gradient: "from-muted-foreground to-muted-foreground/70" },
              ].map((user) => (
                <div
                  key={user.initials}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br ${user.gradient} text-xs font-medium text-white shadow-lg`}
                >
                  {user.initials}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-orange text-orange" />
                ))}
                <span className="ml-1 text-sm font-medium text-foreground">4.9</span>
              </div>
              <p className="text-sm text-muted-foreground">Trusted by 10,000+ students</p>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <Hero3DVisual />
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(1deg);
          }
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(-1deg);
          }
        }
        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        :global(.animate-float-slow) {
          animation: float-slow 6s ease-in-out infinite;
        }
        :global(.animate-float-medium) {
          animation: float-medium 5s ease-in-out infinite;
        }
        :global(.animate-float-fast) {
          animation: float-fast 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
