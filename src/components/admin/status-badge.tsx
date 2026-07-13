import { getT } from "@/lib/i18n";

export async function StatusBadge({ status }: { status: string }) {
  const { t } = await getT();
  const map: Record<string, string> = {
    pending: "bg-amber-400/15 text-amber-300",
    paid: "bg-sky-400/15 text-sky-300",
    shipped: "bg-indigo-400/15 text-indigo-300",
    delivered: "bg-emerald-400/15 text-emerald-300",
    cancelled: "bg-coral/15 text-coral",
  };
  const labelKey = `status.${status}` as const;
  const label = t(labelKey);
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        map[status] ?? "bg-white/10 text-slate-300"
      }`}
    >
      {label}
    </span>
  );
}
