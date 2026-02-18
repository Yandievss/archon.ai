# ArchonPro BusinessSuite — Projectanalyse

**Datum:** 2026-02-18  
**Doel:** Overzicht om gericht verder te werken.

---

## 1. Stack & structuur

| Onderdeel | Technologie |
|-----------|-------------|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind 4 |
| Data | Prisma (SQLite), Supabase (optioneel) |
| Tests | Playwright (e2e) |
| Taal | TypeScript |

- **Entry:** `src/app/page.tsx` — single-page dashboard met `?page=` + localStorage.
- **Pagina’s:** Dynamisch geladen uit `src/components/pages/*Page.tsx`.
- **API:** `src/app/api/**/route.ts` — REST-achtige routes per module.

---

## 2. Pagina’s (navigatie)

Alle 16 pagina’s bestaan en zijn in `page.tsx` gekoppeld:

| Pagina | Component | API-module |
|--------|-----------|------------|
| Home | DashboardHome | — |
| Bedrijven | BedrijvenPage | `/api/companies` |
| Contacten | ContactenPage | `/api/contacts` |
| Deals | DealsPage | `/api/deals` |
| Offertes | OffertesPage | `/api/offertes` (+ analyze) |
| Facturen | FacturenPage | `/api/facturen` (+ pdf) |
| Projecten | ProjectenPage | `/api/projecten` |
| Agenda | AgendaPage | `/api/afspraken` |
| Inkomsten | InkomstenPage | `/api/inkomsten` |
| Uitgaven | UitgavenPage | `/api/uitgaven` |
| Artikelen | ArtikelenPage | (geen API in lijst) |
| Timesheets | TimesheetsPage | (geen API in lijst) |
| Betalingen | BetalingenPage | (geen API in lijst) |
| AI Assistant | AIAssistantPage | — |
| Abonnement | AbonnementPage | — |
| Instellingen | InstellingenPage | — |

---

## 3. API-routes (aanwezig)

- **Companies:** `route.ts`, `[id]/route.ts`
- **Contacts:** `route.ts`, `[id]/route.ts`
- **Deals:** `route.ts`, `[id]/route.ts`
- **Offertes:** `route.ts`, `[id]/route.ts`, `[id]/analyze/route.ts`, `ai/route.ts`
- **Facturen:** `route.ts`, `[id]/route.ts`, `[id]/pdf/route.ts`
- **Projecten:** `route.ts`, `[id]/route.ts`
- **Afspraken:** `route.ts`, `[id]/route.ts`
- **Inkomsten:** `route.ts`, `[id]/route.ts`
- **Uitgaven:** `route.ts`, `[id]/route.ts`
- **Overig:** `api/route.ts`, `check-tables/route.ts`

Geen aparte routes gezien voor Artikelen, Timesheets, Betalingen (mogelijk stub of elders).

---

## 4. Prisma-modellen

- User, Company, Contact, Deal, Quote, Project, Event  
- Plus modellen voor facturen, inkomsten, uitgaven (in schema aanwezig).

Database: SQLite via `DATABASE_URL`.

---

## 5. Task queue-status (docs/task-queue.md)

- **TASK-000 t/m TASK-012:** Allemaal als DONE gemarkeerd (audit, header, ontbrekende pagina’s, CRUD per module, polish, toegankelijkheid).
- **Backlog:** o.a. zoekfunctie, command palette-zoeken, geavanceerde filters, bulkacties, CSV-export, notificaties, rechten.

---

## 6. Audit (docs/buttons-audit.md) — wat nog “Unclear” is

- **Header:** Notificatieknoppen (openstaande offertes, afspraken vandaag, deals in opvolging) — navigatie bestaan, maar “untested”.
- **Header:** Command palette — opent wel, geen duidelijke zoek-handler.
- **Header:** Profiel-dropdown / logout — onLogout wordt aangeroepen, geen echte auth-API.
- **DashboardHome:** Nog niet gedetailleerd geaudit.

---

## 7. E2E-tests

- `dashboard.e2e.spec.ts`
- `buttons-all-pages.spec.ts`
- `offertes-page.e2e.spec.ts`
- `visual-regression.spec.ts`, `all-action-buttons.spec.ts`, `action-buttons.spec.ts`, `all-buttons.spec.ts`

---

## 8. Aanbevolen volgorde om aan te werken

1. **Kwaliteit nu:** `npm run typecheck`, `npm run lint`, `npm run build` — eventueel falende checks oplossen.
2. **Eerst waarde, weinig risico:**  
   Header-notificaties expliciet doen navigeren naar de juiste pagina + korte E2E of unit voor die knoppen (sluit aan bij TASK-001, nu “verified” maken).
3. **Daarna:**  
   Command palette: zoekactie implementeren (zoeken in pagina’s/acties) — backlog.
4. **Later:**  
   Algemene zoekfunctie, filters, bulkacties, export — per taak max 10 bestanden, ~400 LOC (AGENTS.md).

---

## 9. Handige commando’s

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run e2e -- e2e/dashboard.e2e.spec.ts --project=chromium --workers=1
npm run e2e -- e2e/buttons-all-pages.spec.ts --project=chromium --workers=1
```

---

**Volgende stap:** Kies één richting (bijv. “header-notificaties verifiëren + test” of “command palette zoeken”) en werk die in één taak af (max 10 bestanden, ~400 LOC).
