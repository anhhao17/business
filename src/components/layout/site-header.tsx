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
    <>
      <nav className={`pill-nav ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="pill-nav-brand">
          <span className="pill-nav-brand-icon">
            <Waves className="h-4 w-4 text-white" strokeWidth={2.2} />
          </span>
          Ocean<span className="text-ocean-300">{t("brand.suffix")}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`pill-nav-link ${isActive(link.href) ? "active" : ""}`}
            >
              <HoverText>{link.label}</HoverText>
            </Link>
          ))}
        </div>

        <div className="pill-nav-actions">
          <div className="hidden md:block">
            <LanguageToggle current={lang} />
          </div>
          <button
            onClick={open}
            aria-label={t("common.openCart")}
            className="pill-nav-cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="pill-nav-cart-badge">{count}</span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t("common.toggleMenu")}
            className="pill-nav-cart md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed left-4 right-4 top-20 z-40 rounded-2xl border border-white/10 bg-deep-900/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 p-3">
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
            <div className="mt-2 border-t border-white/10 pt-2">
              <LanguageToggle current={lang} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
