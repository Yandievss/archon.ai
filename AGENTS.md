# ArchonPro Agent Instructions

## Mission
Build and maintain a production-grade dashboard where every visible action is functional, predictable, and testable.

## Project Context
- Stack: Next.js 16, React 19, TypeScript, Tailwind 4, Prisma, Supabase, Playwright.
- Main app entry: `src/app/page.tsx`.
- Dashboard components: `src/components/dashboard/*`.
- API routes: `src/app/api/**/route.ts`.

## Non-Negotiable Rules
1. Never leave dead buttons or menu items.
2. Every clickable element must be one of:
   - navigation,
   - UI state change (open modal, toggle, filter),
   - mutation (create/update/delete).
3. If functionality is intentionally unavailable, disable the control and show tooltip text `Binnenkort`.
4. Do not break existing page navigation/state synchronization (`?page=` and localStorage behavior).
5. Keep desktop and mobile behavior consistent.
6. Preserve accessibility: labels, keyboard support, focus states, aria attributes.

## Execution Protocol
1. Read the affected page/component first.
2. List all impacted controls and expected behavior.
3. Implement wiring end-to-end (UI -> handler -> API/data -> feedback).
4. Add loading, success, and error states for async actions.
5. Run quality checks before finishing.

## Quality Gates (Required)
Run these before finalizing:
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- relevant Playwright tests (at minimum the impacted spec files)

## API and Data Rules
- Validate all API input.
- Return clear status codes and JSON error messages.
- Keep Prisma/Supabase schema usage consistent with existing models.
- Protect against null/undefined access in UI and API.

## UI Rules
- No layout jump when switching pages.
- Keep spacing, typography, and card styling consistent with existing dashboard style.
- Add skeleton/empty/error states for data-driven sections.

## Definition of Done
A task is done only if:
1. all intended controls work,
2. no regression in navigation/layout,
3. checks pass,
4. changed files and behavior are clearly summarized.

## Useful Commands
- `npm run dev`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run e2e -- e2e/dashboard.e2e.spec.ts --project=chromium --workers=1`
- `npm run e2e -- e2e/buttons-all-pages.spec.ts --project=chromium --workers=1`
