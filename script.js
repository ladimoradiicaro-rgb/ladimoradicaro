const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const bookingForm = document.querySelector("[data-booking-form]");
const carousels = document.querySelectorAll("[data-carousel]");
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

const contacts = {
  email: "ladimoradiicaro@gmail.com",
  whatsappGiovanni: "393493608146",
  phoneRita: "+393470395338"
};

// Set this to a public Google Calendar embed URL when it is ready.
const availabilityCalendarUrl = window.availabilityCalendarUrl || "";

const defaultWhatsappMessage = "Ciao, vorrei avere informazioni sulla disponibilità de La Dimora di Icaro.";

const translations = {
  it: {
    "nav.homes": "Le dimore",
    "nav.location": "Posizione",
    "nav.services": "Servizi",
    "nav.faq": "FAQ",
    "cta.book": "Prenota",
    "cta.check": "Verifica disponibilità",
    "cta.location": "Scopri la posizione",
    "cta.photos": "Vedi foto",
    "cta.ask": "Chiedi disponibilità",
    "cta.request": "Richiedi disponibilità",
    "hero.eyebrow": "Tra Palermo, mare e aeroporto",
    "hero.title": "Due dimore familiari tra Palermo, mare e aeroporto.",
    "hero.cardLabel": "Arrivo semplice",
    "hero.cardText": "Check-in dalle 15:00, casa pronta e collegamenti rapidi.",
    "hero.airportSmall": "dall'aeroporto",
    "hero.stationSmall": "dalla stazione",
    "quick.touristsLabel": "Per turisti",
    "quick.touristsText": "Una base familiare per scoprire Palermo, Carini e la costa.",
    "quick.flyLabel": "Per chi vola",
    "quick.flyText": "A 12 minuti dall'aeroporto, comoda prima o dopo il volo.",
    "quick.groupLabel": "Per ogni gruppo",
    "quick.groupText": "Dimora Verde fino a 6 ospiti, Dimora Blu fino a 4.",
    "homes.eyebrow": "Le due case",
    "homes.title": "Scegli la dimora più adatta al tuo modo di viaggiare.",
    "homes.copy": "La Dimora di Icaro nasce per accogliere famiglie, coppie e piccoli gruppi con una sensazione semplice: arrivare, posare le valigie e trovare una casa vera, curata e pronta.",
    "homes.green.name": "La Dimora Verde",
    "homes.green.meta": "105 mq · fino a 6 ospiti",
    "homes.green.title": "La soluzione più grande, ideale per famiglie e gruppi.",
    "homes.green.copy": "Tre camere, due letti matrimoniali, un divano letto e due bagni: spazio comodo per stare insieme senza rinunciare alla privacy.",
    "homes.green.feature1": "Massimo 6 ospiti",
    "homes.green.feature2": "105 mq",
    "homes.green.feature3": "3 camere",
    "homes.green.feature4": "2 bagni",
    "homes.green.feature5": "2 letti matrimoniali",
    "homes.green.feature6": "1 divano letto",
    "homes.blue.name": "La Dimora Blu",
    "homes.blue.meta": "40 mq · fino a 4 ospiti",
    "homes.blue.title": "Più raccolta e pratica, perfetta per coppie o piccoli nuclei.",
    "homes.blue.copy": "Un letto matrimoniale, un divano letto e un bagno: una dimora semplice, luminosa e facile da vivere.",
    "homes.blue.feature1": "Massimo 4 ospiti",
    "homes.blue.feature2": "40 mq",
    "homes.blue.feature3": "Camera matrimoniale",
    "homes.blue.feature4": "1 divano letto",
    "homes.blue.feature5": "1 bagno",
    "gallery.green": "La Dimora Verde",
    "gallery.blue": "La Dimora Blu",
    "location.routeLabel": "Dal terminal a casa",
    "location.routeTitle": "Aeroporto Falcone Borsellino → La Dimora di Icaro",
    "location.routeTime": "Circa 12 minuti in auto",
    "location.step1Title": "Aeroporto",
    "location.step1Text": "Partenza dal Falcone Borsellino.",
    "location.step2Title": "A29 verso Palermo",
    "location.step2Text": "Percorso diretto e rapido.",
    "location.step3Title": "Uscita Carini",
    "location.step3Text": "Esci a Carini e prosegui verso la dimora.",
    "location.step4Title": "La Dimora",
    "location.step4Text": "Arrivo in Via Strada Statale Est, 157.",
    "location.airportLabel": "Aeroporto",
    "location.airportTitle": "12 minuti",
    "location.airportText": "Dall'aeroporto Falcone Borsellino alla dimora in auto.",
    "location.cityLabel": "Città",
    "location.cityTitle": "Palermo in 20-30 minuti",
    "location.cityText": "In auto, in base al traffico. In treno il centro di Palermo si raggiunge in circa 30 minuti.",
    "location.seaLabel": "Mare",
    "location.seaTitle": "Costa Verde a 5 minuti",
    "location.seaText": "La spiaggia di Villagrazia di Carini è vicina per giornate leggere al mare.",
    "location.stationLabel": "Stazione",
    "location.stationTitle": "A 600 metri",
    "location.stationText": "La stazione più vicina è raggiungibile anche a piedi.",
    "services.eyebrow": "Servizi inclusi",
    "services.title": "Le comodità essenziali per un soggiorno semplice.",
    "services.wifi.title": "Wi-Fi",
    "services.wifi.text": "Connessione presente per lavorare, organizzare il viaggio o rilassarsi.",
    "services.air.title": "Aria condizionata",
    "services.air.text": "Ambienti freschi e piacevoli anche nelle giornate più calde.",
    "services.kitchen.title": "Cucina attrezzata",
    "services.kitchen.text": "Tutto il necessario per colazioni, pranzi semplici e cene in casa.",
    "services.wash.title": "Lavatrice",
    "services.wash.text": "Comoda per soggiorni lunghi, famiglie e viaggi leggeri.",
    "services.tv.title": "Smart TV",
    "services.tv.text": "Per una serata tranquilla dopo mare, visite o viaggio.",
    "services.bath.title": "Doccia e bidet",
    "services.bath.text": "Bagni curati e funzionali, pronti all'arrivo.",
    "services.outdoor.title": "Spazio esterno",
    "services.outdoor.text": "Veranda e aree esterne per vivere la casa anche fuori.",
    "services.parking.title": "Posto auto",
    "services.parking.text": "Parcheggio comodo per chi arriva in macchina o noleggia un'auto.",
    "services.crib.title": "Culla",
    "services.crib.text": "Un aiuto in più per famiglie con bambini piccoli.",
    "services.bbq.title": "Barbecue",
    "services.bbq.text": "Per momenti semplici da vivere insieme all'aperto.",
    "services.linen.title": "Biancheria e asciugamani",
    "services.linen.text": "La casa è preparata per arrivare e sentirsi subito a posto.",
    "services.dog.title": "Cani ammessi",
    "services.dog.text": "Solo con spazio esterno dedicato, da concordare prima del soggiorno.",
    "direct.eyebrow": "Prenotazione diretta",
    "direct.title": "Perché prenotare direttamente dal sito.",
    "direct.copy": "Parli con chi gestisce davvero la casa, chiarisci i dettagli prima dell'arrivo e scegli la dimora più adatta al tuo soggiorno.",
    "direct.b1.title": "Contatto diretto",
    "direct.b1.text": "Risposte da Rita e Giovanni, senza passaggi inutili.",
    "direct.b2.title": "Disponibilità più chiare",
    "direct.b2.text": "Ti aiutiamo a verificare date, ospiti e durata del soggiorno.",
    "direct.b3.title": "Scelta della dimora",
    "direct.b3.text": "Supporto per capire se è meglio Dimora Verde o Dimora Blu.",
    "direct.b4.title": "Dettagli prima dell'arrivo",
    "direct.b4.text": "Informazioni precise su posizione, servizi e organizzazione.",
    "direct.b5.title": "Esigenze particolari",
    "direct.b5.text": "Puoi chiarire richieste specifiche prima di prenotare.",
    "faq.eyebrow": "Domande rapide",
    "faq.title": "Le risposte che aiutano a prenotare con serenità.",
    "faq.q1": "Quale dimora devo scegliere?",
    "faq.a1": "La Dimora Verde è più grande, 105 mq e fino a 6 persone. La Dimora Blu è più raccolta, 40 mq e fino a 4 persone.",
    "faq.q2": "Quanto dista l'aeroporto?",
    "faq.a2": "L'aeroporto Falcone Borsellino dista circa 12 minuti in auto.",
    "faq.q3": "La stazione è vicina?",
    "faq.a3": "Sì, la stazione più vicina si trova a circa 600 metri dalla dimora.",
    "faq.q4": "Come verifico disponibilità e tariffe?",
    "faq.a4": "Puoi usare il form, WhatsApp o i canali Booking e Airbnb. Le tariffe variano in base a periodo, ospiti e durata del soggiorno.",
    "booking.eyebrow": "Prenota o chiedi informazioni",
    "booking.title": "Raccontaci quando vorresti arrivare.",
    "booking.copy": "Scrivici per disponibilità, dettagli sulle due dimore e condizioni di soggiorno. Puoi contattarci direttamente o aprire i nostri canali ufficiali.",
    "booking.home": "Dimora",
    "booking.homeAny": "Da valutare insieme",
    "booking.checkin": "Check-in",
    "booking.checkout": "Check-out",
    "booking.guests": "Ospiti",
    "booking.checkoutError": "Il check-out deve essere successivo al check-in.",
    "booking.rateNote": "Le tariffe variano in base al periodo, al numero di ospiti e alla durata del soggiorno.",
    "booking.availabilityLabel": "Disponibilità",
    "booking.availabilityEmpty": "Contattaci per verificare le date. Il calendario disponibilità potrà essere collegato qui appena sarà disponibile.",
    "booking.channels": "Canali ufficiali",
    "booking.channelsCopy": "Scegli dove prenotare o contattaci via social.",
    "links.booking": "Prenota su Booking",
    "links.bookingText": "Disponibilità e tariffe",
    "links.airbnbGreen": "Prenota Dimora Verde",
    "links.airbnbBlue": "Prenota Dimora Blu",
    "links.greenText": "Fino a 6 ospiti",
    "links.blueText": "Fino a 4 ospiti",
    "footer.booking": "Booking",
    "footer.airbnbGreen": "Airbnb Verde",
    "footer.airbnbBlue": "Airbnb Blu",
    "footer.privacy": "Privacy Policy",
    "footer.cookie": "Cookie Policy",
    "cookie.text": "Cookie tecnici e preferenze locali. Leggi la Cookie Policy.",
    "cookie.accept": "Accetta"
  },
  en: {
    "nav.homes": "Homes",
    "nav.location": "Location",
    "nav.services": "Amenities",
    "nav.faq": "FAQ",
    "cta.book": "Book",
    "cta.check": "Check availability",
    "cta.location": "See location",
    "cta.photos": "View photos",
    "cta.ask": "Ask availability",
    "cta.request": "Request availability",
    "hero.eyebrow": "Between Palermo, the sea and the airport",
    "hero.title": "Two family homes between Palermo, the sea and the airport.",
    "hero.cardLabel": "Easy arrival",
    "hero.cardText": "Check-in from 3:00 PM, the house ready and quick connections.",
    "hero.airportSmall": "from the airport",
    "hero.stationSmall": "from the station",
    "quick.touristsLabel": "For travelers",
    "quick.touristsText": "A family base to discover Palermo, Carini and the coast.",
    "quick.flyLabel": "For flights",
    "quick.flyText": "12 minutes from the airport, convenient before or after your flight.",
    "quick.groupLabel": "For every group",
    "quick.groupText": "Dimora Verde up to 6 guests, Dimora Blu up to 4.",
    "homes.eyebrow": "The two homes",
    "homes.title": "Choose the home that fits your way of traveling.",
    "homes.copy": "La Dimora di Icaro welcomes families, couples and small groups with a simple feeling: arrive, leave your bags and find a real, cared-for home ready for you.",
    "homes.green.name": "La Dimora Verde",
    "homes.green.meta": "105 sqm · up to 6 guests",
    "homes.green.title": "The larger home, ideal for families and groups.",
    "homes.green.copy": "Three bedrooms, two double beds, one sofa bed and two bathrooms: comfortable space to be together with privacy.",
    "homes.green.feature1": "Max 6 guests",
    "homes.green.feature2": "105 sqm",
    "homes.green.feature3": "3 bedrooms",
    "homes.green.feature4": "2 bathrooms",
    "homes.green.feature5": "2 double beds",
    "homes.green.feature6": "1 sofa bed",
    "homes.blue.name": "La Dimora Blu",
    "homes.blue.meta": "40 sqm · up to 4 guests",
    "homes.blue.title": "A more intimate and practical home, perfect for couples or small groups.",
    "homes.blue.copy": "One double bed, one sofa bed and one bathroom: a simple, bright home that is easy to live in.",
    "homes.blue.feature1": "Max 4 guests",
    "homes.blue.feature2": "40 sqm",
    "homes.blue.feature3": "Double bedroom",
    "homes.blue.feature4": "1 sofa bed",
    "homes.blue.feature5": "1 bathroom",
    "gallery.green": "La Dimora Verde",
    "gallery.blue": "La Dimora Blu",
    "location.routeLabel": "From terminal to home",
    "location.routeTitle": "Falcone Borsellino Airport → La Dimora di Icaro",
    "location.routeTime": "About 12 minutes by car",
    "location.step1Title": "Airport",
    "location.step1Text": "Departure from Falcone Borsellino.",
    "location.step2Title": "A29 toward Palermo",
    "location.step2Text": "A direct and quick route.",
    "location.step3Title": "Carini exit",
    "location.step3Text": "Exit at Carini and continue toward the house.",
    "location.step4Title": "La Dimora",
    "location.step4Text": "Arrival at Via Strada Statale Est, 157.",
    "location.airportLabel": "Airport",
    "location.airportTitle": "12 minutes",
    "location.airportText": "From Falcone Borsellino Airport to the house by car.",
    "location.cityLabel": "City",
    "location.cityTitle": "Palermo in 20-30 minutes",
    "location.cityText": "By car, depending on traffic. By train, Palermo city center is about 30 minutes away.",
    "location.seaLabel": "Sea",
    "location.seaTitle": "Costa Verde in 5 minutes",
    "location.seaText": "Villagrazia di Carini beach is close for relaxed days by the sea.",
    "location.stationLabel": "Station",
    "location.stationTitle": "600 meters away",
    "location.stationText": "The nearest station is also reachable on foot.",
    "services.eyebrow": "Included amenities",
    "services.title": "The essential comforts for an easy stay.",
    "services.wifi.title": "Wi-Fi",
    "services.wifi.text": "Connection available for work, planning the trip or relaxing.",
    "services.air.title": "Air conditioning",
    "services.air.text": "Fresh, comfortable rooms even on the warmest days.",
    "services.kitchen.title": "Equipped kitchen",
    "services.kitchen.text": "Everything you need for breakfast, simple lunches and dinners at home.",
    "services.wash.title": "Washing machine",
    "services.wash.text": "Useful for longer stays, families and light travel.",
    "services.tv.title": "Smart TV",
    "services.tv.text": "For a quiet evening after the sea, visits or travel.",
    "services.bath.title": "Shower and bidet",
    "services.bath.text": "Functional, cared-for bathrooms ready for your arrival.",
    "services.outdoor.title": "Outdoor space",
    "services.outdoor.text": "Veranda and outdoor areas to enjoy the house outside too.",
    "services.parking.title": "Parking space",
    "services.parking.text": "Convenient for guests arriving by car or renting one.",
    "services.crib.title": "Crib",
    "services.crib.text": "Extra help for families with small children.",
    "services.bbq.title": "Barbecue",
    "services.bbq.text": "For simple moments to enjoy together outdoors.",
    "services.linen.title": "Linens and towels",
    "services.linen.text": "The house is prepared so you can arrive and feel settled.",
    "services.dog.title": "Dogs allowed",
    "services.dog.text": "Only with dedicated outdoor space, to be agreed before the stay.",
    "direct.eyebrow": "Direct booking",
    "direct.title": "Why book directly from the website.",
    "direct.copy": "You speak with the people who manage the house, clarify details before arrival and choose the best home for your stay.",
    "direct.b1.title": "Direct contact",
    "direct.b1.text": "Answers from Rita and Giovanni, with no unnecessary steps.",
    "direct.b2.title": "Clearer availability",
    "direct.b2.text": "We help you check dates, guests and length of stay.",
    "direct.b3.title": "Help choosing",
    "direct.b3.text": "Support to understand whether Dimora Verde or Dimora Blu is better for you.",
    "direct.b4.title": "Details before arrival",
    "direct.b4.text": "Precise information about location, amenities and organization.",
    "direct.b5.title": "Special needs",
    "direct.b5.text": "You can clarify specific requests before booking.",
    "faq.eyebrow": "Quick questions",
    "faq.title": "Answers that help you book with peace of mind.",
    "faq.q1": "Which home should I choose?",
    "faq.a1": "La Dimora Verde is larger, 105 sqm and up to 6 guests. La Dimora Blu is more compact, 40 sqm and up to 4 guests.",
    "faq.q2": "How far is the airport?",
    "faq.a2": "Falcone Borsellino Airport is about 12 minutes away by car.",
    "faq.q3": "Is the station nearby?",
    "faq.a3": "Yes, the nearest station is about 600 meters from the house.",
    "faq.q4": "How do I check availability and rates?",
    "faq.a4": "You can use the form, WhatsApp or the Booking and Airbnb channels. Rates vary by season, number of guests and length of stay.",
    "booking.eyebrow": "Book or ask for info",
    "booking.title": "Tell us when you would like to arrive.",
    "booking.copy": "Write to us for availability, details about the two homes and stay conditions. You can contact us directly or open our official channels.",
    "booking.home": "Home",
    "booking.homeAny": "Let's choose together",
    "booking.checkin": "Check-in",
    "booking.checkout": "Check-out",
    "booking.guests": "Guests",
    "booking.checkoutError": "Check-out must be after check-in.",
    "booking.rateNote": "Rates vary depending on the period, number of guests and length of stay.",
    "booking.availabilityLabel": "Availability",
    "booking.availabilityEmpty": "Contact us to check your dates. The availability calendar can be connected here as soon as it is available.",
    "booking.channels": "Official channels",
    "booking.channelsCopy": "Choose where to book or contact us via social media.",
    "links.booking": "Book on Booking",
    "links.bookingText": "Availability and rates",
    "links.airbnbGreen": "Book Dimora Verde",
    "links.airbnbBlue": "Book Dimora Blu",
    "links.greenText": "Up to 6 guests",
    "links.blueText": "Up to 4 guests",
    "footer.booking": "Booking",
    "footer.airbnbGreen": "Airbnb Verde",
    "footer.airbnbBlue": "Airbnb Blu",
    "footer.privacy": "Privacy Policy",
    "footer.cookie": "Cookie Policy",
    "cookie.text": "Technical cookies and local preferences. Read the Cookie Policy.",
    "cookie.accept": "Accept"
  }
};

