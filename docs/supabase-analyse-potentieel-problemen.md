# Analyse: Supabase en mogelijke problemen

**Datum:** 18 feb 2026  
**Doel:** Inzicht in wat naast Supabase wordt gebruikt en waar dat problemen kan geven.

---

## 1. Wat je nu gebruikt

| Onderdeel | Gebruik |
|-----------|--------|
| **Supabase** | PostgreSQL-database, Storage (o.a. factuur-PDF’s), client in `src/lib/supabase.ts`, admin in `src/lib/supabaseAdmin.ts`. API’s: afspraken, projecten, contacten, offertes, facturen, en (als fallback) bedrijven. |
| **Prisma + SQLite** | Alleen voor **bedrijven (companies)** in `src/app/api/companies/route.ts` en `src/app/api/companies/[id]/route.ts`. Schema: `prisma/schema.prisma`, database: `prisma/dev.db` (SQLite). |

---

## 2. Belangrijkste risico: twee bronnen voor “bedrijven”

- **Companies API** doet eerst een Prisma-aanroep (SQLite).  
- Als die faalt met **P2021** (tabel niet gevonden), wordt er **Supabase** gebruikt als fallback.

Gevolgen:

- **Data split:** Afhankelijk van omgeving/DB-staat schrijven of lezen je in SQLite **of** in Supabase. Data is niet automatisch gesynchroniseerd.
- **IDs:** Prisma gebruikt `cuid` (string), Supabase-tabel `bedrijven` gebruikt integer `id`. De API mapt wel, maar in de rest van de app (contacten, projecten, offertes, …) wordt overal naar Supabase verwezen; die relaties verwachten bedrijf-IDs zoals in Supabase.
- **Veldnamen:** Prisma: `name`, `sector`, `location`. Supabase: `naam`, `stad`, etc. De fallback mapt dit, maar je hebt in feite twee modellen voor hetzelfde begrip “bedrijf”.

**Aanbeveling:** Kies één bron van waarheid voor bedrijven. Gezien de rest van de app op Supabase draait, is het het zuiverst om **alleen Supabase** te gebruiken voor bedrijven en Prisma/SQLite daaruit te halen (of alleen nog voor iets anders, bv. lokale dev zonder Supabase).

---

## 3. Prisma + SQLite naast Supabase

- **Prisma** is geconfigureerd met `provider = "sqlite"` en `url = env("DATABASE_URL")` (vaak `file:./dev.db`).
- **Supabase** is je echte productie-/cloud-database (PostgreSQL).

Problemen die kunnen optreden:

- **Lokaal zonder Supabase-keys:** Companies werken via Prisma/SQLite; andere API’s (afspraken, projecten, facturen, …) kunnen 503 of “Supabase admin niet geconfigureerd” geven.
- **Met Supabase, zonder geldige SQLite/Prisma-tabellen:** Prisma gooit P2021, companies vallen terug op Supabase. Dan werkt alles via Supabase, maar de code blijft dubbel en verwarrend.
- **Build/deploy:** Als `DATABASE_URL` in productie niet staat of naar een niet-bestaand SQLite-bestand wijst, gedraagt de companies-API zich anders dan wanneer Prisma wél zou werken.

Als je volledig op Supabase gaat: Prisma alleen nog gebruiken waar je het bewust voor wilt inzetten (bijv. een aparte SQLite-DB voor iets anders), niet voor dezelfde entiteiten als Supabase.

---

## 4. next-auth

- **next-auth** staat in `package.json`, maar in `src` wordt geen `getServerSession`, `useSession` of andere next-auth-aanroepen gebruikt.
- Er is dus **geen actief tweede auth-systeem** in de code.

Mogelijke problemen later:

- Als je **Supabase Auth** (login/sessie) gaat gebruiken en later ook next-auth zou toevoegen, krijg je twee auth-flows. Beter is één keuze: ofwel Supabase Auth, ofwel next-auth (bijv. met Supabase als provider).
- Geen direct conflict nu, wel iets om op te letten bij het toevoegen van inloggen.

---

## 5. Environment variables

