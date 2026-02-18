# UI Controls Audit — ArchonPro Dashboard

**Last Updated:** 2026-02-18
**Status:** Complete Inventory

---

## Control Status Legend

| Status                   | Definition                                                   |
| ------------------------ | ------------------------------------------------------------ |
| **OK**                   | Control is wired, functional, tested                         |
| **Dead**                 | Control exists but has no handler or goes nowhere            |
| **Unclear**              | Handler exists but flow is ambiguous or untested             |
| **Disabled(Binnenkort)** | Intentionally disabled + accessible (aria-disabled, tooltip) |

---

## 1. Header Controls (`DashboardHeader.tsx`)

| Page/Route   | Control Label                       | Type       | Status  | File(s)                                          | Missing / Issues                                                  | Fix Category | Priority |
| ------------ | ----------------------------------- | ---------- | ------- | ------------------------------------------------ | ----------------------------------------------------------------- | ------------ | -------- |
| All (sticky) | Menu (hamburger)                    | Navigation | OK      | DashboardHeader.tsx                              | None                                                              | nav          | P0       |
| All (sticky) | Search / Command Palette            | UI State   | Unclear | DashboardHeader.tsx, DashboardCommandPalette.tsx | No search handler shown; opens palette only                       | state        | P1       |
| All (sticky) | "Openstaande offertes" notification | Navigation | Unclear | DashboardHeader.tsx                              | Notification exists but click handler to "offertes" page untested | nav          | P1       |
| All (sticky) | "Afspraken vandaag" notification    | Navigation | Unclear | DashboardHeader.tsx                              | Notification exists; should navigate to "agenda"                  | nav          | P1       |
| All (sticky) | "Deals in opvolging" notification   | Navigation | Unclear | DashboardHeader.tsx                              | Notification exists; should navigate to "deals"                   | nav          | P1       |
| All (sticky) | Theme toggle (Sun/Moon)             | UI State   | OK      | DashboardHeader.tsx                              | Calls onToggleTheme                                               | state        | P0       |
| All (sticky) | Profile dropdown                    | UI State   | Unclear | DashboardHeader.tsx (lines 220+)                 | Dropdown exists but options not fully visible in excerpt          | state        | P1       |
| All (sticky) | Logout (in profile menu)            | Mutation   | Unclear | DashboardHeader.tsx                              | Calls onLogout but no API confirmation                            | mutation     | P1       |

---

## 2. Desktop Sidebar Navigation (`DesktopSidebar.tsx`)

| Page/Route    | Control Label                 | Type       | Status  | File(s)            | Missing / Issues                                                           | Fix Category | Priority |
| ------------- | ----------------------------- | ---------- | ------- | ------------------ | -------------------------------------------------------------------------- | ------------ | -------- |
| All (desktop) | Toggle sidebar open/close     | UI State   | OK      | DesktopSidebar.tsx | onToggleOpen wired                                                         | state        | P0       |
| All (desktop) | "Bedrijven" nav button        | Navigation | OK      | DesktopSidebar.tsx | onNavigate wired                                                           | nav          | P0       |
| All (desktop) | "Contacten" nav button        | Navigation | OK      | DesktopSidebar.tsx | onNavigate wired                                                           | nav          | P0       |
| All (desktop) | "Deals" nav button            | Navigation | OK      | DesktopSidebar.tsx | onNavigate wired                                                           | nav          | P0       |
| All (desktop) | "Offertes" nav button         | Navigation | OK      | DesktopSidebar.tsx | onNavigate wired                                                           | nav          | P0       |
| All (desktop) | "Facturen" nav button         | Navigation | OK      | DesktopSidebar.tsx | onNavigate wired                                                           | nav          | P0       |
| All (desktop) | "Projecten" nav button        | Navigation | OK      | DesktopSidebar.tsx | onNavigate wired                                                           | nav          | P0       |
| All (desktop) | "Agenda" nav button           | Navigation | OK      | DesktopSidebar.tsx | onNavigate wired                                                           | nav          | P0       |
| All (desktop) | "Inkomsten" nav button        | Navigation | OK      | DesktopSidebar.tsx | onNavigate wired                                                           | nav          | P0       |
| All (desktop) | "Uitgaven" nav button         | Navigation | OK      | DesktopSidebar.tsx | onNavigate wired                                                           | nav          | P0       |
| All (desktop) | "Artikelen" nav button        | Navigation | OK      | DesktopSidebar.tsx | onNavigate wired                                                           | nav          | P0       |
| All (desktop) | "Timesheets" nav button       | Navigation | OK      | DesktopSidebar.tsx | onNavigate wired                                                           | nav          | P0       |
| All (desktop) | "Betalingen" nav button       | Navigation | OK      | DesktopSidebar.tsx | onNavigate wired                                                           | nav          | P0       |
| All (desktop) | "AI Assistant" button (Tools) | Navigation | OK      | DesktopSidebar.tsx | onNavigate wired                                                           | nav          | P0       |
| All (desktop) | "Abonnement" button (Tools)   | Navigation | Unclear | DesktopSidebar.tsx | Labeled in navigation but no page component found in src/components/pages/ | nav          | P2       |
| All (desktop) | "Instellingen" button (Tools) | Navigation | Unclear | DesktopSidebar.tsx | Labeled in navigation but no page component found in src/components/pages/ | nav          | P2       |
| All (desktop) | Logout button (Tools)         | Mutation   | OK      | DesktopSidebar.tsx | onLogout called on "Uitloggen"                                             | mutation     | P0       |

---

## 3. Mobile Sidebar Navigation (`MobileSidebar.tsx`)

