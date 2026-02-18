# ArchonPro Agent Instructions (Codex / AI Agent)

## Mission

Maintain a production-grade dashboard where every visible action is functional, predictable, and testable.

## Communication

- Default language: Dutch (switch only if user asks).
- Keep output short and practical.
- Always report:
  1. what changed,
  2. what was validated (commands actually run),
  3. what is pending/blocked + next step.

## Project Context

- Stack: Next.js 16, React 19, TypeScript, Tailwind 4, Prisma, Supabase, Playwright.
- App Router.
- Main app entry: `src/app/page.tsx`
- Dashboard components: `src/components/dashboard/**`
- API routes: `src/app/api/**/route.ts`

## Core Definitions

Every clickable UI control MUST be one of:

1. Navigation (route change)
2. UI state change (open modal, switch tabs, filter)
3. Mutation (create/update/delete via API/data)

If intentionally unavailable:

- disable control + show tooltip text: `Binnenkort`
- must be accessible: aria-disabled, focus/keyboard safe

## Non-Negotiable Rules

1. Never leave dead buttons or menu items.
2. No breaking changes to existing navigation/state sync (`?page=` + localStorage behavior).
3. Keep desktop/mobile behavior consistent.
4. Preserve accessibility: labels, keyboard support, focus states, aria attributes.
5. Do not add secrets/tokens/keys anywhere.

## Hard Safety Limits (MANDATORY)

- Max files touched per task: 10 (tests/specs included).
- Max diff per task: ~400 LOC. If bigger: split into multiple tasks.
- No dependency changes (no `package.json`, lockfiles) unless TASK explicitly says so.
- No repo-wide formatting/refactors.

## Stop & Ask (do not continue) if:

- A migration/schema change seems needed (Prisma/Supabase).
- You must touch >10 files to complete the task.
- Tests/build fail due to missing env/credentials.
- You need to change dependencies to proceed.
- Requirements are ambiguous.

## Execution Protocol (per TASK)

1. Read the affected page/component first.
2. List impacted controls + expected behavior.
3. Implement wiring end-to-end (UI -> handler -> API/data -> feedback).
4. Add loading + success + error states.
5. Run quality gates (below) OR clearly state what could not run and why.
6. Summarize per file: what changed + why.

## Quality Gates (Required Evidence)

Run before finalizing (unless blocked):

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Relevant Playwright tests (at minimum impacted spec files)

Evidence rule:

- Never claim checks passed unless actually executed.
- If a check fails: report the failing command + short error summary.

## API & Data Rules

- Validate all API input.
- Return clear status codes + JSON errors.
- Keep Prisma/Supabase usage consistent with existing models.
- Guard against null/undefined in UI + API.

### Data Change Protocol (if needed)

- Prisma schema change requires: migration + short rollback note.
- Supabase schema/RLS changes require: SQL migration + RLS impact note.
- Do not mix large data changes with UI wiring in the same task unless TASK explicitly requests.

## UI Rules

- No layout jump when switching pages.
- Keep spacing/typography/card styling consistent with existing dashboard style.
- Add skeleton/empty/error states for data-driven sections.
- Toast/feedback for mutations.

## Definition of Done

A task is done only if:

1. all intended controls work,
2. no regression in navigation/layout,
3. checks pass (or are explicitly blocked with reason),
4. changed files + behavior are clearly summarized.

## Useful Commands

- `npm run dev`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run qa:dashboard`
- `npm run qa:dashboard:local`
- `npm run e2e -- e2e/dashboard.e2e.spec.ts --project=chromium --workers=1`
- `npm run e2e -- e2e/buttons-all-pages.spec.ts --project=chromium --workers=1`

## Autopilot Task Queue Rules

- Tasks live in `/tasks` and are numbered `TASK-000.md`, `TASK-001.md`, etc.
- After completing any task `TASK-XYZ`, generate the next task file `TASK-(XYZ+1)` automatically.
- Determine next number by scanning `/tasks` for the highest existing number.
- Each task must be small: max 10 files, max ~400 LOC diff, 1 page/area only.
- Update `docs/task-queue.md` after each task (mark done + reprioritize).
- Never execute more than one task per run.

### Prompt to use with Codex

```
- Lees AGENTS.md.
- Voer tasks/TASK-000.md uit als die nog niet gedaan is. Anders voer de hoogste onvoltooide TASK uit.
- Respecteer max 10 files en max ~400 LOC.
- Na afronden: update docs/task-queue.md en genereer automatisch de volgende tasks/TASK-XXX.md.
- Voer nooit meer dan 1 task per run uit.
- Claim geen tests als je ze niet hebt gerund; noteer blockers.
```
