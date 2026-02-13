import { test, expect } from '@playwright/test'

test.describe('All Action Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/pages=bedrijven')
  })

  // Previously fixed pages
  test('Uitgaven page - Nieuwe Uitgave button', async ({ page }) => {
    await page.goto('http://localhost:3000/pages=uitgaven')
    const button = page.getByRole('button', { name: /Nieuwe Uitgave/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    
    // Listen for toast
    const toastPromise = page.waitForSelector('[role="status"]')
    await button.click()
    await toastPromise
    
    const toast = page.locator('[role="status"]')
    await expect(toast).toContainText('Nieuwe Uitgave')
  })

  test('Agenda page - Nieuwe Afspraak button', async ({ page }) => {
    await page.goto('http://localhost:3000/pages=agenda')
    const button = page.getByRole('button', { name: /Nieuwe Afspraak/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })

  test('Offerte page - Nieuwe Offerte button', async ({ page }) => {
    await page.goto('http://localhost:3000/pages=offertes')
    const button = page.getByRole('button', { name: /Nieuwe Offerte/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })

  test('Projecten page - Nieuw Project button', async ({ page }) => {
    await page.goto('http://localhost:3000/pages=projecten')
    const button = page.getByRole('button', { name: /Nieuw Project/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })

  test('Inkomsten page - Nieuwe Inkomst button', async ({ page }) => {
    await page.goto('http://localhost:3000/pages=inkomsten')
    const button = page.getByRole('button', { name: /Nieuwe Inkomst/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })

  // Newly fixed pages
  test('Bedrijven page - Nieuw Bedrijf button', async ({ page }) => {
    await page.goto('http://localhost:3000/pages=bedrijven')
    const button = page.getByRole('button', { name: /Nieuw Bedrijf/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    
    const toastPromise = page.waitForSelector('[role="status"]')
    await button.click()
    await toastPromise
    
    const toast = page.locator('[role="status"]')
    await expect(toast).toContainText('Nieuw Bedrijf')
  })

  test('Contacten page - Nieuw Contact button', async ({ page }) => {
    await page.goto('http://localhost:3000/pages=contacten')
    const button = page.getByRole('button', { name: /Nieuw Contact/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    
    const toastPromise = page.waitForSelector('[role="status"]')
    await button.click()
    await toastPromise
    
    const toast = page.locator('[role="status"]')
    await expect(toast).toContainText('Nieuw Contact')
  })

  test('Deals page - Nieuwe Deal button', async ({ page }) => {
    await page.goto('http://localhost:3000/pages=deals')
    const button = page.getByRole('button', { name: /Nieuwe Deal/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    
    const toastPromise = page.waitForSelector('[role="status"]')
    await button.click()
    await toastPromise
    
    const toast = page.locator('[role="status"]')
    await expect(toast).toContainText('Nieuwe Deal')
  })

  test('Timesheets page - Nieuwe Entry button', async ({ page }) => {
    await page.goto('http://localhost:3000/pages=timesheets')
    const button = page.getByRole('button', { name: /Nieuwe Entry/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    
    const toastPromise = page.waitForSelector('[role="status"]')
    await button.click()
    await toastPromise
    
    const toast = page.locator('[role="status"]')
    await expect(toast).toContainText('Nieuwe Entry')
  })

  test('Artikelen page - Nieuw Artikel button', async ({ page }) => {
    await page.goto('http://localhost:3000/pages=artikelen')
    const button = page.getByRole('button', { name: /Nieuw Artikel/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    
    const toastPromise = page.waitForSelector('[role="status"]')
    await button.click()
    await toastPromise
    
    const toast = page.locator('[role="status"]')
    await expect(toast).toContainText('Nieuw Artikel')
  })
})
