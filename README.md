# ArchonPro Dashboard

ArchonPro is a business suite dashboard (CRM + projecten + offertes + financiën + AI assistent) gebouwd met Next.js (App Router), TypeScript, Tailwind CSS v4 en shadcn/ui.

## Vereisten

- Node.js 18+ (aanbevolen: 20+)
- npm

## Starten

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build & Production

```bash
npm run build
npm run start
```

Optioneel (logs naar `dev.log` / `server.log`):

```bash
npm run dev:log
npm run start:log
```

## Handige scripts

- `npm run lint`
- `npm run typecheck`
- `npm run e2e` (Playwright)
- `npm run e2e:ui`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:push`

## E2E Tests (Playwright)

Eenmalig (Chromium installeren):

```bash
npx playwright install chromium
```

Run:

```bash
npm run e2e
```

## Projectstructuur (kort)

```text
src/
  app/                 Next.js routes + layout
  components/          UI + dashboard onderdelen
  hooks/               React hooks
  lib/                 helpers/utils
```

## Secrets

Zet API keys in `.env.local` en commit nooit secrets. Roteer keys die per ongeluk gedeeld/gelekt zijn.
