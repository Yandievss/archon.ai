'use client'

import { useState } from 'react'
import {
  Briefcase,
  Plus,
  TrendingUp,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

// Types
interface Deal {
  id: number
  naam: string
  bedrijf: string
  waarde: number
  prioriteit: 'hoog' | 'medium' | 'laag'
  kans: number
}

interface DealsByStatus {
  nieuw: Deal[]
  contact: Deal[]
  offerte: Deal[]
  onderhandeling: Deal[]
  gewonnen: Deal[]
}

// Sample Data
const initialDeals: DealsByStatus = {
  nieuw: [
    { id: 1, naam: 'Website Redesign', bedrijf: 'ACME BV', waarde: 25000, prioriteit: 'hoog', kans: 20 },
    { id: 2, naam: 'App Development', bedrijf: 'TechStart NV', waarde: 45000, prioriteit: 'medium', kans: 15 },
    { id: 3, naam: 'SEO Optimalisatie', bedrijf: 'Media Plus', waarde: 8500, prioriteit: 'laag', kans: 10 },
  ],
  contact: [
    { id: 4, naam: 'Cloud Migration', bedrijf: 'Global Solutions', waarde: 35000, prioriteit: 'hoog', kans: 40 },
    { id: 5, naam: 'Security Audit', bedrijf: 'Green Energy', waarde: 18000, prioriteit: 'laag', kans: 35 },
    { id: 6, naam: 'Data-analyse traject', bedrijf: 'Finance Hub', waarde: 42000, prioriteit: 'medium', kans: 45 },
    { id: 7, naam: 'Mobile App MVP', bedrijf: 'HealthTech NL', waarde: 55000, prioriteit: 'hoog', kans: 30 },
  ],
  offerte: [
    { id: 8, naam: 'ERP Implementatie', bedrijf: 'ACME BV', waarde: 85000, prioriteit: 'hoog', kans: 60 },
    { id: 9, naam: 'Marketing Automation', bedrijf: 'LogiStream BV', waarde: 28000, prioriteit: 'medium', kans: 55 },
  ],
  onderhandeling: [
    { id: 10, naam: 'Consulting Traject', bedrijf: 'Media Plus', waarde: 32000, prioriteit: 'medium', kans: 75 },
    { id: 11, naam: 'Software Licenties', bedrijf: 'Green Energy', waarde: 48000, prioriteit: 'hoog', kans: 80 },
    { id: 12, naam: 'Support Contract', bedrijf: 'TechStart NV', waarde: 18000, prioriteit: 'laag', kans: 70 },
  ],
  gewonnen: [
    { id: 13, naam: 'Maintenance Contract', bedrijf: 'Green Energy', waarde: 15000, prioriteit: 'laag', kans: 100 },
    { id: 14, naam: 'E-commerce Platform', bedrijf: 'ACME BV', waarde: 92000, prioriteit: 'hoog', kans: 100 },
  ],
}

// Column configuration
const columns = [
  { key: 'nieuw' as const, label: 'NIEUW', color: 'bg-blue-500', gradient: 'from-blue-500/10 to-blue-600/5' },
  { key: 'contact' as const, label: 'CONTACT', color: 'bg-amber-500', gradient: 'from-amber-500/10 to-amber-600/5' },
  { key: 'offerte' as const, label: 'OFFERTE', color: 'bg-indigo-500', gradient: 'from-indigo-500/10 to-indigo-600/5' },
  { key: 'onderhandeling' as const, label: 'ONDERH.', color: 'bg-cyan-500', gradient: 'from-cyan-500/10 to-cyan-600/5' },
  { key: 'gewonnen' as const, label: 'GEWONNEN', color: 'bg-emerald-500', gradient: 'from-emerald-500/10 to-emerald-600/5' },
]

// Priority Badge
function PriorityBadge({ priority }: { priority: Deal['prioriteit'] }) {
  const styles = {
    hoog: 'bg-red-500/10 text-red-600 border-red-500/20',
    medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    laag: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  }
  const labels = { hoog: 'Hoog', medium: 'Medium', laag: 'Laag' }
  const dots = { hoog: 'bg-red-500', medium: 'bg-amber-500', laag: 'bg-emerald-500' }

  return (
    <span className={cn('text-xs px-2 py-0.5 rounded-full border flex items-center gap-1', styles[priority])}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dots[priority])} />
      {labels[priority]}
    </span>
  )
}

