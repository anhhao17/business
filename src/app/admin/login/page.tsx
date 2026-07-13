import Link from "next/link";
import { Lock, Waves } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/env";
import { DEMO_ADMIN_PASSWORD } from "@/lib/admin-auth";
import { getT } from "@/lib/i18n";

export const metadata = { title: "Admin login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { t } = await getT();
  const sp = await searchParams;
  const error = sp.error === "1";

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div className="aurora-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="grid-overlay pointer-events-none absolute inset-0" />

      <div className="glass-card relative w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-abyss-600 shadow-glow">
            <Waves className="h-6 w-6 text-white" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-white">
            {t("admin.login.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{t("admin.login.subtitle")}</p>
        </div>

        {error && (
          <p className="mt-5 rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-center text-xs text-coral">
            {t("admin.login.invalid")}
          </p>
        )}

        <form action="/api/admin/auth" method="POST" className="mt-6 space-y-4">
          {isSupabaseConfigured ? (
            <>
              <div>
                <label className="label-field">{t("contact.email")}</label>
                <input name="email" type="email" required className="input-field" placeholder="you@example.com" />
              </div>
              <div>
                <label className="label-field">{t("admin.login.password")}</label>
                <input name="password" type="password" required className="input-field" placeholder="••••••••" />
              </div>
            </>
          ) : (
            <>
              <input type="hidden" name="email" value="demo@oceancatch.local" />
              <div>
                <label className="label-field">{t("admin.login.demoPassword")}</label>
                <input name="password" type="password" required className="input-field" placeholder="••••••••" />
              </div>
              <p className="rounded-lg border border-ocean-400/20 bg-ocean-400/5 px-3 py-2 text-xs text-slate-300">
                {t("admin.login.demoHint", { pw: DEMO_ADMIN_PASSWORD })}
              </p>
            </>
          )}

          <button type="submit" className="btn-primary w-full">
            <Lock className="h-4 w-4" /> {t("common.signIn")}
          </button>
        </form>

        <Link href="/" className="mt-5 block text-center text-xs text-slate-400 hover:text-white">
          {t("common.backToStore")}
        </Link>
      </div>
    </div>
  );
}
