---
auto_execution_mode: 0
description: "Fix Next.js build/prerender errors by tracing server/client boundaries and missing providers."
---

You will fix the current Next.js build error.

Method:
1) Identify the exact failing route and stack trace.
2) Determine if the failing code runs in Server Component context.
3) If hooks are used, enforce "use client" and move logic to a Client Component.
4) If a provider is required (e.g., NavigationProvider), wrap it in the root layout or the route segment layout.
5) Re-run build mentally by verifying imports and render tree.
6) Validate with:
   - npm run typecheck
   - npm run build
Output:
- Root cause
- Minimal patch (file paths + diffs)
- Why it fixes the prerender/build
