"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { LANGS, LANG_SHORT, LANG_COOKIE, type Lang } from "@/lib/i18n/dictionaries";

export function LanguageToggle({ current }: { current: Lang }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(lang: Lang) {
    if (lang === current) return;
    // Set cookie via a tiny fetch so we can then refresh server components.
    document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-0.5">
      <Globe className="ml-1.5 h-3.5 w-3.5 text-slate-400" />
      {LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => switchTo(lang)}
          disabled={pending}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
            lang === current
              ? "bg-ocean-400/20 text-white"
              : "text-slate-400 hover:text-white"
          }`}
          aria-pressed={lang === current}
        >
          {LANG_SHORT[lang]}
        </button>
      ))}
    </div>
  );
}
