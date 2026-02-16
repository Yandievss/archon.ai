---
auto_execution_mode: 0
description: "Generate a complete CRUD module (UI + API + DB contract) for an entity like contacts/invoices."
---

Create a full CRUD module for <ENTITY>.

Must include:
- DB schema fields: id, company_id, created_at, updated_at + entity fields
- API: list (with search/filter), create, update, delete
- UI: list page, create modal/drawer, edit, delete confirm
- States: loading, empty, error, success toasts
- Tenant safety: enforce company_id on every operation
Return:
- File tree changes
- Exact endpoints and payload types
- Test plan + 1 minimal test if feasible

Mandatory checks before final output:
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- relevant e2e specs for the module
