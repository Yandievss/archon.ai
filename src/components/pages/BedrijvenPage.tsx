'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Building2,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Users,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import AddCompanyModal from '@/components/modals/AddCompanyModal'
import { PageEmptyState, PageInlineError, PagePanel } from '@/components/dashboard/PageStates'
import { toast } from '@/hooks/use-toast'
import {
  useDashboardQueryEnum,
  useDashboardQueryNumber,
  useDashboardQueryText,
} from '@/hooks/use-dashboard-query-state'
import { cn } from '@/lib/utils'

interface ApiCompany {
  id: string
  name: string
  sector: string | null
  location: string | null
  status: string | null
  dealValue?: number | null
  _count?: {
    contacts?: number
    deals?: number
  }
}

interface Bedrijf {
  id: string
  naam: string
  sector: string
  locatie: string
  contacten: number
  deals: number
  dealValue: number
  status: 'Actief' | 'Inactief' | 'Nieuw'
}

function normalizeStatus(value: string | null | undefined): Bedrijf['status'] {
  if (value === 'Inactief') return 'Inactief'
  if (value === 'Nieuw') return 'Nieuw'
  return 'Actief'
}

function StatusBadge({ status }: { status: Bedrijf['status'] }) {
  const styles = {
    Actief: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    Inactief: 'bg-muted text-muted-foreground border-border/30',
    Nieuw: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  }

  return (
    <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', styles[status])}>
      {status}
    </span>
  )
}

function TableLoadingRows() {
  return Array.from({ length: 5 }).map((_, index) => (
    <TableRow key={`bedrijf-loading-${index}`} className="border-border/20">
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell className="text-center"><Skeleton className="mx-auto h-4 w-8" /></TableCell>
      <TableCell className="text-center"><Skeleton className="mx-auto h-4 w-8" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
      <TableCell className="text-center"><Skeleton className="mx-auto h-8 w-24" /></TableCell>
    </TableRow>
  ))
}

