'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar,
  Wallet,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Download,
  Filter,
  Eye,
  CreditCard,
  Building2,
  Euro,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Sample Data
const betalingenStats = {
  teOntvangen: 28400,
  teBetalen: 8200,
  vandaagVervallen: 2500,
  dezeWeek: 12300,
}

const teOntvangenBetalingen = [
  { id: 1, factuurNr: "2025-001", bedrijf: "ACME BV", bedrag: 8500, vervaldatum: "15 Feb 2025", status: "Openstaand", dagenOver: 3 },
  { id: 2, factuurNr: "2025-002", bedrijf: "Global Solutions", bedrag: 4200, vervaldatum: "12 Feb 2025", status: "Vervallen", dagenOver: -1 },
  { id: 3, factuurNr: "2025-003", bedrijf: "TechStart NV", bedrag: 12000, vervaldatum: "20 Feb 2025", status: "Openstaand", dagenOver: 8 },
  { id: 4, factuurNr: "2025-004", bedrijf: "DigitalPro", bedrag: 3700, vervaldatum: "22 Feb 2025", status: "Openstaand", dagenOver: 10 },
  { id: 5, factuurNr: "2025-005", bedrijf: "WebCraft BV", bedrag: 5200, vervaldatum: "25 Feb 2025", status: "Openstaand", dagenOver: 13 },
]

const teBetalenBetalingen = [
  { id: 1, factuurNr: "INV-8821", leverancier: "AWS", bedrag: 1250, vervaldatum: "14 Feb 2025", status: "Openstaand", dagenOver: 2 },
  { id: 2, factuurNr: "INV-8832", leverancier: "Google Ads", bedrag: 3500, vervaldatum: "18 Feb 2025", status: "Openstaand", dagenOver: 6 },
  { id: 3, factuurNr: "INV-8845", leverancier: "Microsoft", bedrag: 890, vervaldatum: "20 Feb 2025", status: "Openstaand", dagenOver: 8 },
  { id: 4, factuurNr: "INV-8856", leverancier: "Slack", bedrag: 450, vervaldatum: "22 Feb 2025", status: "Openstaand", dagenOver: 10 },
]

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Betaald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Openstaand: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Vervallen: "bg-red-500/10 text-red-600 border-red-500/20",
  }

  return (
    <span className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", styles[status])}>
      {status}
    </span>
  )
}

