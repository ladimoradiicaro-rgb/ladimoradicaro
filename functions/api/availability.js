// GET /api/availability?home=verde|blu
// Busy nights for one home, merged from the iCal exports of Airbnb and Booking.com.
//
// The feed URLs are private: they live as Cloudflare Pages secrets, never in the repo.
//   ICAL_VERDE = "<airbnb verde .ics> <booking verde .ics>"   (space-separated, any number)
//   ICAL_BLU   = "<airbnb blu .ics> <booking blu .ics>"
// Without them the endpoint answers in demo mode with a few sample busy nights, so the
// calendar can be previewed before the real links are configured.
//
// Response: { home, mode: "live" | "demo", updated, busy: ["2027-07-10", ...] }
// A date in `busy` means the NIGHT starting that day is taken.

const HOMES = { verde: "ICAL_VERDE", blu: "ICAL_BLU" };
const CACHE_SECONDS = 600; // 10 minutes: plenty for a request-to-book flow, light on Airbnb/Booking
const HORIZON_DAYS = 550;

const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

function parseDate(value) {
  // DTSTART;VALUE=DATE:20270710  or  DTSTART:20270710T140000Z
  const m = value.match(/(\d{4})(\d{2})(\d{2})/);
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null;
}

function busyFromIcal(text, from, to) {
  const busy = new Set();
  const unfolded = text.replace(/\r?\n[ \t]/g, ""); // RFC 5545 line folding
  for (const block of unfolded.split("BEGIN:VEVENT").slice(1)) {
    const start = parseDate((block.match(/\nDTSTART[^:]*:([^\r\n]+)/) || [])[1] || "");
    let end = parseDate((block.match(/\nDTEND[^:]*:([^\r\n]+)/) || [])[1] || "");
    if (!start) continue;
    if (!end || end <= start) end = new Date(start.getTime() + 86400000);
    // DTEND is exclusive: the checkout day itself stays bookable.
    for (let d = new Date(Math.max(start, from)); d < end && d < to; d = new Date(d.getTime() + 86400000)) {
      busy.add(iso(d));
    }
  }
  return busy;
}

function demoBusy(home, from) {
  // Deterministic sample stays so the preview looks realistic.
  const offsets = home === "verde" ? [[6, 4], [19, 7], [41, 3], [63, 10]] : [[3, 2], [12, 5], [30, 7], [55, 4]];
  const busy = [];
  for (const [startOffset, length] of offsets) {
    for (let i = 0; i < length; i += 1) busy.push(iso(new Date(from.getTime() + (startOffset + i) * 86400000)));
  }
  return busy;
}

export async function onRequestGet({ request, env, waitUntil }) {
  const url = new URL(request.url);
  const home = url.searchParams.get("home");
  if (!HOMES[home]) return Response.json({ error: "home must be verde or blu" }, { status: 400 });

  const feedsValue = env[HOMES[home]] || "";
  // The cache key carries a fingerprint of the configured feeds, so changing the links
  // takes effect immediately instead of after the cache expires.
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(feedsValue));
  const fingerprint = [...new Uint8Array(digest)].slice(0, 6).map((b) => b.toString(16).padStart(2, "0")).join("");
  const cache = caches.default;
  const cacheKey = new Request(`${url.origin}/api/availability?home=${home}&v=${fingerprint}`);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const to = new Date(from.getTime() + HORIZON_DAYS * 86400000);
  const feeds = feedsValue.split(/\s+/).filter((u) => u.startsWith("https://"));

  let body;
  if (!feeds.length) {
    body = { home, mode: "demo", updated: new Date().toISOString(), busy: demoBusy(home, from) };
  } else {
    const results = await Promise.allSettled(
      feeds.map((feed) =>
        fetch(feed, { headers: { "User-Agent": "LaDimoraDiIcaro-Calendar/1.0" }, cf: { cacheTtl: 300 } }).then((r) => {
          if (!r.ok) throw new Error(`feed ${r.status}`);
          return r.text();
        }),
      ),
    );
    const ok = results.filter((r) => r.status === "fulfilled");
    if (!ok.length) {
      // Never pretend a home is free when we couldn't read its calendar.
      return Response.json({ error: "calendar unavailable" }, { status: 502, headers: { "Cache-Control": "no-store" } });
    }
    const busy = new Set();
    ok.forEach((r) => busyFromIcal(r.value, from, to).forEach((d) => busy.add(d)));
    body = {
      home,
      mode: "live",
      partial: ok.length < feeds.length, // one of the channels didn't answer
      updated: new Date().toISOString(),
      busy: [...busy].sort(),
    };
  }

  const response = Response.json(body, {
    headers: { "Cache-Control": `public, max-age=${CACHE_SECONDS}` },
  });
  waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
