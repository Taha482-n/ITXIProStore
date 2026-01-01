import { test, expect } from '@playwright/test';

test('login page loads', async ({ page }) => {
  // Go directly to the login page
  await page.goto('/login');

  // Wait until page finishes loading network requests
  await page.waitForLoadState('networkidle');

  // Generic checks that usually work on any login page:
  // 1) URL is correct (or includes /login)
  await expect(page).toHaveURL(/\/login/);

  // 2) There is at least one input field (email/password)
  const inputs = page.locator('input');
  await expect(inputs.first()).toBeVisible();

  // 3) There is a button on the page (login/submit)
  const buttons = page.locator('button');
  await expect(buttons.first()).toBeVisible();
});
