'use client'

import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Presentation,
  Phone,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Types
interface Afspraak {
  id: number
  tijd: string
  titel: string
  type: 'Intern' | 'Klant' | 'Demo' | 'Prospect'
  duur: string
}

interface CalendarEvent {
  title: string
  time: string
}

// Sample Data
const afsprakenVandaag: Afspraak[] = [
  { id: 1, tijd: "09:00", titel: "Team standup", type: "Intern", duur: "30 min" },
  { id: 2, tijd: "10:30", titel: "Gesprek met ACME BV", type: "Klant", duur: "1 uur" },
  { id: 3, tijd: "14:00", titel: "Product demo", type: "Demo", duur: "1,5 uur" },
  { id: 4, tijd: "16:00", titel: "Sales call", type: "Prospect", duur: "45 min" },
]

const weekAfspraken = 8

const calendarEvents: Record<number, CalendarEvent[]> = {
  12: [{ title: "Klantgesprek", time: "10:30" }],
  14: [{ title: "Project meeting", time: "14:00" }],
  15: [{ title: "Deadline offerte", time: "17:00" }],
  20: [{ title: "Workshop", time: "09:00" }],
  22: [{ title: "Team building", time: "15:00" }],
  25: [{ title: "Review", time: "11:00" }],
  28: [{ title: "Contract signing", time: "10:00" }],
}

// Type Icon Component
function TypeIcon({ type }: { type: Afspraak['type'] }) {
  const icons = {
    Intern: { icon: Users, color: "text-purple-500 bg-purple-500/10" },
    Klant: { icon: Users, color: "text-blue-500 bg-blue-500/10" },
    Demo: { icon: Presentation, color: "text-emerald-500 bg-emerald-500/10" },
    Prospect: { icon: Phone, color: "text-amber-500 bg-amber-500/10" },
  }
  const { icon: Icon, color } = icons[type]
  return (
    <div className={cn("p-2 rounded-lg", color)}>
      <Icon className="w-4 h-4" />
    </div>
  )
}

// Type Badge Component
function TypeBadge({ type }: { type: Afspraak['type'] }) {
  const styles = {
    Intern: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    Klant: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Demo: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Prospect: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  }

  return (
    <span className={cn("text-xs px-2 py-0.5 rounded-full border", styles[type])}>
      {type}
    </span>
  )
}

// Afspraak Card Component
function AfspraakCard({ afspraak }: { afspraak: Afspraak; index?: number }) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl bg-card/40 backdrop-blur-xl border border-border/30 hover:bg-card/60 hover:shadow-md transition-[background-color,box-shadow,border-color] duration-200"
    >
      <TypeIcon type={afspraak.type} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-foreground">{afspraak.tijd}</span>
          <TypeBadge type={afspraak.type} />
        </div>
        <p className="text-sm font-medium text-foreground/80 mb-1">{afspraak.titel}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{afspraak.duur}</span>
        </div>
      </div>
    </div>
  )
}

// Custom Calendar Component
function CustomCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 1)) // February 2025
  const today = 12

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 // Adjust for Monday start

  const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  const dayNames = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const days: ReactNode[] = []
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const hasEvent = calendarEvents[day]
    const isToday = day === today
    days.push(
      <motion.button
        key={day}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "w-8 h-8 rounded-lg text-sm font-medium flex flex-col items-center justify-center relative transition-[background-color,box-shadow,border-color] duration-200",
          isToday
            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
            : hasEvent
            ? "bg-muted text-foreground/80 hover:bg-muted/80"
            : "text-muted-foreground hover:bg-muted/40"
        )}
      >
        {day}
        {hasEvent && !isToday && (
          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-500" />
        )}
      </motion.button>
    )
  }

  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-5">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-foreground">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="w-8 h-6 flex items-center justify-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  )
}

export default function AgendaPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
          <p className="text-sm text-muted-foreground">Beheer uw afspraken en planning</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-[background-color,box-shadow,border-color] duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Afspraak
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div>
            <CustomCalendar />
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="space-y-4">
          {/* Today Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-inverse/10">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-white/70">Vandaag</p>
                <p className="font-semibold">12 Februari 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex-1 h-2 bg-inverse/10 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              </div>
              <span className="text-xs text-white/70">76% bezet</span>
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Afspraken</h3>
              <Badge variant="secondary" className="text-xs">
                {afsprakenVandaag.length} vandaag
              </Badge>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {afsprakenVandaag.map((afspraak, index) => (
                <AfspraakCard key={afspraak.id} afspraak={afspraak} index={index} />
              ))}
            </div>
          </div>

          {/* Week Stats */}
          <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deze week</p>
                <p className="text-2xl font-bold text-foreground">{weekAfspraken} afspraken</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day, index) => (
                <div
                  key={day}
                  className={cn(
                    "w-full h-8 rounded-lg flex items-center justify-center text-xs font-medium",
                    index < 4 ? "bg-blue-500/10 text-blue-600" : "bg-muted text-muted-foreground"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
