# Dependency Management & Security

This document outlines how dependencies are managed, updated, and secured in this project.

## Current Security Status

- **npm audit**: 0 vulnerabilities found (2026-02-13)
- **Dependencies**: ~80+ production packages
- **Last updated**: 2026-02-13
- **Update strategy**: Automated via Dependabot (enabled)

---

## Automated Dependency Management

### Dependabot Configuration

GitHub's Dependabot automatically:
- Scans dependencies **daily** for updates
- Creates pull requests for new versions
- Groups updates by type (dev, minor, major)
- Runs full CI on dependency PRs
- Auto-merges non-breaking updates (if CI passes)

**Schedule**: Weekly (Monday 03:00 UTC)

**Groups**:
- `development-dependencies`: Dev deps (minor/patch)
- `production-minor`: Prod minor/patch updates
- `production-major`: Prod major updates (manual review)

**Ignored**: Node.js 19.x (stick with LTS 18)

**Location**: `.github/dependabot.yml`

---

## CI/CD Security Checks

Every push/PR runs:

1. **npm audit --audit-level=high**
   - Fails if HIGH or CRITICAL vulnerabilities found
   - Report uploaded as CI artifact
   - Location: `.github/workflows/a11y.yml`

2. **ESLint security rules**
   - Detects unsafe patterns
   - Enforced via `npm run lint`

3. **TypeScript checking**
   - Type safety prevents classes of vulnerabilities
   - Enforced via `npm run typecheck`

---

## Manual Dependency Updates

### Check Current Status

```bash
# List outdated packages
npm outdated

# Show update strategy
npm outdated --long
```

### Update Strategies

#### Safe: Minor/Patch Updates
```bash
# Update all within semver ranges
npm update

# Fix audit vulnerabilities
npm audit fix
```

#### Aggressive: Major Updates
```bash
# Interactive upgrade (choose versions)
npm upgrade <package>

# Example:
npm upgrade next@latest react@latest
```

#### Specific Package
```bash
npm install <package>@<version>
```

### Testing After Updates

```bash
# Run full test suite
npm run lint
npm run typecheck
npm run build
npm run e2e

# Run specific checks
npm audit                   # Security
npx lighthouse http://localhost:3000  # Performance
```

---

## Production Deployment

Before deploying:

```bash
# Install exact lockfile versions
npm ci

# Run full validation
npm run lint
npm run typecheck
npm run build

# Check for vulnerabilities
npm audit

# Optional: Run E2E tests
npm run e2e
```

**Never use `npm install` in production** — always use `npm ci`.

---

## Common Vulnerabilities by Type

| Package | Type | Typical Issues | Mitigation |
|---------|------|---|---|
| **next** | Framework | Auth escapes, CORS issues | Update regularly |
| **react** | Library | XSS via unsanitized props | TypeScript + ESLint |
| **lodash** | Utility | Prototype pollution | Use modern alternatives |
| **axios** | HTTP | HTTPS validation | Keep updated |
| **prisma** | ORM | SQL injection | Use parameterized queries |

---

## Handling Critical Vulnerabilities

### If a Critical Vulnerability is Found

1. **Assess**: Is your code affected?
   - Check if vulnerable function is used
   - Review affected versions

2. **Update**: Try to update package
   ```bash
   npm install <package>@latest
   ```

3. **Test**: Run full CI suite
   ```bash
   npm run build && npm run e2e
   ```

4. **Deploy**: If safe, deploy immediately
   ```bash
   git add package.json package-lock.json
   git commit -m "fix(security): update package for CVE fix"
   git push origin main
   ```

5. **Document**: Record incident in `SECURITY.md` if applicable

---

## Breaking Changes in Updates

### If Major Update Breaks Code

```bash
# 1. Revert
npm install <package>@previous-version

# 2. Update gradually
# - Update package
# - Fix code changes
# - Test thoroughly

# 3. Example: Next.js 15 → 16
npm install next@16
npm run build  # May show type errors
# Fix errors in src/
npm run typecheck
npm run e2e
git add -A
git commit -m "chore(next): upgrade to v16"
```

---

## Lockfile Management

### `package-lock.json`

- **Always commit** to version control
- **Ensures reproducible installs** across environments
- **Cannot be modified manually** (use `npm install` instead)

**Never edit lockfile directly** — it's auto-generated.

---

## Reporting Security Issues

See `SECURITY.md` for vulnerability reporting guidelines.

- **Email**: security@archonpro.app
- **Response time**: 48-72 hours
- **Process**: Coordinated disclosure

---

## High-Risk Packages (Monitor Closely)

These packages are frequently targeted or require careful updates:

- `next` / `react` — Core framework
- `prisma` — ORM (SQL injection risk)
- `axios` / `ethers` — Network/crypto
- `lodash` / `moment` — Prototype pollution risk

---

## Best Practices

✅ **Do**:
- Use `npm ci` in CI/production
- Review Dependabot PRs before merging
- Run full test suite after major updates
- Keep Node.js LTS version updated
- Audit regularly

❌ **Don't**:
- Force-merge failing security updates
- Ignore high/critical vulnerabilities
- Use `npm install` in production
- Commit `node_modules/`
- Override security warnings without justification

---

## References

- [npm audit docs](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Dependabot docs](https://docs.github.com/en/code-security/dependabot)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
