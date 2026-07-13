import { cookies } from "next/headers";
import {
  type Lang,
  DEFAULT_LANG,
  LANGS,
  LANG_COOKIE,
  translate as translateFn,
} from "./dictionaries";

export { LANG_COOKIE };

/** Read the active language from the cookie (server-side). */
export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const raw = store.get(LANG_COOKIE)?.value;
  if (raw && LANGS.includes(raw as Lang)) return raw as Lang;
  return DEFAULT_LANG;
}

/** Server-side translate: returns a `t()` bound to the cookie language. */
export async function getT() {
  const lang = await getLang();
  return {
    lang,
    t: (key: string, vars?: Record<string, string | number>) =>
      translateFn(lang, key, vars),
  };
}

export { translateFn as translate, DEFAULT_LANG, LANGS };
export type { Lang };
