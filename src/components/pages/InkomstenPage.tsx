'use client'

import { useState } from 'react'
import { TrendingUp, Plus, Search, DollarSign, Eye, Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

// Types
interface Inkomst {
  id: string
  factuurNummer: string
  titel: string
  bedrijf: string
  bedrag: number
  status: 'open' | 'verstuurd' | 'betaald' | 'overdue'
  vervaldatum: string
  aangemaaktOp: string
}

// Sample Data
const inkomstenData: Inkomst[] = [
  {
    id: '1',
    factuurNummer: 'INV-2024-001',
    titel: 'Website Redesign',
    bedrijf: 'ACME BV',
    bedrag: 25000,
    status: 'betaald',
    vervaldatum: '2024-02-01',
    aangemaaktOp: '2024-01-15',
  },
  {
    id: '2',
    factuurNummer: 'INV-2024-002',
    titel: 'App Development',
    bedrijf: 'TechStart NV',
    bedrag: 45000,
    status: 'open',
    vervaldatum: '2024-02-15',
    aangemaaktOp: '2024-01-20',
  },
  {
    id: '3',
    factuurNummer: 'INV-2024-003',
    titel: 'Consultancy Services',
    bedrijf: 'Global Solutions',
    bedrag: 12000,
    status: 'verstuurd',
    vervaldatum: '2024-01-10',
    aangemaaktOp: '2024-01-25',
  },
  {
    id: '4',
    factuurNummer: 'INV-2024-004',
    titel: 'SEO Optimalisatie',
    bedrijf: 'Media Plus',
    bedrag: 8500,
    status: 'overdue',
    vervaldatum: '2024-01-05',
    aangemaaktOp: '2024-01-01',
  },
]

// Status Badge Component
function StatusBadge({ status }: { status: Inkomst['status'] }) {
  const styles = {
    open: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    verstuurd: 'bg-green-500/10 text-green-600 border-green-500/20',
    betaald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    overdue: 'bg-red-500/10 text-red-600 border-red-500/20',
  }

  const labels = {
    open: 'Open',
    verstuurd: 'Verstuurd',
    betaald: 'Betaald',
    overdue: 'Overdue',
  }

  return (
    <span className={cn('text-xs px-2.5 py-0.5 rounded-full border font-medium', styles[status])}>
      {labels[status]}
    </span>
  )
}

export default function InkomstenPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('vervaldatum')

  // Filter data
  const filteredData = inkomstenData.filter((inkomst) => {
    const matchesSearch = inkomst.factuurNummer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inkomst.titel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inkomst.bedrijf.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inkomst.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sort data
  const sortedData = filteredData.sort((a, b) => {
    if (sortBy === 'titel') return a.titel.localeCompare(b.titel)
    if (sortBy === 'bedrag') return b.bedrag - a.bedrag
    if (sortBy === 'vervaldatum') return new Date(b.vervaldatum).getTime() - new Date(a.vervaldatum).getTime()
    return 0
  })

  // Calculate totals
  const totaalBedrag = filteredData.reduce((sum, inkomst) => sum + inkomst.bedrag, 0)
  const betaaldItems = filteredData.filter((item) => item.status === 'betaald')
  const openItems = filteredData.filter((item) => item.status === 'open')
  const overdueItems = filteredData.filter((item) => item.status === 'overdue')

  const betaaldBedrag = betaaldItems.reduce((sum, item) => sum + item.bedrag, 0)
  const openBedrag = openItems.reduce((sum, item) => sum + item.bedrag, 0)
  const overdueBedrag = overdueItems.reduce((sum, item) => sum + item.bedrag, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-emerald-500/20 to-green-500/20">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            Inkomsten
          </h1>
          <p className="text-muted-foreground mt-1">Beheer uw inkomsten</p>
        </div>
        <Button 
          className="bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25"
          onClick={() => {
            toast({
              title: 'Nieuwe Factuur',
              description: 'Factuur aanmaken functionaliteit wordt geïmplementeerd.',
            })
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Factuur
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-linear-to-br from-emerald-500/10 to-green-500/20 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-white">Totaal Open</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-white mb-2">€{openBedrag.toLocaleString('nl-NL')}</div>
            <div className="text-sm text-emerald-100">Aantal: {openItems.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-blue-500/10 to-cyan-500/20 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white">Totaal Verstuurd</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-white mb-2">€{betaaldBedrag.toLocaleString('nl-NL')}</div>
            <div className="text-sm text-blue-100">Aantal: {betaaldItems.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-red-500/10 to-orange-500/20 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-white">Totaal Overdue</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-white mb-2">€{overdueBedrag.toLocaleString('nl-NL')}</div>
            <div className="text-sm text-red-100">Aantal: {overdueItems.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-purple-500/10 to-pink-500/20 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Totaal Bedrag</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-white mb-2">€{totaalBedrag.toLocaleString('nl-NL')}</div>
            <div className="text-sm text-purple-100">Aantal: {filteredData.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken op factuurnummer of titel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/30 border-border/30 focus-visible:ring-emerald-500/20"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background/30 border-border/30">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="verstuurd">Verstuurd</SelectItem>
              <SelectItem value="betaald">Betaald</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-44 bg-background/30 border-border/30">
              <SelectValue placeholder="Sorteren" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="titel">Titel (A-Z)</SelectItem>
              <SelectItem value="bedrag">Bedrag</SelectItem>
              <SelectItem value="vervaldatum">Vervaldatum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="font-semibold text-muted-foreground">Factuur</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Titel</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Bedrijf</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Bedrag</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Vervaldatum</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-center">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((inkomst) => (
              <TableRow
                key={inkomst.id}
                className="border-border/20 hover:bg-muted/40 transition-colors cursor-pointer"
                onClick={() => {
                  toast({
                    title: 'Factuur Geselecteerd',
                    description: `Factuur "${inkomst.titel}" geselecteerd.`,
                  })
                }}
              >
                <TableCell className="font-medium text-foreground">{inkomst.factuurNummer}</TableCell>
                <TableCell className="text-foreground">{inkomst.titel}</TableCell>
                <TableCell className="text-foreground">{inkomst.bedrijf}</TableCell>
                <TableCell className="text-foreground">€{inkomst.bedrag.toLocaleString('nl-NL')}</TableCell>
                <TableCell>
                  <StatusBadge status={inkomst.status} />
                </TableCell>
                <TableCell className="text-foreground">{inkomst.vervaldatum}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        toast({
                          title: 'Factuur Bekijken',
                          description: `Details van "${inkomst.titel}" worden getoond.`,
                        })
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        toast({
                          title: 'Factuur Bewerken',
                          description: `"${inkomst.titel}" wordt bewerkt.`,
                        })
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        toast({
                          title: 'Factuur Markeren als Betaald',
                          description: `"${inkomst.titel}" wordt gemarkeerd als betaald.`,
                        })
                      }}
                    >
                      <DollarSign className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        toast({
                          title: 'Factuur Verwijderen',
                          description: `"${inkomst.titel}" wordt verwijderd.`,
                          variant: 'destructive',
                        })
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* No results */}
      {sortedData.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground/80">Geen inkomsten gevonden</h3>
          <p className="text-muted-foreground text-sm">Probeer een andere zoekopdracht of filters</p>
        </div>
      )}
    </div>
  )
}
