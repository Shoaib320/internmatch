"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, MoreHorizontal, Trash2, Building2, MapPin, Briefcase, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteAdminCompany, getAdminCompanies } from "@/services/adminService"

export default function AdminCompaniesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [companies, setCompanies] = useState<any[]>([])

  useEffect(() => {
    async function loadCompanies() {
      try {
        const response = await getAdminCompanies()
        setCompanies(response.companies || [])
      } catch (requestError: any) {
        setError(requestError.response?.data?.message || "Failed to load companies.")
      } finally {
        setLoading(false)
      }
    }

    loadCompanies()
  }, [])

  const industries = useMemo(() => [...new Set(companies.map((company) => company.industryType).filter(Boolean))], [companies])

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || company.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesIndustry = industryFilter === "all" || company.industryType === industryFilter
      return matchesSearch && matchesIndustry
    })
  }, [companies, industryFilter, searchQuery])

  async function handleDelete(companyId: string) {
    try {
      await deleteAdminCompany(companyId)
      setCompanies((current) => current.filter((company) => company._id !== companyId))
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Failed to delete company.")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Company Management</h1>
        <p className="text-muted-foreground mt-1">Review and manage registered companies.</p>
      </div>

      {error ? <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Companies" value={String(companies.length)} />
        <StatCard label="With Industry" value={String(companies.filter((company) => company.industryType).length)} />
        <StatCard label="With Website" value={String(companies.filter((company) => company.website).length)} />
        <StatCard label="With Location" value={String(companies.filter((company) => company.location).length)} />
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search companies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-background/50" />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[180px] bg-background/50"><SelectValue placeholder="Industry" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => <SelectItem key={industry} value={industry}>{industry}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm md:col-span-2 lg:col-span-3">
            <CardContent className="pt-6"><div className="flex items-center justify-center gap-3 py-8 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />Loading companies...</div></CardContent>
          </Card>
        ) : filteredCompanies.map((company) => (
          <Card key={company._id} className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-border/50">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">{getInitials(company.companyName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{company.companyName}</h3>
                    <p className="text-sm text-muted-foreground">{company.industryType || "Industry not set"}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(company._id)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-sm text-muted-foreground">{company.email}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{company.location || "Location not set"}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Building2 className="h-4 w-4" />{company.website || "Website not set"}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Briefcase className="h-4 w-4" />{company.description ? "Description available" : "No description yet"}</div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Badge variant="secondary">{company.industryType || "General"}</Badge>
                <span className="text-xs text-muted-foreground">{formatDate(company.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
