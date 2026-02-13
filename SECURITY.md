# Security Policy

## Reported Security Vulnerabilities

If you discover a security vulnerability in this project, please send an email to **security@archonpro.app** instead of using the issue tracker.

### Guidelines

- **Do not** open a public GitHub issue for security vulnerabilities
- **Do** provide a clear description of the issue
- **Include** steps to reproduce if possible
- **Allow** time for a response before public disclosure (typically 48-72 hours)

We take all security reports seriously and will work with you to fix the issue promptly.

---

## Dependencies & Maintenance

### Regular Audits

- **npm audit** runs automatically on every push/PR in CI
- Vulnerabilities block pull requests if severity is high/critical
- Updates are checked weekly via Dependabot

### Updating Dependencies

#### Automated (Dependabot)

1. Create `.github/dependabot.yml` (optional — GitHub enables by default)
2. Dependabot automatically:
   - Scans dependencies daily
   - Creates pull requests for updates
   - Runs CI on update PRs

#### Manual Updates

```bash
# Check for outdated packages
npm outdated

# Update to latest within semver range
npm update

# Update to latest version (may break)
npm upgrade <package>

# Check/fix vulnerabilities
npm audit fix
npm audit fix --force  # may break compatibility
```

### Dependency Policy

- **Major updates**: Manual PR, requires review and testing
- **Minor/Patch**: Auto-merged if all CI passes (through Dependabot)
- **Security fixes**: Prioritized and fast-tracked

### Current Security Status

- **Last audit**: 2026-02-13
- **Vulnerabilities**: 0 found
- **Outdated packages**: Use `npm outdated` to check

---

## CI/CD Security Checks

Our GitHub Actions pipeline includes:

1. **npm audit** — Scans for known vulnerabilities
2. **ESLint** — Code quality and security rules
3. **TypeScript** — Type safety (prevents many runtime errors)
4. **Playwright E2E** — Integration/security flow tests
5. **Lighthouse** — Performance & best practices

Failed security checks block PRs from merging.

---

## Dependency Lock Files

- **package-lock.json** is committed to ensure reproducible installs
- Always run `npm ci` in CI environments (not `npm install`)
- Review dependency changes in PRs

---

## Best Practices

### For Developers

- ✅ Use `npm ci` in CI/production
- ✅ Keep dependencies updated
- ✅ Review dependency changes before merging
- ✅ Run `npm audit` before deploying
- ❌ Don't commit `node_modules/`
- ❌ Don't override security warnings without justification

### For Production

- ✅ Use npm check before deployment: `npm audit`
- ✅ Monitor dependencies regularly
- ✅ Keep Node.js version updated
- ✅ Use environment variables for secrets
- ❌ Never commit `.env` files

---

## Reporting Security Issues

**Email**: security@archonpro.app  
**Response time**: 48-72 hours  
**Disclosure**: Coordinated disclosure (details kept confidential until fix released)

Thank you for helping keep this project secure!
