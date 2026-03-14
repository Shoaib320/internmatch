"use client"

import { cn } from "@/lib/utils"

interface FloatingIllustrationProps {
  variant: "career" | "resume" | "analytics" | "hiring" | "profile" | "growth"
  className?: string
}

export function FloatingIllustration({ variant, className }: FloatingIllustrationProps) {
  const illustrations = {
    career: (
      <div className="relative w-full h-full">
        {/* Main card */}
        <div className="absolute top-4 left-4 w-48 h-32 bg-card/90 backdrop-blur-lg rounded-xl border border-border/50 shadow-xl p-4 transform rotate-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
            <div>
              <div className="h-2 w-20 bg-muted rounded" />
              <div className="h-1.5 w-14 bg-muted/60 rounded mt-1" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-1.5 w-full bg-muted/40 rounded" />
            <div className="h-1.5 w-3/4 bg-muted/40 rounded" />
          </div>
        </div>
        
        {/* Floating badge */}
        <div className="absolute top-0 right-8 w-20 h-20 bg-gradient-to-br from-orange to-accent rounded-xl shadow-lg transform -rotate-12 flex items-center justify-center">
          <svg className="w-10 h-10 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        
        {/* Stats card */}
        <div className="absolute bottom-0 right-0 w-40 h-24 bg-card/90 backdrop-blur-lg rounded-xl border border-border/50 shadow-xl p-3 transform -rotate-3">
          <div className="text-xs text-muted-foreground mb-2">Match Score</div>
          <div className="text-2xl font-bold text-primary">92%</div>
          <div className="flex gap-1 mt-2">
            <div className="h-1.5 flex-1 bg-primary rounded" />
            <div className="h-1.5 w-2 bg-muted rounded" />
          </div>
        </div>
        
        {/* Floating dots */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
        </div>
        <div className="absolute top-1/4 right-1/3">
          <div className="w-2 h-2 bg-teal rounded-full animate-pulse delay-300" />
        </div>
        <div className="absolute bottom-1/4 left-1/3">
          <div className="w-2 h-2 bg-orange rounded-full animate-pulse delay-700" />
        </div>
      </div>
    ),
    
    resume: (
      <div className="relative w-full h-full">
        {/* Resume document */}
        <div className="absolute inset-4 bg-card/95 backdrop-blur-lg rounded-xl border border-border/50 shadow-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary" />
            <div>
              <div className="h-3 w-32 bg-foreground/80 rounded" />
              <div className="h-2 w-24 bg-muted-foreground/60 rounded mt-2" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-2 w-20 bg-primary rounded" />
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-muted/40 rounded" />
              <div className="h-1.5 w-5/6 bg-muted/40 rounded" />
              <div className="h-1.5 w-4/6 bg-muted/40 rounded" />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-2 w-16 bg-secondary rounded" />
            <div className="flex gap-2">
              <div className="px-2 py-1 bg-primary/10 rounded text-xs text-primary">React</div>
              <div className="px-2 py-1 bg-secondary/10 rounded text-xs text-secondary">Python</div>
              <div className="px-2 py-1 bg-teal/10 rounded text-xs text-teal">ML</div>
            </div>
          </div>
        </div>
        
        {/* Floating edit icon */}
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-orange rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      </div>
    ),
    
    analytics: (
      <div className="relative w-full h-full">
        {/* Main chart card */}
        <div className="absolute top-2 left-2 right-2 h-36 bg-card/90 backdrop-blur-lg rounded-xl border border-border/50 shadow-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="h-2 w-24 bg-muted rounded" />
            <div className="text-xs text-primary font-semibold">+24%</div>
          </div>
          <div className="flex items-end gap-2 h-20">
            <div className="flex-1 bg-primary/20 rounded-t h-8" />
            <div className="flex-1 bg-primary/30 rounded-t h-12" />
            <div className="flex-1 bg-primary/40 rounded-t h-10" />
            <div className="flex-1 bg-primary/50 rounded-t h-16" />
            <div className="flex-1 bg-primary/60 rounded-t h-14" />
            <div className="flex-1 bg-primary rounded-t h-20" />
          </div>
        </div>
        
        {/* Stats badges */}
        <div className="absolute bottom-4 left-4 w-24 h-16 bg-gradient-to-br from-secondary to-teal rounded-xl shadow-lg p-2 text-secondary-foreground">
          <div className="text-xs opacity-80">Skills</div>
          <div className="text-lg font-bold">12</div>
        </div>
        
        <div className="absolute bottom-4 right-4 w-24 h-16 bg-gradient-to-br from-orange to-accent rounded-xl shadow-lg p-2 text-accent-foreground">
          <div className="text-xs opacity-80">Matches</div>
          <div className="text-lg font-bold">8</div>
        </div>
      </div>
    ),
    
    hiring: (
      <div className="relative w-full h-full">
        {/* Candidate cards stack */}
        <div className="absolute top-8 left-8 w-44 h-28 bg-muted/60 rounded-xl transform rotate-6" />
        <div className="absolute top-6 left-6 w-44 h-28 bg-muted/80 rounded-xl transform rotate-3" />
        <div className="absolute top-4 left-4 w-44 h-28 bg-card/95 backdrop-blur-lg rounded-xl border border-border/50 shadow-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
            <div>
              <div className="h-2 w-16 bg-foreground/80 rounded" />
              <div className="h-1.5 w-12 bg-muted-foreground/60 rounded mt-1" />
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="px-1.5 py-0.5 bg-primary/10 rounded text-[10px] text-primary">95%</div>
            <div className="px-1.5 py-0.5 bg-secondary/10 rounded text-[10px] text-secondary">React</div>
          </div>
        </div>
        
        {/* Accept/Reject buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    ),
    
    profile: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Profile card */}
        <div className="w-56 h-64 bg-card/95 backdrop-blur-lg rounded-2xl border border-border/50 shadow-2xl p-5">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-teal mb-3" />
            <div className="h-3 w-28 bg-foreground/80 rounded mb-1" />
            <div className="h-2 w-20 bg-muted-foreground/60 rounded mb-4" />
            <div className="flex gap-2 mb-4">
              <div className="px-2 py-1 bg-primary/10 rounded text-xs text-primary">3.8 GPA</div>
              <div className="px-2 py-1 bg-secondary/10 rounded text-xs text-secondary">CS</div>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Profile</span>
                <span className="text-primary">85%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-primary to-secondary rounded-full" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-orange rounded-full animate-bounce" />
        <div className="absolute bottom-8 left-4 w-6 h-6 bg-teal rounded-lg animate-pulse" />
      </div>
    ),
    
    growth: (
      <div className="relative w-full h-full">
        {/* Growth path */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          <path
            d="M20 180 Q 50 150, 80 140 T 140 100 T 180 40"
            fill="none"
            stroke="url(#growthGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="growthGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--secondary)" />
              <stop offset="50%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--orange)" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Milestone points */}
        <div className="absolute bottom-8 left-4 w-10 h-10 bg-secondary rounded-full shadow-lg flex items-center justify-center text-secondary-foreground text-sm font-bold">1</div>
        <div className="absolute top-1/2 left-1/3 w-10 h-10 bg-primary rounded-full shadow-lg flex items-center justify-center text-primary-foreground text-sm font-bold">2</div>
        <div className="absolute top-1/4 right-1/4 w-10 h-10 bg-teal rounded-full shadow-lg flex items-center justify-center text-secondary-foreground text-sm font-bold">3</div>
        <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-orange to-accent rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        
        {/* Labels */}
        <div className="absolute bottom-16 left-0 text-xs text-muted-foreground">Apply</div>
        <div className="absolute top-1/2 left-1/4 -translate-y-8 text-xs text-muted-foreground">Interview</div>
        <div className="absolute top-8 right-1/3 text-xs text-muted-foreground">Offer</div>
      </div>
    ),
  }

  return (
    <div className={cn("relative", className)}>
      {illustrations[variant]}
    </div>
  )
}
