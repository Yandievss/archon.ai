'use client'

import { LogOut, Menu, Moon, Sun } from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { bottomNavItems, navigationItems } from '@/components/dashboard/navigation'

export default function DashboardCommandPalette({
  open,
  onOpenChange,
  activePage,
  onNavigate,
  onPrefetch,
  themeMounted,
  resolvedTheme,
  onToggleTheme,
  onToggleDesktopSidebar,
  onLogout,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  activePage: string
  onNavigate: (page: string) => void
  onPrefetch: (page?: string) => void
  themeMounted: boolean
  resolvedTheme: string | undefined
  onToggleTheme: () => void
  onToggleDesktopSidebar: () => void
  onLogout: () => void
}) {
  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Zoeken"
      description="Zoek een pagina of voer een actie uit."
    >
      <CommandInput placeholder="Typ om te zoeken..." />
      <CommandList>
        <CommandEmpty>Geen resultaten gevonden.</CommandEmpty>

        <CommandGroup heading="Navigatie">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.page ?? item.label}
              value={`${item.label} ${item.page ?? ''}`.trim()}
              onMouseEnter={() => onPrefetch(item.page)}
              onFocus={() => onPrefetch(item.page)}
              onSelect={() => onNavigate(item.page || 'home')}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
              {activePage === item.page ? <CommandShortcut>Actief</CommandShortcut> : null}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Tools">
          {bottomNavItems
            .filter((item) => item.page)
            .map((item) => (
              <CommandItem
                key={item.page as string}
                value={`${item.label} ${item.page as string}`.trim()}
                onMouseEnter={() => onPrefetch(item.page)}
                onFocus={() => onPrefetch(item.page)}
                onSelect={() => onNavigate(item.page as string)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {activePage === item.page ? <CommandShortcut>Actief</CommandShortcut> : null}
              </CommandItem>
            ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Systeem">
          <CommandItem
            value="Thema wisselen theme"
            onSelect={() => {
              onToggleTheme()
              onOpenChange(false)
            }}
          >
            {themeMounted && resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>Thema wisselen</span>
          </CommandItem>

          <CommandItem
            value="Zijbalk tonen verbergen sidebar"
            onSelect={() => {
              onToggleDesktopSidebar()
              onOpenChange(false)
            }}
          >
            <Menu className="w-4 h-4" />
            <span>Zijbalk tonen/verbergen</span>
            <CommandShortcut>Ctrl+B</CommandShortcut>
          </CommandItem>

          <CommandItem value="Uitloggen logout" onSelect={onLogout}>
            <LogOut className="w-4 h-4" />
            <span>Uitloggen</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

