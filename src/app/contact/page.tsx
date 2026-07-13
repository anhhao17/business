"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useT } from "@/components/i18n/i18n-provider";
import { env } from "@/lib/env";

export default function ContactPage() {
  const { t } = useT();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      subject: form.get("subject"),
      message: form.get("message"),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      setStatus("ok");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="aurora-bg pointer-events-none absolute inset-0 opacity-50" />
        <div className="container-page relative py-14 sm:py-20">
          <span className="section-eyebrow">{t("contact.eyebrow")}</span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
            {t("contact.title")}
          </h1>
          <p className="mt-3 max-w-xl text-slate-300">{t("contact.body")}</p>
        </div>
      </section>

      <div className="container-page grid gap-8 py-12 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold text-white">
              {t("contact.reachUs")}
            </h2>
            <ul className="mt-4 space-y-4 text-sm">
              <ContactRow icon={<Mail className="h-5 w-5" />} label={t("contact.email")}>
                <a href={`mailto:${env.contactEmail}`} className="link-underline hover:text-white">
                  {env.contactEmail}
                </a>
              </ContactRow>
              <ContactRow icon={<Phone className="h-5 w-5" />} label={t("contact.phone")}>
                <a href="tel:+84868786432" className="link-underline hover:text-white">
                  {env.contactPhone}
                </a>
              </ContactRow>
              <ContactRow icon={<MapPin className="h-5 w-5" />} label={t("contact.pier")}>
                {env.contactAddress}
              </ContactRow>
            </ul>
            <div className="mt-6 rounded-xl border border-ocean-400/20 bg-ocean-400/5 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">{t("contact.orderCutoff")}</p>
              <p className="mt-1 text-slate-400">{t("contact.cutoffBody")}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-6 sm:p-8">
            {status === "ok" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
                  <Send className="h-6 w-6 text-emerald-400" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold text-white">
                  {t("contact.sent")}
                </h2>
                <p className="mt-2 text-sm text-slate-400">{t("contact.sentBody")}</p>
                <button onClick={() => setStatus("idle")} className="btn-outline mt-6">
                  {t("contact.sendAnother")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label-field">{t("contact.name")} <span className="text-coral">*</span></label>
                    <input name="name" required className="input-field" placeholder={t("contact.namePlaceholder")} />
                  </div>
                  <div>
                    <label className="label-field">{t("contact.email")} <span className="text-coral">*</span></label>
                    <input name="email" type="email" required className="input-field" placeholder={t("contact.emailPlaceholder")} />
                  </div>
                </div>
                <div>
                  <label className="label-field">{t("contact.subject")} <span className="text-coral">*</span></label>
                  <input name="subject" required className="input-field" placeholder={t("contact.subjectPlaceholder")} />
                </div>
                <div>
                  <label className="label-field">{t("contact.message")} <span className="text-coral">*</span></label>
                  <textarea name="message" required rows={6} className="input-field" placeholder={t("contact.messagePlaceholder")} />
                </div>

                {error && (
                  <p className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-xs text-coral">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={status === "sending"} className="btn-primary">
                  {status === "sending" ? t("contact.sending") : t("contact.send")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-ocean-400/10 text-ocean-200">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
        <div className="text-slate-200">{children}</div>
      </div>
    </li>
  );
}
