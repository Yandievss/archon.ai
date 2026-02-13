'use client'

import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

// Types
interface Bedrijf {
  id: number
  naam: string
  sector: string
  locatie: string
  contacten: number
  deals: number
  dealValue: number
  status: 'Actief' | 'Inactief' | 'Nieuw'
}

// Sample Data
const bedrijvenData: Bedrijf[] = [
  { id: 1, naam: 'ACME BV', sector: 'Technologie', locatie: 'Amsterdam', contacten: 5, deals: 3, dealValue: 45000, status: 'Actief' },
  { id: 2, naam: 'Global Solutions', sector: 'Consulting', locatie: 'Rotterdam', contacten: 3, deals: 2, dealValue: 28000, status: 'Actief' },
  { id: 3, naam: 'TechStart NV', sector: 'Software', locatie: 'Utrecht', contacten: 2, deals: 1, dealValue: 15000, status: 'Nieuw' },
  { id: 4, naam: 'Green Energy BV', sector: 'Energie', locatie: 'Den Haag', contacten: 8, deals: 5, dealValue: 120000, status: 'Actief' },
  { id: 5, naam: 'Media Plus', sector: 'Media', locatie: 'Eindhoven', contacten: 4, deals: 0, dealValue: 0, status: 'Inactief' },
  { id: 6, naam: 'Finance Hub', sector: 'Financiën', locatie: 'Amsterdam', contacten: 6, deals: 4, dealValue: 95000, status: 'Actief' },
  { id: 7, naam: 'HealthTech NL', sector: 'Gezondheid', locatie: 'Utrecht', contacten: 3, deals: 2, dealValue: 55000, status: 'Actief' },
  { id: 8, naam: 'LogiStream BV', sector: 'Logistiek', locatie: 'Rotterdam', contacten: 7, deals: 3, dealValue: 72000, status: 'Nieuw' },
]

// Status Badge Component
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

export default function BedrijvenPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('naam')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter and sort data
  const filteredData = bedrijvenData
    .filter((bedrijf) => {
      const matchesSearch = bedrijf.naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bedrijf.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bedrijf.locatie.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || bedrijf.status === statusFilter
      const matchesType = typeFilter === 'all' || bedrijf.sector === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      if (sortBy === 'naam') return a.naam.localeCompare(b.naam)
      if (sortBy === 'dealValue') return b.dealValue - a.dealValue
      if (sortBy === 'contacten') return b.contacten - a.contacten
      return 0
    })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Get unique sectors for filter
  const sectors = [...new Set(bedrijvenData.map((b) => b.sector))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            Bedrijven
          </h1>
          <p className="text-muted-foreground mt-1">Beheer uw bedrijfsrelaties</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
          <Plus className="w-4 h-4 mr-2" />
          Nieuw Bedrijf
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken op naam, sector of locatie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/30 border-border/30 focus-visible:ring-blue-500/20"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background/30 border-border/30">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="Actief">Actief</SelectItem>
              <SelectItem value="Inactief">Inactief</SelectItem>
              <SelectItem value="Nieuw">Nieuw</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background/30 border-border/30">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Sectors</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-44 bg-background/30 border-border/30">
              <SelectValue placeholder="Sorteren" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="naam">Naam (A-Z)</SelectItem>
              <SelectItem value="dealValue">Deal Waarde</SelectItem>
              <SelectItem value="contacten">Aantal Contacten</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden">
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
            {paginatedData.map((bedrijf) => (
              <tr
                key={bedrijf.id}
                className="group border-border/20 hover:bg-muted/40 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-border/30 shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-600 font-semibold">
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
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </tr>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            Toont {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} van {filteredData.length} bedrijven
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="icon"
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'h-8 w-8',
                  currentPage === page && 'bg-blue-500 hover:bg-blue-600'
                )}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
