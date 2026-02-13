'use client'

import {
  FileText,
  Plus,
  MoreHorizontal,
  Eye,
  Download,
  Send,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// Types
interface Offerte {
  id: number
  nummer: string
  klant: string
  bedrag: number
  datum: string
  geldigTot: string
  status: 'Openstaand' | 'Geaccepteerd' | 'Afgewezen'
}

// Sample Data
const offertesStats = {
  totaal: 15,
  openstaand: 6,
  geaccepteerd: 7,
  afgewezen: 2
}

const offertes: Offerte[] = [
  { id: 1, nummer: "2025-001", klant: "ACME BV", bedrag: 8500, datum: "10 Feb 2025", geldigTot: "24 Feb 2025", status: "Openstaand" },
  { id: 2, nummer: "2025-002", klant: "Global Solutions", bedrag: 12000, datum: "8 Feb 2025", geldigTot: "22 Feb 2025", status: "Geaccepteerd" },
  { id: 3, nummer: "2025-003", klant: "TechStart NV", bedrag: 25000, datum: "5 Feb 2025", geldigTot: "19 Feb 2025", status: "Openstaand" },
  { id: 4, nummer: "2025-004", klant: "Media Plus", bedrag: 4500, datum: "1 Feb 2025", geldigTot: "15 Feb 2025", status: "Afgewezen" },
  { id: 5, nummer: "2025-005", klant: "Green Energy", bedrag: 18000, datum: "28 Jan 2025", geldigTot: "11 Feb 2025", status: "Geaccepteerd" },
  { id: 6, nummer: "2025-006", klant: "Innovatie Lab", bedrag: 32000, datum: "25 Jan 2025", geldigTot: "8 Feb 2025", status: "Geaccepteerd" },
  { id: 7, nummer: "2025-007", klant: "Digital Works", bedrag: 9500, datum: "22 Jan 2025", geldigTot: "5 Feb 2025", status: "Openstaand" },
]

// Status Badge Component
function StatusBadge({ status }: { status: Offerte['status'] }) {
  const styles = {
    Openstaand: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Geaccepteerd: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Afgewezen: "bg-red-500/10 text-red-600 border-red-500/20",
  }

  const icons = {
    Openstaand: Clock,
    Geaccepteerd: CheckCircle,
    Afgewezen: XCircle,
  }

  const Icon = icons[status]

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium", styles[status])}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  )
}

// Stat Card Component
function StatCard({ label, value, icon: Icon, gradient, trend }: { label: string; value: number; icon: React.ElementType; gradient: string; trend?: string }) {
  return (
    <div className="relative group">
      <div className={cn(
        "absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        gradient
      )} />
      <div className="relative bg-card/60 backdrop-blur-xl border border-border/30 rounded-xl p-4 hover:shadow-lg hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-lg bg-gradient-to-br", gradient)}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Total Amount Card
function TotalAmountCard() {
  const totalBedrag = offertes.reduce((sum, offerte) => sum + offerte.bedrag, 0)
  const geaccepteerdBedrag = offertes
    .filter(o => o.status === 'Geaccepteerd')
    .reduce((sum, o) => sum + o.bedrag, 0)

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-white/70">Totaal Offerte Waarde</p>
          <p className="text-3xl font-bold">{formatCurrency(totalBedrag)}</p>
        </div>
        <div className="p-3 rounded-xl bg-inverse/10">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
            <span>Geaccepteerd</span>
            <span>{formatCurrency(geaccepteerdBedrag)}</span>
          </div>
          <div className="h-2 bg-inverse/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              style={{ width: `${(geaccepteerdBedrag / totalBedrag) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs">
        <span className="text-emerald-400">{Math.round((geaccepteerdBedrag / totalBedrag) * 100)}%</span>
        <span className="text-white/70">van totaal geaccepteerd</span>
      </div>
    </div>
  )
}

// Offerte Row Component
function OfferteRow({ offerte }: { offerte: Offerte; index?: number }) {
  return (
    <tr className="group hover:bg-muted/40 transition-colors">
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-foreground">{offerte.nummer}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-foreground/80">{offerte.klant}</span>
      </TableCell>
      <TableCell>
        <span className="font-semibold text-foreground">{formatCurrency(offerte.bedrag)}</span>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <p className="text-foreground/80">{offerte.datum}</p>
          <p className="text-xs text-muted-foreground">Geldig tot: {offerte.geldigTot}</p>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={offerte.status} />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2">
              <Eye className="w-4 h-4" />
              Bekijken
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Download className="w-4 h-4" />
              Downloaden
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Send className="w-4 h-4" />
              Verzenden
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600">
              <Trash2 className="w-4 h-4" />
              Verwijderen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </tr>
  )
}

export default function OffertesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Offertes</h1>
          <p className="text-sm text-muted-foreground">Beheer uw offertes en prijsvoorstellen</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Offerte
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Totaal" value={offertesStats.totaal} icon={FileText} gradient="from-slate-500 to-slate-600" />
        <StatCard label="Openstaand" value={offertesStats.openstaand} icon={Clock} gradient="from-amber-500 to-amber-600" />
        <StatCard label="Geaccepteerd" value={offertesStats.geaccepteerd} icon={CheckCircle} gradient="from-emerald-500 to-emerald-600" />
        <StatCard label="Afgewezen" value={offertesStats.afgewezen} icon={XCircle} gradient="from-red-500 to-red-600" />
        <div className="col-span-2 lg:col-span-1">
          <TotalAmountCard />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/30">
              <TableHead className="text-muted-foreground font-medium">Offerte NR</TableHead>
              <TableHead className="text-muted-foreground font-medium">Klant</TableHead>
              <TableHead className="text-muted-foreground font-medium">Bedrag</TableHead>
              <TableHead className="text-muted-foreground font-medium">Datum</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium w-12">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offertes.map((offerte, index) => (
              <OfferteRow key={offerte.id} offerte={offerte} index={index} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-xl p-4 hover:bg-card/75 hover:shadow-lg transition-[background-color,box-shadow,border-color] duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Te vervallen</p>
              <p className="text-xl font-bold text-foreground">3 offertes</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Binnen 7 dagen verlopen</p>
        </div>

        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-xl p-4 hover:bg-card/75 hover:shadow-lg transition-[background-color,box-shadow,border-color] duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversie ratio</p>
              <p className="text-xl font-bold text-foreground">46.7%</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">7 van 15 geaccepteerd</p>
        </div>

        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-xl p-4 hover:bg-card/75 hover:shadow-lg transition-[background-color,box-shadow,border-color] duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gemiddelde waarde</p>
              <p className="text-xl font-bold text-foreground">€15,643</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Per offerte</p>
        </div>
      </div>
    </div>
  )
}
