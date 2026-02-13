'use client'

import {
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar,
  Wallet,
  BarChart3,
  PieChart as PieChartIcon,
  MoreHorizontal,
  ChevronRight,
  Download,
  Users,
  Monitor,
  Megaphone,
  Package,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// Sample Data
const uitgavenStats = {
  maandTotaal: 12450,
  jaarTotaal: 98200,
  budgetOver: 7550,
  grootsteCategorie: "Personeel",
}

const uitgavenPerCategorie = [
  { categorie: "Personeel", percentage: 45, bedrag: 44190, color: "#3b82f6" },
  { categorie: "Software", percentage: 25, bedrag: 24550, color: "#8b5cf6" },
  { categorie: "Marketing", percentage: 15, bedrag: 14730, color: "#f59e0b" },
  { categorie: "Overig", percentage: 15, bedrag: 14730, color: "#6b7280" },
]

const maandelijkseUitgaven = [
  { maand: "Jan", uitgaven: 8500, budget: 20000 },
  { maand: "Feb", uitgaven: 12450, budget: 20000 },
  { maand: "Mrt", uitgaven: 9200, budget: 20000 },
  { maand: "Apr", uitgaven: 11000, budget: 20000 },
  { maand: "Mei", uitgaven: 8800, budget: 20000 },
  { maand: "Jun", uitgaven: 10500, budget: 20000 },
]

const recenteUitgaven = [
  { id: 1, datum: "12 Feb 2025", omschrijving: "AWS Cloud services", categorie: "Software", bedrag: 1250, status: "Betaald" },
  { id: 2, datum: "10 Feb 2025", omschrijving: "Marketing campagne", categorie: "Marketing", bedrag: 3500, status: "Betaald" },
  { id: 3, datum: "8 Feb 2025", omschrijving: "Team lunch", categorie: "Personeel", bedrag: 450, status: "Betaald" },
  { id: 4, datum: "5 Feb 2025", omschrijving: "Office supplies", categorie: "Overig", bedrag: 280, status: "Betaald" },
  { id: 5, datum: "3 Feb 2025", omschrijving: "Google Workspace", categorie: "Software", bedrag: 890, status: "Betaald" },
]

// Category Icons
const categoryIcons: Record<string, React.ElementType> = {
  Personeel: Users,
  Software: Monitor,
  Marketing: Megaphone,
  Overig: Package,
}

// Custom Tooltip
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name?: string }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-border">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            {item.name}: €{item.value.toLocaleString()}
          </p>
        ))}
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

// Category Badge
function CategoryBadge({ categorie }: { categorie: string }) {
  const Icon = categoryIcons[categorie] || Package
  const colors: Record<string, string> = {
    Personeel: "bg-blue-500/10 text-blue-600",
    Software: "bg-purple-500/10 text-purple-600",
    Marketing: "bg-amber-500/10 text-amber-600",
    Overig: "bg-muted text-muted-foreground",
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium", colors[categorie] || "bg-muted text-muted-foreground")}>
      <Icon className="w-3 h-3" />
      {categorie}
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
  isText = false
}: { 
  title: string
  value: number | string
  change?: number
  icon: React.ElementType
  color: string
  gradient: string
  prefix?: string
  isText?: boolean
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
              change >= 0 ? "bg-red-500/10 text-red-600" : "bg-emerald-500/10 text-emerald-600"
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
            {isText ? value : `${prefix}${typeof value === 'number' ? value.toLocaleString() : value}`}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function UitgavenPage() {
  const handleNewUitgave = () => {
    toast({
      title: 'Nieuwe Uitgave',
      description: 'Aanmaken is nog niet gekoppeld in deze demo.',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Uitgaven</h1>
          <p className="text-muted-foreground text-sm mt-1">Overzicht van alle uitgaven en kosten</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-card/60 backdrop-blur-xl border-border/30 hover:bg-card/75">
            <Download className="w-4 h-4 mr-2" />
            Exporteren
          </Button>
          <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 transition-all duration-200" onClick={handleNewUitgave}>
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe Uitgave
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Totaal deze maand"
          value={uitgavenStats.maandTotaal}
          icon={Wallet}
          color="#ef4444"
          gradient="from-red-500/20 to-red-600/10"
        />
        <StatCard
          title="Totaal dit jaar"
          value={uitgavenStats.jaarTotaal}
          icon={BarChart3}
          color="#3b82f6"
          gradient="from-blue-500/20 to-blue-600/10"
        />
        <StatCard
          title="Budget over"
          value={uitgavenStats.budgetOver}
          icon={TrendingDown}
          color="#10b981"
          gradient="from-emerald-500/20 to-emerald-600/10"
        />
        <StatCard
          title="Grootste categorie"
          value={uitgavenStats.grootsteCategorie}
          icon={PieChartIcon}
          color="#8b5cf6"
          gradient="from-purple-500/20 to-purple-600/10"
          isText
        />
      </div>

      {/* Charts Section - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-6 hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Uitgaven per Categorie</h3>
              <p className="text-sm text-muted-foreground">Verdeling van uitgaven</p>
            </div>
          </div>
          <div className="flex items-center justify-center py-4">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={uitgavenPerCategorie}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="percentage"
                >
                  {uitgavenPerCategorie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 16px 40px rgb(0 0 0 / 0.18)',
                    color: 'var(--foreground)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {uitgavenPerCategorie.map((item) => (
              <div key={item.categorie} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground flex-1">{item.categorie}</span>
                <span className="text-sm font-semibold text-foreground">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-6 hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Maandelijks Overzicht</h3>
              <p className="text-sm text-muted-foreground">Uitgaven vs Budget</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maandelijkseUitgaven} barGap={0}>
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
                <Bar 
                  dataKey="uitgaven" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]}
                  name="Uitgaven"
                />
                <Bar 
                  dataKey="budget" 
                  fill="var(--input)" 
                  radius={[4, 4, 0, 0]}
                  name="Budget"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Expenses Table */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-6 hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recente Uitgaven</h3>
            <p className="text-sm text-muted-foreground">Laatste transacties this maand</p>
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
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Categorie</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Bedrag</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Acties</th>
              </tr>
            </thead>
            <tbody>
              {recenteUitgaven.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border/30 hover:bg-muted/40 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10">
                        <Calendar className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">{item.datum}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-foreground">{item.omschrijving}</span>
                  </td>
                  <td className="py-4 px-4">
                    <CategoryBadge categorie={item.categorie} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">-€{item.bedrag.toLocaleString()}</span>
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
