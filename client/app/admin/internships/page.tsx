"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, MoreHorizontal, Trash2, Building2, MapPin, DollarSign, Clock, Briefcase, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteAdminInternship, getAdminInternships } from "@/services/adminService"

export default function AdminInternshipsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [internships, setInternships] = useState<any[]>([])

  useEffect(() => {
    async function loadInternships() {
      try {
        const response = await getAdminInternships()
        setInternships(response.internships || [])
      } catch (requestError: any) {
        setError(requestError.response?.data?.message || "Failed to load internships.")
      } finally {
        setLoading(false)
      }
    }

    loadInternships()
  }, [])

  const filteredInternships = useMemo(() => {
    return internships.filter((internship) => {
      const matchesSearch = internship.internshipTitle.toLowerCase().includes(searchQuery.toLowerCase()) || internship.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = typeFilter === "all" || internship.internshipType === typeFilter
      return matchesSearch && matchesType
    })
  }, [internships, searchQuery, typeFilter])

  async function handleDelete(internshipId: string) {
    try {
      await deleteAdminInternship(internshipId)
      setInternships((current) => current.filter((internship) => internship._id !== internshipId))
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Failed to delete internship.")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Internship Management</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage all internship listings.</p>
      </div>

      {error ? <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Listings" value={String(internships.length)} />
        <StatCard label="Remote" value={String(internships.filter((item) => item.internshipType === "remote").length)} />
        <StatCard label="Hybrid" value={String(internships.filter((item) => item.internshipType === "hybrid").length)} />
        <StatCard label="On-site" value={String(internships.filter((item) => item.internshipType === "onsite").length)} />
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search internships..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-background/50" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] bg-background/50"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead>Internship</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Compensation</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5}><div className="flex items-center justify-center gap-3 py-8 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />Loading internships...</div></TableCell></TableRow>
            ) : filteredInternships.map((internship) => (
              <TableRow key={internship._id} className="hover:bg-muted/30 border-border/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border/50">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{getInitials(internship.companyName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{internship.internshipTitle}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Building2 className="h-3 w-3" />{internship.companyName}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge variant="secondary">{internship.internshipType}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{internship.location || "Location TBD"}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-foreground font-medium"><DollarSign className="h-3 w-3" />{internship.stipend || "Not listed"}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{internship.duration || "Duration TBD"}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-3 w-3" />{formatDate(internship.applicationDeadline)}</div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(internship._id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle></CardHeader>
      <CardContent><div className="text-2xl font-bold text-foreground">{value}</div></CardContent>
    </Card>
  )
}

function getInitials(value: string) {
  return value.split(" ").filter(Boolean).slice(0, 2).map((item) => item[0]?.toUpperCase()).join("")
}

function formatDate(value: string) {
  if (!value) {
    return "Not set"
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
