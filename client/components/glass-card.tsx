"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-lg",
        hover && "transition-all duration-300 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  )
}
