'use client'

import { useState } from 'react'
import { FolderKanban, Plus, Search, Calendar, Users, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

// Types
interface Project {
  id: string
  naam: string
  beschrijving: string
  bedrijf: string
  status: 'nieuw' | 'actief' | 'afgerond' | 'gepauzeerd'
  startdatum: string
  einddatum: string
  budget: number
  voortgang: number
  teamleden: number
}

// Sample Data
const projectenData: Project[] = [
  {
    id: '1',
    naam: 'Website Redesign',
    beschrijving: 'Complete redesign van de ACME BV website met moderne technologieën',
    bedrijf: 'ACME BV',
    status: 'actief',
    startdatum: '2024-01-01',
    einddatum: '2024-03-15',
    budget: 25000,
    voortgang: 75,
    teamleden: 3,
  },
  {
    id: '2',
    naam: 'App Development',
    beschrijving: 'Ontwikkeling van mobiele app voor iOS en Android',
    bedrijf: 'TechStart NV',
    status: 'actief',
    startdatum: '2024-01-10',
    einddatum: '2024-04-30',
    budget: 45000,
    voortgang: 60,
    teamleden: 5,
  },
  {
    id: '3',
    naam: 'Cloud Migration',
    beschrijving: 'Migratie van lokale servers naar cloud infrastructuur',
    bedrijf: 'Global Solutions',
    status: 'gepauzeerd',
    startdatum: '2023-12-01',
    einddatum: '2024-02-28',
    budget: 35000,
    voortgang: 100,
    teamleden: 2,
  },
  {
    id: '4',
    naam: 'Marketing Platform',
    beschrijving: 'Ontwikkeling van intern marketing platform',
    bedrijf: 'Media Plus',
    status: 'afgerond',
    startdatum: '2023-09-15',
    einddatum: '2023-12-20',
    budget: 18000,
    voortgang: 100,
    teamleden: 4,
  },
]

// Status Badge Component
function StatusBadge({ status }: { status: Project['status'] }) {
  const styles = {
    nieuw: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    actief: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    afgerond: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    gepauzeerd: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  }

  const labels = {
    nieuw: 'Nieuw',
    actief: 'Actief',
    afgerond: 'Afgerond',
    gepauzeerd: 'Gepauzeerd',
  }

  return (
    <span className={cn('text-xs px-2.5 py-0.5 rounded-full border font-medium', styles[status])}>
      {labels[status]}
    </span>
  )
}

export default function ProjectenPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('startdatum')

  // Filter data
  const filteredData = projectenData.filter((project) => {
    const matchesSearch = project.naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.beschrijving.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.bedrijf.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sort data
  const sortedData = filteredData.sort((a, b) => {
    if (sortBy === 'naam') return a.naam.localeCompare(b.naam)
    if (sortBy === 'budget') return b.budget - a.budget
    if (sortBy === 'startdatum') return new Date(b.startdatum).getTime() - new Date(a.startdatum).getTime()
    if (sortBy === 'voortgang') return b.voortgang - a.voortgang
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500">
              <FolderKanban className="w-6 h-6 text-indigo-600" />
            </div>
            Projecten
          </h1>
          <p className="text-muted-foreground mt-1">Beheer uw projecten</p>
        </div>
        <Button 
          className="bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25"
          onClick={() => {
            toast({
              title: 'Nieuw Project',
              description: 'Project aanmaken functionaliteit wordt geïmplementeerd.',
            })
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nieuw Project
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken op naam of beschrijving..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/30 border-border/30 focus-visible:ring-indigo-500/20"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background/30 border-border/30">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="nieuw">Nieuw</SelectItem>
              <SelectItem value="actief">Actief</SelectItem>
              <SelectItem value="afgerond">Afgerond</SelectItem>
              <SelectItem value="gepauzeerd">Gepauzeerd</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-44 bg-background/30 border-border/30">
              <SelectValue placeholder="Sorteren" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="naam">Naam (A-Z)</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="startdatum">Startdatum</SelectItem>
              <SelectItem value="voortgang">Voortgang</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedData.map((project) => (
          <Card
            key={project.id}
            className="group bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-5 hover:shadow-xl hover:bg-card/75 hover:border-border/50 transition-[background-color,box-shadow,border-color] duration-300 cursor-pointer"
            onClick={() => {
              toast({
                title: 'Project Geselecteerd',
                description: `Project "${project.naam}" geselecteerd.`,
              })
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-indigo-500 transition-colors">
                    {project.naam}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {project.teamleden} teamleden
                    </Badge>
                    <span className="text-sm text-muted-foreground">leden</span>
                  </div>
                </div>
                <StatusBadge status={project.status} />
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {new Date(project.startdatum).toLocaleDateString('nl-NL')} - {new Date(project.einddatum).toLocaleDateString('nl-NL')}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                {project.beschrijving}
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Bedrijf</span>
                  <span className="font-medium text-foreground">{project.bedrijf}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium text-foreground">€{project.budget.toLocaleString('nl-NL')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Voortgang</span>
                  <div className="flex items-center gap-2">
                    <Progress value={project.voortgang} className="flex-1 h-2" />
                    <span className="font-medium text-foreground">{project.voortgang}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-muted-foreground">Team</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      toast({
                        title: 'Project Bekijken',
                        description: `Details van "${project.naam}" worden getoond.`,
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
                        title: 'Project Bewerken',
                        description: `"${project.naam}" wordt bewerkt.`,
                      })
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      toast({
                        title: 'Project Verwijderen',
                        description: `"${project.naam}" wordt verwijderd.`,
                        variant: 'destructive',
                      })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* No results */}
      {sortedData.length === 0 && (
        <div className="text-center py-12">
          <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground/80">Geen projecten gevonden</h3>
          <p className="text-muted-foreground text-sm">Probeer een andere zoekopdracht of filters</p>
        </div>
      )}
    </div>
  )
}
