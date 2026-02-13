'use client'

import { Menu, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'
import { bottomNavItems, navigationItems } from '@/components/dashboard/navigation'

export default function DesktopSidebar({
  open,
  activePage,
  onToggleOpen,
  onNavigate,
  onLogout,
  onPrefetch,
}: {
  open: boolean
  activePage: string
  onToggleOpen: () => void
  onNavigate: (page: string) => void
  onLogout: () => void
  onPrefetch: (page?: string) => void
}) {
  return (
    <>
      <button
        type="button"
        onClick={onToggleOpen}
        aria-controls="desktop-sidebar"
        aria-expanded={open}
        aria-label={open ? 'Zijbalk inklappen' : 'Zijbalk uitklappen'}
        title={open ? 'Zijbalk inklappen' : 'Zijbalk uitklappen'}
        className="hidden lg:flex fixed left-4 top-4 z-50 p-2 rounded-lg bg-card/60 backdrop-blur-xl border border-border/30 hover:bg-card/75 transition-all duration-200 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside
        id="desktop-sidebar"
        aria-hidden={!open}
        className={cn(
          'hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-sidebar backdrop-blur-xl border-r border-sidebar-border text-sidebar-foreground flex-col z-40 transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">ArchonPro</h1>
              <p className="text-xs text-sidebar-foreground/60">Business Suite</p>
            </div>
          </div>
        </div>

        <nav aria-label="Hoofdnavigatie" className="flex-1 p-3 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                type="button"
                tabIndex={open ? 0 : -1}
                onMouseEnter={() => onPrefetch(item.page)}
                onFocus={() => onPrefetch(item.page)}
                onClick={() => onNavigate(item.page || 'home')}
                aria-current={activePage === item.page ? 'page' : undefined}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-[background-color,color,box-shadow,border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/50',
                  activePage === item.page
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg border border-sidebar-border'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    activePage === item.page ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground/70'
                  )}
                />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="space-y-1">
            {bottomNavItems.map((item) => (
              <button
                key={item.label}
                type="button"
                tabIndex={open ? 0 : -1}
                onMouseEnter={() => onPrefetch(item.page)}
                onFocus={() => onPrefetch(item.page)}
                onClick={() => (item.page ? onNavigate(item.page) : onLogout())}
                aria-current={item.page && activePage === item.page ? 'page' : undefined}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-[background-color,color,box-shadow,border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/50',
                  item.page && activePage === item.page
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    item.page && activePage === item.page ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground/70'
                  )}
                />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

