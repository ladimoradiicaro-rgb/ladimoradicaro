import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "./useLanguage";
import { registerDict, t, type Dict, type Key, type Lang } from "../../i18n/island";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { pricing, pricingIsDemo } from "../../data/pricing";
import { overlapsBusy, quote } from "../../lib/quote";
import "./BookingForm.css";

/* Booking request: pick the home, choose the dates on a calendar that shows the nights
   already booked on Airbnb/Booking (/api/availability), see the direct-booking price,
   then send the request on WhatsApp (or by email). The hosts confirm and take payment. Guests are capped by each home's capacity;
   "Da valutare insieme" leaves the choice to the hosts. Buttons elsewhere on the
   page with data-home-request="La Dimora Verde|La Dimora Blu" preselect a home. */

type HomeKey = "verde" | "blu" | "any";

const WHATSAPP = "393493608146";
const EMAIL = "ladimoradiicaro@gmail.com";

const homes: Record<HomeKey, { name: string; max: number; nameKey?: Key; detailKey: Key }> = {
  verde: { name: "La Dimora Verde", max: 7, detailKey: "booking.form.greenDetail" },
  blu: { name: "La Dimora Blu", max: 4, detailKey: "booking.form.blueDetail" },
  any: { name: "Da valutare insieme", max: 11, nameKey: "booking.form.any", detailKey: "booking.form.anyDetail" },
};

/** Strings for one language, all from src/i18n. */
const strings = (lang: Lang) => {
  const tr = (key: Key, vars?: Record<string, string | number>) => t(key, lang, vars);
  return {
    home: tr("booking.home"),
    any: tr("booking.form.any"),
    checkin: tr("booking.checkin"),
    checkout: tr("booking.checkout"),
    guests: tr("booking.guests"),
    less: tr("booking.form.less"),
    more: tr("booking.form.more"),
    nights: (n: number) => `${n} ${tr(n === 1 ? "booking.form.night" : "booking.form.nights")}`,
    pickDates: tr("booking.form.pickDates"),
    checkoutError: tr("booking.checkoutError"),
    capacity: (max: number) => tr("booking.form.capacity", { max }),
    send: tr("booking.form.send"),
    email: tr("booking.form.email"),
    greeting: tr("booking.form.greeting"),
    thanks: tr("booking.form.thanks"),
    subject: tr("booking.form.subject"),
    label: { home: tr("booking.home"), nights: tr("booking.form.nightsLabel"), guests: tr("booking.guests") },
    sendRequest: tr("booking.form.sendRequest"),
    priceLabel: tr("booking.form.priceLabel"),
    pickCheckin: tr("booking.cal.pickCheckin"),
    pickCheckout: tr("booking.cal.pickCheckout"),
    loading: tr("booking.cal.loading"),
    calError: tr("booking.cal.error"),
    demo: tr("booking.cal.demo"),
    overlap: tr("booking.cal.overlap"),
    minNights: (n: number) => tr("booking.cal.minNights", { n }),
    perNight: (price: number, n: number) => tr("booking.cal.perNight", { price, n }),
    discount: tr("booking.cal.discount"),
    cleaning: tr("booking.cal.cleaning"),
    total: tr("booking.cal.total"),
    priceNote: tr("booking.cal.note"),
    anyNote: tr("booking.cal.anyNote"),
  };
};

const isoDate = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const nightsBetween = (a: string, b: string) =>
  Math.round((new Date(`${b}T12:00:00`).getTime() - new Date(`${a}T12:00:00`).getTime()) / 86400000);
const formatDate = (iso: string, lang: Lang, withYear = false) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString(lang === "en" ? "en-GB" : "it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" as const } : {}),
  });

const track = (action: string, params: Record<string, unknown>) =>
  (window as unknown as { trackEvent?: (a: string, p: Record<string, unknown>) => void }).trackEvent?.(action, params);

