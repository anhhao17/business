import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { env, isSupabaseConfigured } from "@/lib/env";

export const DEMO_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ocean";

export type AdminUser = {
  email: string;
  demo?: boolean;
};

/**
 * Returns the current admin user, or null if not authenticated.
 * - Supabase mode: requires a valid Supabase session whose email matches
 *   ADMIN_EMAIL (or is present in the `admins` table).
 * - Demo mode: requires the `oc-admin-demo` cookie set by /admin/login.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  if (!isSupabaseConfigured) {
    const store = await cookies();
    const cookie = store.get("oc-admin-demo");
    if (cookie?.value === "ok") {
      return { email: "demo@oceancatch.local", demo: true };
    }
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  if (env.adminEmail && user.email.toLowerCase() === env.adminEmail.toLowerCase()) {
    return { email: user.email };
  }
  const { data: adminRow } = await supabase
    .from("admins")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();
  if (adminRow) return { email: user.email };
  return null;
}
