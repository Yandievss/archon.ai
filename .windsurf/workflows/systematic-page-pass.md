---
auto_execution_mode: 0
description: "Systematically complete one dashboard page so all controls and states are production-ready."
---

Complete the target page end-to-end.

Steps:
1) Enumerate every interactive element (buttons, icon buttons, links, row actions, menus).
2) Mark each item as:
   - Navigation
   - UI state change
   - Mutation
3) Implement missing behavior with full flow:
   - UI action -> handler -> API/data -> toast/feedback.
4) Ensure loading, empty, and error states are present.
5) Ensure keyboard and aria accessibility is intact.
6) Run checks:
   - npm run typecheck
   - npm run lint
   - npm run build
   - relevant e2e specs
7) Return a checklist with status per control and changed file paths.
