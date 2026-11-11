import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config.ts';

// Unit tests only. End-to-end tests live in e2e/ and run with Playwright.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'json-summary'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/test/**', 'src/**/*.d.ts', 'src/main.tsx'],
        // Minimum unit-test coverage (UNICEF open-source checklist). CI fails below this.
        thresholds: {
          lines: 15,
          statements: 15,
        },
      },
    },
  })
);
