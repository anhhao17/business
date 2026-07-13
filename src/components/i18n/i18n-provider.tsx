"use client";

import { createContext, useContext, useMemo } from "react";
import {
  type Lang,
  DEFAULT_LANG,
  translate as translateFn,
} from "@/lib/i18n/dictionaries";

type I18nValue = {
  lang: Lang;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({
      lang,
      t: (key, vars) => translateFn(lang, key, vars),
    }),
    [lang],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback for components rendered outside the provider (shouldn't happen
    // in practice, but keeps things safe).
    return {
      lang: DEFAULT_LANG,
      t: (key, vars) => translateFn(DEFAULT_LANG, key, vars),
    };
  }
  return ctx;
}
