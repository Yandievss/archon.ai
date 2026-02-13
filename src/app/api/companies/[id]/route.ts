import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/db'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

type RouteContext = {
  params: Promise<{ id: string }>
}

const CompanyUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  sector: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  description: z.string().optional(),
  status: z.enum(['Actief', 'Inactief', 'Nieuw']).optional(),
})

function isPrismaMissingTableError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2021'
  )
}

function parseCompanyId(rawId: string) {
  const id = Number(rawId)
  return Number.isFinite(id) ? id : null
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params

  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: true,
        deals: true,
        projects: true,
        quotes: true,
      },
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    if (!isPrismaMissingTableError(error)) {
      console.error('Error fetching company:', error)
      return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 })
    }

    const companyId = parseCompanyId(id)
    if (companyId == null) {
      return NextResponse.json({ error: 'Invalid company id' }, { status: 400 })
    }

    try {
      const supabase = getSupabaseAdmin() as any
      const companyResult = await supabase
        .from('bedrijven')
        .select('id, naam, stad, email, telefoon, created_at')
        .eq('id', companyId)
        .maybeSingle()

      if (companyResult.error) throw companyResult.error
      if (!companyResult.data) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 })
      }

      const company = companyResult.data as any
      return NextResponse.json({
        id: String(company.id),
        name: company.naam,
        location: company.stad,
        email: company.email,
        phone: company.telefoon,
        status: 'Actief',
        contacts: [],
        deals: [],
        projects: [],
        quotes: [],
      })
    } catch (fallbackError) {
      console.error('Fallback error fetching company from Supabase:', fallbackError)
      return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 })
    }
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params

  try {
    const body = await request.json()
    const validatedData = CompanyUpdateSchema.parse(body)

    try {
      const company = await prisma.company.update({
        where: { id },
        data: validatedData,
      })

      return NextResponse.json(company)
    } catch (prismaError) {
      if (!isPrismaMissingTableError(prismaError)) throw prismaError

      const companyId = parseCompanyId(id)
      if (companyId == null) {
        return NextResponse.json({ error: 'Invalid company id' }, { status: 400 })
      }

      const supabase = getSupabaseAdmin() as any
      const updatePayload: Record<string, string | null> = {}

      if (validatedData.name !== undefined) updatePayload.naam = validatedData.name
      if (validatedData.location !== undefined) updatePayload.stad = validatedData.location || null
      if (validatedData.email !== undefined) updatePayload.email = validatedData.email || null
      if (validatedData.phone !== undefined) updatePayload.telefoon = validatedData.phone || null
      if (validatedData.description !== undefined) updatePayload.adres = validatedData.description || null

      const { data, error } = await supabase
        .from('bedrijven')
        .update(updatePayload)
        .eq('id', companyId)
        .select('id, naam, stad, email, telefoon')
        .maybeSingle()

      if (error) throw error
      if (!data) return NextResponse.json({ error: 'Company not found' }, { status: 404 })

      return NextResponse.json({
        id: String(data.id),
        name: data.naam,
        location: data.stad,
        email: data.email,
        phone: data.telefoon,
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating company:', error)
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params

  try {
    await prisma.company.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (!isPrismaMissingTableError(error)) {
      console.error('Error deleting company:', error)
      return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 })
    }

    const companyId = parseCompanyId(id)
    if (companyId == null) {
      return NextResponse.json({ error: 'Invalid company id' }, { status: 400 })
    }

    try {
      const supabase = getSupabaseAdmin() as any
      const { error: deleteError } = await supabase.from('bedrijven').delete().eq('id', companyId)
      if (deleteError) throw deleteError
      return NextResponse.json({ success: true }, { status: 200 })
    } catch (fallbackError) {
      console.error('Fallback error deleting company from Supabase:', fallbackError)
      return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 })
    }
  }
}