let currentLanguage = localStorage.getItem("siteLanguage") || "it";
let activeLightboxImages = [];
let activeLightboxIndex = 0;
let languageAnimationTimer;

const getTranslation = (key) => translations[currentLanguage]?.[key] || translations.it[key] || "";

const encodeWhatsapp = (message) => `https://wa.me/${contacts.whatsappGiovanni}?text=${encodeURIComponent(message)}`;

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
  window.clearTimeout(languageAnimationTimer);
  document.body.classList.remove("language-transition");
  languageSwitcher?.classList.remove("is-switching");

  requestAnimationFrame(() => {
    document.body.classList.add("language-transition");
    languageSwitcher?.classList.add("is-switching");
  });

  languageAnimationTimer = window.setTimeout(() => {
    document.body.classList.remove("language-transition");
    languageSwitcher?.classList.remove("is-switching");
  }, 620);
};

const setupAvailabilityCalendar = () => {
  if (!availabilityPanel || !availabilityCalendarUrl) {
    return;
  }

  availabilityPanel.innerHTML = `
    <span>${getTranslation("booking.availabilityLabel")}</span>
    <iframe title="Calendario disponibilità La Dimora di Icaro" src="${availabilityCalendarUrl}" loading="lazy"></iframe>
  `;
};

const checkoutInput = bookingForm?.querySelector('input[name="checkout"]');

