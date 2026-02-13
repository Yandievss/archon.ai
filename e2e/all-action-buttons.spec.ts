import { test, expect } from '@playwright/test'

test.describe('All Action Buttons', () => {
  // Verify all action buttons work across all pages

  test('Bedrijven page - Nieuw Bedrijf button', async ({ page }) => {
    await page.goto('http://localhost:3000?page=bedrijven')
    const button = page.getByRole('button', { name: /Nieuw Bedrijf/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })

  test('Contacten page - Nieuw Contact button', async ({ page }) => {
    await page.goto('http://localhost:3000?page=contacten')
    const button = page.getByRole('button', { name: /Nieuw Contact/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })

  test('Deals page - Nieuwe Deal button', async ({ page }) => {
    await page.goto('http://localhost:3000?page=deals')
    const button = page.getByRole('button', { name: /Nieuwe Deal/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })

  test('Timesheets page - Nieuwe Entry button', async ({ page }) => {
    await page.goto('http://localhost:3000?page=timesheets')
    const button = page.getByRole('button', { name: /Nieuwe Entry/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })

  test('Artikelen page - Nieuw Artikel button', async ({ page }) => {
    await page.goto('http://localhost:3000?page=artikelen')
    const button = page.getByRole('button', { name: /Nieuw Artikel/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })

  test('Offertes page - Nieuwe Offerte button', async ({ page }) => {
    await page.goto('http://localhost:3000?page=offertes')
    const button = page.getByRole('button', { name: /Nieuwe Offerte/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })

  test('Projecten page - Nieuw Project button', async ({ page }) => {
    await page.goto('http://localhost:3000?page=projecten')
    const button = page.getByRole('button', { name: /Nieuw Project/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })

  test('Agenda page - Nieuwe Afspraak button', async ({ page }) => {
    await page.goto('http://localhost:3000?page=agenda')
    const button = page.getByRole('button', { name: /Nieuwe Afspraak/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })

  test('Inkomsten page - Nieuwe Inkomst button', async ({ page }) => {
    await page.goto('http://localhost:3000?page=inkomsten')
    const button = page.getByRole('button', { name: /Nieuwe Inkomst/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })

  test('Uitgaven page - Nieuwe Uitgave button', async ({ page }) => {
    await page.goto('http://localhost:3000?page=uitgaven')
    const button = page.getByRole('button', { name: /Nieuwe Uitgave/i })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.click()
  })
})
