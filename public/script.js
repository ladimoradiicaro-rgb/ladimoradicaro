const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const langButtons = document.querySelectorAll("[data-lang]");
const languageSwitcher = document.querySelector("[data-language-switcher]");
const floatingWhatsapp = document.querySelector("[data-floating-whatsapp]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const cookieBanner = document.querySelector("[data-cookie-banner]");
const cookieAccept = document.querySelector("[data-cookie-accept]");
const reviewMarquee = document.querySelector(".review-marquee");
let reviewPauseTimer;

const contacts = {
  email: "ladimoradiicaro@gmail.com",
  whatsapp: "393493608146",
  phone: "+393470395338"
};

const defaultWhatsappMessage = "Ciao, vorrei avere informazioni sulla disponibilità de La Dimora di Icaro.";

// IT/EN strings live in src/i18n/*.json and arrive here through /i18n.js.
const translations = window.ICARO_I18N || { it: {}, en: {} };

// The page is served in its own language (/ = IT, /en/ = EN).
let currentLanguage = document.documentElement.lang === "en" ? "en" : "it";
let activeLightboxImages = [];
let activeLightboxIndex = 0;
let languageAnimationTimer;

const getTranslation = (key) => translations[currentLanguage]?.[key] || translations.it[key] || "";

const encodeWhatsapp = (message) => `https://wa.me/${contacts.whatsapp}?text=${encodeURIComponent(message)}`;

const trackEvent = (action, params = {}) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: action, ...params });
  }
};

window.trackEvent = trackEvent;

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  toggle?.setAttribute("aria-expanded", "false");
  toggle?.setAttribute("aria-label", currentLanguage === "en" ? "Open menu" : "Apri menu");
};

const applyLanguage = (language) => {
  currentLanguage = translations[language] ? language : "it";
  // The preference is stored only when the visitor presses IT/EN (see langButtons).
  window.dispatchEvent(new CustomEvent("icaro:language", { detail: currentLanguage }));
  document.documentElement.lang = currentLanguage;
  languageSwitcher?.classList.toggle("is-en", currentLanguage === "en");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const text = getTranslation(element.dataset.i18n);
    if (text) {
      element.textContent = text;
    }
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  const menuIsOpen = document.body.classList.contains("menu-open");
  toggle?.setAttribute("aria-label", menuIsOpen
    ? (currentLanguage === "en" ? "Close menu" : "Chiudi menu")
    : (currentLanguage === "en" ? "Open menu" : "Apri menu"));
};

const animateLanguageSwitch = () => {
  // Short text fade on the page (motion-system.css); the thumb slides on its own.
  window.clearTimeout(languageAnimationTimer);
  document.body.classList.remove("language-transition");
  requestAnimationFrame(() => document.body.classList.add("language-transition"));
  languageAnimationTimer = window.setTimeout(() => {
    document.body.classList.remove("language-transition");
  }, 220);
};

const openLightbox = (images, index) => {
  if (!lightbox || !lightboxImage) {
    return;
  }

  activeLightboxImages = images;
  activeLightboxIndex = index;
  const image = activeLightboxImages[activeLightboxIndex];
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt || "Foto La Dimora di Icaro";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  trackEvent("gallery_lightbox_open", { image: image.src });
};

const showLightboxImage = (direction) => {
  if (!activeLightboxImages.length || !lightboxImage) {
    return;
  }

  activeLightboxIndex = (activeLightboxIndex + direction + activeLightboxImages.length) % activeLightboxImages.length;
  const image = activeLightboxImages[activeLightboxIndex];
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt || "Foto La Dimora di Icaro";
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = "";
};

window.addEventListener("icaro:open-gallery-image", (event) => {
  const images = Array.isArray(event.detail?.images) ? event.detail.images : [];
  const src = event.detail?.src;
  const normalizedImages = images
    .map((image) => ({
      src: image.src,
      currentSrc: image.src,
      alt: image.alt || "Foto La Dimora di Icaro"
    }))
    .filter((image) => image.src);
  const index = Math.max(0, normalizedImages.findIndex((image) => image.src === src));

  if (normalizedImages.length) {
    activeLightboxImages = normalizedImages;
    activeLightboxIndex = index;
    if (lightboxImage && lightbox) {
      lightboxImage.src = normalizedImages[index].src;
      lightboxImage.alt = normalizedImages[index].alt;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
    }
  }
});

updateHeader();
applyLanguage(currentLanguage);

floatingWhatsapp?.setAttribute("href", encodeWhatsapp(defaultWhatsappMessage));

if (cookieBanner && localStorage.getItem("cookieNoticeAccepted") !== "true") {
  cookieBanner.hidden = false;
}

window.addEventListener("scroll", updateHeader, { passive: true });

toggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen
    ? (currentLanguage === "en" ? "Close menu" : "Chiudi menu")
    : (currentLanguage === "en" ? "Open menu" : "Apri menu"));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

langButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const nextLanguage = button.dataset.lang;
    if (nextLanguage === currentLanguage) {
      return;
    }

    // Pages with an English version: go to it (real URL, indexable). Others: switch in place.
    const alternate = document.querySelector(`link[rel="alternate"][hreflang="${nextLanguage}"]`);
    if (alternate) {
      localStorage.setItem("siteLanguage", nextLanguage);
      trackEvent("language_change", { language: nextLanguage });
      window.location.href = new URL(alternate.href).pathname + window.location.hash;
      return;
    }

    animateLanguageSwitch();
    closeMenu();
    applyLanguage(nextLanguage);
    trackEvent("language_change", { language: currentLanguage });
  });
});

cookieAccept?.addEventListener("click", () => {
  localStorage.setItem("cookieNoticeAccepted", "true");
  cookieBanner?.setAttribute("hidden", "");
  trackEvent("cookie_notice_accept");
});

// Home preselection and the availability request live in the BookingForm island.

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => {
    trackEvent(element.dataset.track, {
      href: element.getAttribute("href") || "",
      label: element.getAttribute("aria-label") || element.textContent.trim()
    });
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => showLightboxImage(-1));
lightboxNext?.addEventListener("click", () => showLightboxImage(1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

const pauseReviewMarquee = () => {
  if (!reviewMarquee) return;
  window.clearTimeout(reviewPauseTimer);
  reviewMarquee.classList.add("is-paused");
};

const resumeReviewMarqueeSoon = () => {
  if (!reviewMarquee) return;
  window.clearTimeout(reviewPauseTimer);
  reviewPauseTimer = window.setTimeout(() => {
    reviewMarquee.classList.remove("is-paused");
  }, 2600);
};

reviewMarquee?.addEventListener("touchstart", pauseReviewMarquee, { passive: true });
reviewMarquee?.addEventListener("touchend", resumeReviewMarqueeSoon);
reviewMarquee?.addEventListener("touchcancel", resumeReviewMarqueeSoon);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeMenu();
  }

  if (lightbox?.classList.contains("is-open") && event.key === "ArrowLeft") {
    showLightboxImage(-1);
  }

  if (lightbox?.classList.contains("is-open") && event.key === "ArrowRight") {
    showLightboxImage(1);
  }
});
