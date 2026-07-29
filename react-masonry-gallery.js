(function () {
  const root = document.getElementById("masonry-gallery-root");
  if (!root || !window.React || !window.ReactDOM) {
    return;
  }

  const e = window.React.createElement;
  const { useEffect, useLayoutEffect, useMemo, useRef, useState } = window.React;

  const text = {
    it: {
      all: "Tutte",
      livingKitchen: "Soggiorno e cucina",
      bedrooms: "Camere",
      bedroom: "Camera",
      baths: "Bagni",
      bath: "Bagno",
      outdoor: "Esterni",
      open: "Apri foto"
    },
    en: {
      all: "All",
      livingKitchen: "Living and kitchen",
      bedrooms: "Bedrooms",
      bedroom: "Bedroom",
      baths: "Bathrooms",
      bath: "Bathroom",
      outdoor: "Outdoor",
      open: "Open photo"
    }
  };

  const heightPattern = [430, 315, 560, 370, 490, 330, 620, 350, 520, 400, 285, 585];
  const makeImage = (category, src, alt) => ({ category, src, alt });
  const enrichItems = (images) => images.map((image, index) => ({
    ...image,
    id: image.src.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, ""),
    img: image.src,
    title: image.alt,
    height: heightPattern[index % heightPattern.length]
  }));

  const galleries = {
    green: {
      name: "La Dimora Verde",
      accent: "green",
      categories: [
        ["living-kitchen", "livingKitchen"],
        ["bedrooms", "bedrooms"],
        ["baths", "baths"],
        ["outdoor", "outdoor"]
      ],
      images: enrichItems([
        makeImage("living-kitchen", "assets/verde-soggiorno-cucina-01.jpeg", "Soggiorno e cucina della Dimora Verde visti dal divano"),
        makeImage("living-kitchen", "assets/verde-soggiorno-cucina-02.jpeg", "Divano, tavolo da pranzo e cucina della Dimora Verde"),
        makeImage("living-kitchen", "assets/verde-soggiorno-cucina-03.jpeg", "Soggiorno con cucina a vista della Dimora Verde"),
        makeImage("living-kitchen", "assets/verde-soggiorno-cucina-04.jpeg", "Zona pranzo e divano della Dimora Verde con luce naturale"),
        makeImage("living-kitchen", "assets/verde-soggiorno-cucina-05.jpeg", "Tavolo da pranzo e cucina attrezzata della Dimora Verde"),
        makeImage("living-kitchen", "assets/verde-soggiorno-cucina-06.jpeg", "Cucina della Dimora Verde con luce dalla finestra"),
        makeImage("living-kitchen", "assets/verde-soggiorno-cucina-07.jpeg", "Cucina attrezzata della Dimora Verde con pensili verdi"),
        makeImage("living-kitchen", "assets/verde-soggiorno-cucina-08.jpeg", "Zona pranzo della Dimora Verde con tavolo e sedie"),
        makeImage("living-kitchen", "assets/verde-soggiorno-cucina-09.jpeg", "Credenza e zona pranzo della Dimora Verde"),
        makeImage("living-kitchen", "assets/verde-soggiorno-cucina-10.jpeg", "Tavolo da pranzo e soggiorno della Dimora Verde"),
        makeImage("living-kitchen", "assets/verde-soggiorno-cucina-12.jpeg", "Dettaglio del tavolo da pranzo e cucina della Dimora Verde"),
        makeImage("living-kitchen", "assets/verde-soggiorno-cucina-13.jpeg", "Passaggio verso la zona soggiorno e cucina della Dimora Verde"),
        makeImage("living-kitchen", "assets/verde-soggiorno-cucina-14.jpeg", "Ingresso alla zona soggiorno e cucina della Dimora Verde"),
        makeImage("bedrooms", "assets/verde-camere-01.jpeg", "Camera singola della Dimora Verde con armadio a ponte azzurro"),
        makeImage("bedrooms", "assets/verde-camere-02.jpeg", "Camera singola della Dimora Verde con letto, finestra e scrivania"),
        makeImage("bedrooms", "assets/verde-camere-03.jpeg", "Letto singolo della Dimora Verde con armadio a ponte"),
        makeImage("bedrooms", "assets/verde-camere-04.jpeg", "Camera singola della Dimora Verde vista verso il corridoio"),
        makeImage("bedrooms", "assets/verde-camere-05.jpeg", "Camera singola della Dimora Verde con letto e arredi azzurri"),
        makeImage("bedrooms", "assets/verde-camere-06.jpeg", "Camera matrimoniale della Dimora Verde con armadio e finestra aperta"),
        makeImage("bedrooms", "assets/verde-camere-07.jpeg", "Camera matrimoniale luminosa della Dimora Verde"),
        makeImage("bedrooms", "assets/verde-camere-08.jpeg", "Letto matrimoniale della Dimora Verde con comodino e decorazioni"),
        makeImage("bedrooms", "assets/verde-camere-09.jpeg", "Camera matrimoniale della Dimora Verde vista dal letto"),
        makeImage("bedrooms", "assets/verde-camere-10.jpeg", "Letto matrimoniale della Dimora Verde con due comodini"),
        makeImage("bedrooms", "assets/verde-camere-11.jpeg", "Divano letto della Dimora Verde preparato per il soggiorno"),
        makeImage("baths", "assets/verde-bagni-01.jpeg", "Bagno della Dimora Verde con doccia, lavabo, wc e bidet"),
        makeImage("baths", "assets/verde-bagni-02.jpeg", "Bagno della Dimora Verde visto dall'ingresso con doccia e sanitari"),
        makeImage("baths", "assets/verde-bagni-03.jpeg", "Secondo bagno della Dimora Verde con doccia e finestra"),
        makeImage("baths", "assets/verde-bagni-04.jpeg", "Bagno della Dimora Verde con lavatrice e mobile lavabo"),
        makeImage("baths", "assets/verde-bagni-05.jpeg", "Secondo bagno della Dimora Verde con wc, bidet e doccia"),
        makeImage("baths", "assets/verde-bagni-06.jpeg", "Mobile lavabo e bidet del secondo bagno della Dimora Verde"),
        makeImage("outdoor", "assets/verde-esterni-03.jpeg", "Spazio esterno della Dimora Verde con zona pavimentata"),
        makeImage("outdoor", "assets/verde-esterni-04.jpeg", "Vista degli esterni della Dimora Verde e dell'ingresso"),
        makeImage("outdoor", "assets/verde-esterni-05.jpeg", "Esterni della Dimora Verde con area all'aperto"),
        makeImage("outdoor", "assets/verde-esterni-06.jpeg", "Dettaglio degli spazi esterni della Dimora Verde")
      ])
    },
    blue: {
      name: "La Dimora Blu",
      accent: "blue",
      categories: [
        ["living-kitchen", "livingKitchen"],
        ["bedrooms", "bedroom"],
        ["baths", "bath"],
        ["outdoor", "outdoor"]
      ],
      images: enrichItems([
        makeImage("living-kitchen", "assets/blu-soggiorno-cucina-01.jpeg", "Cucina e sala da pranzo della Dimora Blu con piano in legno e piastrelle decorate"),
        makeImage("living-kitchen", "assets/blu-soggiorno-cucina-02.jpeg", "Soggiorno della Dimora Blu con parete turchese, divano e tavolo da pranzo"),
        makeImage("living-kitchen", "assets/blu-soggiorno-cucina-03.jpeg", "Vista d'insieme del soggiorno e cucina della Dimora Blu"),
        makeImage("living-kitchen", "assets/blu-soggiorno-cucina-04.jpeg", "Zona divano e tavolo da pranzo della Dimora Blu con porta aperta sul terrazzo"),
        makeImage("living-kitchen", "assets/blu-soggiorno-cucina-05.jpeg", "Tavolo da pranzo della Dimora Blu con vista sulla porta d'ingresso"),
        makeImage("living-kitchen", "assets/blu-soggiorno-cucina-06.jpeg", "Ingresso e zona giorno della Dimora Blu"),
        makeImage("living-kitchen", "assets/blu-soggiorno-cucina-07.jpeg", "Vista laterale della cucina attrezzata della Dimora Blu con luce naturale"),
        makeImage("living-kitchen", "assets/blu-soggiorno-cucina-08.jpeg", "Piano cottura e lavello della cucina della Dimora Blu con parete in maioliche"),
        makeImage("living-kitchen", "assets/blu-soggiorno-cucina-09.jpeg", "Dettaglio della cucina e del piano lavoro della Dimora Blu"),
        makeImage("living-kitchen", "assets/blu-soggiorno-cucina-10.jpeg", "Zona giorno luminosa della Dimora Blu"),
        makeImage("living-kitchen", "assets/blu-soggiorno-cucina-11.jpeg", "Soggiorno e cucina della Dimora Blu con arredi chiari"),
        makeImage("bedrooms", "assets/blu-camere-01.jpeg", "Camera matrimoniale della Dimora Blu con copriletto blu e uscita sul soggiorno"),
        makeImage("bedrooms", "assets/blu-camere-02.jpeg", "Camera della Dimora Blu con armadio a specchio e vista sul soggiorno"),
        makeImage("bedrooms", "assets/blu-camere-03.jpeg", "Letto matrimoniale della Dimora Blu con asciugamani arrotolati e testata in legno"),
        makeImage("bedrooms", "assets/blu-camere-04.jpeg", "Camera della Dimora Blu vista frontalmente con comodini illuminati e finestra"),
        makeImage("bedrooms", "assets/blu-camere-05.jpeg", "Camera della Dimora Blu con parete turchese, climatizzatore e armadio a specchio"),
        makeImage("bedrooms", "assets/blu-camere-06.jpeg", "Armadio a specchio scorrevole della camera della Dimora Blu"),
        makeImage("bedrooms", "assets/blu-camere-07.jpeg", "Dettaglio degli asciugamani arrotolati sul letto blu della Dimora Blu con lampada accesa"),
        makeImage("baths", "assets/blu-bagni-01.jpeg", "Bagno della Dimora Blu con doccia rivestita di maioliche decorate"),
        makeImage("baths", "assets/blu-bagni-02.jpeg", "Bagno della Dimora Blu con wc, bidet e box doccia piastrellato"),
        makeImage("baths", "assets/blu-bagni-03.jpeg", "Lavabo e lavatrice del bagno della Dimora Blu con vista sul soggiorno turchese"),
        makeImage("outdoor", "assets/blu-esterni-01.jpeg", "Terrazzo della Dimora Blu con tavolino e sedie in ferro battuto"),
        makeImage("outdoor", "assets/blu-esterni-02.jpeg", "Ingresso esterno della Dimora Blu con persiane in legno e facciata bianca"),
        makeImage("outdoor", "assets/blu-esterni-03.jpeg", "Pigna di ceramica sul tavolo in mosaico del terrazzo della Dimora Blu")
      ])
    }
  };

  function currentLang() {
    return window.localStorage.getItem("siteLanguage") === "en" ? "en" : "it";
  }

  function useMedia(queries, values, defaultValue) {
    const get = () => {
      if (typeof window === "undefined" || !window.matchMedia) {
        return defaultValue;
      }

      const index = queries.findIndex((query) => window.matchMedia(query).matches);
      return values[index] || defaultValue;
    };

    const [value, setValue] = useState(get);

    useEffect(() => {
      const handler = () => setValue(get());
      const mediaQueries = queries.map((query) => window.matchMedia(query));
      mediaQueries.forEach((query) => query.addEventListener("change", handler));
      return () => mediaQueries.forEach((query) => query.removeEventListener("change", handler));
    }, []);

    return value;
  }

  function useMeasure() {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
      if (!ref.current || typeof ResizeObserver === "undefined") {
        return undefined;
      }

      const observer = new ResizeObserver(([entry]) => {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }, []);

    return [ref, size];
  }

  async function preloadImages(urls) {
    await Promise.all(urls.map((src) => new Promise((resolve) => {
      const image = new Image();
      image.onload = image.onerror = () => resolve();
      image.src = src;
    })));
  }

  function getInitialPosition(item, animateFrom, container) {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return { x: item.x, y: item.y };
    }

    switch (animateFrom) {
      case "top":
        return { x: item.x, y: -220 };
      case "left":
        return { x: -item.w - 80, y: item.y };
      case "right":
        return { x: container.width + 120, y: item.y };
      case "center":
        return { x: container.width / 2 - item.w / 2, y: container.height / 2 - item.h / 2 };
      case "random": {
        const options = ["top", "bottom", "left", "right"];
        return getInitialPosition(item, options[Math.floor(Math.random() * options.length)], container);
      }
      case "bottom":
      default:
        return { x: item.x, y: window.innerHeight + 160 };
    }
  }

  function CinematicMasonryGallery({
    items,
    categoryLabels,
    openImage,
    animateFrom = "bottom",
    blurToFocus = true,
    stagger = 0.055,
    hoverScale = 0.96,
    colorShiftOnHover = true
  }) {
    const columns = useMedia(
      ["(min-width: 1500px)", "(min-width: 1000px)", "(min-width: 700px)", "(min-width: 440px)"],
      [5, 4, 3, 2],
      1
    );
    const [containerRef, size] = useMeasure();
    const [imagesReady, setImagesReady] = useState(false);
    const [entered, setEntered] = useState(false);
    const [hoveredId, setHoveredId] = useState("");
    const token = items.map((item) => item.id).join("|");

    useEffect(() => {
      let isCancelled = false;
      setImagesReady(false);
      setEntered(false);

      preloadImages(items.map((item) => item.img)).then(() => {
        if (!isCancelled) {
          setImagesReady(true);
        }
      });

      return () => {
        isCancelled = true;
      };
    }, [token]);

    const layout = useMemo(() => {
      if (!size.width || !items.length) {
        return { grid: [], containerHeight: 420 };
      }

      const gap = size.width < 540 ? 14 : size.width < 900 ? 18 : 24;
      const colHeights = new Array(columns).fill(0);
      const totalGaps = (columns - 1) * gap;
      const columnWidth = (size.width - totalGaps) / columns;
      const grid = items.map((item) => {
        const column = colHeights.indexOf(Math.min(...colHeights));
        const x = column * (columnWidth + gap);
        const h = Math.max(190, Math.round((item.height / 400) * columnWidth));
        const y = colHeights[column];
        colHeights[column] += h + gap;
        return { ...item, x, y, w: columnWidth, h };
      });

      return {
        grid,
        containerHeight: Math.max(420, Math.max(...colHeights))
      };
    }, [columns, items, size.width]);

    useLayoutEffect(() => {
      if (!imagesReady || !layout.grid.length) {
        return undefined;
      }

      const frame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setEntered(true));
      });

      return () => window.cancelAnimationFrame(frame);
    }, [imagesReady, layout.grid.length, token, columns]);

    return e("div", {
      ref: containerRef,
      className: "masonry-grid cinematic-masonry-grid",
      style: { height: `${layout.containerHeight}px` }
    },
      layout.grid.map((item, index) => {
        const start = getInitialPosition(item, animateFrom, size);
        const isActive = imagesReady && entered;
        const x = isActive ? item.x : start.x;
        const y = isActive ? item.y : start.y;
        const scale = hoveredId === item.id ? hoverScale : 1;
        const transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

        return e("button", {
          key: item.id,
          type: "button",
          className: "masonry-card cinematic-masonry-card",
          style: {
            width: `${item.w}px`,
            height: `${item.h}px`,
            opacity: isActive ? 1 : 0,
            filter: blurToFocus && !isActive ? "blur(18px)" : "blur(0)",
            transform,
            transitionDelay: isActive ? `${Math.min(index, 24) * stagger}s` : "0s",
            zIndex: hoveredId === item.id ? 5 : 1
          },
          onClick: () => openImage(item),
          onMouseEnter: () => setHoveredId(item.id),
          onMouseLeave: () => setHoveredId(""),
          onFocus: () => setHoveredId(item.id),
          onBlur: () => setHoveredId(""),
          "aria-label": item.alt
        },
          e("span", {
            className: "masonry-card-media",
            style: { backgroundImage: `url(${item.img})` }
          },
            colorShiftOnHover ? e("span", { className: "masonry-color-overlay" }) : null
          ),
          e("span", { className: "masonry-card-label" },
            categoryLabels[item.category] || item.title
          )
        );
      })
    );
  }

  function MasonryGalleryPage() {
    const galleryId = root.dataset.galleryHome === "blue" ? "blue" : "green";
    const gallery = galleries[galleryId];
    const [category, setCategory] = useState("all");
    const [lang, setLang] = useState(currentLang);
    const copy = text[lang] || text.it;

    useEffect(() => {
      const updateLanguage = () => window.setTimeout(() => setLang(currentLang()), 80);
      const handleClick = (event) => {
        if (event.target.closest("[data-lang]")) {
          updateLanguage();
        }
      };

      document.addEventListener("click", handleClick);
      window.addEventListener("storage", updateLanguage);
      return () => {
        document.removeEventListener("click", handleClick);
        window.removeEventListener("storage", updateLanguage);
      };
    }, []);

    const filteredImages = useMemo(() => {
      if (category === "all") {
        return gallery.images;
      }

      return gallery.images.filter((image) => image.category === category);
    }, [category, gallery.images]);

    const categoryButtons = [["all", "all"], ...gallery.categories];
    const categoryLabels = gallery.categories.reduce((labels, [id, label]) => {
      labels[id] = copy[label];
      return labels;
    }, {});

    const openImage = (image) => {
      window.dispatchEvent(new CustomEvent("icaro:open-gallery-image", {
        detail: {
          images: filteredImages.map((item) => ({ src: item.src, alt: item.alt })),
          src: image.src
        }
      }));
    };

    return e("div", { className: `masonry-gallery masonry-gallery-${gallery.accent}` },
      e("div", { className: "masonry-toolbar" },
        e("div", { className: "masonry-filters", "aria-label": "Filtra foto" },
          categoryButtons.map(([id, label]) =>
            e("button", {
              key: id,
              type: "button",
              className: id === category ? "is-active" : "",
              onClick: () => setCategory(id),
              "aria-pressed": id === category
            }, copy[label])
          )
        )
      ),
      e(CinematicMasonryGallery, {
        key: `${galleryId}-${category}`,
        items: filteredImages,
        categoryLabels,
        openImage,
        animateFrom: "bottom",
        blurToFocus: true,
        stagger: 0.055,
        hoverScale: 0.96,
        colorShiftOnHover: true
      })
    );
  }

  if (window.ReactDOM.createRoot) {
    window.ReactDOM.createRoot(root).render(e(MasonryGalleryPage));
  } else {
    window.ReactDOM.render(e(MasonryGalleryPage), root);
  }
}());
