// Centralized runtime configuration.
// Reads from environment variables with safe fallbacks so the app can run
// in a "demo mode" (local JSON data) when Supabase is not yet configured.

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  adminEmail: process.env.ADMIN_EMAIL ?? "",
  contactEmail: process.env.CONTACT_EMAIL ?? "orders@oceancatch.com",
};

/** True when Supabase env vars look valid (not the placeholder template). */
export const isSupabaseConfigured = (() => {
  const url = env.supabaseUrl;
  const key = env.supabaseAnonKey;
  return (
    Boolean(url) &&
    !url.includes("YOUR-PROJECT") &&
    Boolean(key) &&
    !key.includes("your-anon-key")
  );
})();
