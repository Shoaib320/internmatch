import Link from "next/link"

interface LogoProps {
  className?: string
  showText?: boolean
  href?: string
}

export function Logo({ className = "", showText = true, href = "/" }: LogoProps) {
  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-teal overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-teal/80" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="relative w-6 h-6 text-primary-foreground"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      {showText && (
        <span className="text-xl font-bold tracking-tight text-foreground">
          Intern<span className="text-primary">Match</span>
        </span>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{logoContent}</Link>
  }

  return logoContent
}
