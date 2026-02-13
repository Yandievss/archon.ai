import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../src/lib/supabaseAdmin'

export async function GET() {
  const tables = [
    'inkomsten',
    'uitgaven',
    'artikelen',
    'timesheets',
    'betalingen',
    'afspraken',
    'abonnementen',
    'deals',
    'projects',
    'companies',
    'contacts',
  ]

  const results: Record<string, any> = {}

  for (const table of tables) {
    try {
      const { data, error } = await supabaseAdmin.from(table).select('id').limit(1)
      if (error) {
        // If relation/table doesn't exist, Postgres returns an error — report as missing
        results[table] = { ok: false, error: String(error.message ?? error) }
      } else {
        results[table] = { ok: true, example: (data && data.length > 0) ? data[0] : null }
      }
    } catch (err: any) {
      results[table] = { ok: false, error: String(err?.message ?? err) }
    }
  }

  return NextResponse.json({ results })
}
