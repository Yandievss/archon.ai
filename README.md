# ArchonPro Dashboard

ArchonPro is een geavanceerde business suite dashboard (CRM + projecten + offertes + financiën + AI assistent) gebouwd met de modernste webtechnologieën.

## 🚀 Technologieën

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Taal:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Componenten:** [shadcn/ui](https://ui.shadcn.com/)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **AI Integratie:** OpenAI & Google Gemini

## 📋 Vereisten

- Node.js 20+
- npm of pnpm
- Een Supabase project

## 🛠️ Installatie

1. Clone de repository:
   ```bash
   git clone https://github.com/Yandievss/archon.ai.git
   cd archon.ai
   ```

2. Installeer afhankelijkheden:
   ```bash
   npm install
   ```

3. Configureer omgevingsvariabelen:
   Maak een `.env.local` bestand aan met de volgende variabelen:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=jouw-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=jouw-anon-key
   SUPABASE_SERVICE_ROLE_KEY=jouw-service-role-key
   OPENAI_API_KEY=jouw-openai-key
   GEMINI_API_KEY=jouw-gemini-key
   ```

4. Start de ontwikkelomgeving:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## 🏗️ Projectstructuur

- `src/app/`: Next.js routes en API endpoints.
- `src/components/`: Herbruikbare UI componenten en dashboard onderdelen.
- `src/hooks/`: Custom React hooks voor data fetching en state management.
- `src/lib/`: Utility functies en gedeelde configuraties.
- `supabase/`: Database migraties en schema definities.

## 🧪 Scripts

- `npm run lint`: Voer ESLint uit voor code kwaliteit.
- `npm run typecheck`: Controleer TypeScript types.
- `npm run build`: Bouw de applicatie voor productie.
- `npm run e2e`: Voer end-to-end tests uit met Playwright.
- `npm run db:push`: Push het Prisma schema naar de database.

## 📄 Licentie

Dit project is privé eigendom.
