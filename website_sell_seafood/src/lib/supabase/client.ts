import { createBrowserClient } from "@supabase/ssr";
import { env, isSupabaseConfigured } from "@/lib/env";

/** Browser Supabase client. Safe to call in Client Components. */
export function createClient() {
  if (!isSupabaseConfigured) {
    // Return a no-op-ish stub so the app never crashes in demo mode.
    // Real auth calls will simply reject; the UI guards against that.
    return null as unknown as ReturnType<typeof createBrowserClient>;
  }
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
