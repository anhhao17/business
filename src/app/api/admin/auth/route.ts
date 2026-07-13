import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isSupabaseConfigured, env } from "@/lib/env";
import { DEMO_ADMIN_PASSWORD } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");

  // Demo mode: simple password gate.
  if (!isSupabaseConfigured) {
    if (password === DEMO_ADMIN_PASSWORD) {
      const store = await cookies();
      store.set("oc-admin-demo", "ok", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(
      new URL("/admin/login?error=1", request.url),
    );
  }

  // Supabase mode: real auth.
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=1`, request.url),
    );
  }
  return NextResponse.redirect(new URL("/admin", request.url));
}

export async function DELETE() {
  if (!isSupabaseConfigured) {
    const store = await cookies();
    store.delete("oc-admin-demo");
    return NextResponse.json({ ok: true });
  }
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}

// Silence unused import warning when Supabase isn't configured.
void env;
