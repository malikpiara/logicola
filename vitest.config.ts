import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    env: {
      NEXT_PUBLIC_POSTHOG_KEY: 'INVALID',
      NEXT_PUBLIC_POSTHOG_HOST: 'https://app.posthog.com',
      NEXT_PUBLIC_SUPABASE_URL: 'https://INVALID.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'INVALID',
    },
  },
});