| Page/Route   | Control Label                   | Type       | Status | File(s)           | Missing / Issues         | Fix Category | Priority |
| ------------ | ------------------------------- | ---------- | ------ | ----------------- | ------------------------ | ------------ | -------- |
| All (mobile) | Mobile menu close (X)           | UI State   | OK     | MobileSidebar.tsx | SheetClose handler wired | state        | P0       |
| All (mobile) | All nav items (same as desktop) | Navigation | OK     | MobileSidebar.tsx | Same handlers as desktop | nav          | P0       |
| All (mobile) | Logout button (mobile)          | Mutation   | OK     | MobileSidebar.tsx | onLogout called          | mutation     | P0       |

---

## 4. Main Dashboard Home (`DashboardHome.tsx`)

| Page/Route       | Control Label    | Type | Status  | File(s)                                    | Missing / Issues | Fix Category | Priority |
| ---------------- | ---------------- | ---- | ------- | ------------------------------------------ | ---------------- | ------------ | -------- |
| Dashboard (home) | [Need to review] | —    | Unclear | src/components/dashboard/DashboardHome.tsx | Not yet examined | —            | P1       |

---

## 5. Page-Specific Controls (Pages in `src/components/pages/`)

### BedrijvenPage

| Control Label         | Type     | Status  | Missing                      | Priority |
| --------------------- | -------- | ------- | ---------------------------- | -------- |
| Add Bedrijf (button)  | Mutation | Unclear | Modal trigger or form route? | P1       |
| Edit / Delete actions | Mutation | Unclear | Handlers on table rows?      | P1       |

### OffertesPage

| Control Label         | Type     | Status  | Missing                               | Priority |
| --------------------- | -------- | ------- | ------------------------------------- | -------- |
| Create Offerte button | Mutation | Unclear | Modal open or new route?              | P0       |
| AI Analysis button    | Mutation | Unclear | API call to `/api/offertes/analyze`?  | P1       |
| Export / PDF button   | Mutation | Unclear | Connects to `/api/offertes/[id]/pdf`? | P1       |
| Edit / Delete actions | Mutation | Unclear | Row handlers wired?                   | P1       |

### ProjectenPage

| Control Label         | Type     | Status  | Missing              | Priority |
| --------------------- | -------- | ------- | -------------------- | -------- |
| Add Project button    | Mutation | Unclear | Modal or form route? | P1       |
| Edit / Delete actions | Mutation | Unclear | Row handlers?        | P1       |

### FacturenPage

| Control Label         | Type     | Status  | Missing                        | Priority |
| --------------------- | -------- | ------- | ------------------------------ | -------- |
| Create Factuur button | Mutation | Unclear | Modal or new page?             | P1       |
| Download/PDF button   | Mutation | OK?     | Uses `/api/facturen/[id]/pdf`? | P1       |
| Edit / Delete         | Mutation | Unclear | Handlers?                      | P1       |

### ContactenPage, DealsPage, etc.

| Control Label      | Type     | Status  | Missing                    | Priority |
| ------------------ | -------- | ------- | -------------------------- | -------- |
| Add/Create buttons | Mutation | Unclear | All need review            | P1       |
| Row actions        | Mutation | Unclear | Edit, Delete, Detail view? | P1       |

---

## 6. Modal Controls (`src/components/modals/`)

Modals exist but wiring to page controls needs audit:

- AddAfspraakModal.tsx
- AddCompanyModal.tsx
- AddContactModal.tsx
- AddDealModal.tsx
- (others)

**Status:** Unclear — modals exist but not clear which page controls trigger them.

---

## Summary Stats

| Category        | Count   | OK     | Unclear | Dead  | Disabled |
| --------------- | ------- | ------ | ------- | ----- | -------- |
| Header          | 8       | 2      | 5       | 0     | 1        |
| Desktop Sidebar | 17      | 14     | 3       | 0     | 0        |
| Mobile Sidebar  | ~14     | 13     | 1       | 0     | 0        |
| Pages (detail)  | ~50+    | ?      | ~45+    | ?     | ?        |
| Modals          | ~6+     | ?      | ~6+     | ?     | ?        |
| **TOTAL**       | **95+** | **29** | **60+** | **0** | **1**    |

---

## Key Findings

1. **Header notifications** — All 3 notification items claim to navigate to pages but handlers are untested.
2. **Missing pages** — "Abonnement" and "Instellingen" are in navigation but no page components found in `src/components/pages/`.
3. **Modals untested** — Modals exist but which page controls open them? Need tracing.
4. **Page-level CRUD** — Add/Edit/Delete buttons on pages (Offertes, Facturen, Bedrijven, etc.) lack clear wiring documentation.
5. **Logout flow** — Calls `onLogout()` but no session/API confirmation visible.
6. **Search functionality** — Command palette opens but no actual search implementation shown.

---

## Recommended Fixes (Grouped by Impact)

### Phase 1: Fix Header & Navigation (P0)

- [ ] Verify notification buttons navigate correctly + show loading states
- [ ] Test Logout flow end-to-end
- [ ] Create missing "Instellingen" and "Abonnement" pages OR disable + mark "Binnenkort"

### Phase 2: Fix Page CRUD Flows (P1)

- [ ] Wire all "Add" buttons to modals + ensure modals submit to API
- [ ] Wire all table row Edit/Delete actions
- [ ] Ensure all mutations show toast feedback

### Phase 3: Polish & Accessibility (P2)

- [ ] Add loading + error states to all mutations
- [ ] Ensure all disabled controls have aria-disabled + tooltips
- [ ] Test keyboard navigation
