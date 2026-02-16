'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Building2,
  Eye,
  FileText,
  Import,
  LayoutGrid,
  LayoutList,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  StickyNote,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react'

import { PageEmptyState, PageInlineError, PageSkeletonGrid } from '@/components/dashboard/PageStates'
import AddContactModal from '@/components/modals/AddContactModal'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDashboardQueryText } from '@/hooks/use-dashboard-query-state'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type ContactStatus = 'lead' | 'klant' | 'leverancier' | 'prospect'

interface Contact {
  id: string
  voornaam: string
  achternaam: string
  functie: string | null
  bedrijf: string | null
  email: string | null
  telefoon: string | null
  status: ContactStatus | null
  notities: string | null
  created_at: string
  updated_at: string
}

const statusConfig: Record<ContactStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; color: string }> = {
  lead: { label: 'Lead', variant: 'secondary', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  klant: { label: 'Klant', variant: 'default', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  leverancier: { label: 'Leverancier', variant: 'outline', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  prospect: { label: 'Prospect', variant: 'secondary', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

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

function StatusBadge({ status }: { status: ContactStatus | null }) {
  if (!status || !statusConfig[status]) return null

  const config = statusConfig[status]
  return (
    <Badge
      variant={config.variant}
      className={cn('text-xs font-medium border', config.color)}
    >
      {config.label}
    </Badge>
  )
}

// TODO: Implementeer volledige functionaliteit - zie issue #123
function DisabledActionButton({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="sm" disabled className="opacity-60">
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Binnenkort beschikbaar</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default function ContactenPage({ autoOpenCreate }: { autoOpenCreate?: boolean }) {
  const [searchQuery, setSearchQuery] = useDashboardQueryText('contacten_q')
  const [bedrijfFilter, setBedrijfFilter] = useDashboardQueryText('contacten_bedrijf', 'all')
  const [functieFilter, setFunctieFilter] = useDashboardQueryText('contacten_functie', 'all')
  const [statusFilter, setStatusFilter] = useDashboardQueryText('contacten_status', 'all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Auto-open create modal when prop is true
  useEffect(() => {
    if (autoOpenCreate && !isModalOpen) {
      setIsModalOpen(true)
    }
  }, [autoOpenCreate])

  // Detail drawer state
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Edit modal state
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Delete dialog state
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Notitie modal state
  const [noteContact, setNoteContact] = useState<Contact | null>(null)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [isSavingNote, setIsSavingNote] = useState(false)

  // Taak modal state
  const [taakContact, setTaakContact] = useState<Contact | null>(null)
  const [isTaakModalOpen, setIsTaakModalOpen] = useState(false)
  const [taakTitel, setTaakTitel] = useState('')
  const [isSavingTaak, setIsSavingTaak] = useState(false)

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/contacts', { cache: 'no-store' })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Kon contacten niet laden.')
      }

      const payload = await response.json()
      setContacts(Array.isArray(payload) ? payload : [])
    } catch (requestError: any) {
      setError(requestError?.message ?? 'Onbekende fout tijdens laden van contacten.')
      setContacts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchContacts()
  }, [fetchContacts, refreshKey])

  const handleNewContact = () => setIsModalOpen(true)

  const handleContactCreated = () => {
    setRefreshKey((current) => current + 1)
    toast({
      title: 'Succes',
      description: 'Contact is succesvol toegevoegd.',
    })
  }

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact)
    setIsDrawerOpen(true)
  }

  const handleEditClick = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingContact(contact)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingContact) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/contacts/${editingContact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingContact),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Bijwerken is mislukt.')
      }

      setContacts((current) =>
        current.map((c) => (c.id === editingContact.id ? editingContact : c))
      )
      toast({
        title: 'Contact bijgewerkt',
        description: `${editingContact.voornaam} ${editingContact.achternaam} is bijgewerkt.`,
      })
      setIsEditModalOpen(false)
      setEditingContact(null)
    } catch (err: any) {
      toast({
        title: 'Bijwerken mislukt',
        description: err?.message ?? 'Kon contact niet bijwerken.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeletingContact(contact)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingContact) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/contacts/${deletingContact.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Verwijderen is mislukt.')
      }

      setContacts((current) => current.filter((c) => c.id !== deletingContact.id))
      toast({
        title: 'Contact verwijderd',
        description: `${deletingContact.voornaam} ${deletingContact.achternaam} is verwijderd.`,
      })
      setIsDeleteDialogOpen(false)
      setDeletingContact(null)
      if (selectedContact?.id === deletingContact.id) {
        setIsDrawerOpen(false)
        setSelectedContact(null)
      }
    } catch (err: any) {
      toast({
        title: 'Verwijderen mislukt',
        description: err?.message ?? 'Kon contact niet verwijderen.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleNoteClick = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation()
    setNoteContact(contact)
    setNoteText(contact.notities ?? '')
    setIsNoteModalOpen(true)
  }

  const handleSaveNote = async () => {
    if (!noteContact) return

    setIsSavingNote(true)
    try {
      const response = await fetch(`/api/contacts/${noteContact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notities: noteText }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Notitie opslaan mislukt.')
      }

      setContacts((current) =>
        current.map((c) => (c.id === noteContact.id ? { ...c, notities: noteText } : c))
      )
      toast({
        title: 'Notitie opgeslagen',
        description: `Notitie voor ${noteContact.voornaam} ${noteContact.achternaam} is opgeslagen.`,
      })
      setIsNoteModalOpen(false)
      setNoteContact(null)
      setNoteText('')
    } catch (err: any) {
      toast({
        title: 'Opslaan mislukt',
        description: err?.message ?? 'Kon notitie niet opslaan.',
        variant: 'destructive',
      })
    } finally {
      setIsSavingNote(false)
    }
  }

  const handleTaakClick = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation()
    setTaakContact(contact)
    setTaakTitel('')
    setIsTaakModalOpen(true)
  }

  const handleSaveTaak = async () => {
    if (!taakContact || !taakTitel.trim()) return

    setIsSavingTaak(true)
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titel: taakTitel,
          contact_id: taakContact.id,
          status: 'open',
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Taak aanmaken mislukt.')
      }

      toast({
        title: 'Taak aangemaakt',
        description: `Taak "${taakTitel}" voor ${taakContact.voornaam} ${taakContact.achternaam} is aangemaakt.`,
      })
      setIsTaakModalOpen(false)
      setTaakContact(null)
      setTaakTitel('')
    } catch (err: any) {
      toast({
        title: 'Aanmaken mislukt',
        description: err?.message ?? 'Kon taak niet aanmaken.',
        variant: 'destructive',
      })
    } finally {
      setIsSavingTaak(false)
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setBedrijfFilter('all')
    setFunctieFilter('all')
    setStatusFilter('all')
  }

  const hasActiveFilters =
    searchQuery || bedrijfFilter !== 'all' || functieFilter !== 'all' || statusFilter !== 'all'

  const getNaam = (contact: Contact) => `${contact.voornaam} ${contact.achternaam}`.trim()

  const bedrijven = useMemo(
    () => [...new Set(contacts.filter((item) => item.bedrijf).map((item) => item.bedrijf!))],
    [contacts]
  )
  const functies = useMemo(
    () => [...new Set(contacts.filter((item) => item.functie).map((item) => item.functie!))],
    [contacts]
  )
  const statuses = useMemo(
    () => [...new Set(contacts.filter((item) => item.status).map((item) => item.status!))],
    [contacts]
  )

  const safeBedrijfFilter = bedrijfFilter === 'all' || bedrijven.includes(bedrijfFilter)
    ? bedrijfFilter
    : 'all'
  const safeFunctieFilter = functieFilter === 'all' || functies.includes(functieFilter)
    ? functieFilter
    : 'all'
  const safeStatusFilter = statusFilter === 'all' || statuses.includes(statusFilter as ContactStatus)
    ? statusFilter
    : 'all'

  const filteredData = useMemo(() => {
    const loweredSearch = searchQuery.toLowerCase()

    return contacts.filter((contact) => {
      const naam = getNaam(contact)
      const bedrijf = contact.bedrijf ?? ''
      const functie = contact.functie ?? ''
      const email = contact.email ?? ''

      const matchesSearch =
        naam.toLowerCase().includes(loweredSearch) ||
        bedrijf.toLowerCase().includes(loweredSearch) ||
        functie.toLowerCase().includes(loweredSearch) ||
        email.toLowerCase().includes(loweredSearch)

      const matchesBedrijf = safeBedrijfFilter === 'all' || contact.bedrijf === safeBedrijfFilter
      const matchesFunctie = safeFunctieFilter === 'all' || contact.functie === safeFunctieFilter
      const matchesStatus = safeStatusFilter === 'all' || contact.status === safeStatusFilter

      return matchesSearch && matchesBedrijf && matchesFunctie && matchesStatus
    })
  }, [contacts, safeBedrijfFilter, safeFunctieFilter, safeStatusFilter, searchQuery])

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header met titel en actieknoppen */}
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
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-muted/50 rounded-lg border border-border/50 mr-2">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
            <DisabledActionButton icon={Upload} label="Import" />
            <DisabledActionButton icon={Import} label="Export" />
            <Button
              className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
              onClick={handleNewContact}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nieuw Contact
            </Button>
          </div>
        </div>

        {/* Zoek en filters */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Zoeken op naam, bedrijf of functie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/30 border-border/30 focus-visible:ring-emerald-500/20"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={safeBedrijfFilter}
                onChange={(e) => setBedrijfFilter(e.target.value)}
                className="h-10 px-3 rounded-md bg-background/30 border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">Alle bedrijven</option>
                {bedrijven.map((bedrijf) => (
                  <option key={bedrijf} value={bedrijf}>
                    {bedrijf}
                  </option>
                ))}
              </select>

              <select
                value={safeFunctieFilter}
                onChange={(e) => setFunctieFilter(e.target.value)}
                className="h-10 px-3 rounded-md bg-background/30 border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">Alle functies</option>
                {functies.map((functie) => (
                  <option key={functie} value={functie}>
                    {functie}
                  </option>
                ))}
              </select>

              <select
                value={safeStatusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-md bg-background/30 border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">Alle statussen</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {statusConfig[status as ContactStatus]?.label ?? status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Actieve filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Zoek: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {safeBedrijfFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {safeBedrijfFilter}
                  <button onClick={() => setBedrijfFilter('all')} className="hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {safeFunctieFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {safeFunctieFilter}
                  <button onClick={() => setFunctieFilter('all')} className="hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {safeStatusFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {statusConfig[safeStatusFilter as ContactStatus]?.label ?? safeStatusFilter}
                  <button onClick={() => setStatusFilter('all')} className="hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                Alles wissen
              </Button>
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && <PageSkeletonGrid />}

        {/* Error state */}
        {error && !loading && (
          <PageInlineError
            title="Contacten konden niet geladen worden"
            description={error}
            onRetry={() => void fetchContacts()}
          />
        )}

        {/* Contact grid */}
        {!loading && !error && (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
              {filteredData.map((contact) => {
                const naam = getNaam(contact)

                return (
                  <div
                    key={contact.id}
                    className="group h-full min-h-60 bg-card/80 backdrop-blur-xl border border-border/40 rounded-2xl p-5 hover:shadow-xl hover:bg-card hover:border-emerald-500/30 transition-all duration-300 cursor-pointer flex flex-col"
                    onClick={() => handleContactClick(contact)}
                  >
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
                          <p className="text-sm text-muted-foreground">{contact.functie || 'Geen functie'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <StatusBadge status={contact.status} />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => handleContactClick(contact)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Bekijken
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleEditClick(contact, e as React.MouseEvent)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Bewerken
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleNoteClick(contact, e as React.MouseEvent)}>
                              <StickyNote className="w-4 h-4 mr-2" />
                              Notitie
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleTaakClick(contact, e as React.MouseEvent)}>
                              <FileText className="w-4 h-4 mr-2" />
                              Taak
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => handleDeleteClick(contact, e as React.MouseEvent)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Verwijderen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {contact.bedrijf && (
                      <div className="flex items-center gap-2 text-muted-foreground mb-3">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{contact.bedrijf}</span>
                      </div>
                    )}

                    <div className="space-y-2 mb-4 flex-1">
                      {contact.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={`mailto:${contact.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm hover:text-emerald-600 transition-colors"
                          >
                            {contact.email}
                          </a>
                        </div>
                      )}

                      {contact.telefoon && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={`tel:${contact.telefoon}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm hover:text-emerald-600 transition-colors"
                          >
                            {contact.telefoon}
                          </a>
                        </div>
                      )}

                      {!contact.email && !contact.telefoon && (
                        <p className="text-sm text-muted-foreground italic">Geen contactgegevens</p>
                      )}
                    </div>

                    {contact.notities && (
                      <div className="mt-auto pt-3 border-t border-border/30">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          <StickyNote className="w-3 h-3 inline mr-1" />
                          {contact.notities}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[300px]">Naam</TableHead>
                    <TableHead>Bedrijf</TableHead>
                    <TableHead>Functie</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefoon</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((contact) => {
                    const naam = getNaam(contact)
                    return (
                      <TableRow
                        key={contact.id}
                        className="hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => handleContactClick(contact)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-white/10 shadow-sm">
                              <AvatarFallback className={cn('text-xs font-semibold text-white bg-linear-to-br', getAvatarGradient(naam))}>
                                {getInitials(naam)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{naam}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {contact.bedrijf ? (
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                              <span>{contact.bedrijf}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{contact.functie || <span className="text-muted-foreground">-</span>}</TableCell>
                        <TableCell>
                          {contact.email ? (
                            <a
                              href={`mailto:${contact.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-emerald-600 transition-colors"
                            >
                              {contact.email}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {contact.telefoon ? (
                            <a
                              href={`tel:${contact.telefoon}`}
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-emerald-600 transition-colors"
                            >
                              {contact.telefoon}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={contact.status} />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => handleContactClick(contact)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Bekijken
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleEditClick(contact, e as React.MouseEvent)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Bewerken
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleNoteClick(contact, e as React.MouseEvent)}>
                                <StickyNote className="w-4 h-4 mr-2" />
                                Notitie
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleTaakClick(contact, e as React.MouseEvent)}>
                                <FileText className="w-4 h-4 mr-2" />
                                Taak
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => handleDeleteClick(contact, e as React.MouseEvent)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Verwijderen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )
        )}

        {/* Empty state */}
        {!loading && !error && filteredData.length === 0 && (
          <PageEmptyState
            icon={Users}
            title="Geen contacten gevonden"
            description="Probeer een andere zoekopdracht of wis de filters."
            actionLabel={hasActiveFilters ? 'Filters wissen' : 'Contact toevoegen'}
            onAction={hasActiveFilters ? clearFilters : handleNewContact}
          />
        )}

        {/* Add Contact Modal */}
        <AddContactModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={handleContactCreated}
        />

        {/* Contact Detail Drawer */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Contact Details</SheetTitle>
              <SheetDescription>
                Bekijk en beheer de details van dit contact.
              </SheetDescription>
            </SheetHeader>
            {selectedContact && (
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                    <AvatarFallback
                      className={cn(
                        'font-semibold text-white bg-linear-to-br',
                        getAvatarGradient(getNaam(selectedContact))
                      )}
                    >
                      {getInitials(getNaam(selectedContact))}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{getNaam(selectedContact)}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={selectedContact.status} />
                      {selectedContact.functie && (
                        <span className="text-sm text-muted-foreground">{selectedContact.functie}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedContact.bedrijf && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Bedrijf</p>
                        <p className="text-sm text-muted-foreground">{selectedContact.bedrijf}</p>
                      </div>
                    </div>
                  )}

                  {selectedContact.email && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <a href={`mailto:${selectedContact.email}`} className="text-sm text-emerald-600 hover:underline">
                          {selectedContact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedContact.telefoon && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Telefoon</p>
                        <a href={`tel:${selectedContact.telefoon}`} className="text-sm text-emerald-600 hover:underline">
                          {selectedContact.telefoon}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {selectedContact.notities && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100 flex items-center gap-2">
                      <StickyNote className="w-4 h-4" />
                      Notities
                    </p>
                    <p className="mt-2 text-sm text-amber-800 dark:text-amber-200 whitespace-pre-wrap">
                      {selectedContact.notities}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Aangemaakt: {new Date(selectedContact.created_at).toLocaleDateString('nl-NL')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Laatst bijgewerkt: {new Date(selectedContact.updated_at).toLocaleDateString('nl-NL')}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsDrawerOpen(false)
                      setEditingContact(selectedContact)
                      setIsEditModalOpen(true)
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Bewerken
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsDrawerOpen(false)
                      setDeletingContact(selectedContact)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Verwijderen
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Edit Contact Dialog */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Bewerken</DialogTitle>
              <DialogDescription>
                Bewerk de gegevens van dit contact.
              </DialogDescription>
            </DialogHeader>
            {editingContact && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Voornaam</label>
                    <Input
                      value={editingContact.voornaam}
                      onChange={(e) =>
                        setEditingContact({ ...editingContact, voornaam: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Achternaam</label>
                    <Input
                      value={editingContact.achternaam}
                      onChange={(e) =>
                        setEditingContact({ ...editingContact, achternaam: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Functie</label>
                  <Input
                    value={editingContact.functie ?? ''}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, functie: e.target.value || null })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bedrijf</label>
                  <Input
                    value={editingContact.bedrijf ?? ''}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, bedrijf: e.target.value || null })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={editingContact.email ?? ''}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, email: e.target.value || null })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefoon</label>
                  <Input
                    type="tel"
                    value={editingContact.telefoon ?? ''}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, telefoon: e.target.value || null })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={editingContact.status ?? ''}
                    onChange={(e) =>
                      setEditingContact({
                        ...editingContact,
                        status: (e.target.value as ContactStatus) || null,
                      })
                    }
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">Geen status</option>
                    <option value="lead">Lead</option>
                    <option value="prospect">Prospect</option>
                    <option value="klant">Klant</option>
                    <option value="leverancier">Leverancier</option>
                  </select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Annuleren
              </Button>
              <Button onClick={handleSaveEdit} disabled={isSaving}>
                {isSaving ? 'Opslaan...' : 'Opslaan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Verwijderen</DialogTitle>
              <DialogDescription>
                Weet u zeker dat u <strong>{deletingContact?.voornaam} {deletingContact?.achternaam}</strong> wilt verwijderen?
                Deze actie kan niet ongedaan worden gemaakt.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuleren
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
                {isDeleting ? 'Verwijderen...' : 'Verwijderen'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Note Dialog */}
        <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notitie Toevoegen</DialogTitle>
              <DialogDescription>
                Voeg een notitie toe voor {noteContact?.voornaam} {noteContact?.achternaam}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Typ uw notitie hier..."
                className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNoteModalOpen(false)}>
                Annuleren
              </Button>
              <Button onClick={handleSaveNote} disabled={isSavingNote || !noteText.trim()}>
                {isSavingNote ? 'Opslaan...' : 'Opslaan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Task Dialog */}
        <Dialog open={isTaakModalOpen} onOpenChange={setIsTaakModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Taak Aanmaken</DialogTitle>
              <DialogDescription>
                Maak een nieuwe taak aan voor {taakContact?.voornaam} {taakContact?.achternaam}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Taak titel</label>
                <Input
                  value={taakTitel}
                  onChange={(e) => setTaakTitel(e.target.value)}
                  placeholder="Bijv. Bel terug voor offerte"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTaakModalOpen(false)}>
                Annuleren
              </Button>
              <Button onClick={handleSaveTaak} disabled={isSavingTaak || !taakTitel.trim()}>
                {isSavingTaak ? 'Aanmaken...' : 'Taak Aanmaken'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
