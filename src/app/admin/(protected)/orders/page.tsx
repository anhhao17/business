import { env } from "@/lib/env";
import { formatPrice, formatDate } from "@/lib/format";
import { getT } from "@/lib/i18n";
import { StatusBadge } from "@/components/admin/status-badge";

export const metadata = { title: "Orders" };

type ApiOrder = {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  address: string;
  note: string | null;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: string;
  created_at: string;
};

export default async function AdminOrdersPage() {
  const { t } = await getT();
  const res = await fetch(`${env.siteUrl}/api/orders`, { cache: "no-store" });
  const data = await res.json();
  const orders: ApiOrder[] = data.orders ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">{t("admin.orders.title")}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {orders.length} {orders.length === 1 ? t("common.item") : t("common.items")}
      </p>

      {orders.length === 0 ? (
        <div className="glass-card mt-6 p-10 text-center">
          <p className="text-sm text-slate-400">{t("admin.orders.none")}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="glass-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-base font-semibold text-white">
                      {o.customer_name}
                    </h3>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    #{o.id.slice(0, 8).toUpperCase()} · {formatDate(o.created_at)}
                  </p>
                </div>
                <p className="font-display text-lg font-bold text-white">
                  {formatPrice(o.total)}
                </p>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="text-sm">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{t("admin.contact")}</p>
                  <p className="mt-1 text-slate-300">
                    <a href={`mailto:${o.email}`} className="link-underline hover:text-white">{o.email}</a>
                    {o.phone && <span className="block text-slate-400">{o.phone}</span>}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">{t("admin.shipping")}</p>
                  <p className="mt-1 text-slate-300">{o.address}</p>
                  {o.note && (
                    <>
                      <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">{t("admin.note")}</p>
                      <p className="mt-1 text-slate-400">{o.note}</p>
                    </>
                  )}
                </div>
                <div className="text-sm">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{t("admin.items")}</p>
                  <ul className="mt-1 space-y-1">
                    {o.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-slate-300">
                        <span>{item.quantity}× {item.name}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
