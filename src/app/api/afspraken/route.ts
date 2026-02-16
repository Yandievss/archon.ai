import { NextResponse } from 'next/server'
import { z } from 'zod'

import {
  mapCompanyNamesById,
  resolveCompanyId,
} from '@/app/api/finance/finance-utils'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

import {
  combineDateAndTime,
  normalizeAfspraakRow,
  normalizeDeelnemers,
} from './afspraak-utils'

const CreateAfspraakSchema = z.object({
  titel: z.string().trim().min(1, 'Titel is verplicht'),
  beschrijving: z.string().trim().optional(),
  datum: z.string().min(1),
  startTijd: z.string().min(1),
  eindTijd: z.string().optional(),
  locatie: z.string().trim().optional(),
  deelnemers: z.array(z.string()).optional(),
  bedrijf: z.string().trim().optional(),
  bedrijfId: z.coerce.number().int().positive().nullable().optional(),
})

const afspraakSelect = 'id, titel, beschrijving, start_tijd, eind_tijd, locatie, deelnemers, bedrijf_id, created_at'

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
      .from('afspraken')
      .select(afspraakSelect)
      .order('start_tijd', { ascending: true })
      .limit(500)

    if (result.error) throw result.error

    const rows = (result.data ?? []) as any[]
    const companyMap = await mapCompanyNamesById(
      supabase as any,
      rows.map((row) => row.bedrijf_id as number | null | undefined)
    )

    return NextResponse.json(
      rows.map((row) => normalizeAfspraakRow({
        ...row,
        companyName: companyMap.get(Number(row.bedrijf_id)) ?? null,
      }))
    )
  } catch (error) {
    console.error('Error fetching afspraken:', error)
    return NextResponse.json({ error: 'Kon afspraken niet laden.' }, { status: 500 })
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

    const validated = CreateAfspraakSchema.parse({
      titel: body?.titel ?? body?.onderwerp,
      beschrijving: body?.beschrijving,
      datum: body?.datum,
      startTijd: body?.startTijd ?? body?.tijd,
      eindTijd: body?.eindTijd,
      locatie: body?.locatie,
      deelnemers: normalizeDeelnemers(body?.deelnemers),
      bedrijf: body?.bedrijf,
      bedrijfId: body?.bedrijfId ?? body?.bedrijf_id,
    })

    const startTimestamp = combineDateAndTime(validated.datum, validated.startTijd)
    if (!startTimestamp) {
      return NextResponse.json({ error: 'Ongeldige startdatum of starttijd.' }, { status: 400 })
    }

    const endTimestamp = validated.eindTijd
      ? combineDateAndTime(validated.datum, validated.eindTijd)
      : null

    if (validated.eindTijd && !endTimestamp) {
      return NextResponse.json({ error: 'Ongeldige eindtijd.' }, { status: 400 })
    }

    const bedrijfId = await resolveCompanyId({
      supabase: supabase as any,
      companyName: validated.bedrijf,
      requestedCompanyId: validated.bedrijfId,
    })

    const insertResult = await (supabase as any)
      .from('afspraken')
      .insert([
        {
          titel: validated.titel,
          beschrijving: validated.beschrijving || null,
          start_tijd: startTimestamp,
          eind_tijd: endTimestamp,
          locatie: validated.locatie || null,
          deelnemers: validated.deelnemers ?? [],
          bedrijf_id: bedrijfId,
        },
      ])
      .select(afspraakSelect)
      .single()

    if (insertResult.error) throw insertResult.error

    const companyMap = await mapCompanyNamesById(supabase as any, [(insertResult.data as any).bedrijf_id])

    return NextResponse.json(
      normalizeAfspraakRow({
        ...insertResult.data,
        companyName: companyMap.get(Number((insertResult.data as any).bedrijf_id)) ?? null,
      }),
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validatiefout', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating afspraak:', error)
    return NextResponse.json({ error: 'Kon afspraak niet aanmaken.' }, { status: 500 })
  }
}
