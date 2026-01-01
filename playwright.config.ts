import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Only look for tests inside this folder
  testDir: './e2e',

  // Only run Playwright tests that end with .e2e.spec.ts
  testMatch: ['**/*.e2e.spec.ts'],

  // These are Angular unit test files – ignore them
  testIgnore: ['**/src/**'],

  use: {
    baseURL: 'https://itxiprostore.web.app',
    headless: true, // change to false if you want to watch the browser
  },
});
