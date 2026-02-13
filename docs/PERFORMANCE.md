# Performance Audit Baseline

Generated: 2026-02-13

## Lighthouse Scores

This project includes automated performance monitoring via:
- **Lighthouse CI** in GitHub Actions (performance, accessibility, best-practices, SEO)
- **pa11y** accessibility scanning
- **Playwright E2E** visual regression tests

### Current Targets (lighthouserc.json)

| Category | Target | Status |
|----------|--------|--------|
| Performance | ≥ 75% | Baseline established |
| Accessibility | ≥ 90% | Continuous monitoring |
| Best Practices | ≥ 85% | Continuous monitoring |
| SEO | ≥ 80% | Continuous monitoring |

## Key Metrics to Monitor

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms (Interaction to Next Paint)
- **CLS** (Cumulative Layout Shift): < 0.1

### Performance Opportunities

Common optimizations (if needed):
1. **Image optimization**: Use `next/image` for automatic optimization
2. **Code splitting**: Ensure dynamic imports for large components
3. **Bundle analysis**: Run `npx next/bundle-analyzer` to identify large deps
4. **Font optimization**: Preload critical fonts; use `font-display: swap`
5. **CSS purging**: Tailwind already handles this in production
6. **Third-party scripts**: Lazy-load non-critical scripts

## Running Lighthouse Locally

```bash
# Generate JSON report
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json

# Generate HTML report
npx lighthouse http://localhost:3000 --output=html --output-path=./lighthouse-report.html

# Run Lighthouse CI (requires server on :3000)
npx -p @lhci/cli@* lhci autorun
```

## Monitoring in CI

Lighthouse CI runs automatically on every push/PR in `.github/workflows/a11y.yml`:
- Builds production version
- Starts production server
- Runs Lighthouse audit
- Uploads results as artifact
- Fails if thresholds not met

## Next Steps

1. **Baseline check**: Review initial Lighthouse reports for any quick wins
2. **Monitor trends**: Track performance over time via artifacts
3. **Address warnings**: Prioritize Lighthouse "Opportunities" section
4. **Optimize images**: Add `next/image` to heavy image sections
5. **Bundle analysis**: Run analyzer if bundle size increases

## References

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/learn/foundations/how-nextjs-works/rendering)
