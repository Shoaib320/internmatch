import { ProtectedShell } from "@/components/protected-shell"

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedShell requiredRole="company">{children}</ProtectedShell>
}
