'use client'

import { Sparkles, X } from 'lucide-react'

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { bottomNavItems, navigationItems } from '@/components/dashboard/navigation'

export default function MobileSidebar({
  open,
  onOpenChange,
  activePage,
  onNavigate,
  onLogout,
  onPrefetch,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
  onPrefetch: (page?: string) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        id="mobile-sidebar"
        side="left"
        className="bg-sidebar backdrop-blur-xl border-r border-sidebar-border text-sidebar-foreground flex flex-col w-64 p-0 lg:hidden [&>button]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigatie</SheetTitle>
          <SheetDescription>Hoofdnavigatie van ArchonPro.</SheetDescription>
        </SheetHeader>

        <div className="p-4 border-b border-sidebar-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg">ArchonPro</div>
              <p className="text-xs text-sidebar-foreground/60">Business Suite</p>
            </div>
          </div>
          <SheetClose asChild>
            <button
              type="button"
              aria-label="Menu sluiten"
              className="p-2 rounded-lg hover:bg-sidebar-accent outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/50"
            >
              <X className="w-5 h-5 text-sidebar-foreground/70" />
            </button>
          </SheetClose>
        </div>

        <nav aria-label="Hoofdnavigatie" className="flex-1 p-3 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onMouseEnter={() => onPrefetch(item.page)}
                onFocus={() => onPrefetch(item.page)}
                onTouchStart={() => onPrefetch(item.page)}
                onClick={() => onNavigate(item.page || 'home')}
                aria-current={activePage === item.page ? 'page' : undefined}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/50',
                  activePage === item.page
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border'
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
          {bottomNavItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onMouseEnter={() => onPrefetch(item.page)}
              onFocus={() => onPrefetch(item.page)}
              onTouchStart={() => onPrefetch(item.page)}
              onClick={() => (item.page ? onNavigate(item.page) : onLogout())}
              aria-current={item.page && activePage === item.page ? 'page' : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/50',
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
      </SheetContent>
    </Sheet>
  )
}

