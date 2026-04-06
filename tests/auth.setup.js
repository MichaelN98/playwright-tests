import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { USER } from './config/user.js';

/**
 * Path where the authenticated browser state will be saved.
 * Used by the userGaragePage fixture to skip the login step.
 */
export const STORAGE_STATE = path.join(process.cwd(), '.auth/user.json');

/**
 * Setup project — runs once before all test suites.
 * Registers the test user (if not yet registered), logs in,
 * and persists the browser storage state to disk.
 */
setup('authenticate as test user', async ({ page, request }) => {
  // ── Step 1: ensure the test user exists ───────────────────────────────────
  // POST /api/auth/signup — 201 Created or 409 Conflict (already registered).
  // Either way we can proceed to login.
  await request.post('/api/auth/signup', {
    data: {
      name:           'Test',
      lastName:       'User',
      email:          USER.email,
      password:       USER.password,
      repeatPassword: USER.password,
    },
  });

  // ── Step 2: log in through the UI ─────────────────────────────────────────
  await page.goto('/');

  // Open "Log in" modal
  await page.locator('.header_signin').click();

  // Fill credentials
  await page.locator('#signinEmail').fill(USER.email);
  await page.locator('#signinPassword').fill(USER.password);

  // Submit
  await page.locator('.modal .btn-primary', { hasText: 'Login' }).click();

  // ── Step 3: verify redirect to Garage ─────────────────────────────────────
  await page.waitForURL('**/panel/garage');
  await expect(page.locator('h1')).toHaveText('Garage');

  // ── Step 4: persist the authenticated state ───────────────────────────────
  await page.context().storageState({ path: STORAGE_STATE });
});
