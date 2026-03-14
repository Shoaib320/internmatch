import { ProtectedShell } from "@/components/protected-shell"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedShell requiredRole="student">{children}</ProtectedShell>
  )
}
