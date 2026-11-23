// Single source for every IT/EN string on the site.
// - Astro pages render Italian on the server with t("key").
// - The IT/EN switcher (script.js, scopri.js) reads the same dictionaries from /i18n.js
//   and swaps every [data-i18n] element; React islands call t(key, lang).
import it from "./it.json";
import en from "./en.json";

export type Lang = "it" | "en";
export type Key = keyof typeof it;
export const dictionaries = { it, en } as const;

/** Translate a key. {name} placeholders are replaced from vars. Falls back to Italian. */
export function t(key: Key, lang: Lang = "it", vars?: Record<string, string | number>): string {
  const text: string = (dictionaries[lang] as Record<string, string>)[key] ?? it[key] ?? key;
  return vars ? text.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? "")) : text;
}

/** Strings an island needs, by key prefix, for both languages — passed as a prop so the
    client bundle doesn't carry the whole dictionary. */
export type Dict = Record<Lang, Record<string, string>>;
export function pick(prefixes: string[]): Dict {
  const filter = (d: Record<string, string>) =>
    Object.fromEntries(Object.entries(d).filter(([key]) => prefixes.some((p) => key.startsWith(p))));
  return { it: filter(it), en: filter(en) };
}
