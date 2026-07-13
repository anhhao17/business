import Link from "next/link";
import {
  ArrowRight,
  Package,
  FileText,
  ShoppingCart,
  Mail,
  Plus,
} from "lucide-react";
import { getProducts, getBlogPosts } from "@/lib/data";
import { isSupabaseConfigured, env } from "@/lib/env";
import { formatPrice, formatDate } from "@/lib/format";
import { getT } from "@/lib/i18n";
import { StatusBadge } from "@/components/admin/status-badge";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const { t } = await getT();
  const [products, posts] = await Promise.all([
    getProducts(),
    getBlogPosts(),
  ]);

  const base = env.siteUrl;
  const [ordersRes, messagesRes] = await Promise.all([
    fetch(`${base}/api/orders`, { cache: "no-store" }).then((r) => r.json()).catch(() => ({ orders: [] })),
    fetch(`${base}/api/contact`, { cache: "no-store" }).then((r) => r.json()).catch(() => ({ messages: [] })),
  ]);
  const orders = (ordersRes.orders ?? []) as Array<{
    id: string;
    total: number;
    status: string;
    customer_name: string;
    created_at: string;
  }>;
  const messages = (messagesRes.messages ?? []) as Array<{
    id: string;
    name: string;
    subject: string;
    created_at: string;
    handled: boolean;
  }>;

  const revenue = orders.reduce((s, o) => s + (o.total ?? 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const unreadMessages = messages.filter((m) => !m.handled).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{t("admin.dashboard")}</h1>
          <p className="mt-1 text-sm text-slate-400">{t("admin.welcome")}</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="h-4 w-4" /> {t("admin.addProduct")}
        </Link>
      </div>

      {!isSupabaseConfigured && (
        <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          {t("admin.demoWarning")}
        </div>
      )}

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Package className="h-5 w-5" />}
          label={t("admin.stat.products")}
          value={String(products.length)}
          href="/admin/products"
        />
        <StatCard
          icon={<ShoppingCart className="h-5 w-5" />}
          label={t("admin.stat.orders")}
          value={String(orders.length)}
          sub={`${pendingOrders} ${t("admin.stat.pending")}`}
          href="/admin/orders"
        />
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label={t("admin.stat.posts")}
          value={String(posts.length)}
          href="/admin/blog"
        />
        <StatCard
          icon={<Mail className="h-5 w-5" />}
          label={t("admin.stat.messages")}
          value={String(messages.length)}
          sub={`${unreadMessages} ${t("admin.stat.unread")}`}
          href="/admin/messages"
        />
      </div>

      {/* Revenue */}
      <div className="glass-card mt-4 p-6">
        <p className="text-xs uppercase tracking-wider text-slate-500">
          {t("admin.revenue")}
        </p>
        <p className="mt-1 font-display text-3xl font-bold text-white">
          {formatPrice(revenue)}
        </p>
      </div>

      {/* Recent orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">
            {t("admin.recentOrders")}
          </h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm text-ocean-300 hover:text-white"
          >
            {t("admin.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="glass-card mt-4 overflow-hidden">
          {orders.length === 0 ? (
            <p className="p-6 text-sm text-slate-400">{t("admin.orders.none")}</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">{t("admin.customer")}</th>
                  <th className="px-4 py-3">{t("admin.total")}</th>
                  <th className="px-4 py-3">{t("admin.status")}</th>
                  <th className="px-4 py-3">{t("admin.date")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 text-white">{o.customer_name}</td>
                    <td className="px-4 py-3 text-white">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {formatDate(o.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  href: string;
}) {
  return (
    <Link href={href} className="glass-card-hover group p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ocean-400/10 text-ocean-200">
          {icon}
        </span>
        <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:text-ocean-300" />
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
      {sub && <p className="mt-1 text-xs text-ocean-300">{sub}</p>}
    </Link>
  );
}
