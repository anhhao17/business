import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { getT } from "@/lib/i18n";

export const metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  const { t } = await getT();

  return (
    <div className="container-page py-8">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass-card p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              {t("admin.signedInAs")}
            </p>
            <p className="mt-1 truncate text-sm font-medium text-white">
              {user.email}
            </p>
            {user.demo && (
              <span className="mt-2 inline-block rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                {t("admin.demoMode")}
              </span>
            )}
          </div>
          <AdminNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
