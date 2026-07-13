import type { Metadata } from "next";
import { Inter, Sora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { DotGrid } from "@/components/effects/dot-grid";
import { FishCursor } from "@/components/effects/fish-cursor";
import { SharkChomp } from "@/components/effects/shark-chomp";
import { getLang } from "@/lib/i18n";
import { env } from "@/lib/env";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "OceanCatch — Hải Sản Tươi Sống, Giao Tận Nơi",
    template: "%s · OceanCatch",
  },
  description:
    "Hải sản đánh bắt tự nhiên và nuôi trồng bền vững cao cấp, giao tươi trong ngày từ bến cá đến tận nhà. Cá hồi, sò điệp, tôm hùm, hàu, trứng cá và nhiều hơn nữa.",
  keywords: [
    "hải sản tươi",
    "mua hải sản online",
    "cá hồi tự nhiên",
    "sò điệp",
    "tôm hùm",
    "hàu",
    "trứng cá",
    "hải sản bền vững",
  ],
  openGraph: {
    title: "OceanCatch — Hải Sản Tươi Sống, Giao Tận Nơi",
    description:
      "Hải sản đánh bắt tự nhiên và nuôi trồng bền vững cao cấp, giao tươi trong ngày từ bến cá đến tận nhà.",
    type: "website",
    url: env.siteUrl,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getLang();
  return (
    <html lang={lang === "vi" ? "vi" : "en"} className={`${inter.variable} ${sora.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-ocean-linear font-sans">
        <ScrollProgress />
        <DotGrid />
        <FishCursor />
        <SharkChomp />
        <I18nProvider lang={lang}>
          <CartProvider>
            <div className="relative z-10 flex min-h-screen flex-col">
              <SiteHeader lang={lang} />
              <main className="flex-1">{children}</main>
              <SiteFooter lang={lang} />
              <CartDrawer />
            </div>
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