// Days Left Badge
function DaysLeftBadge({ dagenOver }: { dagenOver: number }) {
  if (dagenOver < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-500/10 px-2 py-1 rounded-full">
        <AlertTriangle className="w-3 h-3" />
        {Math.abs(dagenOver)} dag(en) te laat
      </span>
    )
  } else if (dagenOver <= 3) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-500/10 px-2 py-1 rounded-full">
        <Clock className="w-3 h-3" />
        {dagenOver} dag(en)
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
      <Clock className="w-3 h-3" />
      {dagenOver} dag(en)
    </span>
  )
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  gradient,
  alert = false
}: { 
  title: string
  value: number
  icon: React.ElementType
  color: string
  gradient: string
  alert?: boolean
}) {
  return (
    <div className="group relative">
      <div className={cn(
        "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        gradient
      )} />
      <div className={cn(
        "relative bg-card/60 backdrop-blur-xl border rounded-2xl p-5 hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300",
        alert ? "border-red-500/20 hover:shadow-red-500/10" : "border-border/30"
      )}>
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-3 rounded-xl shadow-lg", `bg-gradient-to-br ${gradient}`)}>
            <Icon className="w-5 h-5" style={{ color: color }} />
          </div>
          {alert && (
            <div className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full bg-red-500/10 text-red-600 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">€{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

// Payment Card Component
function PaymentCard({ 
  item, 
  type 
}: { 
  item: typeof teOntvangenBetalingen[0] | typeof teBetalenBetalingen[0]
  type: 'in' | 'out'
  index: number
}) {
  const isTeOntvangen = type === 'in'
  const bedrijf = isTeOntvangen ? (item as typeof teOntvangenBetalingen[0]).bedrijf : (item as typeof teBetalenBetalingen[0]).leverancier
  
  return (
    <div className="group bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-5 hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-xl",
            isTeOntvangen ? "bg-emerald-500/10" : "bg-red-500/10"
          )}>
            {isTeOntvangen ? (
              <ArrowDownRight className="w-5 h-5 text-emerald-600" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground">{bedrijf}</p>
            <p className="text-sm text-muted-foreground">Factuur #{item.factuurNr}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn(
            "text-lg font-bold",
            isTeOntvangen ? "text-emerald-600" : "text-red-600"
          )}>
            {isTeOntvangen ? '+' : '-'}€{item.bedrag.toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          Vervalt: {item.vervaldatum}
        </div>
        <DaysLeftBadge dagenOver={item.dagenOver} />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <StatusBadge status={item.status} />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs bg-card/60 hover:bg-card/75 border-border/30"
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            Details
          </Button>
          <Button 
            size="sm" 
            className={cn(
              "h-8 text-xs text-white shadow-lg transition-all duration-200",
              isTeOntvangen 
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/25"
                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25"
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            {isTeOntvangen ? 'Markeer betaald' : 'Betaal nu'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function BetalingenPage() {
  const [activeTab, setActiveTab] = useState('te-ontvangen')
  const [statusFilter, setStatusFilter] = useState('alle')
  const [periodeFilter, setPeriodeFilter] = useState('deze-maand')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Betalingen</h1>
          <p className="text-muted-foreground text-sm mt-1">Beheer inkomende en uitgaande betalingen</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-card/60 backdrop-blur-xl border border-border/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="alle">Alle statussen</option>
            <option value="openstaand">Openstaand</option>
            <option value="vervallen">Vervallen</option>
            <option value="betaald">Betaald</option>
          </select>
          
          {/* Periode Filter */}
          <select
            value={periodeFilter}
            onChange={(e) => setPeriodeFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-card/60 backdrop-blur-xl border border-border/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="deze-maand">Deze maand</option>
            <option value="vorige-maand">Vorige maand</option>
            <option value="dit-kwartaal">Dit kwartaal</option>
            <option value="dit-jaar">Dit jaar</option>
          </select>

          <Button variant="outline" className="bg-card/60 backdrop-blur-xl border-border/30 hover:bg-card/75">
            <Download className="w-4 h-4 mr-2" />
            Exporteren
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Te ontvangen"
          value={betalingenStats.teOntvangen}
          icon={ArrowDownRight}
          color="#10b981"
          gradient="from-emerald-500/20 to-emerald-600/10"
        />
        <StatCard
          title="Te betalen"
          value={betalingenStats.teBetalen}
          icon={ArrowUpRight}
          color="#ef4444"
          gradient="from-red-500/20 to-red-600/10"
        />
        <StatCard
          title="Vandaag vervallen"
          value={betalingenStats.vandaagVervallen}
          icon={AlertTriangle}
          color="#f59e0b"
          gradient="from-amber-500/20 to-amber-600/10"
          alert
        />
        <StatCard
          title="Deze week"
          value={betalingenStats.dezeWeek}
          icon={Calendar}
          color="#3b82f6"
          gradient="from-blue-500/20 to-blue-600/10"
        />
      </div>

      {/* Tabs Section */}
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-card/60 backdrop-blur-xl border border-border/30 p-1 mb-6">
            <TabsTrigger 
              value="te-ontvangen" 
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              <ArrowDownRight className="w-4 h-4 mr-2" />
              Te ontvangen
              <Badge variant="secondary" className="ml-2 bg-inverse/20 text-inherit">
                {teOntvangenBetalingen.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="te-betalen"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Te betalen
              <Badge variant="secondary" className="ml-2 bg-inverse/20 text-inherit">
                {teBetalenBetalingen.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="te-ontvangen" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {teOntvangenBetalingen.map((item, index) => (
                <PaymentCard key={item.id} item={item} type="in" index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="te-betalen" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {teBetalenBetalingen.map((item, index) => (
                <PaymentCard key={item.id} item={item} type="out" index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Betaaloverzicht</h3>
            <p className="text-white/80 text-sm">
              U heeft <span className="text-emerald-400 font-semibold">€{betalingenStats.teOntvangen.toLocaleString()}</span> te ontvangen en <span className="text-red-400 font-semibold">€{betalingenStats.teBetalen.toLocaleString()}</span> te betalen
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center px-4 py-2 bg-inverse/10 rounded-xl">
              <p className="text-2xl font-bold text-emerald-400">
                +€{(betalingenStats.teOntvangen - betalingenStats.teBetalen).toLocaleString()}
              </p>
              <p className="text-xs text-white/70">Netto positief</p>
            </div>
            <Button className="bg-inverse text-inverse-foreground hover:bg-inverse/90 shadow-lg transition-all duration-200">
              <CreditCard className="w-4 h-4 mr-2" />
              Betaaloverzicht
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