export default function BedrijvenPage() {
  const [searchQuery, setSearchQuery] = useDashboardQueryText('bedrijven_q')
  const [statusFilter, setStatusFilter] = useDashboardQueryEnum(
    'bedrijven_status',
    'all',
    ['all', 'Actief', 'Inactief', 'Nieuw'] as const
  )
  const [typeFilter, setTypeFilter] = useDashboardQueryText('bedrijven_sector', 'all')
  const [sortBy, setSortBy] = useDashboardQueryEnum(
    'bedrijven_sort',
    'naam',
    ['naam', 'dealValue', 'contacten'] as const
  )
  const [currentPage, setCurrentPage] = useDashboardQueryNumber('bedrijven_page', 1, { min: 1 })
  const [companies, setCompanies] = useState<ApiCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const itemsPerPage = 5

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/companies', { cache: 'no-store' })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Kon bedrijven niet laden.')
      }

      const data = await response.json()
      setCompanies(Array.isArray(data) ? data : [])
    } catch (requestError: any) {
      setError(requestError?.message ?? 'Onbekende fout tijdens laden van bedrijven.')
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchCompanies()
  }, [fetchCompanies, refreshKey])

  const bedrijvenData = useMemo<Bedrijf[]>(() => {
    return companies.map((company) => ({
      id: company.id,
      naam: company.name,
      sector: company.sector?.trim() || 'Onbekend',
      locatie: company.location?.trim() || 'Onbekend',
      contacten: company._count?.contacts ?? 0,
      deals: company._count?.deals ?? 0,
      dealValue: Math.round(company.dealValue ?? 0),
      status: normalizeStatus(company.status),
    }))
  }, [companies])

  const sectors = useMemo(
    () => [...new Set(bedrijvenData.map((bedrijf) => bedrijf.sector))].sort((a, b) => a.localeCompare(b)),
    [bedrijvenData]
  )
  const safeTypeFilter = typeFilter === 'all' || sectors.includes(typeFilter) ? typeFilter : 'all'

  const filteredData = useMemo(() => {
    const loweredSearch = searchQuery.toLowerCase()

    return bedrijvenData
      .filter((bedrijf) => {
        const matchesSearch =
          bedrijf.naam.toLowerCase().includes(loweredSearch) ||
          bedrijf.sector.toLowerCase().includes(loweredSearch) ||
          bedrijf.locatie.toLowerCase().includes(loweredSearch)
        const matchesStatus = statusFilter === 'all' || bedrijf.status === statusFilter
        const matchesType = safeTypeFilter === 'all' || bedrijf.sector === safeTypeFilter

        return matchesSearch && matchesStatus && matchesType
      })
      .sort((a, b) => {
        if (sortBy === 'naam') return a.naam.localeCompare(b.naam)
        if (sortBy === 'dealValue') return b.dealValue - a.dealValue
        return b.contacten - a.contacten
      })
  }, [bedrijvenData, safeTypeFilter, searchQuery, sortBy, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedData = filteredData.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  )
  const hasResults = filteredData.length > 0
  const rangeStart = hasResults ? ((safeCurrentPage - 1) * itemsPerPage) + 1 : 0
  const rangeEnd = hasResults ? Math.min(safeCurrentPage * itemsPerPage, filteredData.length) : 0

  const handleDeleteBedrijf = async (companyId: string, companyName: string) => {
    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Verwijderen is mislukt.')
      }

      toast({
        title: 'Bedrijf Verwijderd',
        description: `${companyName} is verwijderd.`,
      })
      setRefreshKey((key) => key + 1)
    } catch (deleteError: any) {
      toast({
        title: 'Verwijderen mislukt',
        description: deleteError?.message ?? 'Kon bedrijf niet verwijderen.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-blue-500/20 to-sky-500/10">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            Bedrijven
          </h1>
          <p className="text-muted-foreground mt-1">Beheer uw bedrijfsrelaties</p>
        </div>
        <Button
          className="bg-linear-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white shadow-lg shadow-blue-500/25"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nieuw Bedrijf
        </Button>
      </div>

      <PagePanel className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken op naam, sector of locatie..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 bg-background/30 border-border/30 focus-visible:ring-blue-500/20"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as 'all' | 'Actief' | 'Inactief' | 'Nieuw')
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-40 bg-background/30 border-border/30">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle statussen</SelectItem>
              <SelectItem value="Actief">Actief</SelectItem>
              <SelectItem value="Inactief">Inactief</SelectItem>
              <SelectItem value="Nieuw">Nieuw</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={safeTypeFilter}
            onValueChange={(value) => {
              setTypeFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-44 bg-background/30 border-border/30">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle sectoren</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value as 'naam' | 'dealValue' | 'contacten')
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-44 bg-background/30 border-border/30">
              <SelectValue placeholder="Sorteren" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="naam">Naam (A-Z)</SelectItem>
              <SelectItem value="dealValue">Deal Waarde</SelectItem>
              <SelectItem value="contacten">Aantal Contacten</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
              setTypeFilter('all')
              setSortBy('naam')
              setCurrentPage(1)
            }}
          >
            Filters wissen
          </Button>
        </div>
      </PagePanel>

      {error && !loading && (
        <PageInlineError
          title="Bedrijven konden niet geladen worden"
          description={error}
          onRetry={() => void fetchCompanies()}
        />
      )}

      {!error && !loading && bedrijvenData.length === 0 && (
        <PageEmptyState
          icon={Building2}
          title="Nog geen bedrijven"
          description="Voeg uw eerste bedrijf toe om het overzicht op te bouwen."
          actionLabel="Nieuw bedrijf"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {!error && (loading || bedrijvenData.length > 0) && (
        <PagePanel className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="font-semibold text-muted-foreground">Bedrijf</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Sector</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Locatie</TableHead>
                <TableHead className="font-semibold text-muted-foreground text-center">Contacten</TableHead>
                <TableHead className="font-semibold text-muted-foreground text-center">Deals</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                <TableHead className="font-semibold text-muted-foreground text-center">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableLoadingRows />
              ) : hasResults ? (
                paginatedData.map((bedrijf) => (
                  <TableRow
                    key={bedrijf.id}
                    className="group border-border/20 hover:bg-muted/40 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-border/30 shadow-sm">
                          <AvatarFallback className="bg-linear-to-br from-blue-500/10 to-sky-500/10 text-blue-600 font-semibold">
                            {bedrijf.naam.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground group-hover:text-blue-500 transition-colors">
                          {bedrijf.naam}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{bedrijf.sector}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {bedrijf.locatie}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground/80">{bedrijf.contacten}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-foreground/80">{bedrijf.deals}</span>
                        </div>
                        {bedrijf.dealValue > 0 && (
                          <span className="text-xs text-emerald-600 font-medium">
                            €{bedrijf.dealValue.toLocaleString('nl-NL')}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={bedrijf.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
                          onClick={() =>
                            toast({
                              title: 'Bedrijf Details',
                              description: `Details van ${bedrijf.naam} worden getoond.`,
                            })
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                          onClick={() =>
                            toast({
                              title: 'Bewerken',
                              description: `Bewerkfunctionaliteit voor ${bedrijf.naam} volgt in de volgende stap.`,
                            })
                          }
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => void handleDeleteBedrijf(bedrijf.id, bedrijf.naam)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-border/20">
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    Geen bedrijven gevonden voor de huidige filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {!loading && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
              <p className="text-sm text-muted-foreground">
                Toont {rangeStart} - {rangeEnd} van {filteredData.length} bedrijven
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={!hasResults || safeCurrentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {hasResults && Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <Button
                    key={page}
                    variant={safeCurrentPage === page ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'h-8 w-8',
                      safeCurrentPage === page && 'bg-blue-500 hover:bg-blue-600'
                    )}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={!hasResults || safeCurrentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </PagePanel>
      )}

      <AddCompanyModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={() => setRefreshKey((key) => key + 1)}
      />
    </div>
  )
}
