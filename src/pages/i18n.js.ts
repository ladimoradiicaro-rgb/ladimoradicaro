// Emits /i18n.js: the dictionaries for the classic scripts (script.js, scopri.js).
import { dictionaries } from "../i18n";

export const GET = () =>
  new Response(`window.ICARO_I18N=${JSON.stringify(dictionaries)};\n`, {
    headers: { "Content-Type": "application/javascript; charset=utf-8" },
  });
