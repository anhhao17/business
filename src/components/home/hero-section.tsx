"use client";

import Link from "next/link";
import { ArrowRight, Fish, ShieldCheck, Truck, Waves } from "lucide-react";
import { useT } from "@/components/i18n/i18n-provider";
import { Parallax } from "@/components/effects/parallax";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { WaveDivider } from "@/components/effects/wave-divider";

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

      <div className="container-page relative pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-36">
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

          <div
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            <MagneticButton strength={0.4} radius={120}>
              <Link href="/products" className="btn-primary">
                {t("hero.ctaShop")} <ArrowRight className="h-4 w-4" />
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.3} radius={80}>
              <Link href="/blog" className="btn-ghost">
                {t("hero.ctaBlog")}
              </Link>
            </MagneticButton>
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

      <WaveDivider color="rgba(4, 17, 31, 1)" />
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
