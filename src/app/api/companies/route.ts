import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/db'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

const CompanySchema = z.object({
  name: z.string().min(1, 'Naam is verplicht'),
  sector: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  description: z.string().optional(),
  vatNumber: z.string().optional(),
  status: z.enum(['Actief', 'Inactief', 'Nieuw']).default('Actief'),
})

function isPrismaMissingTableError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2021'
  )
}

function deriveStatus(createdAt: string | null): 'Actief' | 'Nieuw' {
  if (createdAt) {
    const createdDate = new Date(createdAt)
    const daysSinceCreation = Math.floor((Date.now() - createdDate.getTime()) / 86_400_000)
    if (Number.isFinite(daysSinceCreation) && daysSinceCreation <= 30) return 'Nieuw'
  }
  return 'Actief'
}

async function listSupabaseCompanies(params: {
  status: string | null
  sector: string | null
  search: string | null
}) {
  const { status, sector, search } = params
  const supabase = getSupabaseAdmin() as any

  const bedrijvenResult = await supabase.from('bedrijven').select('id, naam, stad, email, created_at, btw')

  if (bedrijvenResult.error) throw bedrijvenResult.error

  const normalizedSearch = search?.trim().toLowerCase() ?? ''

  const payload = ((bedrijvenResult.data ?? []) as any[])
    .map((bedrijf) => {
      const computedStatus = deriveStatus(bedrijf.created_at ?? null)

      return {
        id: String(bedrijf.id),
        name: bedrijf.naam,
        sector: 'Onbekend',
        location: bedrijf.stad ?? null,
        email: bedrijf.email ?? null,
        vatNumber: bedrijf.btw ?? null,
        status: computedStatus,
        dealValue: 0,
        _count: {
          contacts: 0,
          deals: 0,
          projects: 0,
        },
      }
    })
    .filter((company) => {
      if (status && company.status !== status) return false
      if (sector && company.sector !== sector) return false
      if (!normalizedSearch) return true

      return (
        company.name.toLowerCase().includes(normalizedSearch) ||
        (company.location ?? '').toLowerCase().includes(normalizedSearch) ||
        (company.email ?? '').toLowerCase().includes(normalizedSearch)
      )
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return payload
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const sector = searchParams.get('sector')
  const search = searchParams.get('search')

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (sector) where.sector = sector
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  try {
    const companies = await prisma.company.findMany({
      where,
      include: {
        _count: {
          select: {
            contacts: true,
            deals: true,
            projects: true,
          },
        },
        deals: {
          select: {
            value: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const payload = companies.map((company) => {
      const dealValue = company.deals.reduce((sum, deal) => sum + (deal.value ?? 0), 0)
      const { deals, ...rest } = company
      return { ...rest, dealValue }
    })

    return NextResponse.json(payload)
  } catch (error) {
    if (!isPrismaMissingTableError(error)) {
      console.error('Error fetching companies:', error)
      return NextResponse.json(
        { error: 'Failed to fetch companies' },
        { status: 500 }
      )
    }

    try {
      const fallbackPayload = await listSupabaseCompanies({ status, sector, search })
      return NextResponse.json(fallbackPayload)
    } catch (fallbackError) {
      console.error('Fallback error fetching companies from Supabase:', fallbackError)
      return NextResponse.json(
        { error: 'Failed to fetch companies' },
        { status: 500 }
      )
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = CompanySchema.parse(body)

    try {
      const company = await prisma.company.create({
        data: validatedData,
      })

      return NextResponse.json(company, { status: 201 })
    } catch (prismaError) {
      if (!isPrismaMissingTableError(prismaError)) throw prismaError

      const supabase = getSupabaseAdmin() as any
      const { data, error } = await supabase
        .from('bedrijven')
        .insert([
          {
            naam: validatedData.name,
            stad: validatedData.location || null,
            email: validatedData.email || null,
            telefoon: validatedData.phone || null,
            adres: validatedData.description || null,
            btw: validatedData.vatNumber || null,
          },
        ])
        .select('id, naam, stad, email, created_at')
        .single()

      if (error) throw error

      return NextResponse.json(
        {
          id: String(data.id),
          name: data.naam,
          sector: validatedData.sector || 'Onbekend',
          location: data.stad,
          email: data.email,
          status: 'Nieuw',
          dealValue: 0,
          _count: { contacts: 0, deals: 0, projects: 0 },
        },
        { status: 201 }
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating company:', error)
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    )
  }
}
