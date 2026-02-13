'use client'

import {
  FolderKanban,
  Plus,
  Calendar,
  Coins,
  MoreHorizontal,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// Types
interface Project {
  id: number
  naam: string
  klant: string
  status: 'Actief' | 'On Hold' | 'Afgerond'
  voortgang: number
  team: string[]
  deadline: string
  budget: number
  budgetGebruikt: number
}

// Sample Data
const projectenStats = {
  actief: 8,
  afgerond: 12,
  onHold: 3,
  totaal: 23
}

const projecten: Project[] = [
  {
    id: 1,
    naam: "E-commerce Platform",
    klant: "ACME BV",
    status: "Actief",
    voortgang: 65,
    team: ["JD", "MJ", "PB"],
    deadline: "15 Mrt 2025",
    budget: 45000,
    budgetGebruikt: 28500
  },
  {
    id: 2,
    naam: "Mobile App Development",
    klant: "TechStart NV",
    status: "Actief",
    voortgang: 35,
    team: ["SJ", "KD"],
    deadline: "30 Apr 2025",
    budget: 65000,
    budgetGebruikt: 22000
  },
  {
    id: 3,
    naam: "Cloud Migration",
    klant: "Global Solutions",
    status: "On Hold",
    voortgang: 80,
    team: ["JD", "PB"],
    deadline: "20 Feb 2025",
    budget: 30000,
    budgetGebruikt: 27000
  },
  {
    id: 4,
    naam: "Website Redesign",
    klant: "Green Energy",
    status: "Actief",
    voortgang: 90,
    team: ["MJ"],
    deadline: "25 Feb 2025",
    budget: 15000,
    budgetGebruikt: 13500
  },
]

// Status Badge Component
function StatusBadge({ status }: { status: Project['status'] }) {
  const styles = {
    Actief: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    'On Hold': "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Afgerond: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  }

  return (
    <span className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", styles[status])}>
      {status}
    </span>
  )
}

// Progress Bar
function AnimatedProgress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-sky-600 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

// Team Avatars Component
function TeamAvatars({ members }: { members: string[] }) {
  const colors = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-sky-400 to-sky-600",
    "bg-gradient-to-br from-pink-400 to-pink-600",
    "bg-gradient-to-br from-amber-400 to-amber-600",
    "bg-gradient-to-br from-emerald-400 to-emerald-600",
  ]

  return (
    <div className="flex -space-x-2">
      {members.slice(0, 3).map((member, index) => (
        <Avatar key={index} className="w-7 h-7 border-2 border-white shadow-sm">
          <AvatarFallback className={cn("text-white text-xs font-medium", colors[index % colors.length])}>
            {member}
          </AvatarFallback>
        </Avatar>
      ))}
      {members.length > 3 && (
        <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground font-medium">
          +{members.length - 3}
        </div>
      )}
    </div>
  )
}

// Stat Card Component
function StatCard({ label, value, icon: Icon, gradient }: { label: string; value: number; icon: React.ElementType; gradient: string }) {
  return (
    <div className="relative group">
      <div className={cn(
        "absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        gradient
      )} />
      <div className="relative bg-card/60 backdrop-blur-xl border border-border/30 rounded-xl p-4 hover:shadow-lg hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-gradient-to-br", gradient)}>
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

// Project Card Component
function ProjectCard({ project }: { project: Project }) {
  const budgetPercentage = Math.round((project.budgetGebruikt / project.budget) * 100)

  return (
    <div className="group relative">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-5 hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{project.naam}</h3>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-muted-foreground">{project.klant}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted/60"
            onClick={() =>
              toast({
                title: 'Project Opties',
                description: `Opties voor ${project.naam} worden geopend.`,
              })
            }
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Voortgang</span>
            <span className="text-xs font-medium text-foreground/80">{project.voortgang}%</span>
          </div>
          <AnimatedProgress value={project.voortgang} />
        </div>

        {/* Budget */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Budget</span>
            <span className="text-xs font-medium text-foreground/80">€{project.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                style={{ width: `${budgetPercentage}%` }}
                className={cn(
                  "h-full rounded-full",
                  budgetPercentage > 80 ? "bg-red-500" : budgetPercentage > 50 ? "bg-amber-500" : "bg-emerald-500"
                )}
              />
            </div>
            <span className="text-xs text-muted-foreground">{budgetPercentage}%</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-2">
            <TeamAvatars members={project.team} />
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{project.deadline}</span>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              <span>Gebruikt: {budgetPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectenPage() {
  const handleNewProject = () => {
    toast({
      title: 'Nieuw Project',
      description: 'Aanmaken is nog niet gekoppeld in deze demo.',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projecten</h1>
          <p className="text-sm text-muted-foreground">Beheer al uw projecten en deadlines</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200" onClick={handleNewProject}>
          <Plus className="w-4 h-4 mr-2" />
          Nieuw Project
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Actief" value={projectenStats.actief} icon={FolderKanban} gradient="from-blue-500 to-blue-600" />
        <StatCard label="Afgerond" value={projectenStats.afgerond} icon={FolderKanban} gradient="from-emerald-500 to-emerald-600" />
        <StatCard label="On Hold" value={projectenStats.onHold} icon={FolderKanban} gradient="from-amber-500 to-amber-600" />
        <StatCard label="Totaal" value={projectenStats.totaal} icon={FolderKanban} gradient="from-sky-500 to-sky-600" />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projecten.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
