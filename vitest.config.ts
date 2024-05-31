import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
