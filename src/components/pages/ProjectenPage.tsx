'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  Eye,
  FolderKanban,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react'

import AddProjectModal from '@/components/modals/AddProjectModal'
import { PageEmptyState, PageInlineError, PagePanel } from '@/components/dashboard/PageStates'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboardQueryEnum, useDashboardQueryText } from '@/hooks/use-dashboard-query-state'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type ProjectStatus = 'Actief' | 'On Hold' | 'Afgerond'

interface Project {
  id: string
  naam: string
  beschrijving: string | null
  bedrijf: string | null
  bedrijfId: number | null
  status: ProjectStatus
  voortgang: number
  deadline: string | null
  budget: number
  budgetGebruikt: number
  createdAt: string | null
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles = {
    Actief: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'On Hold': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    Afgerond: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  }

  return (
    <span className={cn('text-xs px-2.5 py-0.5 rounded-full border font-medium', styles[status])}>
      {status}
    </span>
  )
}

function formatDate(value: string | null): string {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleDateString('nl-NL')
}

function nextStatus(current: ProjectStatus): ProjectStatus {
  if (current === 'Actief') return 'On Hold'
  if (current === 'On Hold') return 'Afgerond'
  return 'Actief'
}

export default function ProjectenPage() {
  const [searchQuery, setSearchQuery] = useDashboardQueryText('projecten_q')
  const [statusFilter, setStatusFilter] = useDashboardQueryEnum(
    'projecten_status',
    'all',
    ['all', 'Actief', 'On Hold', 'Afgerond'] as const
  )
  const [sortBy, setSortBy] = useDashboardQueryEnum(
    'projecten_sort',
    'deadline',
    ['deadline', 'budget', 'voortgang', 'naam'] as const
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/projecten', { cache: 'no-store' })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Kon projecten niet laden.')
      }

      const payload = await response.json()
      setProjects(Array.isArray(payload) ? payload : [])
    } catch (requestError: any) {
      setError(requestError?.message ?? 'Onbekende fout tijdens laden van projecten.')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchProjects()
  }, [fetchProjects, refreshKey])

  const filteredProjects = useMemo(() => {
    const loweredSearch = searchQuery.toLowerCase()

    return projects
      .filter((project) => {
        const matchesSearch =
          project.naam.toLowerCase().includes(loweredSearch) ||
          (project.beschrijving ?? '').toLowerCase().includes(loweredSearch) ||
          (project.bedrijf ?? '').toLowerCase().includes(loweredSearch)

        const matchesStatus = statusFilter === 'all' || project.status === statusFilter

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'naam') return a.naam.localeCompare(b.naam)
        if (sortBy === 'budget') return b.budget - a.budget
        if (sortBy === 'voortgang') return b.voortgang - a.voortgang

        const left = new Date(a.deadline ?? '').getTime()
        const right = new Date(b.deadline ?? '').getTime()
        return right - left
      })
  }, [projects, searchQuery, sortBy, statusFilter])

  const refreshProjects = () => setRefreshKey((current) => current + 1)

  const updateProjectStatus = async (projectId: string, status: ProjectStatus) => {
    try {
      const response = await fetch(`/api/projecten/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Kon projectstatus niet aanpassen.')
      }

      setProjects((current) =>
        current.map((project) => (project.id === projectId ? { ...project, status } : project))
      )

      toast({
        title: 'Project bijgewerkt',
        description: `Status aangepast naar ${status}.`,
      })
    } catch (updateError: any) {
      toast({
        title: 'Bijwerken mislukt',
        description: updateError?.message ?? 'Kon project niet bijwerken.',
        variant: 'destructive',
      })
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projecten/${projectId}`, { method: 'DELETE' })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Kon project niet verwijderen.')
      }

      setProjects((current) => current.filter((project) => project.id !== projectId))
      toast({
        title: 'Project verwijderd',
        description: 'Het project is verwijderd.',
      })
    } catch (deleteError: any) {
      toast({
        title: 'Verwijderen mislukt',
        description: deleteError?.message ?? 'Kon project niet verwijderen.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-500/20">
              <FolderKanban className="w-6 h-6 text-indigo-600" />
            </div>
            Projecten
          </h1>
          <p className="text-muted-foreground mt-1">Beheer uw projecten</p>
        </div>
        <Button
          className="bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nieuw Project
        </Button>
      </div>

      <PagePanel className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken op naam of beschrijving..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/30 border-border/30 focus-visible:ring-indigo-500/20"
            />
          </div>

          <Select value={statusFilter} onValueChange={(value: 'all' | ProjectStatus) => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-44 bg-background/30 border-border/30">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle statussen</SelectItem>
              <SelectItem value="Actief">Actief</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Afgerond">Afgerond</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: 'deadline' | 'budget' | 'voortgang' | 'naam') => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-44 bg-background/30 border-border/30">
              <SelectValue placeholder="Sorteren" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="naam">Naam (A-Z)</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="voortgang">Voortgang</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PagePanel>

      {error && !loading && (
        <PageInlineError
          title="Projecten konden niet geladen worden"
          description={error}
          onRetry={() => void fetchProjects()}
        />
      )}

      {!error && (loading || filteredProjects.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && Array.from({ length: 6 }).map((_, index) => (
            <div key={`project-loading-${index}`} className="h-72 rounded-2xl bg-muted/30 animate-pulse" />
          ))}

          {!loading && filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-5 hover:shadow-xl hover:bg-card/75 hover:border-border/50 transition-[background-color,box-shadow,border-color] duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground group-hover:text-indigo-500 transition-colors">
                      {project.naam}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {project.budget > 0 ? `€${project.budget.toLocaleString('nl-NL')}` : 'Geen budget'}
                      </Badge>
                    </div>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {formatDate(project.deadline)}</span>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {project.beschrijving || 'Geen beschrijving'}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bedrijf</span>
                    <span className="font-medium text-foreground">{project.bedrijf ?? '-'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Gebruikt budget</span>
                    <span className="font-medium text-foreground">€{project.budgetGebruikt.toLocaleString('nl-NL')}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Voortgang</span>
                      <span className="font-medium text-foreground">{project.voortgang}%</span>
                    </div>
                    <Progress value={project.voortgang} className="h-2" />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t border-border/30">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{project.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10"
                      onClick={() => {
                        toast({
                          title: 'Project details',
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
                      onClick={() => void updateProjectStatus(project.id, nextStatus(project.status))}
                      title="Status wijzigen"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => void deleteProject(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && filteredProjects.length === 0 && (
        <PageEmptyState
          icon={FolderKanban}
          title={projects.length === 0 ? 'Nog geen projecten' : 'Geen projecten gevonden'}
          description={
            projects.length === 0
              ? 'Voeg uw eerste project toe om overzicht te krijgen.'
              : 'Pas uw zoekopdracht of filters aan.'
          }
          actionLabel={projects.length === 0 ? 'Nieuw project' : 'Filters wissen'}
          onAction={() => {
            if (projects.length === 0) {
              setModalOpen(true)
              return
            }
            setSearchQuery('')
            setStatusFilter('all')
            setSortBy('deadline')
          }}
        />
      )}

      <AddProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={refreshProjects}
      />
    </div>
  )
}
