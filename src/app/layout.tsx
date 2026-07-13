import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { DotGrid } from "@/components/effects/dot-grid";
import { FishCursor } from "@/components/effects/fish-cursor";
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

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Ocean Catch — Fresh Seafood, Delivered Overnight",
    template: "%s · Ocean Catch",
  },
  description:
    "Premium wild-caught and sustainably farmed seafood, shipped overnight from the dock to your door. Salmon, scallops, lobster, oysters, caviar and more.",
  keywords: [
    "fresh seafood",
    "buy seafood online",
    "wild salmon",
    "scallops",
    "lobster",
    "oysters",
    "caviar",
    "sustainable seafood",
  ],
  openGraph: {
    title: "Ocean Catch — Fresh Seafood, Delivered Overnight",
    description:
      "Premium wild-caught and sustainably farmed seafood, shipped overnight from the dock to your door.",
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
    <html lang={lang === "vi" ? "vi" : "en"} className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-ocean-linear font-sans">
        <ScrollProgress />
        <DotGrid />
        <FishCursor />
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
