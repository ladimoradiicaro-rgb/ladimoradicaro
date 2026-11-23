const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const galleries = document.querySelectorAll("[data-gallery]");
const langButtons = document.querySelectorAll("[data-lang]");
const languageSwitcher = document.querySelector("[data-language-switcher]");
const floatingWhatsapp = document.querySelector("[data-floating-whatsapp]");
const availabilityPanel = document.querySelector("[data-availability-panel]");
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

// Availability can use two Google Calendar iCal feeds.
// Set window.availabilityGreenIcalUrl and window.availabilityBlueIcalUrl before this script,
// or set window.availabilityCalendars to an array of { id, label, icalUrl } objects.
// If a single iCal feed is used, event titles containing "Verde" or "Blu"
// are mapped to the corresponding color in the custom calendar.
const availabilityIcalUrl = window.availabilityIcalUrl || "https://calendar.google.com/calendar/ical/ladimoradiicaro%40gmail.com/public/basic.ics";
const availabilityGreenIcalUrl = window.availabilityGreenIcalUrl || availabilityIcalUrl;
const availabilityBlueIcalUrl = window.availabilityBlueIcalUrl || "https://calendar.google.com/calendar/ical/afc21817f8d166526e2efcdc924042c82c63875be0e2eca1222e4b26436f852a%40group.calendar.google.com/public/basic.ics";
const availabilityProxyUrl = window.availabilityProxyUrl || "";
const availabilityFallbackProxyUrl = window.availabilityFallbackProxyUrl || "https://api.allorigins.win/raw?url=";
const availabilityGreenEmbedSrc = window.availabilityGreenEmbedSrc || "ladimoradiicaro@gmail.com";
const availabilityBlueEmbedSrc = window.availabilityBlueEmbedSrc || "afc21817f8d166526e2efcdc924042c82c63875be0e2eca1222e4b26436f852a@group.calendar.google.com";
const buildAvailabilityEmbedUrl = () => {
  const embedCalendars = Array.isArray(window.availabilityEmbedCalendars)
    ? window.availabilityEmbedCalendars
    : [
      availabilityGreenEmbedSrc && { src: availabilityGreenEmbedSrc, color: "#65916f" },
      availabilityBlueEmbedSrc && { src: availabilityBlueEmbedSrc, color: "#077cbd" }
    ].filter(Boolean);

  if (!embedCalendars.length) {
    return "https://calendar.google.com/calendar/embed?src=ladimoradiicaro%40gmail.com&ctz=Europe%2FRome&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0";
  }

  const params = new URLSearchParams({
    ctz: "Europe/Rome",
    mode: "MONTH",
    showTitle: "0",
    showNav: "1",
    showDate: "1",
    showPrint: "0",
    showTabs: "0",
    showCalendars: "0",
    showTz: "0"
  });

  embedCalendars.forEach((calendar) => {
    params.append("src", calendar.src);
    params.append("color", calendar.color || "#077cbd");
  });

  return `https://calendar.google.com/calendar/embed?${params.toString()}`;
};
const availabilityEmbedUrl = window.availabilityEmbedUrl || buildAvailabilityEmbedUrl();
const defaultAvailabilityCalendars = [
  {
    id: "green",
    label: "La Dimora Verde",
    labelKey: "booking.availabilityGreen",
    icalUrl: availabilityGreenIcalUrl
  },
  {
    id: "blue",
    label: "La Dimora Blu",
    labelKey: "booking.availabilityBlue",
    icalUrl: availabilityBlueIcalUrl
  }
];
const availabilityCalendars = Array.isArray(window.availabilityCalendars)
  ? window.availabilityCalendars
  : defaultAvailabilityCalendars;

const defaultWhatsappMessage = "Ciao, vorrei avere informazioni sulla disponibilità de La Dimora di Icaro.";

// IT/EN strings live in src/i18n/*.json and arrive here through /i18n.js.
const translations = window.ICARO_I18N || { it: {}, en: {} };

let currentLanguage = localStorage.getItem("siteLanguage") || "it";
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
  localStorage.setItem("siteLanguage", currentLanguage);
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

