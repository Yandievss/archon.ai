import { test, expect } from '@playwright/test'

test.describe('Action Buttons - Create New Records', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Alleen relevant op desktop viewport')
    await page.goto('/')
    await expect(page.locator('[data-mounted="true"]')).toHaveCount(1)
  })

  test('Offerte page - Nieuwe Offerte button is clickable', async ({ page }) => {
    // Navigate to Offertes page
    const sidebarBtn = page.locator('#desktop-sidebar').getByRole('button', { name: 'Offertes', exact: true })
    await sidebarBtn.click()
    await page.waitForLoadState('networkidle')

    // Find "Nieuwe Offerte" button
    const newBtn = page.getByRole('button', { name: /Nieuwe Offerte/i })
    await expect(newBtn).toBeVisible()
    await expect(newBtn).toBeEnabled()
    
    // Click it
    await newBtn.click()
    const toastRoot = page.locator('[toast-close]').locator('..').first()
    await expect(toastRoot).toContainText('Nieuwe Offerte')
  })

  test('Projecten page - Nieuw Project button is clickable', async ({ page }) => {
    const sidebarBtn = page.locator('#desktop-sidebar').getByRole('button', { name: 'Projecten', exact: true })
    await sidebarBtn.click()
    await page.waitForLoadState('networkidle')

    const newBtn = page.getByRole('button', { name: /Nieuw Project/i })
    await expect(newBtn).toBeVisible()
    await expect(newBtn).toBeEnabled()
    
    await newBtn.click()
    const toastRoot = page.locator('[toast-close]').locator('..').first()
    await expect(toastRoot).toContainText('Nieuw Project')
  })

  test('Agenda page - Nieuwe Afspraak button is clickable', async ({ page }) => {
    const sidebarBtn = page.locator('#desktop-sidebar').getByRole('button', { name: 'Agenda', exact: true })
    await sidebarBtn.click()
    await page.waitForLoadState('networkidle')

    const newBtn = page.getByRole('button', { name: /Nieuwe Afspraak/i })
    await expect(newBtn).toBeVisible()
    await expect(newBtn).toBeEnabled()
    
    await newBtn.click()
    const toastRoot = page.locator('[toast-close]').locator('..').first()
    await expect(toastRoot).toContainText('Nieuwe Afspraak')
  })

  test('Inkomsten page - Nieuwe Inkomst button is clickable', async ({ page }) => {
    const sidebarBtn = page.locator('#desktop-sidebar').getByRole('button', { name: 'Inkomsten', exact: true })
    await sidebarBtn.click()
    await page.waitForLoadState('networkidle')

    const newBtn = page.getByRole('button', { name: /Nieuwe Inkomst/i })
    await expect(newBtn).toBeVisible()
    await expect(newBtn).toBeEnabled()
    
    await newBtn.click()
    const toastRoot = page.locator('[toast-close]').locator('..').first()
    await expect(toastRoot).toContainText('Nieuwe Inkomst')
  })

  test('Uitgaven page - Nieuwe Uitgave button is clickable', async ({ page }) => {
    const sidebarBtn = page.locator('#desktop-sidebar').getByRole('button', { name: 'Uitgaven', exact: true })
    await sidebarBtn.click()
    await page.waitForLoadState('networkidle')

    const newBtn = page.getByRole('button', { name: /Nieuwe Uitgave/i })
    await expect(newBtn).toBeVisible()
    await expect(newBtn).toBeEnabled()
    
    await newBtn.click()
    const toastRoot = page.locator('[toast-close]').locator('..').first()
    await expect(toastRoot).toContainText('Nieuwe Uitgave')
  })
})
