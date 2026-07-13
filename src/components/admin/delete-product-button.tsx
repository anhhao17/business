"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useT } from "@/components/i18n/i18n-provider";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const { t } = useT();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-coral/10 hover:text-coral"
        aria-label={t("common.delete")}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    );
  }
  return (
    <span className="flex items-center gap-2">
      <button
        onClick={async () => {
          setBusy(true);
          await fetch("/api/admin/products", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          router.refresh();
        }}
        className="rounded-lg bg-coral/20 px-2.5 py-1 text-xs font-semibold text-coral hover:bg-coral/30"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : t("admin.products.deleteConfirm", { name: name.slice(0, 16) })}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-white"
      >
        {t("common.cancel")}
      </button>
    </span>
  );
}
