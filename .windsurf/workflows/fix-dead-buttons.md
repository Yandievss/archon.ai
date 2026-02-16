---
auto_execution_mode: 0
description: "Find and fix all dead buttons on a page: wire handlers, routes, and data, or disable with tooltip."
---

You will make every button on the target page functional.

Steps:
1) Inventory all clickable UI elements (buttons, icon buttons, menu items, table row actions).
2) For each element, classify:
   A) Navigation (route change)
   B) Mutation (create/update/delete)
   C) UI state (open modal/drawer, tabs, filters)
3) Implement missing handlers end-to-end:
   - UI action -> function -> API route/server action -> validation -> DB -> toast feedback.
4) If an action is intentionally not implemented:
   - disable the button + tooltip "Binnenkort"
   - add TODO with a tracking issue id.
5) Add loading state and error handling for every mutation.
6) Return a checklist of all buttons and their status (implemented/disabled).
