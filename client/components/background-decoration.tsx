"use client"

import { cn } from "@/lib/utils"

interface BackgroundDecorationProps {
  variant?: "default" | "hero" | "dashboard" | "auth"
  className?: string
}

export function BackgroundDecoration({ variant = "default", className }: BackgroundDecorationProps) {
  return (
    <div className={cn("pointer-events-none fixed inset-0 overflow-hidden", className)}>
      {/* Primary gradient orb */}
      <div 
        className={cn(
          "absolute rounded-full blur-3xl opacity-30",
          variant === "hero" && "w-[800px] h-[800px] -top-[400px] -right-[200px] bg-gradient-to-br from-primary via-secondary to-teal",
          variant === "dashboard" && "w-[600px] h-[600px] -top-[200px] -right-[100px] bg-gradient-to-br from-primary/60 via-secondary/50 to-teal/40",
          variant === "auth" && "w-[700px] h-[700px] -top-[350px] left-1/4 bg-gradient-to-br from-primary via-secondary to-teal",
          variant === "default" && "w-[500px] h-[500px] -top-[250px] -right-[100px] bg-gradient-to-br from-primary/50 via-secondary/40 to-teal/30"
        )}
      />
      
      {/* Secondary gradient orb */}
      <div 
        className={cn(
          "absolute rounded-full blur-3xl opacity-20",
          variant === "hero" && "w-[600px] h-[600px] bottom-[100px] -left-[200px] bg-gradient-to-tr from-orange via-accent to-primary",
          variant === "dashboard" && "w-[400px] h-[400px] bottom-[50px] -left-[100px] bg-gradient-to-tr from-orange/50 via-accent/40 to-primary/30",
          variant === "auth" && "w-[500px] h-[500px] -bottom-[200px] right-1/4 bg-gradient-to-tr from-teal via-secondary to-primary",
          variant === "default" && "w-[400px] h-[400px] bottom-[100px] -left-[100px] bg-gradient-to-tr from-orange/40 via-accent/30 to-primary/20"
        )}
      />
      
      {/* Accent orb */}
      <div 
        className={cn(
          "absolute rounded-full blur-3xl opacity-15",
          variant === "hero" && "w-[400px] h-[400px] top-1/2 left-1/3 bg-gradient-to-r from-teal to-secondary",
          variant === "dashboard" && "w-[300px] h-[300px] top-1/3 right-1/4 bg-gradient-to-r from-teal/40 to-secondary/30",
          variant === "auth" && "w-[350px] h-[350px] top-1/3 left-1/2 bg-gradient-to-r from-orange/50 to-accent/40",
          variant === "default" && "w-[300px] h-[300px] top-1/2 left-1/4 bg-gradient-to-r from-teal/30 to-secondary/20"
        )}
      />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                           linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Floating abstract shapes */}
      <svg className="absolute top-20 right-20 w-24 h-24 text-primary/10" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      
      <svg className="absolute bottom-40 left-20 w-20 h-20 text-secondary/10" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 50 50)" />
        <rect x="30" y="30" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 50 50)" />
      </svg>
      
      <svg className="absolute top-1/3 right-1/4 w-16 h-16 text-teal/10" viewBox="0 0 100 100">
        <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <polygon points="50,25 75,75 25,75" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    </div>
  )
}
