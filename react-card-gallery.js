(function () {
  const root = document.getElementById("react-card-gallery-root");
  if (!root || !window.React || !window.ReactDOM) {
    return;
  }

  const e = window.React.createElement;
  const { useEffect, useMemo, useRef, useState } = window.React;

  const galleries = {
    green: {
      title: "La Dimora Verde",
      eyebrow: "Galleria completa",
      accent: "green",
      categories: [
        { id: "living-kitchen", label: "Soggiorno e cucina" },
        { id: "bedrooms", label: "Camere" },
        { id: "baths", label: "Bagni" },
        { id: "outdoor", label: "Esterni" }
      ],
      images: [
        ["living-kitchen", "assets/verde-soggiorno-cucina-01.jpeg", "Soggiorno e cucina della Dimora Verde"],
        ["living-kitchen", "assets/verde-soggiorno-cucina-02.jpeg", "Zona giorno della Dimora Verde"],
        ["living-kitchen", "assets/verde-soggiorno-cucina-08.jpeg", "Tavolo da pranzo della Dimora Verde"],
        ["living-kitchen", "assets/verde-soggiorno-cucina-10.jpeg", "Soggiorno luminoso della Dimora Verde"],
        ["bedrooms", "assets/verde-camere-06.jpeg", "Camera matrimoniale della Dimora Verde"],
        ["bedrooms", "assets/verde-camere-10.jpeg", "Letto matrimoniale della Dimora Verde"],
        ["bedrooms", "assets/verde-camere-01.jpeg", "Camera singola della Dimora Verde"],
        ["baths", "assets/verde-bagni-01.jpeg", "Bagno della Dimora Verde"],
        ["baths", "assets/verde-bagni-03.jpeg", "Secondo bagno della Dimora Verde"],
        ["outdoor", "assets/verde-esterni-04.jpeg", "Ingresso esterno della Dimora Verde"],
        ["outdoor", "assets/verde-esterni-06.jpeg", "Spazi esterni della Dimora Verde"]
      ]
    },
    blue: {
      title: "La Dimora Blu",
      eyebrow: "Galleria completa",
      accent: "blue",
      categories: [
        { id: "living-kitchen", label: "Soggiorno e cucina" },
        { id: "bedrooms", label: "Camera" },
        { id: "baths", label: "Bagno" },
        { id: "outdoor", label: "Esterni" }
      ],
      images: [
        ["living-kitchen", "assets/blu-soggiorno-cucina-01.jpeg", "Cucina e sala da pranzo della Dimora Blu"],
        ["living-kitchen", "assets/blu-soggiorno-cucina-02.jpeg", "Soggiorno della Dimora Blu"],
        ["living-kitchen", "assets/blu-soggiorno-cucina-03.jpeg", "Vista d'insieme della Dimora Blu"],
        ["living-kitchen", "assets/blu-soggiorno-cucina-04.jpeg", "Zona divano della Dimora Blu"],
        ["bedrooms", "assets/blu-camere-01.jpeg", "Camera matrimoniale della Dimora Blu"],
        ["bedrooms", "assets/blu-camere-04.jpeg", "Camera della Dimora Blu"],
        ["bedrooms", "assets/blu-camere-07.jpeg", "Dettaglio letto della Dimora Blu"],
        ["baths", "assets/blu-bagni-01.jpeg", "Bagno della Dimora Blu"],
        ["baths", "assets/blu-bagni-03.jpeg", "Lavabo e lavatrice della Dimora Blu"],
        ["outdoor", "assets/blu-esterni-01.jpeg", "Terrazzo della Dimora Blu"],
        ["outdoor", "assets/blu-esterni-03.jpeg", "Dettaglio terrazzo della Dimora Blu"]
      ]
    }
  };

  function CardSwapGallery() {
    const [home, setHome] = useState("green");
    const [category, setCategory] = useState("living-kitchen");
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const wheelLockRef = useRef(false);
    const gallery = galleries[home];

    const activeImages = useMemo(
      () => gallery.images
        .filter(([imageCategory]) => imageCategory === category)
        .map(([, src, alt]) => ({ src, alt })),
      [gallery, category]
    );

    useEffect(() => {
      setActive(0);
    }, [home, category]);

    useEffect(() => {
      if (paused || activeImages.length < 2) {
        return undefined;
      }

      const timer = window.setInterval(() => {
        setActive((value) => (value + 1) % activeImages.length);
      }, 3600);

      return () => window.clearInterval(timer);
    }, [paused, activeImages.length]);

    const orderedImages = activeImages.map((_, index) => activeImages[(active + index) % activeImages.length]);
    const [touchStartX, setTouchStartX] = useState(null);

    const goToPrevious = () => {
      if (activeImages.length < 2) {
        return;
      }

      setActive((value) => (value - 1 + activeImages.length) % activeImages.length);
    };

    const goToNext = () => {
      if (activeImages.length < 2) {
        return;
      }

      setActive((value) => (value + 1) % activeImages.length);
    };

    const handleWheel = (event) => {
      if (Math.abs(event.deltaX) < 8 && Math.abs(event.deltaY) < 18) {
        return;
      }

      event.preventDefault();
      if (wheelLockRef.current) {
        return;
      }

      wheelLockRef.current = true;
      setPaused(true);
      if (event.deltaX > 0 || event.deltaY > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
      window.setTimeout(() => {
        wheelLockRef.current = false;
        setPaused(false);
      }, 620);
    };

    const handleTouchEnd = (event) => {
      if (touchStartX === null) {
        setPaused(false);
        return;
      }

      const deltaX = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 36) {
        deltaX < 0 ? goToNext() : goToPrevious();
      }
      setTouchStartX(null);
      window.setTimeout(() => setPaused(false), 1200);
    };

    const openImage = (image) => {
      const event = new CustomEvent("icaro:open-gallery-image", {
        detail: {
          images: activeImages,
          src: image.src
        }
      });
      window.dispatchEvent(event);
    };

    return e("div", { className: `react-card-gallery react-card-gallery-${gallery.accent}` },
      e("div", { className: "react-gallery-copy" },
        e("p", { className: "eyebrow" }, gallery.eyebrow),
        e("h2", null, gallery.title),
        e("label", { className: "react-gallery-select-label" },
          e("span", null, "Dimora"),
          e("select", {
            value: home,
            onChange: (event) => {
              setHome(event.target.value);
              setCategory("living-kitchen");
            }
          },
            Object.entries(galleries).map(([id, item]) =>
              e("option", { key: id, value: id }, item.title)
            )
          )
        ),
        e("div", { className: "react-gallery-filters", "aria-label": "Ambienti" },
          gallery.categories.map((item) =>
            e("button", {
              key: item.id,
              type: "button",
              className: item.id === category ? "is-active" : "",
              onClick: () => setCategory(item.id)
            }, item.label)
          )
        )
      ),
      e("div", { className: "react-gallery-visual" },
        e("div", {
          className: "react-card-stage",
          onMouseEnter: () => setPaused(true),
          onMouseLeave: () => setPaused(false),
          onWheel: handleWheel,
          onTouchStart: (event) => {
            setPaused(true);
            setTouchStartX(event.touches[0].clientX);
          },
          onTouchEnd: handleTouchEnd
        },
          orderedImages.slice(0, 5).map((image, index) =>
            e("button", {
              key: `${image.src}-${index}`,
              type: "button",
              className: "swap-card",
              style: {
                "--card-index": index,
                "--card-x": `${index * 2.6}rem`,
                "--card-y": `${index * 0.9}rem`,
                "--card-scale": 1 - index * 0.035,
                "--card-rotate": `${(index - 2) * 1.8}deg`,
                "--card-z": 20 - index
              },
              onClick: () => openImage(image),
              "aria-label": image.alt
            },
              e("img", { src: image.src, alt: image.alt, loading: index === 0 ? "eager" : "lazy" })
            )
          )
        ),
        e("div", { className: "react-gallery-footer" },
          e("div", { className: "react-gallery-controls", "aria-label": "Scorri foto" },
            e("button", { type: "button", onClick: goToPrevious, "aria-label": "Foto precedente" }, "‹"),
            e("button", { type: "button", onClick: goToNext, "aria-label": "Foto successiva" }, "›")
          ),
          e("div", { className: "react-gallery-count" },
            e("strong", null, String(active + 1).padStart(2, "0")),
            e("span", null, `/ ${String(activeImages.length).padStart(2, "0")}`)
          )
        ),
        e("p", { className: "react-gallery-hint" }, "Scorri con mouse, trackpad o swipe")
      )
    );
  }

  window.ReactDOM.createRoot(root).render(e(CardSwapGallery));
}());
