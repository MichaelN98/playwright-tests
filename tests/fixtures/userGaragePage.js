import { test as base } from '@playwright/test';
import { GaragePage } from '../pages/GaragePage.js';
import { STORAGE_STATE } from '../auth.setup.js';

/**
 * Custom fixture that provides an authenticated GaragePage instance.
 *
 * How it works:
 *  1. Creates a new browser context loaded with the storage state
 *     saved by the "setup" project (auth.setup.js).
 *  2. This means the user is already logged in — no explicit login needed.
 *  3. Opens the Garage page and waits until it is fully loaded.
 *  4. After the test finishes, the context is closed automatically.
 *
 * Usage in a test:
 *  import { test, expect } from '../fixtures/userGaragePage.js';
 *
 *  test('example', async ({ userGaragePage }) => {
 *    await expect(userGaragePage.addCarBtn).toBeVisible();
 *  });
 */
export const test = base.extend({
  // fixture name matches the task requirement
  userGaragePage: async ({ browser }, use) => {
    // Restore the authenticated session from the saved storage state
    const context = await browser.newContext({
      storageState: STORAGE_STATE,
      httpCredentials: {
        username: process.env.HTTP_USERNAME ?? 'guest',
        password: process.env.HTTP_PASSWORD ?? 'welcome2qauto',
      },
    });

    const page = await context.newPage();
    const garagePage = new GaragePage(page);

    // Navigate to Garage — the user is already authenticated
    await garagePage.goto();
    await garagePage.isLoaded();

    // Hand the GaragePage instance to the test
    await use(garagePage);

    // Teardown — close the context after the test
    await context.close();
  },
});

// Re-export expect so test files only need one import
export { expect } from '@playwright/test';