const parseIcalDate = (value = "") => {
  const cleanValue = value.trim();
  const dateOnly = cleanValue.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (dateOnly) {
    return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  }

  const dateTime = cleanValue.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  if (dateTime) {
    return new Date(
      Number(dateTime[1]),
      Number(dateTime[2]) - 1,
      Number(dateTime[3]),
      Number(dateTime[4]),
      Number(dateTime[5]),
      Number(dateTime[6])
    );
  }

  return null;
};

const formatDateKey = (date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, "0"),
  String(date.getDate()).padStart(2, "0")
].join("-");

const expandBusyDates = (events) => {
  const busyDates = new Set();

  events.forEach(({ start, end }) => {
    if (!start) {
      return;
    }

    const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const finalDate = end
      ? new Date(end.getFullYear(), end.getMonth(), end.getDate())
      : new Date(current);

    if (!end || finalDate <= current) {
      busyDates.add(formatDateKey(current));
      return;
    }

    while (current < finalDate) {
      busyDates.add(formatDateKey(current));
      current.setDate(current.getDate() + 1);
    }
  });

  return busyDates;
};

const cleanIcalText = (value = "") => value
  .replace(/\\n/g, " ")
  .replace(/\\,/g, ",")
  .replace(/\\;/g, ";")
  .replace(/\\\\/g, "\\")
  .trim();

const parseIcalEvents = (text) => {
  const unfolded = text
    .replace(/\r\n[ \t]/g, "")
    .replace(/\n[ \t]/g, "")
    .split(/\r?\n/);
  const events = [];
  let currentEvent = null;

  unfolded.forEach((line) => {
    if (line === "BEGIN:VEVENT") {
      currentEvent = {};
      return;
    }

    if (line === "END:VEVENT") {
      if (currentEvent?.start) {
        events.push(currentEvent);
      }
      currentEvent = null;
      return;
    }

    if (!currentEvent) {
      return;
    }

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      return;
    }

    const property = line.slice(0, separatorIndex).split(";")[0];
    const value = line.slice(separatorIndex + 1);

    if (property === "SUMMARY") {
      currentEvent.summary = cleanIcalText(value);
    }

    if (property === "DESCRIPTION") {
      currentEvent.description = cleanIcalText(value);
    }

    if (property === "CATEGORIES") {
      currentEvent.categories = cleanIcalText(value);
    }

    if (property === "DTSTART") {
      currentEvent.start = parseIcalDate(value);
    }

    if (property === "DTEND") {
      currentEvent.end = parseIcalDate(value);
    }
  });

  return events;
};

const inferAvailabilityCalendarId = (event, fallbackId) => {
  const text = [
    event.summary,
    event.description,
    event.categories
  ].filter(Boolean).join(" ").toLowerCase();

  if (/\bblu\b|dimora blu|la dimora blu/.test(text)) {
    return "blue";
  }

  if (/\bverde\b|dimora verde|la dimora verde/.test(text)) {
    return "green";
  }

  return fallbackId;
};

const configuredAvailabilityCalendars = () => availabilityCalendars
  .map((calendar) => ({
    id: calendar.id || "calendar",
    label: calendar.labelKey ? getTranslation(calendar.labelKey) : (calendar.label || calendar.id || ""),
    icalUrl: calendar.icalUrl || calendar.url || "",
    proxyUrl: calendar.proxyUrl || availabilityProxyUrl
  }))
  .filter((calendar) => calendar.icalUrl || calendar.proxyUrl);

const getAvailabilityFeedUrls = (calendar) => {
  if (calendar.proxyUrl && calendar.icalUrl) {
    const separator = calendar.proxyUrl.includes("?") ? "&" : "?";
    return [`${calendar.proxyUrl}${separator}url=${encodeURIComponent(calendar.icalUrl)}`];
  }

  const urls = [];

  if (calendar.proxyUrl) {
    urls.push(calendar.proxyUrl);
  }

  if (calendar.icalUrl) {
    urls.push(calendar.icalUrl);
  }

  if (calendar.icalUrl && availabilityFallbackProxyUrl) {
    urls.push(`${availabilityFallbackProxyUrl}${encodeURIComponent(calendar.icalUrl)}`);
  }

  return urls;
};

