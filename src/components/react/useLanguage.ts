import { useEffect, useState } from "react";

import type { Lang } from "../../i18n";
export type { Lang };

/** Current site language; follows the IT/EN switcher (script.js emits "icaro:language"). */
export function useLanguage(initial: Lang = "it"): Lang {
  // The page is rendered in its own language (/ or /en/); follow switches made in place.
  const [lang, setLang] = useState<Lang>(initial);
  useEffect(() => {
    const onChange = (event: Event) => setLang((event as CustomEvent<Lang>).detail === "en" ? "en" : "it");
    window.addEventListener("icaro:language", onChange);
    return () => window.removeEventListener("icaro:language", onChange);
  }, []);
  return lang;
}
