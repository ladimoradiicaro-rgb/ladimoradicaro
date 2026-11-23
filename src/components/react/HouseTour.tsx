import { useEffect, useRef, useState } from "react";
import { tours, type TourData } from "../../data/tour";
import { useLanguage } from "./useLanguage";
import { registerDict, t, type Dict, type Lang } from "../../i18n/island";

/* Scroll-driven walkthrough of the two homes.
   Each tour is a tall track with a full-screen sticky stage. Scrolling stacks the
   photos like cards: each one holds, then the next slides up and covers it while the
   one underneath dims and drifts up. Nothing zooms.
   React renders the structure and the room captions; the per-frame painting writes
   styles straight to the DOM through refs so the cards move in lockstep with Lenis.
   A tour with lead N reserves N photo-lengths at the start for its intro (the big
   logo that blurs away), exposed to CSS as --intro (0 → 1). */

const HOLD = 0.3; // share of each photo's stretch where it simply stays on screen
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const pad = (n: number) => String(n).padStart(2, "0");
const src = (file: string, w: 1280 | 1920) => `/assets/tour/${file}-${w}.webp`;

type Lenis = {
  on: (event: "scroll", cb: () => void) => () => void;
  scrollTo: (target: number, opts?: Record<string, unknown>) => void;
};
declare global {
  interface Window { lenis?: Lenis }
}

interface Track {
  data: TourData;
  el: HTMLDivElement;
  shots: HTMLElement[];
  images: HTMLImageElement[];
  segs: HTMLElement[];
  roomStart: number[];
  roomLength: number[];
  units: number;
  frame: number;
  room: number;
  setRoom: (room: number) => void;
}

function metrics(t: Track) {
  const rect = t.el.getBoundingClientRect();
  const total = Math.max(1, t.el.offsetHeight - window.innerHeight);
  return {
    top: rect.top + window.scrollY,
    total,
    progress: clamp(-rect.top / total, 0, 1),
    visible: rect.bottom > 0 && rect.top < window.innerHeight,
  };
}

/** Moves data-src/data-srcset into place the first time a photo is needed. */
function loadImage(img?: HTMLImageElement) {
  if (!img || img.getAttribute("src") || !img.dataset.src) return;
  if (img.dataset.srcset) img.srcset = img.dataset.srcset;
  img.src = img.dataset.src;
}

function paint(t: Track, index: number, slide: number) {
  t.shots.forEach((shot, i) => {
    let visible = false, y = 0, dim = 0, radius = 0;
    if (i === index) {
      visible = true;
      y = -slide * 7; // drifts up a little as it gets covered
      dim = slide * 0.6; // and darkens underneath
    } else if (i === index + 1) {
      visible = slide > 0;
      y = (1 - slide) * 100; // next card rises from the bottom
      radius = (1 - slide) * 28;
    } else if (i > index + 1) {
      y = 100;
    }
    shot.style.visibility = visible ? "visible" : "hidden";
    shot.style.transform = `translate3d(0, ${y.toFixed(3)}%, 0)`;
    shot.style.setProperty("--dim", dim.toFixed(3));
    shot.style.setProperty("--r", `${radius.toFixed(1)}px`);
    shot.classList.toggle("is-incoming", i === index + 1 && slide > 0 && slide < 1);
  });
}

