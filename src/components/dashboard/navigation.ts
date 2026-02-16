import type { ElementType } from 'react'
import {
  Bot,
  Briefcase,
  Building2,
  CalendarDays,
  Crown,
  FileSpreadsheet,
  FolderKanban,
  Home,
  LogOut,
  Package,
  Receipt,
  Settings,
  Timer,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'

export type NavigationItem = {
  icon: ElementType
  label: string
  page?: string
}

export const navigationItems: NavigationItem[] = [
  { icon: Home, label: 'Dashboard', page: 'home' },
  { icon: Building2, label: 'Bedrijven', page: 'bedrijven' },
  { icon: Users, label: 'Contacten', page: 'contacten' },
  { icon: Briefcase, label: 'Deals', page: 'deals' },
  { icon: FileSpreadsheet, label: 'Offertes', page: 'offertes' },
  { icon: Receipt, label: 'Facturen', page: 'facturen' },
  { icon: FolderKanban, label: 'Projecten', page: 'projecten' },
  { icon: CalendarDays, label: 'Agenda', page: 'agenda' },
  { icon: TrendingUp, label: 'Inkomsten', page: 'inkomsten' },
  { icon: Wallet, label: 'Uitgaven', page: 'uitgaven' },
  { icon: Package, label: 'Artikelen', page: 'artikelen' },
  { icon: Timer, label: 'Timesheets', page: 'timesheets' },
  { icon: Receipt, label: 'Betalingen', page: 'betalingen' },
]

export const bottomNavItems: NavigationItem[] = [
  { icon: Bot, label: 'AI Assistant', page: 'ai-assistant' },
  { icon: Crown, label: 'Abonnement', page: 'abonnement' },
  { icon: Settings, label: 'Instellingen', page: 'instellingen' },
  { icon: LogOut, label: 'Uitloggen', page: undefined },
]

export const validPages = new Set<string>([
  ...(navigationItems.map((i) => i.page).filter(Boolean) as string[]),
  ...(bottomNavItems.map((i) => i.page).filter(Boolean) as string[]),
])

export const pageLabelById = new Map<string, string>(
  [...navigationItems, ...bottomNavItems]
    .filter((i) => i.page)
    .map((i) => [i.page as string, i.label])
)

