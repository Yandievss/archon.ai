# Customizations Preset (Cascade / Editor)

Use this file to quickly fill `Rules`, `Skills`, `Workflows`, and `Memories` in your customization screen.

## Rules
### Global Rule (short)
```text
Always execute changes end-to-end: implement behavior, validate with typecheck/lint/build, and summarize changed files + risks.
```

### Workspace Rule (ArchonPro)
```text
Follow /Users/innovarslabo/Downloads/workspace-fdc7a0c2-c6fd-43d4-a8ea-262f977fcc44/AGENTS.md as source of truth.
Focus on dashboard reliability: no dead buttons, stable layout on page switch, accessible controls, and tested behavior.
Before done: npm run typecheck, npm run lint, npm run build, plus relevant Playwright specs.
```

## Skills
Enable at Workspace scope:
- playwright
- openai-docs
- linear (only when ticketing is requested)
- vercel-deploy (only when deploy is requested)
- pdf (only for PDF tasks)

Keep Global:
- find-skills

## Workflows
Keep these enabled in workspace:
- `fix-dead-buttons`
- `systematic-page-pass`
- `ui-polish-pass`
- `build-crud-module`
- `debug-next-build`
- `review`
- `release-gate`

Recommended run order for feature work:
1. `systematic-page-pass`
2. `ui-polish-pass`
3. `release-gate`

## Memories
Add these memories (workspace):

```text
Project is ArchonPro dashboard on Next.js 16 + TypeScript + Tailwind + Prisma + Supabase.
```

```text
Definition of done: no dead buttons, no layout jumps, and quality gates green.
```

```text
Main quality gates: npm run typecheck, npm run lint, npm run build, and relevant Playwright specs.
```

```text
Preferred verification command: npm run qa:dashboard (or qa:dashboard:local when dev server on :3000 is active).
```

```text
Main navigation/state behavior depends on src/app/page.tsx with ?page= sync and localStorage persistence.
```

```text
Primary UI areas: src/components/dashboard/* and src/components/pages/*.
```

```text
When action is not implemented yet, disable control and show tooltip 'Binnenkort'.
```

## Optional Memory (communication)
```text
Default communication language with this workspace is Dutch unless user asks otherwise.
```
