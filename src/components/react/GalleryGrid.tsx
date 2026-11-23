import { useMemo, useState } from "react";
import { filters, galleries, labelKeys, type Category, type HomeId, type Photo } from "../../data/galleries";
import { t } from "../../i18n";
import { useLanguage } from "./useLanguage";
import "./GalleryGrid.css";

/* Clean photo grid for the gallery pages: room filters on a sticky bar, equal tiles,
   a quiet fade as photos load, click opens the site lightbox on the visible set. */

const small = (p: Photo) => `/assets/gallery/${p.file}-800.webp`;
const large = (p: Photo) => `/assets/gallery/${p.file}-1600.webp`;

export default function GalleryGrid({ home }: { home: HomeId }) {
  const lang = useLanguage();
  const [category, setCategory] = useState<Category | "all">("all");
  const chips = filters[home];
  const photos = useMemo(
    () => (category === "all" ? galleries[home] : galleries[home].filter((p) => p.category === category)),
    [home, category],
  );
  const labelFor = (c: Category) => t(labelKeys[chips.find((chip) => chip.id === c)?.label ?? c], lang);
  const count = (c: Category | "all") => (c === "all" ? galleries[home].length : galleries[home].filter((p) => p.category === c).length);

  const open = (photo: Photo) => {
    window.dispatchEvent(new CustomEvent("icaro:open-gallery-image", {
      detail: { images: photos.map((p) => ({ src: large(p), alt: p.alt })), src: large(photo) },
    }));
  };

  return (
    <div className={`photo-grid-wrap photo-grid-wrap--${home}`}>
      <div className="photo-filters" role="toolbar" aria-label={t("gallery.filter", lang)}>
        {[{ id: "all" as const, label: "all" as const }, ...chips].map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={chip.id === category ? "is-active" : undefined}
            aria-pressed={chip.id === category}
            onClick={() => setCategory(chip.id)}
          >
            {t(labelKeys[chip.label], lang)}
            <span className="photo-filters-count">{count(chip.id)}</span>
          </button>
        ))}
      </div>

      <p className="photo-grid-count" aria-live="polite">{t("gallery.count", lang, { n: photos.length })}</p>

      <ul className="photo-grid" key={category}>
        {photos.map((photo, i) => (
          <li key={photo.file} style={{ "--i": Math.min(i, 12) } as React.CSSProperties}>
            <button type="button" onClick={() => open(photo)} aria-label={photo.alt}>
              <img
                src={small(photo)}
                srcSet={`${small(photo)} 800w, ${large(photo)} 1600w`}
                sizes="(max-width: 560px) 50vw, (max-width: 960px) 33vw, 300px"
                alt={photo.alt}
                loading={i < 8 ? "eager" : "lazy"}
                decoding="async"
                // Photos can finish loading before hydration, when onLoad never fires.
                ref={(el) => { if (el?.complete) el.classList.add("is-loaded"); }}
                onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
              />
              <span className="photo-grid-label">{labelFor(photo.category)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
