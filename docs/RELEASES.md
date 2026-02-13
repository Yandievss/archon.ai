# Release & Versioning Guide

This project follows **Semantic Versioning** (semver) and uses **Conventional Commits** for automated changelog generation.

## Quick Start

### Local Release

```bash
# Create a patch release (0.2.0 → 0.2.1)
npm run release:patch

# Create a minor release (0.2.0 → 0.3.0)
npm run release:minor

# Create a major release (0.2.0 → 1.0.0)
npm run release:major
```

After running a release command:

```bash
git push origin main --follow-tags
```

### Automated Release (GitHub Actions)

Trigger via GitHub Actions UI:

1. Go to **Actions** → **Release** workflow
2. Click **Run workflow**
3. Select release type (patch/minor/major)
4. Workflow will:
   - Run tests and build
   - Generate new version
   - Update CHANGELOG.md
   - Create git tag
   - Create GitHub Release

## Conventional Commits

All commits must follow the conventional commits format:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Types

| Type | Section | Example | Auto-bump |
|------|---------|---------|-----------|
| `feat` | ✨ Features | `feat(ui): add dark mode toggle` | Minor |
| `fix` | 🐛 Bug Fixes | `fix(a11y): adjust contrast` | Patch |
| `perf` | ⚡ Performance | `perf(lighthouse): optimize images` | Patch |
| `refactor` | ♻️ Refactoring | `refactor(components): simplify Button` | — |
| `test` | 🧪 Tests | `test(e2e): add homepage snapshot` | — |
| `ci` | 🔄 CI/CD | `ci(a11y): add pa11y workflow` | — |
| `docs` | 📖 Documentation | `docs: update README` | — |
| `chore` | 🔧 Chores | `chore(deps): update deps` | — |

### Breaking Changes

To trigger a **major** version bump, add `!` after the type:

```bash
git commit -m "feat!: redesign API endpoint"
# or in the footer:
git commit -m "feat(api): redesign endpoint

BREAKING CHANGE: old endpoint removed"
```

## Examples

### Feature Release

```bash
# Make feature commits
git commit -m "feat(dashboard): add analytics widget"
git commit -m "feat(dashboard): add export button"

# Create release
npm run release:minor
# 0.2.0 → 0.3.0

# Push
git push origin main --follow-tags
```

### Bug Fix Release

```bash
# Make fix commits
git commit -m "fix(buttons): resolve hover state issue"

# Create release
npm run release:patch
# 0.2.0 → 0.2.1

# Push
git push origin main --follow-tags
```

### Multiple Changes Release

```bash
# Mix of commits
git commit -m "feat(auth): add SSO support"
git commit -m "fix(forms): validate email correctly"
git commit -m "perf(images): lazy load below fold"

# Pick highest bump (feat → minor)
npm run release:minor
# 0.2.0 → 0.3.0
```

## Generated CHANGELOG Format

The CHANGELOG is auto-generated with sections:

```markdown
## [0.3.0] - 2026-02-14

### ✨ Features
- **auth**: Add SSO support

### 🐛 Bug Fixes
- **forms**: Validate email correctly

### ⚡ Performance
- **images**: Lazy load below fold

### 🔄 CI/CD
- Update workflow timeouts
```

## Version Scheme

- **Major** (0.X.0): Breaking changes, significant refactors
- **Minor** (0.0.X): New features, non-breaking additions
- **Patch** (0.0.0): Bug fixes, performance improvements

## Pre-release Versions

For beta/rc releases (optional):

```bash
npm run release -- --prerelease
# 0.2.0 → 0.2.1-0

npm run release -- --prerelease beta
# 0.2.0 → 0.2.1-beta.0
```

## GitHub Releases

Each version automatically creates a GitHub Release with:
- Changelog excerpt
- Links to commits/compare
- Attached build artifacts

Access at: https://github.com/YOUR_REPO/releases

## Troubleshooting

### "standard-version not found"

```bash
npm install --save-dev standard-version
```

### Manual version bump

```bash
# If automated release fails, manual bump:
npm version patch  # or minor/major
git push origin main --follow-tags
```

### Revert release

```bash
git tag -d v0.2.1
git reset --soft HEAD~1
# Re-edit and try again
```

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [standard-version docs](https://github.com/conventional-changelog/standard-version)
