'use client'

import { useState } from 'react'
import { FileText, Plus, Search, Download, Send, Eye, Pencil, Trash2, CheckCircle2, X } from 'lucide-react'
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
interface Offerte {
  id: string
  nummer: string
  titel: string
  bedrijf: string
  bedrag: number
  status: 'concept' | 'verstuurd' | 'geaccepteerd' | 'geweigerd'
  createdAt: string
  verzondenOp: string
}

// Sample Data
const offertesData: Offerte[] = [
  {
    id: '1',
    nummer: 'OFF-2024-001',
    titel: 'Website Redesign',
    bedrijf: 'ACME BV',
    bedrag: 25000,
    status: 'verstuurd',
    createdAt: '2024-01-10',
    verzondenOp: '2024-01-15'
  },
  {
    id: '2',
    nummer: 'OFF-2024-002',
    titel: 'App Development',
    bedrijf: 'TechStart NV',
    bedrag: 45000,
    status: 'geaccepteerd',
    createdAt: '2024-01-20',
    verzondenOp: '2024-01-22'
  },
  {
    id: '3',
    nummer: 'OFF-2024-003',
    titel: 'SEO Optimalisatie',
    bedrijf: 'Media Plus',
    bedrag: 8500,
    status: 'concept',
    createdAt: '2024-02-01',
    verzondenOp: '2024-02-05'
  },
  {
    id: '4',
    nummer: 'OFF-2024-004',
    titel: 'Cloud Migration',
    bedrijf: 'Global Solutions',
    bedrag: 35000,
    status: 'geweigerd',
    createdAt: '2024-01-25',
    verzondenOp: '2024-02-10'
  },
]

// Status Badge Component
function StatusBadge({ status }: { status: Offerte['status'] }) {
  const styles = {
    concept: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    verstuurd: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    geaccepteerd: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    geweigerd: 'bg-red-500/10 text-red-600 border-red-500/20',
  }

  const labels = {
    concept: 'Concept',
    verstuurd: 'Verstuurd',
    geaccepteerd: 'Geaccepteerd',
    geweigerd: 'Geweigerd',
  }

  return (
    <span className={cn('text-xs px-2.5 py-0.5 rounded-full border font-medium', styles[status])}>
      {labels[status]}
    </span>
  )
}

export default function OffertesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('createdAt')

  // Filter data
  const filteredData = offertesData.filter((offerte) => {
    const matchesSearch = offerte.titel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offerte.bedrijf.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || offerte.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sort data
  const sortedData = filteredData.sort((a, b) => {
    if (sortBy === 'titel') return a.titel.localeCompare(b.titel)
    if (sortBy === 'bedrag') return b.bedrag - a.bedrag
    if (sortBy === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            Offertes
          </h1>
          <p className="text-muted-foreground mt-1">Beheer uw offertes</p>
        </div>
        <Button 
          className="bg-linear-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25"
          onClick={() => {
            toast({
              title: 'Nieuwe Offerte',
              description: 'Offerte aanmaken functionaliteit wordt geïmplementeerd.',
            })
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Offerte
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken op titel of bedrijf..."
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
              <SelectItem value="concept">Concept</SelectItem>
              <SelectItem value="verstuurd">Verstuurd</SelectItem>
              <SelectItem value="geaccepteerd">Geaccepteerd</SelectItem>
              <SelectItem value="geweigerd">Geweigerd</SelectItem>
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
              <SelectItem value="createdAt">Aangemaakt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="font-semibold text-muted-foreground">Nummer</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Titel</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Bedrijf</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Bedrag</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Verzonden</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-center">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((offerte) => (
              <TableRow
                key={offerte.id}
                className="border-border/20 hover:bg-muted/40 transition-colors cursor-pointer"
                onClick={() => {
                  toast({
                    title: 'Offerte Geselecteerd',
                    description: `Offerte "${offerte.titel}" geselecteerd.`,
                  })
                }}
              >
                <TableCell className="font-medium text-foreground">{offerte.nummer}</TableCell>
                <TableCell className="text-foreground">{offerte.titel}</TableCell>
                <TableCell className="text-foreground">{offerte.bedrijf}</TableCell>
                <TableCell className="text-foreground">€{offerte.bedrag.toLocaleString('nl-NL')}</TableCell>
                <TableCell>
                  <StatusBadge status={offerte.status} />
                </TableCell>
                <TableCell className="text-foreground">{offerte.verzondenOp}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        toast({
                          title: 'Offerte Bekijken',
                          description: `Details van "${offerte.titel}" worden getoond.`,
                        })
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        toast({
                          title: 'Offerte Bewerken',
                          description: `"${offerte.titel}" wordt bewerkt.`,
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
                          title: 'Offerte Verzenden',
                          description: `"${offerte.titel}" wordt verzonden.`,
                        })
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        toast({
                          title: 'Offerte Verwijderen',
                          description: `"${offerte.titel}" wordt verwijderd.`,
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
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground/80">Geen offertes gevonden</h3>
          <p className="text-muted-foreground text-sm">Probeer een andere zoekopdracht of filters</p>
        </div>
      )}
    </div>
  )
}