const fs = require('fs')
const path = require('path')

async function main() {
  const envPath = path.join(process.cwd(), '.env.local')
  let env = {}
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    content.split(/\n/).forEach(line => {
      const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/)
      if (m) {
        const key = m[1]
        let val = m[2]
        // strip surrounding quotes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        env[key] = val
      }
    })
  } else {
    console.error('.env.local not found in project root')
    process.exit(1)
  }

  const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Supabase keys missing in .env.local (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)')
    process.exit(2)
  }

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const tables = [
    'inkomsten',
    'uitgaven',
    'artikelen',
    'timesheets',
    'betalingen',
    'afspraken',
    'abonnementen',
    'deals',
    'projecten',
    'bedrijven',
    'contacten'
  ]

  ;(async () => {
    const results = {}
    for (const t of tables) {
      try {
        const { data, error } = await supabase.from(t).select('id').limit(1)
        if (error) {
          results[t] = { ok: false, error: error.message }
        } else {
          results[t] = { ok: true, example: (data && data.length) ? data[0] : null }
        }
      } catch (err) {
        results[t] = { ok: false, error: err.message || String(err) }
      }
    }
    console.log(JSON.stringify({ results }, null, 2))
    process.exit(0)
  })()
}

main()
