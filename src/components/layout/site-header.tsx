"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, Waves, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { useT } from "@/components/i18n/i18n-provider";
import { HoverText } from "@/components/effects/hover-text";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import type { Lang } from "@/lib/i18n/dictionaries";

export function SiteHeader({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const { count, open } = useCart();
  const { t } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/products", label: t("nav.shop") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-deep-900/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-abyss-600 shadow-glow">
            <Waves className="h-5 w-5 text-white" strokeWidth={2.2} />
            <span className="absolute inset-0 rounded-xl bg-wave-shine opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Ocean<span className="text-ocean-300">{t("brand.suffix")}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <HoverText>{link.label}</HoverText>
              {isActive(link.href) && (
                <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-ocean-400 to-transparent" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle current={lang} />
          <button
            onClick={open}
            aria-label={t("common.openCart")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-100 transition hover:border-ocean-400/50 hover:bg-white/[0.08]"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-ocean-400 to-abyss-500 px-1 text-[10px] font-bold text-white shadow-glow">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t("common.toggleMenu")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-100 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-deep-900/95 backdrop-blur-xl md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-ocean-400/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
