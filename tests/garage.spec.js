// @ts-check
import { test, expect } from './fixtures/userGaragePage.js';

/**
 * Garage page tests.
 *
 * All tests use the custom `userGaragePage` fixture, which:
 *  - Loads the authenticated browser state saved by auth.setup.js
 *  - Opens /panel/garage
 *  - Returns a fully initialised GaragePage instance
 *
 * No explicit login is required in any test.
 */
test.describe('Garage Page', () => {

  test('authenticated user lands on Garage page', async ({ userGaragePage }) => {
    await expect(userGaragePage.page).toHaveURL(/\/panel\/garage/);
  });

  test('Garage page heading is visible', async ({ userGaragePage }) => {
    await expect(userGaragePage.pageTitle).toHaveText('Garage');
  });

  test('"Add car" button is visible for authenticated user', async ({ userGaragePage }) => {
    await expect(userGaragePage.addCarBtn).toBeVisible();
  });

  test('empty garage shows informational message', async ({ userGaragePage }) => {
    const carItems = userGaragePage.page.locator('.car-item, .car_item');
    const count = await carItems.count();

    if (count === 0) {
      // No cars yet — empty state message should be displayed
      await expect(userGaragePage.emptyMsg).toBeVisible();
      await expect(userGaragePage.emptyMsg).toHaveText("You don't have any cars in your garage");
    } else {
      // Garage has cars — car list should be visible
      await expect(userGaragePage.carList).toBeVisible();
    }
  });

});
