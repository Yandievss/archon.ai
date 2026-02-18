import { useEffect, useMemo, useState } from 'react'

function safeJson(res: Response) {
  return res
    .json()
    .catch(() => null)
}

/** Zorgt dat we altijd een array hebben (API kan { error } of { data } teruggeven). */
function toArray(x: unknown): any[] {
  if (Array.isArray(x)) return x
  if (x != null && typeof x === 'object' && 'data' in x && Array.isArray((x as any).data)) return (x as any).data
  if (x != null && typeof x === 'object' && 'appointments' in x && Array.isArray((x as any).appointments)) return (x as any).appointments
  return []
}

function groupByDay(items: any[], dateKey = 'datum') {
  const map = new Map<string, number>()
  for (const it of items || []) {
    const d = it?.[dateKey] ? new Date(it[dateKey]) : null
    if (!d || Number.isNaN(d.getTime())) continue
    const key = d.toLocaleDateString('nl-NL', { weekday: 'short' })
    map.set(key, (map.get(key) ?? 0) + (Number(it.bedrag ?? it.amount ?? 0) || 0))
  }

  // last 7 days in Dutch short weekday order (Mon..Sun)
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const dt = new Date()
    dt.setDate(dt.getDate() - i)
    days.push(dt.toLocaleDateString('nl-NL', { weekday: 'short' }))
  }

  return days.map((day) => ({ day, amount: Math.round((map.get(day) ?? 0) * 100) / 100 }))
}

export function useDashboardData() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [companies, setCompanies] = useState<any[] | null>(null)
  const [contacts, setContacts] = useState<any[] | null>(null)
  const [appointments, setAppointments] = useState<any[] | null>(null)
  const [incomes, setIncomes] = useState<any[] | null>(null)
  const [offertes, setOffertes] = useState<any[] | null>(null)
  const [projects, setProjects] = useState<any[] | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const [cRes, ctRes, aRes, iRes, oRes, pRes] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/contacts'),
          fetch('/api/afspraken'),
          fetch('/api/inkomsten'),
          fetch('/api/offertes'),
          fetch('/api/projecten'),
        ])

        const [c, ct, a, i, o, p] = await Promise.all([
          safeJson(cRes),
          safeJson(ctRes),
          safeJson(aRes),
          safeJson(iRes),
          safeJson(oRes),
          safeJson(pRes),
        ])

        if (cancelled) return

        // normalize endpoints that return { data } / { error } vs arrays
        setCompanies(toArray(c))
        setContacts(toArray(ct))
        setAppointments(toArray(a))
        setIncomes(toArray(i))
        setOffertes(toArray(o))
        setProjects(toArray(p))
      } catch (err: any) {
        if (cancelled) return
        console.error('Failed to load dashboard data', err)
        setError(String(err?.message ?? err ?? 'unknown'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const stats = useMemo(() => {
    const appointmentsList = toArray(appointments)
    const appointmentsToday = appointmentsList.filter((a) => {
      const d = a?.datum ?? a?.date ?? null
      if (!d) return false
      return (new Date(d)).toISOString().slice(0, 10) === todayStr
    }).length

    const overdueOffertes = toArray(offertes).filter((o) => {
      const status = (o?.status ?? '').toLowerCase()
      const geldig = o?.geldigTot ?? o?.geldig_tot ?? o?.validtot ?? null
      if (status !== 'openstaand' && status !== 'open') return false
      if (!geldig) return true
      return new Date(geldig) < new Date()
    }).length

    const dealsInFollowUp = toArray(offertes).filter((o) => {
      const status = (o?.status ?? '').toLowerCase()
      return status === 'openstaand' || status === 'voorstel' || status === 'onderhandeling'
    }).length

    const tasksDue = toArray(projects).filter((pr) => {
      const endDate = pr?.einddatum ?? pr?.endDate ?? pr?.end_date ?? null
      if (!endDate) return false
      const daysLeft = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000)
      return daysLeft <= 7 && daysLeft >= 0
    }).length

    return { appointmentsToday, overdueOffertes, dealsInFollowUp, tasksDue }
  }, [appointments, offertes, projects, todayStr])

  const revenueData = useMemo(() => groupByDay(toArray(incomes), 'datum'), [incomes])

  const dealsData = useMemo(() => {
    const byStatus = new Map<string, number>()
    for (const o of toArray(offertes)) {
      const s = (o?.status ?? 'Onbekend')
      byStatus.set(s, (byStatus.get(s) ?? 0) + 1)
    }

    const palette = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6']
    let idx = 0
    return Array.from(byStatus.entries()).map(([name, value]) => ({ name, value, color: palette[(idx++) % palette.length] }))
  }, [offertes])

  const activities = useMemo(() => {
    const acts: any[] = []
    for (const a of toArray(appointments).slice(0, 6)) {
      acts.push({
        id: a?.id ?? `appt-${Math.random().toString(36).slice(2)}`,
        time: a?.tijd ?? a?.time ?? '',
        action: a?.onderwerp ?? a?.onderwerp ?? 'Afspraak',
        user: a?.contactpersoon ?? '',
        type: 'appointment'
      })
    }
    for (const i of toArray(incomes).slice(0, 6)) {
      acts.push({
        id: i?.id ?? `income-${Math.random().toString(36).slice(2)}`,
        time: i?.created_at ?? i?.createdAt ?? '',
        action: i?.titel ?? i?.omschrijving ?? 'Inkomst',
        user: i?.bedrijven?.[0]?.naam ?? '',
        type: 'invoice'
      })
    }
    for (const c of toArray(contacts).slice(0, 6)) {
      acts.push({
        id: c?.id ?? `contact-${Math.random().toString(36).slice(2)}`,
        time: c?.createdAt ?? c?.created_at ?? '',
        action: `Contact toegevoegd: ${c?.voornaam ?? c?.firstName ?? ''} ${c?.achternaam ?? c?.lastName ?? ''}`,
        user: c?.bedrijf ?? c?.company ?? '',
        type: 'contact'
      })
    }
    return acts.slice(0, 10)
  }, [appointments, incomes, contacts])

  return {
    loading,
    error,
    stats,
    revenueData,
    dealsData,
    activities,
  }
}

export default useDashboardData
