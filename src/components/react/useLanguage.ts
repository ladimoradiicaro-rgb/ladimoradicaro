import { useEffect, useState } from "react";

export type Lang = "it" | "en";

const read = (): Lang => {
  try {
    return localStorage.getItem("siteLanguage") === "en" ? "en" : "it";
  } catch {
    return "it";
  }
};

/** Current site language; follows the IT/EN switcher (script.js emits "icaro:language"). */
export function useLanguage(): Lang {
  const [lang, setLang] = useState<Lang>("it");
  useEffect(() => {
    setLang(read());
    const onChange = (event: Event) => setLang((event as CustomEvent<Lang>).detail === "en" ? "en" : "it");
    const onStorage = () => setLang(read());
    window.addEventListener("icaro:language", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("icaro:language", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return lang;
}
