# Task Queue â€” ArchonPro Dashboard Fixes

**Generated:** 2026-02-18
**Total Tasks:** 12+ (prioritized)

---

## Status Overview

- [x] TASK-000: Audit (DONE)
- [x] TASK-001: Fix header notifications + logout flow (DONE)
- [x] TASK-002: Create missing pages (Instellingen, Abonnement) (DONE)
- [x] TASK-003: Wire Offertes page CRUD + AI analysis (DONE)
- [x] TASK-004: Wire Facturen page CRUD + PDF export (DONE)
- [x] TASK-005: Wire Bedrijven page CRUD (DONE)
- [x] TASK-006: Verify Deals page CRUD & Kanban (DONE - fully implemented)
- [x] TASK-007: Verify Contacten page CRUD (DONE - 1187 LOC, advanced features)
- [x] TASK-008: Verify Projecten page CRUD (DONE - 513 LOC, budget tracking)
- [x] TASK-009: Verify Agenda (Afspraken) page CRUD (DONE - 470 LOC, smart type detection)
- [x] TASK-010: Verify Finance pages CRUD (DONE - 974 LOC total, smart status)
- [x] TASK-011: Polish dashboard audit (DONE - all patterns compliant)
- [x] TASK-012: Accessibility audit (DONE - WCAG AA compliant)
- [x] TASK-013: Header notifications verifiÃ«ren (DONE - E2E stabilization & cleanup)
- [ ] TASK-014: Offerte AI-generatie flow (P0 - visie-item, grote feature)

---

## Priority Groups

### ðŸ”´ Phase 1 â€” Core Dashboard (P0: Do First)

**Goal:** Get main flow 100% functional
**Scope:** Header + navigation + logout
**Impact:** Users can navigate + basic actions work

#### TASK-001: Fix Header Notifications + Logout Flow

**Priority:** P0 (core flow)
**Scope:** 1 file
**Type:** Wiring + Testing

**What to fix:**

- Header notification buttons ("Openstaande offertes", "Afspraken vandaag", "Deals in opvolging")
- Verify each navigates to correct page
- Test logout flow (onLogout handler)
- Add loading state to logout

**Files affected:**

- `src/components/dashboard/DashboardHeader.tsx`

**Acceptance Criteria:**

- [ ] Each notification button navigates to correct page + page changes immediately
- [ ] Logout button shows loading spinner + clears session
- [ ] No console errors
- [ ] Typecheck + lint pass
- [ ] Playwright test: `e2e/dashboard.e2e.spec.ts` passes (header section)

---

#### TASK-002: Create Missing Pages (Instellingen, Abonnement)

**Priority:** P0 (navigation completeness)
**Scope:** 2 new pages + navigation wiring
**Type:** Feature

**What to do:**

- Create `src/components/pages/InstellingenPage.tsx` (settings stub)
- Create `src/components/pages/AbonnementPage.tsx` (subscription stub)
- Import & export in `src/app/page.tsx`

**Files affected:**

- `src/components/pages/InstellingenPage.tsx` (new)
- `src/components/pages/AbonnementPage.tsx` (new)
- `src/app/page.tsx` (add imports + dynamic loaders)

**Acceptance Criteria:**

- [ ] Both pages exist + render
- [ ] Navigation buttons reach them (no 404)
- [ ] Sidebar buttons show active state on these pages
- [ ] Typecheck + lint pass
- [ ] Build succeeds

---

### ðŸŸ¡ Phase 2 â€” CRUD Flows for Each Module (P1: High Impact)

**Goal:** All pages have full CRUD (Create, Read, Update, Delete)
**Scope:** One page/module per task
**Pattern:** Wire "Add" button â†’ modal â†’ API call â†’ success toast + refetch

#### TASK-003: Wire Offertes Page CRUD + AI Analysis

**Priority:** P1 (revenue core)
**Scope:** 1 page + modals
**Type:** Wiring

**What to fix:**

- "Create Offerte" button â†’ opens modal
- Modal submit â†’ POST `/api/offertes` + refetch
- Row Edit button â†’ opens edit modal + PATCH `/api/offertes/[id]`
- Row Delete button â†’ DELETE `/api/offertes/[id]` + confirmation
- "AI Analysis" button â†’ POST `/api/offertes/[id]/analyze`
- Add loading + error states + toasts

**Files affected:**

- `src/components/pages/OffertesPage.tsx`
- `src/components/modals/AddOfferteModal.tsx` (if exists; create if not)
- Edit modal (if separate)

**Acceptance Criteria:**

- [ ] Add offerte flow works end-to-end
- [ ] Edit + delete on rows work
- [ ] AI analysis button triggers + shows result
- [ ] Toast feedback on success/error
- [ ] No dead code
- [ ] Typecheck + lint + build pass

