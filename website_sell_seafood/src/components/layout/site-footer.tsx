import Link from "next/link";
import { Waves, Mail, Phone, MapPin } from "lucide-react";
import { getT } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/dictionaries";
import { env } from "@/lib/env";

export async function SiteFooter({ lang }: { lang: Lang }) {
  const { t } = await getT();
  void lang;

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-deep-900/60">
      <div className="aurora-bg pointer-events-none absolute inset-0 opacity-30" />
      <div className="container-page relative grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-abyss-600 shadow-glow">
              <Waves className="h-5 w-5 text-white" strokeWidth={2.2} />
            </span>
            <span className="font-display text-lg font-bold text-white">
              Ocean<span className="text-ocean-300">{t("brand.suffix")}</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {t("footer.tagline")}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="chip">{t("footer.chip.shipping")}</span>
            <span className="chip">{t("footer.chip.dock")}</span>
            <span className="chip">{t("footer.chip.sustainable")}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t("footer.shop")}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/products" className="text-slate-300 link-underline hover:text-white">
                {t("footer.shop.all")}
              </Link>
            </li>
            <li>
              <Link href="/products?category=fish" className="text-slate-300 link-underline hover:text-white">
                {t("footer.shop.fish")}
              </Link>
            </li>
            <li>
              <Link href="/products?category=crab" className="text-slate-300 link-underline hover:text-white">
                {t("footer.shop.crab")}
              </Link>
            </li>
            <li>
              <Link href="/products?category=specialty" className="text-slate-300 link-underline hover:text-white">
                {t("footer.shop.specialty")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t("footer.getInTouch")}
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-ocean-300" />
              <a href={`mailto:${env.contactEmail}`} className="link-underline hover:text-white">
                {env.contactEmail}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-ocean-300" />
              <span>(555) 012-3456</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-ocean-300" />
              <span>Pier 7, Harbor District</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Ocean Catch. {t("footer.rights")}</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-slate-300">
              {t("nav.admin")}
            </Link>
            <span className="text-slate-700">·</span>
            <Link href="/blog" className="hover:text-slate-300">
              {t("nav.blog")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