const renderAvailabilityFallback = () => {
  if (!availabilityPanel) {
    return;
  }

  availabilityPanel.innerHTML = `
    <span>${getTranslation("booking.availabilityLabel")}</span>
    <div class="availability-empty">
      <div class="availability-headline">
        <strong>${getTranslation("booking.availabilityWindow")}</strong>
        <small>${getTranslation("booking.availabilitySource")}</small>
      </div>
      <p>${getTranslation("booking.availabilityEmpty")}</p>
      <ol>
        <li>${getTranslation("booking.availabilityStep1")}</li>
        <li>${getTranslation("booking.availabilityStep2")}</li>
        <li>${getTranslation("booking.availabilityStep3")}</li>
      </ol>
    </div>
  `;
};

const addBusyDate = (busyDatesByDay, dateKey, calendarId) => {
  if (!busyDatesByDay.has(dateKey)) {
    busyDatesByDay.set(dateKey, new Set());
  }

  busyDatesByDay.get(dateKey).add(calendarId);
};

const renderAvailabilityMonths = (busyDatesByDay) => {
  if (!availabilityPanel) {
    return;
  }

  const today = new Date();
  const monthFormatter = new Intl.DateTimeFormat(currentLanguage === "en" ? "en-GB" : "it-IT", {
    month: "long",
    year: "numeric"
  });
  const dayFormatter = new Intl.DateTimeFormat(currentLanguage === "en" ? "en-GB" : "it-IT", {
    weekday: "short"
  });
  const weekStart = new Date(2026, 5, 15);
  const weekdays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return dayFormatter.format(date).replace(".", "");
  });

  const months = Array.from({ length: 2 }, (_, monthOffset) => {
    const monthStart = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const firstDayOffset = (monthStart.getDay() + 6) % 7;
    const gridStart = new Date(monthStart);
    gridStart.setDate(monthStart.getDate() - firstDayOffset);

    const cells = Array.from({ length: 42 }, (_, dayOffset) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + dayOffset);
      const isCurrentMonth = date.getMonth() === monthStart.getMonth();
      const key = formatDateKey(date);
      const busyCalendars = busyDatesByDay.get(key) || new Set();
      const isGreenBusy = busyCalendars.has("green");
      const isBlueBusy = busyCalendars.has("blue");
      const isBusy = busyCalendars.size > 0;
      const status = isGreenBusy && isBlueBusy
        ? getTranslation("booking.availabilityBoth")
        : isGreenBusy
          ? getTranslation("booking.availabilityGreen")
          : isBlueBusy
            ? getTranslation("booking.availabilityBlue")
            : getTranslation("booking.availabilityOpen");
      const busyClass = isGreenBusy && isBlueBusy
        ? "is-busy-both"
        : isGreenBusy
          ? "is-busy-green"
          : isBlueBusy
            ? "is-busy-blue"
            : "";

      return `
        <time class="${isCurrentMonth ? "" : "is-muted"} ${isBusy ? `is-busy ${busyClass}` : "is-open"}" datetime="${key}" title="${status}">
          <b>${date.getDate()}</b>
          <span>${status}</span>
        </time>
      `;
    }).join("");

    return `
      <article class="availability-month">
        <h3>${monthFormatter.format(monthStart)}</h3>
        <div class="availability-weekdays">${weekdays.map((day) => `<span>${day}</span>`).join("")}</div>
        <div class="availability-days">${cells}</div>
      </article>
    `;
  }).join("");

  availabilityPanel.innerHTML = `
    <div class="availability-topline">
      <span>${getTranslation("booking.availabilityLabel")}</span>
      <small>${getTranslation("booking.availabilitySource")}</small>
    </div>
    <div class="availability-summary">
      <strong>${getTranslation("booking.availabilityWindow")}</strong>
      <div class="availability-legend">
        <small><i class="is-open"></i>${getTranslation("booking.availabilityOpen")}</small>
        <small><i class="is-busy-green"></i>${getTranslation("booking.availabilityGreen")}</small>
        <small><i class="is-busy-blue"></i>${getTranslation("booking.availabilityBlue")}</small>
        <small><i class="is-busy-both"></i>${getTranslation("booking.availabilityBoth")}</small>
      </div>
    </div>
    <div class="availability-calendar">${months}</div>
  `;
};

