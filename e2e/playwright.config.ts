import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  // Only run Playwright E2E tests, not Angular unit tests
  testMatch: ['**/*.e2e.spec.ts'],
  testIgnore: ['**/src/**', '**/*.spec.ts'],

  use: {
    baseURL: 'https://itxiprostore.web.app',
    headless: false, // set false if you want to watch the browser
  },
});
