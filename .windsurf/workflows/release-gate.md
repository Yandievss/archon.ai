---
auto_execution_mode: 0
description: "Run release-quality validation before considering any task complete."
---

Validate the current workspace as release-ready.

Checklist:
1) Static checks:
   - npm run typecheck
   - npm run lint
2) Production check:
   - npm run build
3) Regression checks:
   - run relevant Playwright specs for changed areas
4) For failures:
   - identify root cause
   - apply minimal patch
   - re-run failed checks
5) Output:
   - pass/fail per check
   - failing files/specs
   - final risk notes
