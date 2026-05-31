import { createClient } from "@supabase/supabase-js";

// Server-side client — uses service role key, bypasses Row Level Security
export function createServerSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Browser-side client — uses anon key, respects Row Level Security
export function createBrowserSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
