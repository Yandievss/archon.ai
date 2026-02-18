'use client'

import { useEffect, useMemo, useState, useTransition, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

import StaticThreads from '@/components/StaticThreads'
import DashboardCommandPalette from '@/components/dashboard/DashboardCommandPalette'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DashboardPageErrorBoundary from '@/components/dashboard/DashboardPageErrorBoundary'
import DesktopSidebar from '@/components/dashboard/DesktopSidebar'
import MobileSidebar from '@/components/dashboard/MobileSidebar'
import { pageLabelById, validPages } from '@/components/dashboard/navigation'
import { toast } from '@/hooks/use-toast'

const ROUTE_BACKED_PAGES = new Set<string>([
  'home',
  'abonnement',
  'ai-assistant',
  'agenda',
  'artikelen',
  'betalingen',
  'bedrijven',
  'contacten',
  'deals',
  'facturen',
  'inkomsten',
  'instellingen',
  'offertes',
  'projecten',
  'timesheets',
  'uitgaven',
])

function getPageFromPath(pathname: string): string {
  const firstSegment = pathname.replace(/^\/+/, '').split('/')[0]
  if (!firstSegment) return 'home'
  return validPages.has(firstSegment) ? firstSegment : 'home'
}

function getPathForPage(page: string): string {
  const normalizedPage = validPages.has(page) ? page : 'home'
  if (normalizedPage === 'home') return '/'
  if (ROUTE_BACKED_PAGES.has(normalizedPage)) return `/${normalizedPage}`
  return `/?page=${normalizedPage}`
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  const [commandOpen, setCommandOpen] = useState(false)
  const [themeMounted, setThemeMounted] = useState(false)
  const [isRouteTransitionPending, startRouteTransition] = useTransition()
  const { resolvedTheme, setTheme } = useTheme()

  const activePage = useMemo(() => getPageFromPath(pathname), [pathname])
  const activePageLabel = pageLabelById.get(activePage) ?? 'Dashboard'

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  const toggleDesktopSidebar = () => setDesktopSidebarOpen((open) => !open)

  const navigateTo = (page: string) => {
    const targetPath = getPathForPage(page)
    setSidebarOpen(false)
    setCommandOpen(false)
    startRouteTransition(() => {
      router.push(targetPath)
    })
  }

  const prefetchPage = (page?: string) => {
    if (!page) return
    void router.prefetch(getPathForPage(page))
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('archonpro.activePage')
    }

    setSidebarOpen(false)
    setCommandOpen(false)

    startRouteTransition(() => {
      router.push('/')
    })

    toast({
      title: 'Uitloggen',
      description: 'Authenticatie is nog niet gekoppeld in deze demo.',
    })
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = window.localStorage.getItem('archonpro.desktopSidebarOpen')
    if (stored == null) return

    const next = stored === '1' || stored === 'true'
    if (next === true) return

    const id = requestAnimationFrame(() => setDesktopSidebarOpen(next))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('archonpro.desktopSidebarOpen', desktopSidebarOpen ? '1' : '0')
  }, [desktopSidebarOpen])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('archonpro.activePage', activePage)
  }, [activePage])

  useEffect(() => {
    const id = requestAnimationFrame(() => setThemeMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.title = activePageLabel ? `ArchonPro - ${activePageLabel}` : 'ArchonPro'
  }, [activePageLabel])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  useEffect(() => {
    if (!commandOpen) return
    const id = requestAnimationFrame(() => setSidebarOpen(false))
    return () => cancelAnimationFrame(id)
  }, [commandOpen])

  useEffect(() => {
    if (!sidebarOpen) return
    const id = requestAnimationFrame(() => setCommandOpen(false))
    return () => cancelAnimationFrame(id)
  }, [sidebarOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const isMeta = event.metaKey || event.ctrlKey

      if (key === 'escape') {
        setCommandOpen(false)
        setSidebarOpen(false)
        return
      }

      if (isMeta && key === 'k') {
        event.preventDefault()
        setCommandOpen((open) => !open)
        return
      }

      if (isMeta && key === 'b') {
        event.preventDefault()
        toggleDesktopSidebar()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="min-h-screen relative" data-mounted={themeMounted ? 'true' : 'false'}>
      <DesktopSidebar
        open={desktopSidebarOpen}
        activePage={activePage}
        onToggleOpen={toggleDesktopSidebar}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        onPrefetch={prefetchPage}
      />

      <MobileSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        activePage={activePage}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        onPrefetch={prefetchPage}
      />

      <div className={`min-h-screen relative z-10 transition-[margin-left] duration-300 ${desktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
          commandOpen={commandOpen}
          onOpenCommand={() => setCommandOpen(true)}
          themeMounted={themeMounted}
          resolvedTheme={resolvedTheme}
          onToggleTheme={toggleTheme}
          activePageLabel={activePageLabel}
          pageSwitching={isRouteTransitionPending}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />

        <div className="p-4 lg:p-6">
          <div className="mx-auto w-full max-w-[1760px]">
            <div className="flex items-start gap-6">
              <main
                className="flex-1 min-h-[calc(100dvh-10rem)]"
                aria-busy={isRouteTransitionPending}
                data-page-switching={isRouteTransitionPending ? 'true' : 'false'}
              >
                <DashboardPageErrorBoundary pageKey={pathname} pageLabel={activePageLabel}>
                  {children}
                </DashboardPageErrorBoundary>
              </main>

              <div className="hidden xl:block w-96 shrink-0 sticky top-24 self-start">
                <StaticThreads />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashboardCommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        activePage={activePage}
        onNavigate={navigateTo}
        onPrefetch={prefetchPage}
        themeMounted={themeMounted}
        resolvedTheme={resolvedTheme}
        onToggleTheme={toggleTheme}
        onToggleDesktopSidebar={toggleDesktopSidebar}
        onLogout={handleLogout}
      />
    </div>
  )
}
