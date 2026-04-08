// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env (ignored by git)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Path to the saved browser storage state produced by auth.setup.js.
 * Exported so fixtures and setup files share a single source of truth.
 */
export const STORAGE_STATE = path.join(process.cwd(), '.auth/user.json');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    /* Base URL loaded from .env → BASE_URL */
    baseURL: process.env.BASE_URL ?? 'https://qauto.forstudy.space',

    /* HTTP Basic Auth loaded from .env → HTTP_USERNAME / HTTP_PASSWORD */
    httpCredentials: {
      username: process.env.HTTP_USERNAME ?? 'guest',
      password: process.env.HTTP_PASSWORD ?? 'welcome2qauto',
    },

    trace: 'on-first-retry',
  },

  projects: [
    /**
     * Setup project — runs BEFORE all browser projects.
     * Logs in as the test user and saves the storage state to .auth/user.json
     */
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },

    /**
     * Browser projects — all depend on "setup" so that .auth/user.json
     * exists before any test that uses the userGaragePage fixture runs.
     */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },
  ],
});
