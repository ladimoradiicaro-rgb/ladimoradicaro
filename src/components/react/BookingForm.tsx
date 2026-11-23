import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "./useLanguage";
import { t, type Key, type Lang } from "../../i18n";
import "./BookingForm.css";

/* Availability request: pick the home, the dates and the guests, then send the
   request on WhatsApp (or by email). Guests are capped by each home's capacity;
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
  };
};

const isoDate = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return isoDate(d);
};
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

export default function BookingForm() {
  const lang = useLanguage();
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

  const nights = checkin && checkout ? nightsBetween(checkin, checkout) : 0;
  const datesError = Boolean(checkin && checkout && nights <= 0);
  const ready = Boolean(checkin && checkout && nights > 0);
  const homeName = home === "any" ? tx.any : homes[home].name;

  const message = useMemo(() => {
    const lines = [
      tx.greeting,
      `${tx.label.home}: ${homeName}`,
      `${tx.checkin}: ${checkin ? formatDate(checkin, lang, true) : "-"}`,
      `${tx.checkout}: ${checkout ? formatDate(checkout, lang, true) : "-"}`,
      ...(ready ? [`${tx.label.nights}: ${nights}`] : []),
      `${tx.label.guests}: ${guests}`,
      "",
      tx.thanks,
    ];
    return lines.join("\n");
  }, [t, homeName, checkin, checkout, nights, guests, ready, lang]);

  const onCheckin = (value: string) => {
    setCheckin(value);
    // Keep the stay valid: move check-out to the next day when it would end up before check-in.
    if (value && (!checkout || checkout <= value)) setCheckout(addDays(value, 1));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setTried(true);
    if (!ready) return;
    track("availability_request_submit", { home: homes[home].name, checkin, checkout, guests, nights });
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

      <label>
        <span>{tx.checkin}</span>
        <input type="date" name="checkin" value={checkin} min={today || undefined} required onChange={(e) => onCheckin(e.target.value)} aria-invalid={tried && !checkin} />
      </label>
      <label>
        <span>{tx.checkout}</span>
        <input
          type="date"
          name="checkout"
          value={checkout}
          min={checkin ? addDays(checkin, 1) : today || undefined}
          required
          onChange={(e) => setCheckout(e.target.value)}
          aria-invalid={datesError || (tried && !checkout)}
          aria-describedby="booking-dates-note"
        />
      </label>

      <div className="guests-field">
        <span id="booking-guests-label">{tx.guests}</span>
        <div className="guests-stepper" role="group" aria-labelledby="booking-guests-label">
          <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1} aria-label={tx.less}>−</button>
          <output aria-live="polite">{guests}</output>
          <button type="button" onClick={() => setGuests((g) => Math.min(max, g + 1))} disabled={guests >= max} aria-label={tx.more}>+</button>
        </div>
        {guests >= max && home !== "any" && <small className="guests-note">{tx.capacity(max)}</small>}
      </div>

      <p id="booking-dates-note" className={`booking-summary${datesError || (tried && !ready) ? " is-error" : ""}`} aria-live="polite">
        {datesError
          ? tx.checkoutError
          : ready
            ? `${formatDate(checkin, lang)} → ${formatDate(checkout, lang)} · ${tx.nights(nights)}`
            : tx.pickDates}
      </p>

      <button className="button primary" type="submit">{tx.send}</button>
      <a className="booking-email" href={mailto} onClick={() => track("availability_request_email", { home: homes[home].name })}>{tx.email}</a>
    </form>
  );
}
