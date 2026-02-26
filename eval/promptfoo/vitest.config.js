/**
 * vitest.config.js
 * Vitest configuration for EVA red-team assertion unit tests.
 * Docs: https://vitest.dev/config/
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['__tests__/**/*.test.js'],
    // Display per-test timing in verbose mode
    reporters: ['verbose'],
  },
});