const setCheckoutError = () => {
  checkoutInput?.setCustomValidity(getTranslation("booking.checkoutError"));
};

const clearCheckoutError = () => {
  checkoutInput?.setCustomValidity("");
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
  button.addEventListener("click", () => {
    const nextLanguage = button.dataset.lang;
    if (nextLanguage === currentLanguage) {
      return;
    }

    animateLanguageSwitch();
    closeMenu();
  applyLanguage(nextLanguage);
  if (checkoutInput?.validationMessage) {
    setCheckoutError();
  }
  setupAvailabilityCalendar();
  trackEvent("language_change", { language: currentLanguage });
  });
});

cookieAccept?.addEventListener("click", () => {
  localStorage.setItem("cookieNoticeAccepted", "true");
  cookieBanner?.setAttribute("hidden", "");
  trackEvent("cookie_notice_accept");
});

document.querySelectorAll("[data-home-request]").forEach((link) => {
  link.addEventListener("click", () => {
    const select = bookingForm?.querySelector('select[name="home"]');
    if (select) {
      select.value = link.dataset.homeRequest;
    }
  });
});

bookingForm?.querySelectorAll('input[name="checkin"], input[name="checkout"]').forEach((input) => {
  input.addEventListener("input", () => {
    clearCheckoutError();
  });
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const home = data.get("home");
  const checkin = data.get("checkin");
  const checkout = data.get("checkout");
  const guests = data.get("guests");

  if (checkin && checkout && String(checkout) <= String(checkin)) {
    checkoutInput?.focus();
    setCheckoutError();
    bookingForm.reportValidity();
    return;
  }

  clearCheckoutError();

  const text = currentLanguage === "en"
    ? [
        "Hello, I would like information about availability at La Dimora di Icaro.",
        `Home: ${home}`,
        `Check-in: ${checkin}`,
        `Check-out: ${checkout}`,
        `Guests: ${guests}`,
        "",
        "Thank you"
      ].join("\n")
    : [
        "Ciao, vorrei avere informazioni sulla disponibilità de La Dimora di Icaro.",
        `Dimora: ${home}`,
        `Check-in: ${checkin}`,
        `Check-out: ${checkout}`,
        `Ospiti: ${guests}`,
        "",
        "Grazie"
      ].join("\n");

  trackEvent("availability_request_submit", { home, checkin, checkout, guests });
  window.open(encodeWhatsapp(text), "_blank", "noopener");
});

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => {
    trackEvent(element.dataset.track, {
      href: element.getAttribute("href") || "",
      label: element.getAttribute("aria-label") || element.textContent.trim()
    });
  });
});

carousels.forEach((carousel) => {
  const images = Array.from(carousel.querySelectorAll(".gallery-frame img"));
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const dots = carousel.querySelector(".gallery-dots");
  let activeIndex = Math.max(0, images.findIndex((image) => image.classList.contains("is-active")));

  images.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.toggle("is-active", index === activeIndex);
    dots?.append(dot);
  });

  const dotItems = Array.from(dots?.querySelectorAll("span") || []);

  const showImage = (index) => {
    activeIndex = (index + images.length) % images.length;
    images.forEach((image, imageIndex) => {
      image.classList.toggle("is-active", imageIndex === activeIndex);
    });
    dotItems.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  };

  prev?.addEventListener("click", () => {
    showImage(activeIndex - 1);
    trackEvent("gallery_previous_click");
  });

  next?.addEventListener("click", () => {
    showImage(activeIndex + 1);
    trackEvent("gallery_next_click");
  });

  images.forEach((image, index) => {
    image.addEventListener("click", () => openLightbox(images, index));
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
