import Link from "next/link";
import { Waves } from "lucide-react";
import { getT } from "@/lib/i18n";

export default async function NotFound() {
  const { t } = await getT();
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
      <div className="aurora-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="glass-card relative max-w-md p-10 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-abyss-600 shadow-glow">
          <Waves className="h-6 w-6 text-white" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-white">{t("404.title")}</h1>
        <p className="mt-2 text-sm text-slate-400">{t("404.body")}</p>
        <Link href="/" className="btn-primary mt-6">
          {t("common.backToHome")}
        </Link>
      </div>
    </div>
  );
}
