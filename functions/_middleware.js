// Runs before every request on Cloudflare Pages.
//
// 1. The domain without www always redirects to www.ladimoradicaro.com (same as the canonicals).
// 2. Pause mode: when the Pages variable MAINTENANCE is "1", every page answers with a short
//    "Torniamo presto" page (HTTP 503 + Retry-After, so search engines keep the site indexed).
//    Images, fonts and other files keep working so the page can show the logo.
//    To reopen the site: set MAINTENANCE to "0" (or delete it) and publish again.

const PAUSE_PAGE = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>La Dimora di Icaro · Torniamo presto</title>
<meta name="description" content="La Dimora di Icaro, case vacanza a Carini (Palermo). Il sito tornerà presto online: per informazioni scrivici su WhatsApp o per email." />
<meta name="robots" content="noindex" />
<link rel="icon" href="/assets/logo-originale.png" />
<style>
  :root { --blue: #077cbd; --ink: #1f2a33; --muted: #4f5d68; --paper: #fffaf1; --line: rgba(31, 42, 51, 0.1); }
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; }
  body {
    display: grid;
    place-items: center;
    min-height: 100svh;
    padding: 32px 16px;
    background: var(--paper);
    color: var(--ink);
    font: 400 17px/1.6 "Nunito Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
    text-align: center;
  }
  main { width: min(32rem, 100%); }
  .logo { display: block; width: min(22rem, 86vw); height: auto; margin: 0 auto 2rem; }
  h1 { margin: 0 0 0.5rem; font-size: 1.6rem; font-weight: 600; line-height: 1.25; text-wrap: balance; }
  p { margin: 0 auto 0.4rem; color: var(--muted); text-wrap: pretty; }
  .en { margin-top: 1.25rem; font-size: 0.95rem; }
  .actions { display: grid; gap: 0.6rem; margin: 2rem auto 0; width: min(20rem, 100%); }
  .actions a {
    display: block;
    padding: 0.85rem 1rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: #fff;
    color: var(--ink);
    font-weight: 600;
    text-decoration: none;
    transition: border-color 150ms ease, background-color 150ms ease;
  }
  .actions a.primary { border-color: var(--blue); background: var(--blue); color: #fff; }
  .actions a:hover { border-color: rgba(31, 42, 51, 0.25); }
  .actions a.primary:hover { background: #05659b; }
  .actions a:focus-visible { outline: 2px solid var(--blue); outline-offset: 3px; }
  footer { margin-top: 2.5rem; color: #7a8590; font-size: 0.85rem; }
</style>
</head>
<body>
<main>
  <img class="logo" src="/assets/logo-site-web.webp" width="1200" height="180" alt="La Dimora di Icaro" />
  <h1>Torniamo presto</h1>
  <p>Stiamo preparando le dimore per i prossimi ospiti. Il sito tornerà online a breve.</p>
  <p>Per informazioni o disponibilità scrivici: ti rispondiamo noi.</p>
  <p class="en" lang="en">We'll be back soon. For information or availability, message us on WhatsApp or by email.</p>
  <div class="actions">
    <a class="primary" href="https://wa.me/393493608146">WhatsApp · 349 360 8146</a>
    <a href="mailto:ladimoradiicaro@gmail.com">ladimoradiicaro@gmail.com</a>
    <a href="tel:+393470395338">Telefono · 347 039 5338</a>
  </div>
  <footer>Via Strada Statale Est, 157 · 90044 Carini (PA)<br />CIN IT082021C23NRN5DBU · CIR 19082021C259979</footer>
</main>
</body>
</html>`;

// Files the pause page itself needs, plus what crawlers and bots ask for.
const PASSTHROUGH = /^\/(assets\/|vendor\/|_astro\/|robots\.txt$|favicon)/;

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);

  if (url.hostname === "ladimoradicaro.com") {
    url.hostname = "www.ladimoradicaro.com";
    return Response.redirect(url.toString(), 301);
  }

  if (env.MAINTENANCE === "1" && !PASSTHROUGH.test(url.pathname)) {
    return new Response(PAUSE_PAGE, {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Retry-After": "86400",
        "Cache-Control": "no-store",
      },
    });
  }

  return next();
}
