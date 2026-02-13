'use client'

import { useState } from 'react'
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

// Types
interface Contact {
  id: number
  naam: string
  functie: string
  bedrijf: string
  email: string
  telefoon: string
  tags: string[]
}

// Sample Data
const contactenData: Contact[] = [
  { id: 1, naam: 'Jan de Vries', functie: 'CEO', bedrijf: 'ACME BV', email: 'jan@acme.nl', telefoon: '+31 6 12345678', tags: ['Decision Maker', 'Warm Lead'] },
  { id: 2, naam: 'Maria Jansen', functie: 'CFO', bedrijf: 'Global Solutions', email: 'maria@global.nl', telefoon: '+31 6 23456789', tags: ['Budget Houder'] },
  { id: 3, naam: 'Peter Bakker', functie: 'CTO', bedrijf: 'TechStart NV', email: 'peter@techstart.nl', telefoon: '+31 6 34567890', tags: ['Technical'] },
  { id: 4, naam: 'Sophie de Graaf', functie: 'Marketing Manager', bedrijf: 'Green Energy', email: 'sophie@green.nl', telefoon: '+31 6 45678901', tags: ['Marketing'] },
  { id: 5, naam: 'Klaas van Dijk', functie: 'Operations Director', bedrijf: 'Media Plus', email: 'klaas@media.nl', telefoon: '+31 6 56789012', tags: ['Operations'] },
  { id: 6, naam: 'Anna Vermeer', functie: 'Sales Director', bedrijf: 'Finance Hub', email: 'anna@finance.nl', telefoon: '+31 6 67890123', tags: ['Decision Maker', 'Sales'] },
  { id: 7, naam: 'Thomas Berg', functie: 'Product Manager', bedrijf: 'HealthTech NL', email: 'thomas@health.nl', telefoon: '+31 6 78901234', tags: ['Product'] },
  { id: 8, naam: 'Emma Smit', functie: 'HR Manager', bedrijf: 'LogiStream BV', email: 'emma@logi.nl', telefoon: '+31 6 89012345', tags: ['HR'] },
  { id: 9, naam: 'Lucas de Boer', functie: 'IT Manager', bedrijf: 'ACME BV', email: 'lucas@acme.nl', telefoon: '+31 6 90123456', tags: ['Technical', 'IT'] },
]

// Tag colors
const tagColors: Record<string, string> = {
  'Decision Maker': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'Warm Lead': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'Budget Houder': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'Technical': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'Marketing': 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  'Operations': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  'Sales': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  'Product': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  'HR': 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  'IT': 'bg-muted text-muted-foreground border-border/30',
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Get gradient color based on name
function getAvatarGradient(name: string): string {
  const gradients = [
    'from-blue-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-purple-500',
    'from-green-500 to-emerald-500',
  ]
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

export default function ContactenPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [bedrijfFilter, setBedrijfFilter] = useState<string>('all')
  const [functieFilter, setFunctieFilter] = useState<string>('all')

  // Filter data
  const filteredData = contactenData.filter((contact) => {
    const matchesSearch =
      contact.naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.bedrijf.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.functie.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBedrijf = bedrijfFilter === 'all' || contact.bedrijf === bedrijfFilter
    const matchesFunctie = functieFilter === 'all' || contact.functie === functieFilter
    return matchesSearch && matchesBedrijf && matchesFunctie
  })

  // Get unique values for filters
  const bedrijven = [...new Set(contactenData.map((c) => c.bedrijf))]
  const functies = [...new Set(contactenData.map((c) => c.functie))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            Contacten
          </h1>
          <p className="text-muted-foreground mt-1">Beheer uw contactpersonen</p>
        </div>
        <Button
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
          onClick={() => {
            toast({
              title: 'Nieuw Contact',
              description: 'Contact aanmaken functionaliteit wordt geïmplementeerd.',
            })
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nieuw Contact
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken op naam, bedrijf of functie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/30 border-border/30 focus-visible:ring-emerald-500/20"
            />
          </div>

          {/* Bedrijf Filter */}
          <Select value={bedrijfFilter} onValueChange={setBedrijfFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-background/30 border-border/30">
              <SelectValue placeholder="Bedrijf" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Bedrijven</SelectItem>
              {bedrijven.map((bedrijf) => (
                <SelectItem key={bedrijf} value={bedrijf}>
                  {bedrijf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Functie Filter */}
          <Select value={functieFilter} onValueChange={setFunctieFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-background/30 border-border/30">
              <SelectValue placeholder="Functie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Functies</SelectItem>
              {functies.map((functie) => (
                <SelectItem key={functie} value={functie}>
                  {functie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredData.map((contact) => (
          <div
            key={contact.id}
            className="group bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-5 hover:shadow-xl hover:bg-card/75 hover:border-border/50 transition-[background-color,box-shadow,border-color] duration-300 cursor-pointer"
            onClick={() => {
              toast({
                title: 'Contact Geselecteerd',
                description: `Contact ${contact.naam} geselecteerd.`,
              })
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                  <AvatarFallback className={cn('font-semibold text-white bg-gradient-to-br', getAvatarGradient(contact.naam))}>
                    {getInitials(contact.naam)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-emerald-500 transition-colors">
                    {contact.naam}
                  </h3>
                  <p className="text-sm text-muted-foreground">{contact.functie}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-foreground/80"
                    onClick={() => {
                      toast({
                        title: 'Contact Details',
                        description: `Details van ${contact.naam} worden getoond.`,
                      })
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Bekijken
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-foreground/80"
                    onClick={() => {
                      toast({
                        title: 'Contact Bewerken',
                        description: `${contact.naam} wordt bewerkt.`,
                      })
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Bewerken
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => {
                      toast({
                        title: 'Contact Verwijderen',
                        description: `${contact.naam} wordt verwijderd.`,
                        variant: 'destructive',
                      })
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Verwijderen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Company */}
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{contact.bedrijf}</span>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href={`mailto:${contact.email}`} className="text-sm hover:text-emerald-600 transition-colors">
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a href={`tel:${contact.telefoon}`} className="text-sm hover:text-emerald-600 transition-colors">
                  {contact.telefoon}
                </a>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={cn('text-xs font-medium', tagColors[tag] || 'bg-muted text-muted-foreground border-border/30')}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground/80">Geen contacten gevonden</h3>
          <p className="text-muted-foreground text-sm">Probeer een andere zoekopdracht of filters</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Totaal Contacten', value: contactenData.length, color: 'from-blue-500 to-purple-500' },
          { label: 'Decision Makers', value: contactenData.filter((c) => c.tags.includes('Decision Maker')).length, color: 'from-purple-500 to-pink-500' },
          { label: 'Warm Leads', value: contactenData.filter((c) => c.tags.includes('Warm Lead')).length, color: 'from-emerald-500 to-teal-500' },
          { label: 'Unieke Bedrijven', value: new Set(contactenData.map((c) => c.bedrijf)).size, color: 'from-amber-500 to-orange-500' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-xl p-4 hover:bg-card/75 hover:shadow-lg transition-[background-color,box-shadow] duration-300"
          >
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className={cn('text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent', stat.color)}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