Relevante variabelen:

| Variabele | Gebruik |
|-----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase-project-URL (client + server). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (client-side, bv. hooks/command palette). |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (server-only, o.a. API-routes). **Niet** in de browser zetten. |
| `DATABASE_URL` | Alleen voor Prisma (SQLite), bv. `file:./prisma/dev.db`. |

Als Supabase-keys ontbreken: alle API’s die `getSupabaseAdmin()` gebruiken geven 503 of gooien.  
Als alleen `DATABASE_URL` ontbreekt of Prisma-tabellen bestaan niet: companies-API valt terug op Supabase (mits Supabase-keys wel staan).

---

## 6. RLS (Row Level Security) in Supabase

- In de docs staat dat RLS is ingeschakeld maar dat policy-push vanuit de CLI is tegengehouden (o.a. DNS/network).
- RLS moet handmatig in de Supabase Console (SQL Editor) worden toegepast; zie `docs/SUPABASE_RLS_SETUP_GUIDE.md`.

Risico’s:

- **Te strikte RLS:** Queries kunnen geen rijen zien of updaten → API’s retourneren lege data of 403/500.
- **Te soepele RLS:** Data is voor iedereen lees-/schrijfbaar als iemand je anon key kent.

Zodra je Supabase echt gebruikt: RLS-policies bewust instellen en testen (bijv. met de service role en met anon key).

---

## 7. Overzicht: wat kan je problemen bezorgen

| Onderdeel | Risico | Wat te doen |
|-----------|--------|-------------|
| **Prisma + Supabase voor dezelfde data (bedrijven)** | Twee bronnen, andere IDs/velden, verwarring en bugs. | Eén bron kiezen; aanbevolen: alles bedrijven via Supabase, Prisma uit companies-API halen. |
| **Prisma/SQLite als “hoofd-DB” naast Supabase** | Inconsistent gedrag lokaal vs productie; afhankelijk van welke DB beschikbaar is. | Duidelijke keuze: ofwel alles Supabase, ofwel Prisma alleen voor een apart use-case + duidelijke scheiding. |
| **Ontbrekende of verkeerde Supabase env vars** | 503 / “Supabase admin niet geconfigureerd” in alle API’s die Supabase gebruiken. | `.env.local` (lokaal) en productie-omgeving: URL + anon key + service role key correct zetten. |
| **RLS niet of verkeerd ingesteld** | Lege resultaten of onverwachte fouten; of juist te veel rechten. | RLS-policies in Supabase Console toepassen en testen. |
| **next-auth later naast Supabase Auth** | Twee inlogsystemen. | Eén auth-strategie kiezen (bijv. alleen Supabase Auth). |

---

## 8. Korte conclusie

- **Supabase** is je hoofdbackend; dat is consistent.
- **Problemen komen vooral door:**  
  1) **Prisma/SQLite voor dezelfde entiteit “bedrijven”** (dubbele bron, andere IDs/velden), en  
  2) **configuratie** (env vars, RLS).

Als je volledig op Supabase gaat: bedrijven-API omzetten naar alleen Supabase (zoals de andere API’s) en Prisma/SQLite voor dit domein loslaten, vermindert verrassingen en onderhoud.

---

## 9. Uitgevoerd (18 feb 2026)

- **Companies API** is volledig op Supabase gezet:
  - `src/app/api/companies/route.ts`: GET en POST gebruiken alleen nog `getSupabaseAdmin()` en tabel `bedrijven`. Geen Prisma meer.
  - `src/app/api/companies/[id]/route.ts`: GET, PUT, PATCH en DELETE gebruiken alleen nog Supabase; `id` wordt als integer geparsed (Supabase `bedrijven.id`).
- Prisma wordt in de companies-routes niet meer gebruikt. `src/lib/db.ts` en het Prisma-schema bestaan nog (o.a. voor andere modellen); niets in `src` importeert `@/lib/db` voor companies.
- Typecheck: geslaagd. Build: Next.js compileert succesvol (eventuele fout komt door het `cp`-commando in het build-script op Windows, niet door deze wijziging).
