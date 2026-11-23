// Translation for React/Preact islands. Each island receives only the strings it uses
// (pick() in src/i18n, passed as the `dict` prop) and registers them here.
import type { Dict, Key, Lang } from "./index";

const store: Dict = { it: {}, en: {} };

export function registerDict(dict: Dict) {
  Object.assign(store.it, dict.it);
  Object.assign(store.en, dict.en);
}

export function t(key: Key, lang: Lang = "it", vars?: Record<string, string | number>): string {
  const text = store[lang][key] ?? store.it[key] ?? key;
  return vars ? text.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? "")) : text;
}

export type { Dict, Key, Lang };
