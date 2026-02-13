'use client'

import { useState, useEffect, startTransition } from 'react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { toast } from '@/hooks/use-toast'
import StaticThreads from '@/components/StaticThreads'
import DashboardHome from '@/components/dashboard/DashboardHome'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DesktopSidebar from '@/components/dashboard/DesktopSidebar'
import MobileSidebar from '@/components/dashboard/MobileSidebar'
import DashboardCommandPalette from '@/components/dashboard/DashboardCommandPalette'
import { pageLabelById, validPages } from '@/components/dashboard/navigation'

function PageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl p-6"
    >
      <span className="sr-only">Pagina laden...</span>
      <div className="flex items-center justify-between gap-4">
        <div className="h-4 w-28 rounded bg-muted/50 animate-pulse" />
        <div className="h-8 w-20 rounded bg-muted/40 animate-pulse" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-3/4 rounded bg-muted/40 animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-muted/30 animate-pulse" />
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="h-24 rounded-xl bg-muted/25 animate-pulse" />
        <div className="h-24 rounded-xl bg-muted/25 animate-pulse" />
      </div>
    </div>
  )
}

// Lazy-load pages so the initial dashboard bundle stays fast.
const loadBedrijvenPage = () => import('@/components/pages/BedrijvenPage')
const BedrijvenPage = dynamic(
  () => loadBedrijvenPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)
const loadContactenPage = () => import('@/components/pages/ContactenPage')
const ContactenPage = dynamic(
  () => loadContactenPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)
const loadDealsPage = () => import('@/components/pages/DealsPage')
const DealsPage = dynamic(
  () => loadDealsPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)
const loadOffertesPage = () => import('@/components/pages/OffertesPage')
const OffertesPage = dynamic(
  () => loadOffertesPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)
const loadProjectenPage = () => import('@/components/pages/ProjectenPage')
const ProjectenPage = dynamic(
  () => loadProjectenPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)
const loadAgendaPage = () => import('@/components/pages/AgendaPage')
const AgendaPage = dynamic(
  () => loadAgendaPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)
const loadInkomstenPage = () => import('@/components/pages/InkomstenPage')
const InkomstenPage = dynamic(
  () => loadInkomstenPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)
const loadUitgavenPage = () => import('@/components/pages/UitgavenPage')
const UitgavenPage = dynamic(
  () => loadUitgavenPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)
const loadArtikelenPage = () => import('@/components/pages/ArtikelenPage')
const ArtikelenPage = dynamic(
  () => loadArtikelenPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)
const loadTimesheetsPage = () => import('@/components/pages/TimesheetsPage')
const TimesheetsPage = dynamic(
  () => loadTimesheetsPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)
const loadBetalingenPage = () => import('@/components/pages/BetalingenPage')
const BetalingenPage = dynamic(
  () => loadBetalingenPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)
const loadAIAssistantPage = () => import('@/components/pages/AIAssistantPage')
const AIAssistantPage = dynamic(
  () => loadAIAssistantPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)
const loadAbonnementPage = () => import('@/components/pages/AbonnementPage')
const AbonnementPage = dynamic(
  () => loadAbonnementPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)
const loadInstellingenPage = () => import('@/components/pages/InstellingenPage')
const InstellingenPage = dynamic(
  () => loadInstellingenPage().then((m) => m.default),
  { loading: () => <PageLoading />, ssr: false }
)

const pageLoaders: Record<string, () => Promise<unknown>> = {
  bedrijven: loadBedrijvenPage,
  contacten: loadContactenPage,
  deals: loadDealsPage,
  offertes: loadOffertesPage,
  projecten: loadProjectenPage,
  agenda: loadAgendaPage,
  inkomsten: loadInkomstenPage,
  uitgaven: loadUitgavenPage,
  artikelen: loadArtikelenPage,
  timesheets: loadTimesheetsPage,
  betalingen: loadBetalingenPage,
  'ai-assistant': loadAIAssistantPage,
  abonnement: loadAbonnementPage,
  instellingen: loadInstellingenPage,
}

function prefetchPage(page?: string) {
  if (!page) return
  const loader = pageLoaders[page]
  if (!loader) return
  void loader().catch(() => {})
}

