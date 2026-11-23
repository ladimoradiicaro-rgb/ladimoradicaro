import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { labelKeys, filters, galleries, type Category, type HomeId, type Photo } from "../../data/galleries";
import { useLanguage } from "./useLanguage";
import { t } from "../../i18n";

// Masonry photo wall for the gallery pages: filter chips, cards that rise and
// come into focus once their photos are loaded, click opens the site lightbox.

const HEIGHTS = [430, 315, 560, 370, 490, 330, 620, 350, 520, 400, 285, 585];
const COLUMNS: [string, number][] = [
  ["(min-width: 1500px)", 5],
  ["(min-width: 1000px)", 4],
  ["(min-width: 700px)", 3],
  ["(min-width: 440px)", 2],
];

const thumb = (p: Photo) => `/assets/gallery/${p.file}-800.webp`;
const large = (p: Photo) => `/assets/gallery/${p.file}-1600.webp`;

function useColumns() {
  const pick = () => COLUMNS.find(([q]) => window.matchMedia(q).matches)?.[1] ?? 1;
  const [cols, setCols] = useState(3);
  useEffect(() => {
    setCols(pick());
    const lists = COLUMNS.map(([q]) => window.matchMedia(q));
    const onChange = () => setCols(pick());
    lists.forEach((l) => l.addEventListener("change", onChange));
    return () => lists.forEach((l) => l.removeEventListener("change", onChange));
  }, []);
  return cols;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

const preload = (urls: string[]) =>
  Promise.all(urls.map((src) => new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  })));

function Wall({ photos, labelFor }: { photos: Photo[]; labelFor: (c: Category) => string }) {
  const columns = useColumns();
  const [ref, width] = useWidth<HTMLDivElement>();
  const [entered, setEntered] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    let cancelled = false;
    setEntered(false);
    preload(photos.map(thumb)).then(() => {
      if (!cancelled) requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    });
    return () => { cancelled = true; };
  }, [photos]);

  const { cards, height } = useMemo(() => {
    if (!width) return { cards: [], height: 420 };
    const gap = width < 540 ? 14 : width < 900 ? 18 : 24;
    const colWidth = (width - (columns - 1) * gap) / columns;
    const cols = new Array(columns).fill(0);
    const cards = photos.map((photo, i) => {
      const c = cols.indexOf(Math.min(...cols));
      const h = Math.max(190, Math.round((HEIGHTS[i % HEIGHTS.length] / 400) * colWidth));
      const card = { photo, x: c * (colWidth + gap), y: cols[c], w: colWidth, h };
      cols[c] += h + gap;
      return card;
    });
    return { cards, height: Math.max(420, ...cols) };
  }, [photos, width, columns]);

  const open = (photo: Photo) => {
    window.dispatchEvent(new CustomEvent("icaro:open-gallery-image", {
      detail: { images: photos.map((p) => ({ src: large(p), alt: p.alt })), src: large(photo) },
    }));
  };

  return (
    <div ref={ref} className="masonry-grid cinematic-masonry-grid" style={{ height }}>
      {cards.map(({ photo, x, y, w, h }, i) => {
        const shown = entered || reduceMotion;
        const isHover = hovered === photo.file;
        return (
          <button
            key={photo.file}
            type="button"
            className="masonry-card cinematic-masonry-card"
            aria-label={photo.alt}
            onClick={() => open(photo)}
            onMouseEnter={() => setHovered(photo.file)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(photo.file)}
            onBlur={() => setHovered(null)}
            style={{
              width: w,
              height: h,
              opacity: shown ? 1 : 0,
              filter: shown ? "blur(0)" : "blur(18px)",
              transform: `translate3d(${x}px, ${shown ? y : window.innerHeight + 160}px, 0) scale(${isHover ? 0.96 : 1})`,
              transitionDelay: shown ? `${Math.min(i, 24) * 0.055}s` : "0s",
              zIndex: isHover ? 5 : 1,
            }}
          >
            <span className="masonry-card-media" style={{ backgroundImage: `url(${thumb(photo)})` }}>
              <span className="masonry-color-overlay" />
            </span>
            <span className="masonry-card-label">{labelFor(photo.category)}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function MasonryGallery({ home }: { home: HomeId }) {
  const lang = useLanguage();
  const [category, setCategory] = useState<Category | "all">("all");
  const chips = filters[home];
  const photos = useMemo(
    () => (category === "all" ? galleries[home] : galleries[home].filter((p) => p.category === category)),
    [home, category],
  );
  const labelFor = (c: Category) => t(labelKeys[chips.find((chip) => chip.id === c)?.label ?? c], lang);

  return (
    <div className={`masonry-gallery masonry-gallery-${home}`}>
      <div className="masonry-toolbar">
        <div className="masonry-filters" aria-label={t("gallery.filter", lang)}>
          {[{ id: "all" as const, label: "all" as const }, ...chips].map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={chip.id === category ? "is-active" : ""}
              aria-pressed={chip.id === category}
              onClick={() => setCategory(chip.id)}
            >
              {t(labelKeys[chip.label], lang)}
            </button>
          ))}
        </div>
      </div>
      <Wall key={`${home}-${category}`} photos={photos} labelFor={labelFor} />
    </div>
  );
}
