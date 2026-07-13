import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env, isSupabaseConfigured } from "@/lib/env";

/** Server Supabase client for Server Components / Route Handlers. */
export async function createClient() {
  const cookieStore = await cookies();

  if (!isSupabaseConfigured) {
    return null as unknown as ReturnType<typeof createServerClient>;
  }

  return createServerClient(
    env.supabaseUrl,
    env.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore.
          }
        },
      },
    },
  );
}
