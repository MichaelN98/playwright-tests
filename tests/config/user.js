/**
 * Test user credentials.
 * Override via environment variables in .env file.
 */
export const USER = {
  email:    process.env.USER_EMAIL    ?? 'aqa-testuser@test.com',
  password: process.env.USER_PASSWORD ?? 'Password1',
};
