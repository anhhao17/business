"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingCart,
  Mail,
  LogOut,
} from "lucide-react";
import { useT } from "@/components/i18n/i18n-provider";

export function AdminNav() {
  const pathname = usePathname();
  const { t } = useT();

  const links = [
    { href: "/admin", label: t("admin.dashboard"), icon: LayoutDashboard, exact: true },
    { href: "/admin/products", label: t("admin.products"), icon: Package },
    { href: "/admin/blog", label: t("admin.blog"), icon: FileText },
    { href: "/admin/orders", label: t("admin.orders"), icon: ShoppingCart },
    { href: "/admin/messages", label: t("admin.messages"), icon: Mail },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="glass-card mt-4 p-3">
      <ul className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, link.exact);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-ocean-400/15 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            </li>
          );
        })}
        <li className="pt-2">
          <button
            onClick={async () => {
              await fetch("/api/admin/auth", { method: "DELETE" });
              window.location.href = "/admin/login";
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-coral/10 hover:text-coral"
          >
            <LogOut className="h-4 w-4" />
            {t("common.signOut")}
          </button>
        </li>
      </ul>
    </nav>
  );
}