function Tour({ data, lang, register }: { data: TourData; lang: Lang; register: (track: Track | null) => void }) {
  const [room, setRoom] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const first = data.id === "green";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const roomCount = data.rooms.length;
    const roomStart = data.rooms.map((_, r) => data.shots.findIndex((s) => s.room === r));
    const roomLength = roomStart.map((start, r) => (r + 1 < roomCount ? roomStart[r + 1] : data.shots.length) - start);
    register({
      data,
      el,
      shots: Array.from(el.querySelectorAll<HTMLElement>(".tour-shot")),
      images: Array.from(el.querySelectorAll<HTMLImageElement>(".tour-shot img")),
      segs: Array.from(el.querySelectorAll<HTMLElement>(".tour-progress i")),
      roomStart,
      roomLength,
      units: data.shots.length + data.lead,
      frame: -1,
      room: 0,
      setRoom,
    });
    return () => register(null);
  }, [data, register]);

  const openPhoto = (index: number) => {
    window.dispatchEvent(new CustomEvent("icaro:open-gallery-image", {
      detail: {
        images: data.shots.map((s) => ({ src: src(s.file, 1920), alt: s.alt })),
        src: src(data.shots[index].file, 1920),
      },
    }));
  };

  return (
    <div
      ref={ref}
      className={`tour ${data.className}`}
      id={data.anchor}
      data-tour
      data-tour-lead={data.lead}
      style={{ "--frames": data.frames } as Record<string, string | number>}
    >
      <div className="tour-stage">
        <div className="tour-frame">
          <div className="tour-shots">
            {data.shots.map((shot, i) => {
              // Every photo sits full-screen in the stage, so the browser would treat all of
              // them as visible and download all 33 at once. Only the first two get a src;
              // the rest load a few frames ahead of the scroll (see loadImage()).
              const eager = first && i < 2;
              const media = {
                src: src(shot.file, 1920),
                srcSet: `${src(shot.file, 1280)} 1280w, ${src(shot.file, 1920)} 1920w`,
              };
              return (
                <figure
                  className="tour-shot"
                  key={shot.file}
                  style={{ zIndex: i + 1 }}
                  tabIndex={0}
                  role="button"
                  aria-label={shot.alt}
                  onClick={() => openPhoto(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openPhoto(i);
                    }
                  }}
                >
                  <img
                    {...(eager ? media : { "data-src": media.src, "data-srcset": media.srcSet })}
                    sizes="(orientation: portrait) 150vh, 100vw"
                    alt={shot.alt}
                    decoding="async"
                    {...(first && i === 0 ? { fetchPriority: "high" as const } : {})}
                  />
                </figure>
              );
            })}
          </div>
          <div className="tour-veil" aria-hidden="true"></div>
          {first ? (
            <div className="tour-logo" aria-hidden="true">
              <img src="/assets/logo-site-web.webp" alt="" fetchPriority="high" />
            </div>
          ) : (
            <div className="tour-logo tour-chapter" aria-hidden="true">
              <img src="/assets/titoli/dimora-blu.webp" alt="" loading="lazy" />
            </div>
          )}
          <header className="tour-head">
            <span className="tour-count"><b>{pad(room + 1)}</b> / {pad(data.rooms.length)}</span>
          </header>
          <div className="tour-progress" aria-hidden="true">
            {data.rooms.map((r, i) => <i key={r.key} className={i < room ? "is-done" : undefined}><b></b></i>)}
          </div>
          <div className="tour-captions">
            {data.rooms.map((r, i) => (
              <article key={r.key} className={`tour-caption${i === room ? " is-active" : ""}`}>
                <p className="tour-kicker"><span>{t(data.nameKey, lang)}</span></p>
                <h3 data-title={r.key}>{t(r.key, lang)}</h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HouseTour({ dict, lang: initial = "it" }: { dict: Dict; lang?: Lang }) {
  registerDict(dict);
  const lang = useLanguage(initial);
  const tracks = useRef<(Track | null)[]>([]);
  const registers = useRef(tours.map((_, i) => (track: Track | null) => { tracks.current[i] = track; }));

  useEffect(() => {
    const section = document.getElementById("tour");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      const list = tracks.current.filter((t): t is Track => Boolean(t));
      if (!list.length) return;

      // The floating WhatsApp button stays away until the whole tour is behind us.
      if (section) document.body.classList.toggle("in-tour", section.getBoundingClientRect().bottom > window.innerHeight * 0.6);

      // Only the opening logo hides the header — computed even when the first tour is off
      // screen, so jumping away from the logo (menu link, skip) always brings it back.
      const opening = list[0];
      if (opening.data.lead) {
        const raw = metrics(opening).progress * opening.units;
        document.body.classList.toggle("tour-intro", raw < opening.data.lead * 0.85);
      }

      list.forEach((t) => {
        const { progress, visible } = metrics(t);
        if (!visible && t.frame !== -1) return;
        const lead = t.data.lead;
        const count = t.shots.length;
        const rawAll = progress * t.units;
        const raw = Math.max(0, rawAll - lead);
        if (lead) t.el.style.setProperty("--intro", clamp(rawAll / lead, 0, 1).toFixed(4));

        const index = Math.min(count - 1, Math.floor(raw));
        if (index !== t.frame) t.frame = index;
        // Load this photo and the next three, but only once the tour is near the screen.
        const rect = t.el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.5 && rect.bottom > -window.innerHeight * 0.5) {
          for (let i = index; i <= index + 3 && i < count; i += 1) loadImage(t.images[i]);
        }

        const local = clamp(raw - index, 0, 1);
        const slide = index < count - 1 ? ease(clamp((local - HOLD) / (1 - HOLD), 0, 1)) : 0;
        paint(t, index, slide);

        const room = t.data.shots[slide > 0.5 ? index + 1 : index].room;
        if (room !== t.room) {
          t.room = room;
          t.setRoom(room);
        }

        t.segs.forEach((seg, r) => {
          seg.style.setProperty("--seg", clamp((raw - t.roomStart[r]) / t.roomLength[r], 0, 1).toFixed(4));
        });

        // Captions and HUD arrive once the intro (logo) has mostly blurred away.
        t.el.classList.toggle("is-started", lead ? rawAll > lead * 0.8 : progress > 0.01);
      });
    };

    // Gentle settle: when scrolling stops with a card half-way, finish (or undo) the move.
    let idle = 0;
    const settle = () => {
      const lenis = window.lenis;
      if (!lenis) return;
      tracks.current.forEach((t) => {
        if (!t) return;
        const { top, total, progress, visible } = metrics(t);
        if (!visible || progress <= 0 || progress >= 1) return;
        const lead = t.data.lead;
        const toY = (unit: number) => top + ((unit + lead) / t.units) * total;
        const raw = progress * t.units - lead;
        const out = (x: number) => 1 - Math.pow(1 - x, 3);
        if (raw < 0) {
          // Stopped half-way through the logo blur: finish it or go back to the logo.
          const intro = (raw + lead) / lead;
          if (intro > 0.04 && intro < 0.96) lenis.scrollTo(toY(intro > 0.5 ? 0.02 : -lead), { duration: 0.9, easing: out });
          return;
        }
        const index = Math.floor(raw);
        const local = raw - index;
        if (local <= HOLD + 0.03 || local >= 0.985 || index >= t.shots.length - 1) return;
        const slide = (local - HOLD) / (1 - HOLD);
        lenis.scrollTo(toY(slide > 0.45 ? index + 1.02 : index + HOLD * 0.5), { duration: 0.75, easing: out });
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; update(); });
    };

    // Lenis (from motion.js) may start before or after this island hydrates.
    let offLenis: (() => void) | undefined;
    let waitTimer = 0;
    const attachLenis = () => {
      const lenis = window.lenis;
      if (!lenis || offLenis) return Boolean(lenis);
      const offUpdate = lenis.on("scroll", update);
      const offSettle = reduceMotion ? () => {} : lenis.on("scroll", () => {
        window.clearTimeout(idle);
        idle = window.setTimeout(settle, 180);
      });
      offLenis = () => { offUpdate?.(); offSettle?.(); };
      window.removeEventListener("scroll", onScroll);
      return true;
    };

    if (!attachLenis()) {
      window.addEventListener("scroll", onScroll, { passive: true });
      let tries = 0;
      waitTimer = window.setInterval(() => {
        if (attachLenis() || ++tries > 40) window.clearInterval(waitTimer);
      }, 50);
    }
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      offLenis?.();
      window.clearInterval(waitTimer);
      window.clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {tours.map((data, i) => (
        <Tour key={data.id} data={data} lang={lang} register={registers.current[i]} />
      ))}
    </>
  );
}
