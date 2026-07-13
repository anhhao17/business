import { env } from "@/lib/env";
import { formatDate } from "@/lib/format";
import { getT } from "@/lib/i18n";

export const metadata = { title: "Messages" };

type ApiMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  handled: boolean;
};

export default async function AdminMessagesPage() {
  const { t } = await getT();
  const res = await fetch(`${env.siteUrl}/api/contact`, { cache: "no-store" });
  const data = await res.json();
  const messages: ApiMessage[] = data.messages ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">{t("admin.messages.title")}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {messages.length} {messages.length === 1 ? t("common.item") : t("common.items")}
      </p>

      {messages.length === 0 ? (
        <div className="glass-card mt-6 p-10 text-center">
          <p className="text-sm text-slate-400">{t("admin.messages.none")}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="glass-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-white">
                    {m.subject}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {m.name} · <a href={`mailto:${m.email}`} className="link-underline hover:text-white">{m.email}</a> · {formatDate(m.created_at)}
                  </p>
                </div>
                {!m.handled && (
                  <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-300">
                    {t("admin.messages.new")}
                  </span>
                )}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
                {m.message}
              </p>
              <a
                href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                className="btn-outline mt-4"
              >
                {t("admin.messages.reply")}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
