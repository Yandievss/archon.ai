# Overzicht: welke mappen zijn nodig en welke niet

**Datum:** 18 feb 2026

---

## Nodig voor de applicatie (niet verwijderen)

| Map | Reden |
|-----|--------|
| **src/** | Alle app-code: pages, components, API-routes, lib, hooks. |
| **public/** | Statische bestanden (favicon, images). Next.js verwacht deze map. |
| **node_modules/** | NPM-pakketten. Wordt gegenereerd door `npm install`. |
| **supabase/** | Migraties en schema voor Supabase (PostgreSQL). Database staat hier gedefinieerd. |
| **prisma/** | Schema + evt. `dev.db`. Nog in gebruik voor `db:push` / `db:generate` in package.json; companies-API gebruikt Supabase, maar Prisma-schema en -scripts bestaan nog. |

---

## Nodig voor ontwikkeling en kwaliteit

| Map | Reden |
|-----|--------|
| **e2e/** | Playwright E2E-tests. Verwijzen in `playwright.config.ts` en `qa:dashboard`-scripts. |
| **scripts/** | o.a. `check-tables.mjs` (Supabase-tabellen check), `supabase-setup.sh`. In package.json: `supabase:setup` → `scripts/supabase-setup.sh`. |
| **docs/** | Documentatie (o.a. SUPABASE_INTEGRATION, task-queue, analyse). Handig voor team en onderhoud. |
| **tasks/** | Task-queue (TASK-000.md, etc.) zoals in AGENTS.md. |

---

## Build- en testoutput (tijdelijk / gegenereerd)

| Map | Reden |
|-----|--------|
| **.next/** | Next.js build-output. Gegenereerd door `next build` / `next dev`. In .gitignore. |
| **output/** | Playwright report en test-results (`output/playwright/report`, `output/playwright/test-results`). In .gitignore. |

Deze mappen zijn **nodig tijdens/na build en tests**, maar horen niet in git. Niet handmatig verwijderen als je net gebuild of getest hebt; ze kunnen steeds opnieuw gegenereerd worden.

---

## Optioneel / tooling / omgeving

| Map | Reden |
|-----|--------|
| **.github/** | GitHub Actions (CI). Nodig als je CI gebruikt; anders optioneel. |
| **.vscode/** | VS Code-instellingen. Alleen lokaal handig; in .gitignore staat `.vscode/settings.json`. |
| **.antigravity/** | Project/tooling-configuratie. Blijft staan tenzij je die tooling niet gebruikt. |
| **.codex / .qodo / .roo / .zscripts** | In .gitignore. Tooling/scripts van andere omgevingen; niet nodig voor `npm run build` of `npm run typecheck`. |
| **.windsurf/** | In .gitignore. IDE-specifiek; niet nodig voor de app. |

---

## Opgeruimd (18 feb 2026)

De volgende mappen en het genoemde bestand zijn verwijderd:

- **examples/** (incl. websocket-voorbeelden) — niet gecompileerd, niet gebruikt.
- **mini-services/** — alleen door .zscripts gebruikt, niet door de app.
- **db/** — lege map, geen referenties in de app.
- **download/** (incl. analysis1.json, analysis2.json, README.md) — geen referenties in de app.
- **upload/** — lege map.
- **src/lib/db.ts** — ongebruikte Prisma-client (companies gebruikt Supabase).

In `tsconfig.json` is `"examples"` uit de `exclude`-lijst gehaald (map bestaat niet meer).

---

## Korte samenvatting

- **Echt nodig:** `src`, `public`, `node_modules`, `supabase`, `prisma` (voor schema/scripts), `e2e`, `scripts`, `docs`, `tasks`.
- **Gegenereerd / in .gitignore:** `.next`, `output`.
- **Optioneel/tooling:** `.github`, `.vscode`, `.antigravity`, `.codex`, `.qodo`, `.roo`, `.zscripts`, `.windsurf`.
- **Reeds opgeruimd:** `examples`, `mini-services`, `db`, `download`, `upload`, en `src/lib/db.ts`.

Als je een map wilt opruimen: eerst controleren of er geen scripts of CI zijn die er expliciet naar verwijzen (bijv. `scripts/supabase-setup.sh` → `scripts/` laten staan).
