"use client";

import { useState } from "react";
import { Check, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { useT } from "@/components/i18n/i18n-provider";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  quantity = 1,
  className = "",
  label,
  fullWidth = false,
}: {
  product: Product;
  quantity?: number;
  className?: string;
  label?: string;
  fullWidth?: boolean;
}) {
  const { addProduct } = useCart();
  const { t } = useT();
  const [added, setAdded] = useState(false);

  const text = label ?? t("product.addToCart");

  return (
    <button
      onClick={() => {
        addProduct(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
      className={`btn-primary ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={!product.in_stock}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" /> {t("common.added")}
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" /> {product.in_stock ? text : t("common.soldOut")}
        </>
      )}
    </button>
  );
}

export function QuickAddButton({ product }: { product: Product }) {
  const { addProduct } = useCart();
  const { t } = useT();
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addProduct(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      aria-label={t("common.quickAdd")}
      className="flex h-9 w-9 items-center justify-center rounded-full
                 bg-gradient-to-br from-ocean-400 to-abyss-500 text-white
                 shadow-glow transition hover:brightness-110"
    >
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}