// Deal Card Component – geen entrance-animatie zodat vakken niet bewegen bij paginawissel
function DealCard({ deal }: { deal: Deal }) {
  return (
    <div
      className="group bg-card/60 backdrop-blur-xl border border-border/30 rounded-xl p-4 hover:bg-card/75 hover:shadow-lg hover:border-border/50 transition-[background-color,box-shadow,border-color] duration-200 cursor-grab active:cursor-grabbing"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-foreground group-hover:text-blue-500 transition-colors">
            {deal.naam}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
            <Building2 className="w-3.5 h-3.5" />
            <span className="text-sm">{deal.bedrijf}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                toast({
                  title: 'Deal Bewerken',
                  description: `${deal.naam} wordt bewerkt.`,
                })
              }}
            >
              Bewerken
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toast({
                  title: 'Deal Kopiëren',
                  description: `${deal.naam} wordt gekopieerd.`,
                })
              }}
            >
              Kopiëren
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                toast({
                  title: 'Deal Verwijderen',
                  description: `${deal.naam} wordt verwijderd.`,
                  variant: 'destructive',
                })
              }}
            >
              Verwijderen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Value */}
      <div className="mb-3">
        <span className="text-lg font-bold text-foreground">
          €{deal.waarde.toLocaleString('nl-NL')}
        </span>
      </div>

      {/* Progress */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Winskans</span>
          <span className={cn(
            'font-medium',
            deal.kans >= 70 ? 'text-emerald-600' : deal.kans >= 40 ? 'text-amber-600' : 'text-muted-foreground'
          )}>
            {deal.kans}%
          </span>
        </div>
        <Progress
          value={deal.kans}
          className="h-1.5"
        />
      </div>

      {/* Priority */}
      <PriorityBadge priority={deal.prioriteit} />
    </div>
  )
}

export default function DealsPage() {
  const [deals] = useState(initialDeals)

  // Calculate totals
  const totalDeals = Object.values(deals).flat().length
  const totalValue = Object.values(deals).flat().reduce((sum, deal) => sum + deal.waarde, 0)
  const wonDeals = deals.gewonnen
  const wonValue = wonDeals.reduce((sum, deal) => sum + deal.waarde, 0)

  return (
    <div className="space-y-6">
      {/* Header – geen animatie bij paginawissel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-sky-500/10">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            Deals
          </h1>
          <p className="text-muted-foreground mt-1">Beheer uw verkoopkansen</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Total Value Card */}
          <div className="hidden sm:flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/50 rounded-xl px-4 py-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-xs text-emerald-600 font-medium">Totaal Pipeline</p>
              <p className="text-lg font-bold text-emerald-700">€{totalValue.toLocaleString('nl-NL')}</p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white shadow-lg shadow-blue-500/25"
            onClick={() => {
              toast({
                title: 'Nieuwe Deal',
                description: 'Deal aanmaken functionaliteit wordt geïmplementeerd.',
              })
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe Deal
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Totaal Deals', value: totalDeals, icon: Briefcase, color: 'from-blue-500 to-sky-500' },
          { label: 'Pipeline Waarde', value: `€${(totalValue / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
          { label: 'Gewonnen', value: wonDeals.length, icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
          { label: 'Gewonnen Waarde', value: `€${(wonValue / 1000).toFixed(0)}K`, icon: Calendar, color: 'from-amber-500 to-orange-500' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-xl p-4 flex items-center gap-3"
          >
            <div className={cn('p-2 rounded-lg bg-gradient-to-br', stat.color)}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={cn('text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent', stat.color)}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnDeals = deals[column.key]
          const columnValue = columnDeals.reduce((sum, deal) => sum + deal.waarde, 0)

          return (
            <div
              key={column.key}
              className="flex-shrink-0 w-72 sm:w-80"
            >
              {/* Column Header */}
              <div className={cn(
                'flex items-center justify-between p-3 rounded-t-xl bg-gradient-to-r border border-border/30',
                column.gradient
              )}>
                <div className="flex items-center gap-2">
                  <span className={cn('w-2 h-2 rounded-full', column.color)} />
                  <span className="font-semibold text-foreground/80 text-sm">{column.label}</span>
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs font-medium">
                    {columnDeals.length}
                  </Badge>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  €{columnValue.toLocaleString('nl-NL')}
                </span>
              </div>

              {/* Column Content */}
              <div className={cn(
                'bg-card/40 border border-t-0 border-border/30 rounded-b-xl p-3 space-y-3',
                'min-h-[200px] max-h-[calc(100vh-380px)] overflow-y-auto custom-scrollbar'
              )}>
                {columnDeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mb-2" />
                    <p className="text-sm">Geen deals</p>
                  </div>
                ) : (
                  columnDeals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))
                )}

                {/* Add Deal Button */}
                <button
                  className="w-full p-3 border-2 border-dashed border-border/30 rounded-xl text-muted-foreground hover:text-foreground hover:border-border/50 hover:bg-card/60 transition-[color,background-color,border-color] duration-200 flex items-center justify-center gap-2 text-sm"
                  onClick={() => {
                    toast({
                      title: 'Deal Toevoegen',
                      description: 'Deal toevoegen functionaliteit wordt geïmplementeerd.',
                    })
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Deal toevoegen
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-4">Snelle Acties</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Nieuwe Deal', icon: Plus, color: 'from-blue-500 to-sky-600' },
            { label: 'Offerte Maken', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
            { label: 'Follow-up', icon: Clock, color: 'from-amber-500 to-orange-500' },
            { label: 'Rapportage', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
          ].map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 border-border/30 hover:border-border/50 hover:bg-card/60"
              onClick={() =>
                toast({
                  title: action.label,
                  description: 'Actie wordt binnenkort gekoppeld.',
                })
              }
            >
              <div className={cn('p-2 rounded-lg bg-gradient-to-br text-white', action.color)}>
                <action.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground/80">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
