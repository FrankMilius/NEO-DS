import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.{js,mjs}'],
    exclude: ['apps/**', 'node_modules/**'],
    reporters: ['verbose'],
    passWithNoTests: false,
  },
});
