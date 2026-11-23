import { useMemo, useState } from "react";
import { addDays, fromIso, nightsOf, toIso } from "../../lib/quote";
import { t, type Lang } from "../../i18n/island";

/* Two-month calendar (one on phones). First click = arrival, second = departure.
   A day marked busy means its NIGHT is taken: it can't be an arrival day, but it can be
   the departure day of a stay whose nights are all free. */

interface Props {
  busy: Set<string>;
  checkin: string;
  checkout: string;
  today: string;
  lang: Lang;
  onChange: (checkin: string, checkout: string) => void;
}

const monthStart = (iso: string) => `${iso.slice(0, 7)}-01`;
const addMonths = (iso: string, n: number) => {
  const d = fromIso(monthStart(iso));
  d.setMonth(d.getMonth() + n);
  return toIso(d);
};

function monthDays(first: string) {
  const d = fromIso(first);
  const lead = (d.getDay() + 6) % 7; // Monday first
  const length = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return { lead, days: Array.from({ length }, (_, i) => addDays(first, i)) };
}

export default function AvailabilityCalendar({ busy, checkin, checkout, today, lang, onChange }: Props) {
  const locale = lang === "en" ? "en-GB" : "it-IT";
  const [view, setView] = useState(() => monthStart(checkin || today));
  const minView = monthStart(today);
  const weekdays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => fromIso(addDays("2024-01-01", i)).toLocaleDateString(locale, { weekday: "narrow" })),
    [locale],
  );

  const pick = (day: string) => {
    const choosingCheckout = checkin && !checkout && day > checkin;
    if (choosingCheckout && !nightsOf(checkin, day).some((n) => busy.has(n))) {
      onChange(checkin, day);
      return;
    }
    if (busy.has(day)) return; // can't arrive on a booked night
    onChange(day, "");
  };

  const months = [view, addMonths(view, 1)];
  const label = (iso: string) => fromIso(iso).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="avail-cal" aria-live="off">
      <div className="avail-cal-nav">
        <button type="button" onClick={() => setView(addMonths(view, -1))} disabled={view <= minView} aria-label={t("booking.cal.prev", lang)}>‹</button>
        <button type="button" onClick={() => setView(addMonths(view, 1))} aria-label={t("booking.cal.next", lang)}>›</button>
      </div>
      <div className="avail-cal-months">
        {months.map((first, mi) => {
          const { lead, days } = monthDays(first);
          return (
            <section key={first} className={`avail-cal-month${mi === 1 ? " avail-cal-month--second" : ""}`}>
              <h4>{fromIso(first).toLocaleDateString(locale, { month: "long", year: "numeric" })}</h4>
              <div className="avail-cal-grid" role="grid">
                {weekdays.map((w, i) => <span key={`w${i}`} className="avail-cal-wd" aria-hidden="true">{w}</span>)}
                {Array.from({ length: lead }, (_, i) => <span key={`l${i}`} />)}
                {days.map((day) => {
                  const past = day < today;
                  const isBusy = busy.has(day);
                  const canCheckout = Boolean(checkin && !checkout && day > checkin && !nightsOf(checkin, day).some((n) => busy.has(n)));
                  const disabled = past || (isBusy && !canCheckout);
                  const inRange = checkin && checkout && day > checkin && day < checkout;
                  const cls = [
                    "avail-cal-day",
                    isBusy && "is-busy",
                    past && "is-past",
                    day === checkin && "is-start",
                    day === checkout && "is-end",
                    inRange && "is-range",
                    day === today && "is-today",
                  ].filter(Boolean).join(" ");
                  return (
                    <button
                      key={day}
                      type="button"
                      className={cls}
                      data-date={day}
                      disabled={disabled}
                      aria-pressed={day === checkin || day === checkout}
                      aria-label={t(isBusy ? "booking.cal.dayBusy" : "booking.cal.dayFree", lang, { date: label(day) })}
                      onClick={() => pick(day)}
                    >
                      {Number(day.slice(8))}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <div className="avail-cal-legend" aria-hidden="true">
        <span><i className="is-free" />{t("booking.cal.free", lang)}</span>
        <span><i className="is-busy" />{t("booking.cal.busy", lang)}</span>
        <span><i className="is-selected" />{t("booking.cal.selected", lang)}</span>
      </div>
    </div>
  );
}
