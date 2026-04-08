import { test, expect } from '../fixtures/userGaragePage.js';

test.describe('Task 1 - Profile page response mocking', () => {
  test('should display mocked profile data after intercepting GET /api/users/profile', async ({ userGaragePage }) => {
    const { page } = userGaragePage;

    const mockedData = {
      status: 'ok',
      data: {
        userId: 999,
        photoFilename: 'default-user.png',
        name: 'MockedName',
        lastName: 'MockedLastName',
      },
    };

    // Intercept GET /api/users/profile and return mocked response body
    await page.route('**/api/users/profile', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockedData),
      })
    );

    // Navigate to profile page — route intercepts the API call
    await page.goto('/panel/profile');

    // Verify the UI displays the mocked name (profile_name = "Name LastName")
    await expect(page.locator('p.profile_name')).toHaveText('MockedName MockedLastName');
  });
});
