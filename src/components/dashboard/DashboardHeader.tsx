'use client'

import { useEffect, useState } from 'react'
import { Bell, Crown, Loader2, Menu, Moon, Plus, Search, Sun, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timeoutId = 0
    let intervalId = 0

    const tick = () => setNow(new Date())
    const initial = new Date()
    const msToNextMinute = (60 - initial.getSeconds()) * 1000 - initial.getMilliseconds()

    timeoutId = window.setTimeout(() => {
      tick()
      intervalId = window.setInterval(tick, 60_000)
    }, msToNextMinute)

    return () => {
      window.clearTimeout(timeoutId)
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <span data-testid="live-clock" className={className}>
      {now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
    </span>
  )
}

export default function DashboardHeader({
  sidebarOpen,
  onOpenSidebar,
  commandOpen,
  onOpenCommand,
  themeMounted,
  resolvedTheme,
  onToggleTheme,
  activePageLabel,
  pageSwitching,
}: {
  sidebarOpen: boolean
  onOpenSidebar: () => void
  commandOpen: boolean
  onOpenCommand: () => void
  themeMounted: boolean
  resolvedTheme: string | undefined
  onToggleTheme: () => void
  activePageLabel: string
  pageSwitching: boolean
}) {
  return (
    <header className="sticky top-0 z-30 bg-background/30 backdrop-blur-xl border-b border-border/20">
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <button
              type="button"
              aria-label="Menu openen"
              aria-controls="mobile-sidebar"
              aria-expanded={sidebarOpen}
              aria-haspopup="dialog"
              onClick={onOpenSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-card/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden md:flex h-9 w-44 items-center rounded-md border border-border/30 bg-card/60 backdrop-blur-xl px-3">
              <span className="truncate text-sm font-medium text-foreground">{activePageLabel}</span>
            </div>

            <div className="relative flex-1 max-w-lg" role="search" aria-label="Zoek">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={commandOpen}
                aria-label="Open zoeken"
                title="Zoeken (Ctrl+K)"
                onClick={onOpenCommand}
                className="w-full h-9 rounded-md border border-border/30 bg-card/60 backdrop-blur-xl pl-10 pr-3 text-sm text-left text-muted-foreground hover:bg-card/75 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <span className="flex items-center gap-3">
                  <span>Zoeken...</span>
                  <span aria-hidden="true" className="ml-auto flex items-center gap-1 text-xs text-muted-foreground/80">
                    <kbd className="rounded border border-border/40 bg-background/40 px-1.5 py-0.5 font-mono">Ctrl</kbd>
                    <kbd className="rounded border border-border/40 bg-background/40 px-1.5 py-0.5 font-mono">K</kbd>
                  </span>
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              data-testid="page-loading-indicator"
              className={`hidden sm:flex items-center justify-center w-9 h-9 rounded-lg border border-border/30 bg-card/60 backdrop-blur-xl transition-opacity duration-200 ${pageSwitching ? 'opacity-100' : 'opacity-0'}`}
            >
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>

            {themeMounted ? (
              <LiveClock className="hidden sm:block text-sm font-medium text-foreground bg-card/60 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-border/30" />
            ) : (
              <span
                className="hidden sm:block text-sm font-medium text-foreground bg-card/60 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-border/30"
                data-testid="live-clock"
                aria-hidden="true"
              >
                --:--
              </span>
            )}

            <button
              type="button"
              aria-label="Thema wisselen"
              onClick={onToggleTheme}
              title="Wissel thema"
              className="p-2 rounded-lg transition-all duration-200 border border-border/30 bg-card/60 backdrop-blur-xl hover:bg-card/75 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {themeMounted && resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Button
              aria-label="Meldingen"
              title="Meldingen"
              variant="ghost"
              size="icon"
              className="relative hover:bg-card/60"
              onClick={() =>
                toast({
                  title: 'Meldingen',
                  description: 'Meldingen zijn nog niet gekoppeld in deze demo.',
                })
              }
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-border/30" />
            </Button>

            <Button
              aria-label="Account"
              title="Account"
              variant="ghost"
              size="icon"
              className="hover:bg-card/60"
              onClick={() =>
                toast({
                  title: 'Account',
                  description: 'Account-instellingen zijn nog niet gekoppeld in deze demo.',
                })
              }
            >
              <User className="w-5 h-5" />
            </Button>
          </div>

          <Button
            className="hidden sm:flex bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-200"
            title="Upgrade"
            onClick={() =>
              toast({
                title: 'Upgrade',
                description: 'Abonnementen zijn nog niet gekoppeld in deze demo.',
              })
            }
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade
          </Button>

          <Button
            aria-label="Nieuwe actie"
            title="Nieuwe actie"
            variant="ghost"
            size="icon"
            className="bg-card/60 hover:bg-card/75 text-foreground border border-border/30 shadow-lg transition-all duration-200"
            onClick={() =>
              toast({
                title: 'Nieuwe actie',
                description: 'Snelle acties zijn nog niet gekoppeld in deze demo.',
              })
            }
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
