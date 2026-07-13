"use client";

import Link from "next/link";
import { ArrowRight, Fish, ShieldCheck, Truck, Waves } from "lucide-react";
import { useT } from "@/components/i18n/i18n-provider";
import { Parallax } from "@/components/effects/parallax";

export function HeroSection() {
  const { t } = useT();

  return (
    <section className="relative overflow-hidden">
      {/* Animated aurora background */}
      <div className="aurora-bg pointer-events-none absolute inset-0" />
      <div className="grid-overlay pointer-events-none absolute inset-0" />

      {/* Floating glow orbs — parallax on scroll */}
      <Parallax speed={80} className="pointer-events-none absolute -left-20 top-20">
        <div className="h-72 w-72 rounded-full bg-ocean-500/20 blur-3xl animate-float" />
      </Parallax>
      <Parallax speed={140} className="pointer-events-none absolute right-0 top-40">
        <div
          className="h-80 w-80 rounded-full bg-abyss-500/20 blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />
      </Parallax>

      <div className="container-page relative py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <span className="section-eyebrow animate-fade-up">
            <Waves className="h-3.5 w-3.5" /> {t("hero.eyebrow")}
          </span>

          <h1
            className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl animate-fade-up"
            style={{ animationDelay: "60ms" }}
          >
            <span className="text-gradient">{t("hero.title1")}</span>
            <br />
            <span className="text-white">{t("hero.title2")}</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            {t("hero.body")}
          </p>

          {/* Terminal-style code line (devin.ai/cli inspired) */}
          <div
            className="mx-auto mt-7 max-w-lg animate-fade-up"
            style={{ animationDelay: "150ms" }}
          >
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-deep-900/60 px-4 py-3 font-mono text-sm backdrop-blur">
              <span className="text-ocean-400">$</span>
              <span className="text-slate-300">
                curl -fsSL https://ocean-catch.dev/install.sh | bash
              </span>
              <span className="ml-auto h-3.5 w-2 animate-pulse bg-ocean-300/80" />
            </div>
          </div>

          <div
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            <Link href="/products" className="btn-primary">
              {t("hero.ctaShop")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/blog" className="btn-ghost">
              {t("hero.ctaBlog")}
            </Link>
          </div>

          {/* Trust strip */}
          <div
            className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4 animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <TrustItem icon={<Truck className="h-5 w-5" />} label={t("hero.trust.shipping")} />
            <TrustItem icon={<ShieldCheck className="h-5 w-5" />} label={t("hero.trust.freshness")} />
            <TrustItem icon={<Fish className="h-5 w-5" />} label={t("hero.trust.sustainable")} />
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="relative -mb-1">
        <svg
          className="block h-16 w-full text-deep-900"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0,40 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
          />
        </svg>
      </div>
    </section>
  );
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-slate-300">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ocean-400/30 bg-ocean-400/10 text-ocean-200">
        {icon}
      </span>
      <span className="text-xs font-medium sm:text-sm">{label}</span>
    </div>
  );
}
