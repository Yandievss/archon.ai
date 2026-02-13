'use client'

import { useState } from 'react'
import { Calendar, Plus, Search, Clock, Users, MapPin, Video, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

// Types
interface Afspraak {
  id: string
  titel: string
  beschrijving: string
  type: 'meeting' | 'call' | 'deadline' | 'task'
  starttijd: string
  eindtijd: string
  datum: string
  locatie: string
  deelnemers: string[]
  status: 'gepland' | 'bezig' | 'afgerond' | 'geannuleerd'
}

// Sample Data
const afsprakenData: Afspraak[] = [
  {
    id: '1',
    titel: 'Project Kick-off',
    beschrijving: 'Kick-off meeting voor het nieuwe project',
    type: 'meeting',
    starttijd: '09:00',
    eindtijd: '10:30',
    datum: '2024-02-15',
    locatie: 'Kantoor ACME BV',
    deelnemers: ['Jan de Vries', 'Maria Jansen', 'Peter Bakker'],
    status: 'gepland',
  },
  {
    id: '2',
    titel: 'Sales Call',
    beschrijving: 'Verkoopgesprek met potentiële klant',
    type: 'call',
    starttijd: '14:00',
    eindtijd: '14:30',
    datum: '2024-02-10',
    locatie: 'Online',
    deelnemers: ['Jan de Vries'],
    status: 'bezig',
  },
  {
    id: '3',
    titel: 'Deadline Review',
    beschrijving: 'Review van project deliverables',
    type: 'deadline',
    starttijd: '15:00',
    eindtijd: '17:00',
    datum: '2024-02-20',
    locatie: 'Kantoor TechStart',
    deelnemers: ['Jan de Vries', 'Maria Jansen'],
    status: 'afgerond',
  },
  {
    id: '4',
    titel: 'Team Meeting',
    beschrijving: 'Wekelijkse team meeting',
    type: 'meeting',
    starttijd: '13:00',
    eindtijd: '14:00',
    datum: '2024-02-25',
    locatie: 'Vergaderzaal',
    deelnemers: ['Jan de Vries', 'Maria Jansen', 'Peter Bakker', 'Sophie de Graaf'],
    status: 'gepland',
  },
]

// Type Badge Component
function TypeBadge({ type }: { type: Afspraak['type'] }) {
  const styles = {
    meeting: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    call: 'bg-green-500/10 text-green-600 border-green-500/20',
    deadline: 'bg-red-500/10 text-red-600 border-red-500/20',
    task: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  }

  const labels = {
    meeting: 'Meeting',
    call: 'Call',
    deadline: 'Deadline',
    task: 'Task',
  }

  return (
    <span className={cn('text-xs px-2.5 py-0.5 rounded-full border font-medium', styles[type])}>
      {labels[type]}
    </span>
  )
}

function StatusBadge({ status }: { status: Afspraak['status'] }) {
  const styles = {
    gepland: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    bezig: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    afgerond: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    geannuleerd: 'bg-red-500/10 text-red-600 border-red-500/20',
  }

  const labels = {
    gepland: 'Gepland',
    bezig: 'Bezig',
    afgerond: 'Afgerond',
    geannuleerd: 'Geannuleerd',
  }

  return (
    <span className={cn('text-xs px-2.5 py-0.5 rounded-full border font-medium', styles[status])}>
      {labels[status]}
    </span>
  )
}

export default function AgendaPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<string>('')

  // Filter data
  const filteredData = afsprakenData.filter((afspraak) => {
    const matchesSearch = afspraak.titel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      afspraak.beschrijving.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || afspraak.type === typeFilter
    const matchesDate = !selectedDate || afspraak.datum === selectedDate
    return matchesSearch && matchesType && matchesDate
  })

  // Sort data by date
  const sortedData = filteredData.sort((a, b) => {
    const dateA = new Date(a.datum).getTime()
    const dateB = new Date(b.datum).getTime()
    return dateB - dateA
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-sky-500 to-blue-600">
              <Calendar className="w-6 h-6 text-sky-600" />
            </div>
            Agenda
          </h1>
          <p className="text-muted-foreground mt-1">Beheer uw afspraken</p>
        </div>
        <Button 
          className="bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25"
          onClick={() => {
            toast({
              title: 'Nieuwe Afspraak',
              description: 'Afspraak aanmaken functionaliteit wordt geïmplementeerd.',
            })
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Afspraak
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 bg-background/30 border-border/30 focus-visible:ring-sky-500/20"
            />
          </div>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background/30 border-border/30">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Types</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="task">Task</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {sortedData.map((afspraak) => (
            <Card
              key={afspraak.id}
              className="group bg-card/40 border border-border/30 rounded-xl p-4 hover:shadow-lg hover:bg-card/60 hover:border-border/50 transition-all duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground group-hover:text-sky-500 transition-colors">
                      {afspraak.titel}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <TypeBadge type={afspraak.type} />
                      <span className="text-sm text-muted-foreground">
                        {afspraak.starttijd} - {afspraak.eindtijd}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {afspraak.deelnemers.length} deelnemers
                    </Badge>
                  </div>
                  <StatusBadge status={afspraak.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {afspraak.beschrijving}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{afspraak.locatie}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{afspraak.datum}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{afspraak.deelnemers.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Video className="w-4 h-4" />
                  <span>Online meeting</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Phone className="w-4 h-4" />
                  <span>{afspraak.type === 'call' ? 'Call' : afspraak.type}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-sky-500 hover:bg-sky-500/10"
                    onClick={() => {
                      toast({
                        title: 'Afspraak Bekijken',
                        description: `Details van "${afspraak.titel}" worden getoond.`,
                      })
                    }}
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
                    onClick={() => {
                      toast({
                        title: 'Afspraak Bewerken',
                        description: `"${afspraak.titel}" wordt bewerkt.`,
                      })
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    onClick={() => {
                      toast({
                        title: 'Afspraak Verwijderen',
                        description: `"${afspraak.titel}" wordt verwijderd.`,
                        variant: 'destructive',
                      })
                    }}
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No results */}
        {sortedData.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium text-foreground/80">Geen afspraken gevonden</h3>
            <p className="text-muted-foreground text-sm">Probeer een andere zoekopdracht of filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
