"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { CartItem, Product } from "@/lib/types";

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "add"; product: CartItem["product"]; quantity?: number }
  | { type: "remove"; productId: string }
  | { type: "setQty"; productId: string; quantity: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

const STORAGE_KEY = "ocean-catch-cart-v1";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const qty = action.quantity ?? 1;
      const existing = state.items.find(
        (i) => i.product.id === action.product.id,
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + qty }
              : i,
          ),
        };
      }
      return { items: [...state.items, { product: action.product, quantity: qty }] };
    }
    case "remove":
      return { items: state.items.filter((i) => i.product.id !== action.productId) };
    case "setQty":
      return {
        items: state.items
          .map((i) =>
            i.product.id === action.productId
              ? { ...i, quantity: Math.max(0, action.quantity) }
              : i,
          )
          .filter((i) => i.quantity > 0),
      };
    case "clear":
      return { items: [] };
    case "hydrate":
      return { items: action.items };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: CartItem["product"], quantity?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, quantity: number) => void;
  clear: () => void;
  /** Convenience wrapper to add from a full Product object. */
  addProduct: (product: Product, quantity?: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", items: parsed });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* ignore */
    }
  }, [state.items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = state.items.reduce(
      (s, i) => s + i.product.price * i.quantity,
      0,
    );
    return {
      items: state.items,
      count,
      subtotal,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add: (product, quantity) => {
        dispatch({ type: "add", product, quantity });
        setIsOpen(true);
      },
      remove: (productId) => dispatch({ type: "remove", productId }),
      setQty: (productId, quantity) =>
        dispatch({ type: "setQty", productId, quantity }),
      clear: () => dispatch({ type: "clear" }),
      addProduct: (product, quantity = 1) =>
        dispatch({
          type: "add",
          product: {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            unit: product.unit,
          },
          quantity,
        }),
    };
  }, [state.items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
