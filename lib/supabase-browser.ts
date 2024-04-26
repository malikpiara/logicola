import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { useMemo } from 'react';

let client: SupabaseClient;

function getSupabaseBrowserClient() {
  if (client) {
    return client;
  }

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}

function useSupabaseBrowser() {
  return useMemo(getSupabaseBrowserClient, []);
}

export default useSupabaseBrowser;
