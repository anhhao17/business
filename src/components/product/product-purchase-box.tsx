"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart";
import { useT } from "@/components/i18n/i18n-provider";
import type { Product } from "@/lib/types";

export function ProductPurchaseBox({ product }: { product: Product }) {
  const { t } = useT();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-deep-800/60 p-1">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label={t("common.decrease")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-semibold text-white">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label={t("common.increase")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-sm text-slate-400">{product.unit}</span>
      </div>

      <AddToCartButton
        product={product}
        quantity={qty}
        fullWidth
        label={qty > 1 ? t("product.addNtoCart", { n: qty }) : t("product.addToCart")}
      />
    </div>
  );
}
