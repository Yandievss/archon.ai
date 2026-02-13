'use client'

import { useState } from 'react'
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar,
  FileText,
  Wallet,
  BarChart3,
  MoreHorizontal,
  ChevronRight,
  Download,
  Loader2,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// Sample Data
const inkomstenStats = {
  maandTotaal: 45230,
  jaarTotaal: 342500,
  openstaand: 28400,
  gemiddeld: 38055,
  maandChange: 12,
}

const inkomstenData = [
  { maand: "Jan", bedrag: 32000 },
  { maand: "Feb", bedrag: 38000 },
  { maand: "Mrt", bedrag: 45000 },
  { maand: "Apr", bedrag: 42000 },
  { maand: "Mei", bedrag: 48000 },
  { maand: "Jun", bedrag: 52000 },
  { maand: "Jul", bedrag: 45230 },
]

const recenteInkomsten = [
  { id: 1, datum: "12 Feb 2025", omschrijving: "Project factuur", bedrijf: "ACME BV", bedrag: 8500, status: "Betaald" },
  { id: 2, datum: "10 Feb 2025", omschrijving: "Consulting diensten", bedrijf: "Global Solutions", bedrag: 4200, status: "Betaald" },
  { id: 3, datum: "8 Feb 2025", omschrijving: "Software licentie", bedrijf: "TechStart NV", bedrag: 12000, status: "Openstaand" },
  { id: 4, datum: "5 Feb 2025", omschrijving: "Marketing campagne", bedrijf: "DigitalPro", bedrag: 6500, status: "Betaald" },
  { id: 5, datum: "3 Feb 2025", omschrijving: "Website ontwikkeling", bedrijf: "WebCraft BV", bedrag: 15000, status: "Openstaand" },
  { id: 6, datum: "1 Feb 2025", omschrijving: "Onderhoudscontract", bedrijf: "ServicePlus", bedrag: 3200, status: "Betaald" },
]

// Custom Tooltip
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-border">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">€{payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

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

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  gradient,
  prefix = "€",
  isPercentage = false
}: { 
  title: string
  value: number
  change?: number
  icon: React.ElementType
  color: string
  gradient: string
  prefix?: string
  isPercentage?: boolean
}) {
  return (
    <div className="group relative">
      <div className={cn(
        "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        gradient
      )} />
      <div className="relative bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-5 hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-3 rounded-xl shadow-lg", `bg-gradient-to-br ${gradient}`)}>
            <Icon className="w-5 h-5" style={{ color: color }} />
          </div>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
              change >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
            )}>
              {change >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">
            {prefix}{value.toLocaleString()}
            {isPercentage && '%'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function InkomstenPage() {
  const [timeFilter, setTimeFilter] = useState('maand')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    datum: new Date().toISOString().split('T')[0],
    omschrijving: '',
    bedrijf: '',
    bedrag: '',
    status: 'Openstaand',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/inkomsten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create inkomst')
      }

      toast({
        title: 'Succes! ✅',
        description: `Inkomst van €${formData.bedrag} voor ${formData.bedrijf} opgeslagen.`,
      })

      // Reset form
      setFormData({
        datum: new Date().toISOString().split('T')[0],
        omschrijving: '',
        bedrijf: '',
        bedrag: '',
        status: 'Openstaand',
      })
      setDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Fout',
        description: 'Kon inkomst niet opslaan. Probeer opnieuw.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNewInkomst = () => {
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inkomsten</h1>
          <p className="text-muted-foreground text-sm mt-1">Overzicht van alle inkomsten en facturen</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-card/60 backdrop-blur-xl border-border/30 hover:bg-card/75">
            <Download className="w-4 h-4 mr-2" />
            Exporteren
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 transition-all duration-200" onClick={handleNewInkomst}>
                <Plus className="w-4 h-4 mr-2" />
                Nieuwe Inkomst
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nieuwe Inkomst Toevoegen</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="datum">Datum</Label>
                  <Input
                    id="datum"
                    type="date"
                    value={formData.datum}
                    onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrijf">Bedrijf</Label>
                  <Input
                    id="bedrijf"
                    placeholder="Bedrijfsnaam"
                    value={formData.bedrijf}
                    onChange={(e) => setFormData({ ...formData, bedrijf: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="omschrijving">Omschrijving</Label>
                  <Input
                    id="omschrijving"
                    placeholder="Factuur, advies, etc."
                    value={formData.omschrijving}
                    onChange={(e) => setFormData({ ...formData, omschrijving: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrag">Bedrag (€)</Label>
                  <Input
                    id="bedrag"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.bedrag}
                    onChange={(e) => setFormData({ ...formData, bedrag: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Openstaand">Openstaand</SelectItem>
                      <SelectItem value="Betaald">Betaald</SelectItem>
                      <SelectItem value="Vervallen">Vervallen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
                    Annuleren
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Opslaan...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Opslaan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Totaal deze maand"
          value={inkomstenStats.maandTotaal}
          change={inkomstenStats.maandChange}
          icon={Wallet}
          color="#10b981"
          gradient="from-emerald-500/20 to-emerald-600/10"
        />
        <StatCard
          title="Totaal dit jaar"
          value={inkomstenStats.jaarTotaal}
          icon={BarChart3}
          color="#3b82f6"
          gradient="from-blue-500/20 to-blue-600/10"
        />
        <StatCard
          title="Openstaand"
          value={inkomstenStats.openstaand}
          icon={FileText}
          color="#f59e0b"
          gradient="from-amber-500/20 to-amber-600/10"
        />
        <StatCard
          title="Gemiddeld per maand"
          value={inkomstenStats.gemiddeld}
          icon={TrendingUp}
          color="#0ea5e9"
          gradient="from-sky-500/20 to-sky-600/10"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-6 hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Inkomsten Trend</h3>
            <p className="text-sm text-muted-foreground">Maandelijks overzicht van inkomsten</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              {['maand', 'kwartaal', 'jaar'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                    timeFilter === filter
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={inkomstenData}>
              <defs>
                <linearGradient id="inkomstenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="maand"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                tickFormatter={(value) => `€${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="bedrag"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#inkomstenGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-6 hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recente Transacties</h3>
            <p className="text-sm text-muted-foreground">Laatste inkomsten this maand</p>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Bekijk alles
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Datum</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Omschrijving</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Bedrijf</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Bedrag</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Acties</th>
              </tr>
            </thead>
            <tbody>
              {recenteInkomsten.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border/30 hover:bg-muted/40 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm text-muted-foreground">{item.datum}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-foreground">{item.omschrijving}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-muted-foreground">{item.bedrijf}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">€{item.bedrag.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