export default function BookingForm({ dict, lang: initial = "it" }: { dict: Dict; lang?: Lang }) {
  registerDict(dict);
  const lang = useLanguage(initial);
  const tx = useMemo(() => strings(lang), [lang]);
  const [home, setHome] = useState<HomeKey>("verde");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);
  const [today, setToday] = useState("");
  const [tried, setTried] = useState(false);

  useEffect(() => setToday(isoDate(new Date())), []);

  // "Prenota la Dimora Verde/Blu" buttons elsewhere on the page preselect the home.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLElement>("[data-home-request]");
      if (!link) return;
      const value = link.dataset.homeRequest ?? "";
      setHome(value.includes("Blu") ? "blu" : value.includes("Verde") ? "verde" : "any");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const max = homes[home].max;
  useEffect(() => setGuests((g) => Math.min(g, max)), [max]);

  // Busy nights per home, read once from /api/availability (cached 15 min at the edge).
  type Feed = { status: "loading" | "ok" | "error"; busy: Set<string>; demo: boolean };
  const [feeds, setFeeds] = useState<Record<"verde" | "blu", Feed>>({
    verde: { status: "loading", busy: new Set(), demo: false },
    blu: { status: "loading", busy: new Set(), demo: false },
  });
  useEffect(() => {
    (["verde", "blu"] as const).forEach((key) => {
      fetch(`/api/availability?home=${key}`)
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((data: { busy: string[]; mode: string }) =>
          setFeeds((f) => ({ ...f, [key]: { status: "ok", busy: new Set(data.busy), demo: data.mode === "demo" } })))
        .catch(() => setFeeds((f) => ({ ...f, [key]: { status: "error", busy: new Set(), demo: false } })));
    });
  }, []);

  // "Da valutare insieme": a night is unavailable only when both homes are taken.
  const feed: Feed = home === "any"
    ? {
        status: feeds.verde.status === "loading" || feeds.blu.status === "loading" ? "loading"
          : feeds.verde.status === "error" && feeds.blu.status === "error" ? "error" : "ok",
        busy: new Set([...feeds.verde.busy].filter((d) => feeds.blu.busy.has(d))),
        demo: feeds.verde.demo || feeds.blu.demo,
      }
    : feeds[home];

  // A home switch can make the chosen nights unavailable: start over in that case.
  useEffect(() => {
    if (checkin && checkout && overlapsBusy(feed.busy, checkin, checkout)) setCheckout("");
    if (checkin && feed.busy.has(checkin)) { setCheckin(""); setCheckout(""); }
  }, [home, feed.busy.size]);

  const nights = checkin && checkout ? nightsBetween(checkin, checkout) : 0;
  const ready = Boolean(checkin && checkout && nights > 0);
  const offer = ready && home !== "any" ? quote(pricing[home], checkin, checkout) : null;
  const tooShort = Boolean(offer && offer.nights < offer.minNights);
  const overlap = ready && overlapsBusy(feed.busy, checkin, checkout);
  const valid = ready && !tooShort && !overlap;
  const homeName = home === "any" ? tx.any : homes[home].name;
  const datesError = tried && !valid;

  const message = useMemo(() => {
    const lines = [
      tx.greeting,
      `${tx.label.home}: ${homeName}`,
      `${tx.checkin}: ${checkin ? formatDate(checkin, lang, true) : "-"}`,
      `${tx.checkout}: ${checkout ? formatDate(checkout, lang, true) : "-"}`,
      ...(ready ? [`${tx.label.nights}: ${nights}`] : []),
      `${tx.label.guests}: ${guests}`,
      ...(offer ? [`${tx.priceLabel}: €${offer.total}`] : []),
      "",
      tx.thanks,
    ];
    return lines.join("\n");
  }, [tx, homeName, checkin, checkout, nights, guests, ready, lang, offer?.total]);

  const submit = (event: Event) => {
    event.preventDefault();
    setTried(true);
    if (!valid) return;
    track("availability_request_submit", { home: homes[home].name, checkin, checkout, guests, nights, total: offer?.total });
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  };

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(`${tx.subject} · ${homeName}`)}&body=${encodeURIComponent(message)}`;

  return (
    <form className="booking-form booking-form--react" onSubmit={submit} noValidate>
      <fieldset className="home-choice">
        <legend>{tx.home}</legend>
        {(Object.keys(homes) as HomeKey[]).map((key) => (
          <label key={key} className={`home-choice-option home-choice-option--${key}`}>
            <input type="radio" name="home" value={homes[key].name} checked={home === key} onChange={() => setHome(key)} />
            <span className="home-choice-name">{homes[key].nameKey ? t(homes[key].nameKey!, lang) : homes[key].name}</span>
            <span className="home-choice-detail">{t(homes[key].detailKey, lang)}</span>
          </label>
        ))}
      </fieldset>

      <div className="booking-dates">
        <p className="booking-dates-step" aria-live="polite">
          {feed.status === "loading" ? tx.loading : !checkin ? tx.pickCheckin : !checkout ? tx.pickCheckout : `${formatDate(checkin, lang)} → ${formatDate(checkout, lang)} · ${tx.nights(nights)}`}
        </p>
        {today && (
          <AvailabilityCalendar
            busy={feed.busy}
            checkin={checkin}
            checkout={checkout}
            today={today}
            lang={lang}
            onChange={(a, b) => { setCheckin(a); setCheckout(b); setTried(false); }}
          />
        )}
        {feed.status === "error" && <p className="booking-cal-note">{tx.calError}</p>}
        {feed.demo && <p className="booking-cal-note is-demo">{tx.demo}</p>}
        {pricingIsDemo && !feed.demo && <p className="booking-cal-note is-demo">{tx.demo}</p>}
      </div>

      <div className="guests-field">
        <span id="booking-guests-label">{tx.guests}</span>
        <div className="guests-stepper" role="group" aria-labelledby="booking-guests-label">
          <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1} aria-label={tx.less}>−</button>
          <output aria-live="polite">{guests}</output>
          <button type="button" onClick={() => setGuests((g) => Math.min(max, g + 1))} disabled={guests >= max} aria-label={tx.more}>+</button>
        </div>
        {guests >= max && home !== "any" && <small className="guests-note">{tx.capacity(max)}</small>}
      </div>

      <div className="booking-quote" aria-live="polite">
        {overlap && <p className="is-error">{tx.overlap}</p>}
        {tooShort && offer && <p className="is-error">{tx.minNights(offer.minNights)}</p>}
        {tried && !ready && <p className="is-error">{tx.pickDates}</p>}
        {offer && !overlap && (
          <dl>
            {offer.lines.map((l) => (
              <div key={l.nightly}><dt>{tx.perNight(l.nightly, l.count)}</dt><dd>€{l.nightly * l.count}</dd></div>
            ))}
            {offer.discount > 0 && <div><dt>{tx.discount}</dt><dd>−€{offer.discount}</dd></div>}
            {offer.cleaning > 0 && <div><dt>{tx.cleaning}</dt><dd>€{offer.cleaning}</dd></div>}
            <div className="booking-quote-total"><dt>{tx.total}</dt><dd>€{offer.total}</dd></div>
          </dl>
        )}
        {offer && !overlap && <p className="booking-quote-note">{tx.priceNote}</p>}
        {ready && home === "any" && <p className="booking-quote-note">{tx.anyNote}</p>}
      </div>

      <button className="button primary" type="submit" aria-invalid={datesError}>{tx.sendRequest}</button>
      <a className="booking-email" href={mailto} onClick={() => track("availability_request_email", { home: homes[home].name })}>{tx.email}</a>
    </form>
  );
}
