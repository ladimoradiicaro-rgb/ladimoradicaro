import { useEffect, useMemo, useState } from "react";
import { useLanguage, type Lang } from "./useLanguage";
import "./BookingForm.css";

/* Availability request: pick the home, the dates and the guests, then send the
   request on WhatsApp (or by email). Guests are capped by each home's capacity;
   "Da valutare insieme" leaves the choice to the hosts. Buttons elsewhere on the
   page with data-home-request="La Dimora Verde|La Dimora Blu" preselect a home. */

type HomeKey = "verde" | "blu" | "any";

const WHATSAPP = "393493608146";
const EMAIL = "ladimoradiicaro@gmail.com";

const homes: Record<HomeKey, { name: string; max: number; detail: Record<Lang, string> }> = {
  verde: { name: "La Dimora Verde", max: 7, detail: { it: "105 mq · fino a 7 ospiti", en: "105 m² · up to 7 guests" } },
  blu: { name: "La Dimora Blu", max: 4, detail: { it: "40 mq · fino a 4 ospiti", en: "40 m² · up to 4 guests" } },
  any: { name: "Da valutare insieme", max: 11, detail: { it: "Vi consigliamo noi", en: "We'll suggest one" } },
};

const copy = {
  it: {
    home: "Dimora",
    any: "Da valutare insieme",
    checkin: "Check-in",
    checkout: "Check-out",
    guests: "Ospiti",
    less: "Un ospite in meno",
    more: "Un ospite in più",
    nights: (n: number) => (n === 1 ? "1 notte" : `${n} notti`),
    pickDates: "Scegli le date",
    checkoutError: "Il check-out deve essere dopo il check-in.",
    capacity: (max: number) => `Massimo ${max} ospiti in questa dimora`,
    send: "Chiedi su WhatsApp",
    email: "Oppure scrivici per email",
    greeting: "Ciao, vorrei avere informazioni sulla disponibilità de La Dimora di Icaro.",
    thanks: "Grazie",
    subject: "Richiesta disponibilità",
    label: { home: "Dimora", nights: "Notti", guests: "Ospiti" },
  },
  en: {
    home: "Home",
    any: "Let's choose together",
    checkin: "Check-in",
    checkout: "Check-out",
    guests: "Guests",
    less: "One guest less",
    more: "One guest more",
    nights: (n: number) => (n === 1 ? "1 night" : `${n} nights`),
    pickDates: "Choose your dates",
    checkoutError: "Check-out must be after check-in.",
    capacity: (max: number) => `Up to ${max} guests in this home`,
    send: "Ask on WhatsApp",
    email: "Or write to us by email",
    greeting: "Hello, I would like information about availability at La Dimora di Icaro.",
    thanks: "Thank you",
    subject: "Availability request",
    label: { home: "Home", nights: "Nights", guests: "Guests" },
  },
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
  const t = copy[lang];
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
  const homeName = home === "any" ? t.any : homes[home].name;

  const message = useMemo(() => {
    const lines = [
      t.greeting,
      `${t.label.home}: ${homeName}`,
      `${t.checkin}: ${checkin ? formatDate(checkin, lang, true) : "-"}`,
      `${t.checkout}: ${checkout ? formatDate(checkout, lang, true) : "-"}`,
      ...(ready ? [`${t.label.nights}: ${nights}`] : []),
      `${t.label.guests}: ${guests}`,
      "",
      t.thanks,
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

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(`${t.subject} · ${homeName}`)}&body=${encodeURIComponent(message)}`;

  return (
    <form className="booking-form booking-form--react" onSubmit={submit} noValidate>
      <fieldset className="home-choice">
        <legend>{t.home}</legend>
        {(Object.keys(homes) as HomeKey[]).map((key) => (
          <label key={key} className={`home-choice-option home-choice-option--${key}`}>
            <input type="radio" name="home" value={homes[key].name} checked={home === key} onChange={() => setHome(key)} />
            <span className="home-choice-name">{key === "any" ? t.any : homes[key].name}</span>
            <span className="home-choice-detail">{homes[key].detail[lang]}</span>
          </label>
        ))}
      </fieldset>

      <label>
        <span>{t.checkin}</span>
        <input type="date" name="checkin" value={checkin} min={today || undefined} required onChange={(e) => onCheckin(e.target.value)} aria-invalid={tried && !checkin} />
      </label>
      <label>
        <span>{t.checkout}</span>
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
        <span id="booking-guests-label">{t.guests}</span>
        <div className="guests-stepper" role="group" aria-labelledby="booking-guests-label">
          <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1} aria-label={t.less}>−</button>
          <output aria-live="polite">{guests}</output>
          <button type="button" onClick={() => setGuests((g) => Math.min(max, g + 1))} disabled={guests >= max} aria-label={t.more}>+</button>
        </div>
        {guests >= max && home !== "any" && <small className="guests-note">{t.capacity(max)}</small>}
      </div>

      <p id="booking-dates-note" className={`booking-summary${datesError || (tried && !ready) ? " is-error" : ""}`} aria-live="polite">
        {datesError
          ? t.checkoutError
          : ready
            ? `${formatDate(checkin, lang)} → ${formatDate(checkout, lang)} · ${t.nights(nights)}`
            : t.pickDates}
      </p>

      <button className="button primary" type="submit">{t.send}</button>
      <a className="booking-email" href={mailto} onClick={() => track("availability_request_email", { home: homes[home].name })}>{t.email}</a>
    </form>
  );
}
