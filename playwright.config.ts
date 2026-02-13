import { defineConfig, devices } from '@playwright/test'

// Use a dedicated port for Playwright by default so we don't accidentally
// reuse a manually running dev/prod server on :3000.
const PORT = process.env.PLAYWRIGHT_PORT ? Number(process.env.PLAYWRIGHT_PORT) : 3100
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'output/playwright/report' }],
  ],
  outputDir: 'output/playwright/test-results',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    // Next.js doesn't allow multiple `next dev` instances for the same project
    // (it uses a shared lock file). Running a production server for E2E avoids
    // flakiness and works even when a dev server is already open.
    command: process.env.CI ? 'npm run start' : 'npm run build && npm run start',
    url: baseURL,
    // Always start the expected server for this run (avoid attaching to stale instances).
    reuseExistingServer: false,
    timeout: 120_000,
    env: process.env.CI ? { PORT: String(PORT), NODE_ENV: 'production' } : { PORT: String(PORT) },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],
})
