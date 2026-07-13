import { createClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

/**
 * Service-role client that bypasses RLS. ONLY use server-side, and only for
 * trusted admin operations / seeding. Never expose this to the browser.
 */
export function createServiceClient() {
  if (!isSupabaseConfigured || !env.supabaseServiceRoleKey) {
    return null;
  }
  return createClient(
    env.supabaseUrl,
    env.supabaseServiceRoleKey,
    { auth: { persistSession: false } },
  );
}