const renderAvailabilityEmbed = () => {
  if (!availabilityPanel) {
    return;
  }

  availabilityPanel.innerHTML = `
    <div class="availability-topline">
      <span>${getTranslation("booking.availabilityLabel")}</span>
      <small>${getTranslation("booking.availabilitySource")}</small>
    </div>
    <div class="availability-summary">
      <strong>${getTranslation("booking.availabilityEmbed")}</strong>
      <div class="availability-legend">
        <small><i class="is-busy-green"></i>${getTranslation("booking.availabilityGreen")}</small>
        <small><i class="is-busy-blue"></i>${getTranslation("booking.availabilityBlue")}</small>
      </div>
    </div>
    <div class="availability-embed-shell">
      <iframe title="Calendario disponibilità La Dimora di Icaro" src="${availabilityEmbedUrl}" loading="lazy"></iframe>
    </div>
  `;
};

const fetchIcalText = async (url) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6500);

  try {
    const response = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Calendar request failed with ${response.status}`);
    }

    return await response.text();
  } finally {
    window.clearTimeout(timeout);
  }
};

const setupAvailabilityCalendar = async () => {
  if (!availabilityPanel) {
    return;
  }

  const calendars = configuredAvailabilityCalendars();
  if (!calendars.length) {
    renderAvailabilityFallback();
    return;
  }

  availabilityPanel.innerHTML = `
    <div class="availability-topline">
      <span>${getTranslation("booking.availabilityLabel")}</span>
      <small>${getTranslation("booking.availabilitySource")}</small>
    </div>
    <p>${getTranslation("booking.availabilityLoading")}</p>
  `;

  let lastError;
  const busyDatesByDay = new Map();
  let successfulFeeds = 0;

  for (const calendar of calendars) {
    const feedUrls = getAvailabilityFeedUrls(calendar);

    for (const feedUrl of feedUrls) {
      try {
        const text = await fetchIcalText(feedUrl);
        parseIcalEvents(text).forEach((event) => {
          const calendarId = inferAvailabilityCalendarId(event, calendar.id);
          expandBusyDates([event]).forEach((dateKey) => addBusyDate(busyDatesByDay, dateKey, calendarId));
        });
        successfulFeeds += 1;
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
      }
    }
  }

  if (successfulFeeds > 0) {
    renderAvailabilityMonths(busyDatesByDay);
    return;
  }

  console.warn(lastError);
  renderAvailabilityEmbed();
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
setupAvailabilityCalendar();

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

    animateLanguageSwitch();
    closeMenu();
    applyLanguage(nextLanguage);
    setupAvailabilityCalendar();
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

galleries.forEach((gallery) => {
  const grid = gallery.querySelector(".single-gallery-grid");
  const images = Array.from(gallery.querySelectorAll("img[data-gallery-image]"));
  const filters = Array.from(gallery.querySelectorAll("[data-gallery-filter]"));
  const figures = Array.from(gallery.querySelectorAll("[data-gallery-category]"));
  const categoryByImage = {
    "verde-bagni-01.jpeg": "baths",
    "verde-bagni-02.jpeg": "baths",
    "verde-bagni-03.jpeg": "baths",
    "verde-bagni-04.jpeg": "baths",
    "verde-bagni-05.jpeg": "baths",
    "verde-bagni-06.jpeg": "baths",
    "verde-soggiorno-cucina-01.jpeg": "living-kitchen",
    "verde-soggiorno-cucina-02.jpeg": "living-kitchen",
    "verde-soggiorno-cucina-03.jpeg": "living-kitchen",
    "verde-soggiorno-cucina-04.jpeg": "living-kitchen",
    "verde-soggiorno-cucina-05.jpeg": "living-kitchen",
    "verde-soggiorno-cucina-06.jpeg": "living-kitchen",
    "verde-soggiorno-cucina-07.jpeg": "living-kitchen",
    "verde-soggiorno-cucina-08.jpeg": "living-kitchen",
    "verde-soggiorno-cucina-09.jpeg": "living-kitchen",
    "verde-soggiorno-cucina-10.jpeg": "living-kitchen",
    "verde-soggiorno-cucina-12.jpeg": "living-kitchen",
    "verde-soggiorno-cucina-13.jpeg": "living-kitchen",
    "verde-soggiorno-cucina-14.jpeg": "living-kitchen"
  };

  figures.forEach((figure) => {
    const image = figure.querySelector("img[data-gallery-image], img");
    const fileName = image?.getAttribute("src")?.split("/").pop();

    if (fileName && categoryByImage[fileName]) {
      figure.dataset.galleryCategory = categoryByImage[fileName];
    }
  });

  const categoriesWithImages = new Set(figures.map((figure) => figure.dataset.galleryCategory).filter(Boolean));

  filters.forEach((filter) => {
    const hasImages = categoriesWithImages.has(filter.dataset.galleryFilter);
    filter.hidden = !hasImages;
    filter.setAttribute("aria-hidden", String(!hasImages));
  });

  const visibleFilters = filters.filter((filter) => !filter.hidden);
  const defaultFilter = categoriesWithImages.has(gallery.dataset.galleryDefault)
    ? gallery.dataset.galleryDefault
    : (visibleFilters[0]?.dataset.galleryFilter || "");
  let activeFilter = defaultFilter;

  const visibleImages = () => figures
    .filter((figure) => figure.parentElement === grid && !figure.hidden)
    .map((figure) => figure.querySelector("img[data-gallery-image], img"))
    .filter(Boolean);

  const applyGalleryFilter = (filterValue) => {
    activeFilter = filterValue || defaultFilter;
    gallery.dataset.galleryActive = activeFilter;

    filters.forEach((filter) => {
      const isActive = filter.dataset.galleryFilter === activeFilter;
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });

    let visibleIndex = 0;
    figures.forEach((figure) => {
      const shouldShow = !activeFilter || figure.dataset.galleryCategory === activeFilter;
      figure.classList.toggle("is-hidden", !shouldShow);
      figure.hidden = !shouldShow;
      figure.setAttribute("aria-hidden", String(!shouldShow));
      figure.classList.remove("is-deck-card", "is-deck-extra");

      if (shouldShow) {
        figure.style.setProperty("--gallery-delay", `${Math.min(visibleIndex, 12) * 26}ms`);
        figure.style.setProperty("--deck-index", String(visibleIndex));
        figure.style.setProperty("--deck-x", `${Math.min(visibleIndex, 5) * 4.8}rem`);
        figure.style.setProperty("--deck-y", `${Math.min(visibleIndex, 5) * 1.15}rem`);
        figure.style.setProperty("--deck-rotate", `${(visibleIndex - 2) * 1.8}deg`);
        figure.style.setProperty("--deck-z", String(30 - visibleIndex));
        figure.classList.add(visibleIndex < 6 ? "is-deck-card" : "is-deck-extra");
        figure.classList.remove("is-filtering");
        visibleIndex += 1;
      } else {
        figure.classList.remove("is-filtering");
      }
    });

    if (grid) {
      figures
        .filter((figure) => !figure.hidden)
        .forEach((figure) => {
          window.requestAnimationFrame(() => figure.classList.add("is-filtering"));
        });
    }
  };

  filters.forEach((filter) => {
    filter.addEventListener("click", () => applyGalleryFilter(filter.dataset.galleryFilter || ""));
  });

  applyGalleryFilter(defaultFilter);

  images.forEach((image, index) => {
    image.addEventListener("click", () => {
      const currentImages = visibleImages();
      const currentIndex = currentImages.indexOf(image);
      openLightbox(currentImages.length ? currentImages : images, Math.max(currentIndex, 0));
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

function fitSectionHeadings() {
  const headings = document.querySelectorAll(".section-copy h2, .section-heading h2");
  if (window.innerWidth <= 980) {
    headings.forEach(h2 => { h2.style.fontSize = ""; h2.style.whiteSpace = ""; });
    return;
  }
  headings.forEach(h2 => {
    if (h2.closest("#faq")) { h2.style.fontSize = ""; h2.style.whiteSpace = ""; return; }
    h2.style.fontSize = "";
    h2.style.whiteSpace = "nowrap";
    const available = h2.parentElement.clientWidth;
    if (!available) return;
    const textWidth = h2.scrollWidth;
    if (!textWidth) return;
    const base = parseFloat(getComputedStyle(h2).fontSize);
    h2.style.fontSize = Math.floor(base * available / textWidth) + "px";
  });
}

fitSectionHeadings();
window.addEventListener("resize", fitSectionHeadings);