---

#### TASK-004: Wire Facturen Page CRUD + PDF Export

**Priority:** P1 (finance core)
**Scope:** 1 page + modals
**Type:** Wiring

**Similar to TASK-003 but for Facturen**

- Add/Edit/Delete buttons wired
- PDF export uses `/api/facturen/[id]/pdf`
- Loading states + error handling

---

#### TASK-005: Wire Bedrijven Page CRUD

**Priority:** P1 (core data)
**Similar pattern:**

- Add button â†’ AddCompanyModal
- Edit/Delete on rows
- API calls to `/api/companies`

---

#### TASK-006: Wire Deals Page CRUD

**Priority:** P1

- Add â†’ AddDealModal
- Edit/Delete on rows
- API to `/api/deals`

---

#### TASK-007: Wire Contacten Page CRUD

**Priority:** P1

- Add â†’ AddContactModal
- Edit/Delete on rows
- API to `/api/contacts`

---

#### TASK-008: Wire Projecten Page CRUD

**Priority:** P1

- Add â†’ AddProjectModal or custom form
- Edit/Delete
- API to `/api/projecten`

---

#### TASK-009: Wire Agenda (Afspraken) Page CRUD

**Priority:** P1

- Add â†’ AddAfspraakModal
- Edit/Delete
- API to `/api/afspraken`

---

#### TASK-010: Wire Finance Pages (Inkomsten, Uitgaven)

**Priority:** P1

- Inkomsten CRUD â†’ `/api/inkomsten`
- Uitgaven CRUD â†’ `/api/uitgaven`
- Both may reuse components

---

### ðŸŸ¢ Phase 3 â€” Polish & QA (P2: Quality)

#### TASK-011: Add Loading + Error States, Toasts

**Priority:** P2
**Scope:** All pages + components
**Type:** UX Polish

- Ensure all API calls show loading spinner
- All mutations show success/error toast
- Error boundaries on page errors

---

#### TASK-012: Accessibility Audit + Keyboard Navigation

**Priority:** P2
**Scope:** Full dashboard
**Type:** QA

- Test keyboard nav on all pages
- Verify aria labels + roles
- Test with screen reader (if possible)

---

## Task Dependency Graph

```
TASK-001 (header)
    â†“
TASK-002 (pages)
    â†“
TASK-003 â†’ TASK-004 â†’ TASK-005 â†’ TASK-006 â†’ TASK-007 â†’ TASK-008 â†’ TASK-009 â†’ TASK-010
    â†“
TASK-011 (polish)
    â†“
TASK-012 (QA)
```

---

## Rules for Next Task Generation

- Each TASK file must include:
  - **Exact control names** (button text, aria-label)
  - **File paths** to modify
  - **API endpoints** to call
  - **Acceptance criteria** (testable)
  - **Max 10 files, ~400 LOC diff**

- After TASK-001 completes: generate TASK-001 file (if not done yet)
- Always run: `npm run typecheck`, `npm run lint`, `npm run build`
- Never claim tests pass unless actually run

---

## Visie (docs/requirements-visie.md)

- **Dashboard geautomatiseerd** â€” Waar mogelijk automatisering (nummering, defaults, status).
- **AI overal toepasbaar** â€” AI op meerdere plekken inzetten; architectuur/UI daarop voorbereiden.
- **Offerte door AI** â€” Gebruiker voert in: korte omschrijving (bv. "laminaat leggen") + afmetingen + foto's â†’ AI genereert de volledige offerte (regels, teksten, prijs); gebruiker kan bewerken.

---

## Backlog (Future)

### Prioriteit (visie)

- [ ] **Offerte AI-generatie:** Flow: korte omschrijving + afmetingen + foto's â†’ API + AI genereert offerte-inhoud (regels/tekst); UI voor invoer + resultaat bewerken.
- [ ] **Dashboard-automatisering:** Bestaande flows verder automatiseren (nummering, standaardwaarden, status).

### Overig

- [ ] Search functionality implementation
- [ ] Command palette search integration
- [ ] Advanced filters on pages
- [ ] Bulk actions (select multiple rows)
- [ ] Export to CSV/Excel
- [ ] Email notifications
- [ ] User permissions / role-based UI

---
## Route Migration Queue (2026-02-18)
- [x] TASK-ROUTES-01: Routes /abonnement, /ai-assistant, /agenda, /artikelen, /bedrijven (DONE - typecheck/lint/build/e2e groen)
- [x] TASK-ROUTES-02: Routes /betalingen, /contacten, /deals, /facturen, /inkomsten (DONE - typecheck/lint/build/e2e groen)
- [ ] TASK-ROUTES-03: Routes /instellingen, /offertes, /projecten, /timesheets, /uitgaven
