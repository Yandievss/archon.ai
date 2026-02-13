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
import { useRecords } from '@/hooks/use-supabase'
import AddContactModal from '@/components/modals/AddContactModal'
import { PageEmptyState, PageInlineError, PagePanel, PageSkeletonGrid } from '@/components/dashboard/PageStates'
import { useDashboardQueryText } from '@/hooks/use-dashboard-query-state'

// Types
interface Contact {
  id: number
  voornaam: string
  achternaam: string
  functie: string | null
  bedrijf: string | null
  email: string | null
  telefoon: string | null
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
    'from-rose-500 to-pink-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-purple-500',
    'from-green-500 to-emerald-500',
  ]
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

export default function ContactenPage() {
  const [searchQuery, setSearchQuery] = useDashboardQueryText('contacten_q')
  const [bedrijfFilter, setBedrijfFilter] = useDashboardQueryText('contacten_bedrijf', 'all')
  const [functieFilter, setFunctieFilter] = useDashboardQueryText('contacten_functie', 'all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Load contacts from Supabase
  const { data: contactenData, loading, error, refetch } = useRecords<Contact>('contacten', refreshKey)

  // Handle modal open/close
  const handleNewContact = () => setIsModalOpen(true)

  // Handle successful contact creation
  const handleContactCreated = () => {
    setRefreshKey(prev => prev + 1) // Refresh data
    toast({
      title: 'Succes',
      description: 'Contact is succesvol toegevoegd.',
    })
  }

  // Combine first and last name
  const getNaam = (contact: Contact) => {
    return `${contact.voornaam} ${contact.achternaam}`.trim()
  }

  // Get fallback values for optional fields
  const getFallbackValue = (value: string | null, fallback: string) => {
    return value || fallback
  }

  // Get unique values for filters
  const bedrijven = [...new Set(contactenData.filter(c => c.bedrijf).map((c) => c.bedrijf!))]
  const functies = [...new Set(contactenData.filter(c => c.functie).map((c) => c.functie!))]
  const safeBedrijfFilter = bedrijfFilter === 'all' || bedrijven.includes(bedrijfFilter) ? bedrijfFilter : 'all'
  const safeFunctieFilter = functieFilter === 'all' || functies.includes(functieFilter) ? functieFilter : 'all'

  // Filter data
  const filteredData = contactenData.filter((contact) => {
    const naam = getNaam(contact)
    const bedrijf = getFallbackValue(contact.bedrijf, '')
    const functie = getFallbackValue(contact.functie, '')
    const email = getFallbackValue(contact.email, '')
    
    const matchesSearch =
      naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bedrijf.toLowerCase().includes(searchQuery.toLowerCase()) ||
      functie.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBedrijf = safeBedrijfFilter === 'all' || contact.bedrijf === safeBedrijfFilter
    const matchesFunctie = safeFunctieFilter === 'all' || contact.functie === safeFunctieFilter
    return matchesSearch && matchesBedrijf && matchesFunctie
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-emerald-500/20 to-teal-500/20">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            Contacten
          </h1>
          <p className="text-muted-foreground mt-1">Beheer uw contactpersonen</p>
        </div>
        <Button
          className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
          onClick={handleNewContact}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nieuw Contact
        </Button>
      </div>

      {/* Filters */}
      <PagePanel className="p-4">
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
          <Select value={safeBedrijfFilter} onValueChange={setBedrijfFilter}>
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
          <Select value={safeFunctieFilter} onValueChange={setFunctieFilter}>
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
      </PagePanel>

      {/* Loading State */}
      {loading && (
        <PageSkeletonGrid />
      )}

      {/* Error State */}
      {error && (
        <PageInlineError
          title="Contacten konden niet geladen worden"
          description={error}
          onRetry={() => void refetch()}
        />
      )}

      {/* Cards Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
          {filteredData.map((contact) => {
            const naam = getNaam(contact)
            return (
              <div
                key={contact.id}
                className="group h-full min-h-60 bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-5 hover:shadow-xl hover:bg-card/75 hover:border-border/50 transition-[background-color,box-shadow,border-color] duration-300 cursor-pointer flex flex-col"
                onClick={() => {
                  toast({
                    title: 'Contact Geselecteerd',
                    description: `Contact ${naam} geselecteerd.`,
                  })
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                      <AvatarFallback className={cn('font-semibold text-white bg-linear-to-br', getAvatarGradient(naam))}>
                        {getInitials(naam)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-emerald-500 transition-colors">
                        {naam}
                      </h3>
                      <p className="text-sm text-muted-foreground">{getFallbackValue(contact.functie, 'Geen functie')}</p>
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
                            description: `Details van ${naam} worden getoond.`,
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
                            description: `${naam} wordt bewerkt.`,
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
                            description: `${naam} wordt verwijderd.`,
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
                {contact.bedrijf && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{contact.bedrijf}</span>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-2 mb-4 flex-1">
                  {contact.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${contact.email}`} className="text-sm hover:text-emerald-600 transition-colors">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.telefoon && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${contact.telefoon}`} className="text-sm hover:text-emerald-600 transition-colors">
                        {contact.telefoon}
                      </a>
                    </div>
                  )}
                  {!contact.email && !contact.telefoon && (
                    <p className="text-sm text-muted-foreground italic">Geen contactgegevens</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* No results */}
      {!loading && !error && filteredData.length === 0 && (
        <PageEmptyState
          icon={Users}
          title="Geen contacten gevonden"
          description="Probeer een andere zoekopdracht of wis de filters."
          actionLabel="Filters wissen"
          onAction={() => {
            setSearchQuery('')
            setBedrijfFilter('all')
            setFunctieFilter('all')
          }}
        />
      )}

      {/* Add Contact Modal */}
      <AddContactModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleContactCreated}
      />

      {/* Stats */}
      {!loading && !error && contactenData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Totaal Contacten', value: contactenData.length, color: 'from-blue-500 to-purple-500' },
            { label: 'Met Bedrijf', value: contactenData.filter((c) => c.bedrijf).length, color: 'from-purple-500 to-pink-500' },
            { label: 'Met Email', value: contactenData.filter((c) => c.email).length, color: 'from-emerald-500 to-teal-500' },
            { label: 'Unieke Bedrijven', value: new Set(contactenData.filter(c => c.bedrijf).map((c) => c.bedrijf!)).size, color: 'from-amber-500 to-orange-500' },
          ].map((stat) => (
            <PagePanel
              key={stat.label}
              className="rounded-xl p-4 hover:bg-card/75 hover:shadow-lg transition-[background-color,box-shadow]"
            >
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={cn('text-2xl font-bold bg-linear-to-r bg-clip-text text-transparent', stat.color)}>
                {stat.value}
              </p>
            </PagePanel>
          ))}
        </div>
      )}
    </div>
  )
}
