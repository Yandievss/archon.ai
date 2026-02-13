'use client'

import { useState } from 'react'
import { FileX, Plus, Search, Filter, Calendar } from 'lucide-react'
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
interface Uitgave {
  id: string
  titel: string
  type: string
  status: string
  bedrijf: string
  deadline: string
  bedrag: number
  createdAt: string
}

// Sample Data
const uitgavenData: Uitgave[] = [
  {
    id: '1',
    titel: 'Factuur Q1 2024',
    type: 'Factuur',
    status: 'Open',
    bedrijf: 'ACME BV',
    deadline: '2024-02-15',
    bedrag: 15000,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    titel: 'Project Archon',
    type: 'Project',
    status: 'Actief',
    bedrijf: 'TechStart NV',
    deadline: '2024-03-01',
    bedrag: 75000,
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    titel: 'Support Ticket #123',
    type: 'Support',
    status: 'In behandeling',
    bedrijf: 'Global Solutions',
    deadline: '2024-01-20',
    bedrag: 0,
    createdAt: '2024-01-18'
  },
]

// Status Badge Component
function StatusBadge({ status }: { status: Uitgave['status'] }) {
  const styles = {
    Open: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    Actief: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'In behandeling': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    Afgerond: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  }

  return (
    <span className={cn('text-xs px-2.5 py-0.5 rounded-full border font-medium', styles[status])}>
      {status}
    </span>
  )
}

export default function UitgavenPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('createdAt')

  // Filter data
  const filteredData = uitgavenData.filter((uitgave) => {
    const matchesSearch = uitgave.titel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uitgave.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uitgave.bedrijf.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || uitgave.status === statusFilter
    const matchesType = typeFilter === 'all' || uitgave.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  // Sort data
  const sortedData = filteredData.sort((a, b) => {
    if (sortBy === 'titel') return a.titel.localeCompare(b.titel)
    if (sortBy === 'bedrag') return b.bedrag - a.bedrag
    if (sortBy === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-orange-500 to-amber-500">
              <FileX className="w-6 h-6 text-orange-600" />
            </div>
            Uitgaven
          </h1>
          <p className="text-muted-foreground mt-1">Beheer uw uitgaven</p>
        </div>
        <Button 
          className="bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/25"
          onClick={() => {
            toast({
              title: 'Nieuwe Uitgave',
              description: 'Uitgave aanmaken functionaliteit wordt geïmplementeerd.',
            })
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Uitgave
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken op titel, type of status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/30 border-border/30 focus-visible:ring-amber-500/20"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background/30 border-border/30">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Actief">Actief</SelectItem>
              <SelectItem value="In behandeling">In behandeling</SelectItem>
              <SelectItem value="Afgerond">Afgerond</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background/30 border-border/30">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Types</SelectItem>
              <SelectItem value="Factuur">Factuur</SelectItem>
              <SelectItem value="Project">Project</SelectItem>
              <SelectItem value="Support">Support</SelectItem>
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
              <SelectItem value="deadline">Deadline</SelectItem>
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
              <TableHead className="font-semibold text-muted-foreground">Titel</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Type</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Bedrag</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Deadline</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Bedrijf</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-center">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((uitgave) => (
              <TableRow
                key={uitgave.id}
                className="border-border/20 hover:bg-muted/40 transition-colors cursor-pointer"
                onClick={() => {
                  toast({
                    title: 'Uitgave Geselecteerd',
                    description: `Uitgave "${uitgave.titel}" geselecteerd.`,
                  })
                }}
              >
                <TableCell className="font-medium text-foreground">{uitgave.titel}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {uitgave.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={uitgave.status} />
                </TableCell>
                <TableCell className="text-foreground">€{uitgave.bedrag.toLocaleString('nl-NL')}</TableCell>
                <TableCell className="text-foreground">{uitgave.deadline}</TableCell>
                <TableCell className="text-foreground">{uitgave.bedrijf}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        toast({
                          title: 'Uitgave Bekijken',
                          description: `Details van "${uitgave.titel}" worden getoond.`,
                        })
                      }}
                    >
                      <FileX className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        toast({
                          title: 'Uitgave Bewerken',
                          description: `"${uitgave.titel}" wordt bewerkt.`,
                        })
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        toast({
                          title: 'Uitgave Verwijderen',
                          description: `"${uitgave.titel}" wordt verwijderd.`,
                          variant: 'destructive',
                        })
                      }}
                    >
                      <FileX className="w-4 h-4" />
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
          <FileX className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground/80">Geen uitgaven gevonden</h3>
          <p className="text-muted-foreground text-sm">Probeer een andere zoekopdracht of filters</p>
        </div>
      )}
    </div>
  )
}
