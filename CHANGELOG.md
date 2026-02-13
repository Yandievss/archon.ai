# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### ✨ Features
- **E2E Testing**: Added Playwright visual regression and interactive tests
- **CI/CD Pipeline**: Automated accessibility scanning (pa11y) and performance monitoring (Lighthouse)
- **Performance Monitoring**: Lighthouse CI integration with configurable thresholds

### 🐛 Bug Fixes
- **WCAG Compliance**: Adjusted primary color (#2E6AFE) to meet contrast requirements

### ⚡ Performance
- Established performance baselines: 75% Performance, 90% Accessibility, 85% Best Practices, 80% SEO

### 🔄 CI/CD
- Added GitHub Actions workflow for automated lint, typecheck, build, and accessibility scanning
- Integrated Playwright E2E tests and visual regression snapshots in CI
- Lighthouse CI configured to track performance metrics

### 📖 Documentation
- Added PERFORMANCE.md with monitoring guidelines and optimization tips
- Created accessibility documentation via WCAG compliance checks

## [0.2.0] - 2026-02-13

### ✨ Features
- **Accessibility Improvements**
  - Dutch language support (nl-NL)
  - Accessible skip-to-content link with focus states
  - Semantic main content wrapper
  - Role="search" on search functionality
  - Comprehensive title attributes on interactive elements

- **Component Refactoring**
  - Forward ref support for Button and Input components
  - Safe default type="button" for Button component (prevents accidental form submissions)
  - Default type="text" for Input component

- **UI Enhancements**
  - Improved dark mode muted-foreground contrast (0.60 → 0.70 opacity)
  - Consistent styling for header and sidebar interactive elements

### 🧪 Tests
- Added Playwright E2E test suite with visual regression snapshots
- Desktop and mobile viewport testing
- Interactive element validation (header, sidebar, skip-link)

### 🐛 Bug Fixes
- Color contrast issue resolved (primary: #2F6BFF → #2E6AFE) for WCAG AA compliance

### ⚡ Performance
- Initial Lighthouse baseline established
- Performance monitoring infrastructure in place

### 🔧 Chores
- Build and typecheck optimization
- ESLint and TypeScript configuration review

## [0.1.0] - 2026-02-13

Initial project setup with baseline dependencies:
- Next.js 16.1.1
- React 19.0.0
- Tailwind CSS 4
- shadcn/ui components
- Prisma ORM
- TypeScript

---

## Release Guide

### Generating Changelog

This project uses [conventional commits](https://www.conventionalcommits.org/) for semantic versioning.

To generate a new version:

```bash
# Patch release (0.2.0 → 0.2.1)
npm run release:patch

# Minor release (0.2.0 → 0.3.0)
npm run release:minor

# Major release (0.2.0 → 1.0.0)
npm run release:major
```

### Commit Types

- `feat`: A new feature
- `fix`: A bug fix
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding or updating tests
- `ci`: Changes to CI/CD configuration
- `docs`: Documentation only changes
- `chore`: Changes that don't affect the code (whitespace, formatting, etc.)

### Example Commits

```bash
# Feature commit
git commit -m "feat(ui): add dark mode toggle"

# Bug fix commit
git commit -m "fix(a11y): adjust primary color for WCAG contrast"

# Performance improvement
git commit -m "perf(lighthouse): optimize image loading"

# Breaking change (triggers major version bump)
git commit -m "feat!: redesign API endpoint"
```

### Version Bumping

The release script will:
1. Bump version in `package.json`
2. Generate/update `CHANGELOG.md`
3. Create a git tag
4. Create a git commit with updated version files

After running a release command, push changes to trigger CI:

```bash
git push origin main --follow-tags
```
