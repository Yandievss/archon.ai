import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

const CreateContactSchema = z.object({
  voornaam: z.string().trim().min(1, 'Voornaam is verplicht'),
  achternaam: z.string().trim().min(1, 'Achternaam is verplicht'),
  email: z.string().email().optional().or(z.literal('')).nullable(),
  telefoon: z.string().optional().or(z.literal('')).nullable(),
  functie: z.string().optional().or(z.literal('')).nullable(),
  bedrijf: z.string().optional().or(z.literal('')).nullable(),
  bedrijfId: z.coerce.number().int().positive().nullable().optional(),
})

function normalizeContactRow(row: any) {
  const bedrijfLink = Array.isArray(row?.bedrijven) ? row.bedrijven[0] : row?.bedrijven

  return {
    id: String(row.id),
    voornaam: String(row.voornaam ?? ''),
    achternaam: String(row.achternaam ?? ''),
    email: row.email ? String(row.email) : null,
    telefoon: row.telefoon ? String(row.telefoon) : null,
    functie: row.functie ? String(row.functie) : null,
    bedrijf: bedrijfLink?.naam ? String(bedrijfLink.naam) : null,
    bedrijfId: row.bedrijf_id == null ? null : Number(row.bedrijf_id),
    created_at: row.created_at ? String(row.created_at) : null,
    updated_at: row.updated_at ? String(row.updated_at) : (row.created_at ? String(row.created_at) : null),
  }
}

async function resolveCompanyId(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  bedrijf: string | null | undefined,
  requestedCompanyId: number | null | undefined
): Promise<number | null> {
  if (requestedCompanyId != null) return requestedCompanyId
  if (!bedrijf || !bedrijf.trim()) return null

  const trimmedName = bedrijf.trim()
  const supabaseAny = supabase as any

  const existingCompany = await supabaseAny
    .from('bedrijven')
    .select('id')
    .ilike('naam', trimmedName)
    .order('id', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (existingCompany.error) throw existingCompany.error
  if (existingCompany.data?.id != null) return Number(existingCompany.data.id)

  const createdCompany = await supabaseAny
    .from('bedrijven')
    .insert([{ naam: trimmedName }])
    .select('id')
    .single()

  if (createdCompany.error) throw createdCompany.error

  return Number(createdCompany.data.id)
}

export async function GET() {
  let supabase: ReturnType<typeof getSupabaseAdmin>

  try {
    supabase = getSupabaseAdmin()
  } catch {
    return NextResponse.json(
      { error: 'Supabase admin client is niet geconfigureerd.' },
      { status: 503 }
    )
  }

  try {
    const result = await (supabase as any)
      .from('contacten')
      .select('id, voornaam, achternaam, email, telefoon, functie, bedrijf_id, created_at, updated_at, bedrijven:bedrijf_id ( id, naam )')
      .order('created_at', { ascending: false })
      .limit(500)

    if (result.error) throw result.error

    return NextResponse.json((result.data ?? []).map(normalizeContactRow))
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ error: 'Kon contacten niet laden.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  let supabase: ReturnType<typeof getSupabaseAdmin>

  try {
    supabase = getSupabaseAdmin()
  } catch {
    return NextResponse.json(
      { error: 'Supabase admin client is niet geconfigureerd.' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()

    const validated = CreateContactSchema.parse({
      voornaam: body?.voornaam ?? body?.firstName,
      achternaam: body?.achternaam ?? body?.lastName,
      email: body?.email ?? null,
      telefoon: body?.telefoon ?? body?.phone ?? null,
      functie: body?.functie ?? body?.position ?? null,
      bedrijf: body?.bedrijf ?? body?.companyName ?? null,
      bedrijfId: body?.bedrijfId ?? body?.companyId ?? null,
    })

    const bedrijfId = await resolveCompanyId(supabase, validated.bedrijf, validated.bedrijfId)

    const result = await (supabase as any)
      .from('contacten')
      .insert([
        {
          voornaam: validated.voornaam,
          achternaam: validated.achternaam,
          email: validated.email || null,
          telefoon: validated.telefoon || null,
          functie: validated.functie || null,
          bedrijf_id: bedrijfId,
        },
      ])
      .select('id, voornaam, achternaam, email, telefoon, functie, bedrijf_id, created_at, updated_at, bedrijven:bedrijf_id ( id, naam )')
      .single()

    if (result.error) throw result.error

    return NextResponse.json(normalizeContactRow(result.data), { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validatiefout', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating contact:', error)
    return NextResponse.json({ error: 'Kon contact niet aanmaken.' }, { status: 500 })
  }
}