// Formatted date (outside component to avoid recreating)
const getFormattedDate = () => {
  return new Date().toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState<string>('home')
  const [commandOpen, setCommandOpen] = useState(false)
  const [themeMounted, setThemeMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const formattedDate = themeMounted ? getFormattedDate() : ''
  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  const toggleDesktopSidebar = () => setDesktopSidebarOpen((open) => !open)

  const navigateTo = (page: string) => {
    const nextPage = validPages.has(page) ? page : 'home'
    prefetchPage(nextPage)
    startTransition(() => setActivePage(nextPage))
    setSidebarOpen(false)
    setCommandOpen(false)
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('archonpro.activePage')
    }
    startTransition(() => setActivePage('home'))
    setSidebarOpen(false)
    setCommandOpen(false)
    toast({
      title: 'Uitloggen',
      description: 'Authenticatie is nog niet gekoppeld in deze demo.',
    })
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const urlPage = params.get('page')
    const storedPage = window.localStorage.getItem('archonpro.activePage')
    const nextPage = urlPage ?? storedPage

    if (nextPage && validPages.has(nextPage)) {
      prefetchPage(nextPage)
      const id = requestAnimationFrame(() => startTransition(() => setActivePage(nextPage)))
      return () => cancelAnimationFrame(id)
    }

    if (urlPage && !validPages.has(urlPage)) {
      const url = new URL(window.location.href)
      url.searchParams.delete('page')
      window.history.replaceState({}, '', url.toString())
    }

    if (storedPage && !validPages.has(storedPage)) {
      window.localStorage.removeItem('archonpro.activePage')
    }
  }, [])

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
    const id = requestAnimationFrame(() => setThemeMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('archonpro.desktopSidebarOpen', desktopSidebarOpen ? '1' : '0')
  }, [desktopSidebarOpen])

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem('archonpro.activePage', activePage)

    const url = new URL(window.location.href)
    if (activePage === 'home') url.searchParams.delete('page')
    else url.searchParams.set('page', activePage)
    window.history.replaceState({}, '', url.toString())
  }, [activePage])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const label = pageLabelById.get(activePage)
    document.title = label ? `ArchonPro — ${label}` : 'ArchonPro'
  }, [activePage])

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Keep page switches visually stable: no smooth scroll animation on navigation.
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [activePage])

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
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const isMeta = e.metaKey || e.ctrlKey

      if (key === 'escape') {
        setCommandOpen(false)
        setSidebarOpen(false)
        return
      }

      if (isMeta && key === 'k') {
        e.preventDefault()
        setCommandOpen((open) => !open)
        return
      }

      if (isMeta && key === 'b') {
        e.preventDefault()
        toggleDesktopSidebar()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Render page content based on active page
  const renderPageContent = () => {
    switch (activePage) {
      case 'bedrijven':
        return <BedrijvenPage />
      case 'contacten':
        return <ContactenPage />
      case 'deals':
        return <DealsPage />
      case 'offertes':
        return <OffertesPage />
      case 'projecten':
        return <ProjectenPage />
      case 'agenda':
        return <AgendaPage />
      case 'inkomsten':
        return <InkomstenPage />
      case 'uitgaven':
        return <UitgavenPage />
      case 'artikelen':
        return <ArtikelenPage />
      case 'timesheets':
        return <TimesheetsPage />
      case 'betalingen':
        return <BetalingenPage />
      case 'ai-assistant':
        return <AIAssistantPage />
      case 'abonnement':
        return <AbonnementPage />
      case 'instellingen':
        return <InstellingenPage />
      default:
        return (
          <DashboardHome
            formattedDate={formattedDate}
            onNavigate={navigateTo}
            onPrefetch={prefetchPage}
          />
        )
    }
  }

  return (
    <div
      className="min-h-screen relative"
      // Useful as a deterministic "hydration done" marker for E2E tests.
      data-mounted={themeMounted ? 'true' : 'false'}
    >
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

      {/* Main Content – alleen margin transition (sidebar), geen layout-animatie bij paginawissel */}
      <div className={`min-h-screen relative z-10 transition-[margin-left] duration-300 ${desktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
          commandOpen={commandOpen}
          onOpenCommand={() => setCommandOpen(true)}
          themeMounted={themeMounted}
          resolvedTheme={resolvedTheme}
          onToggleTheme={toggleTheme}
        />

        {/* Content – min-height voorkomt springen bij paginawissel / lazy load */}
        <div className="p-4 lg:p-6">
          <div className="flex gap-6">
            <div className="flex-1 min-h-[70vh]">
              {renderPageContent()}
            </div>
            
            {/* Static Threads Sidebar - No Animation */}
            <div className="hidden xl:block w-96 shrink-0 sticky top-24 self-start">
              <StaticThreads />
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
