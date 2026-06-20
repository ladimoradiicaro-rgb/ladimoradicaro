const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const bookingForm = document.querySelector("[data-booking-form]");
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
    "quick.groupText": "Dimora Verde fino a 7 ospiti, Dimora Blu fino a 4, con limiti adulti dedicati.",
    "homes.eyebrow": "Le due case",
    "homes.title": "Scegli la dimora più adatta al tuo modo di viaggiare.",
    "homes.copy": "La Dimora di Icaro nasce per accogliere famiglie, coppie e piccoli gruppi con una sensazione semplice: arrivare, posare le valigie e trovare una casa vera, curata e pronta.",
    "homes.green.name": "La Dimora Verde",
    "homes.green.meta": "105 mq · fino a 7 ospiti · max 5 adulti",
    "homes.green.title": "La soluzione più grande, ideale per famiglie e gruppi.",
    "homes.green.copy": "Due camere principali, due bagni e un divano letto nella zona giorno: 3 posti letto distinti senza contare il divano come camera.",
    "homes.green.feature1": "Max 7 ospiti",
    "homes.green.feature2": "105 mq",
    "homes.green.feature3": "2 camere",
    "homes.green.feature4": "2 bagni",
    "homes.green.feature5": "2 letti matrimoniali",
    "homes.green.feature6": "1 divano letto",
    "homes.blue.name": "La Dimora Blu",
    "homes.blue.meta": "40 mq · fino a 4 ospiti · max 2 adulti",
    "homes.blue.title": "Più raccolta e pratica, perfetta per coppie o piccoli nuclei.",
    "homes.blue.copy": "Un letto matrimoniale, un divano letto e un bagno: una dimora semplice, luminosa e facile da vivere.",
    "homes.blue.feature1": "Max 4 ospiti",
    "homes.blue.feature2": "40 mq",
    "homes.blue.feature3": "1 camera",
    "homes.blue.feature4": "1 divano letto",
    "homes.blue.feature5": "1 bagno",
    "gallery.green": "La Dimora Verde",
    "gallery.greenEyebrow": "Galleria completa",
    "gallery.blue": "La Dimora Blu",
    "gallery.blueEyebrow": "Galleria completa",
    "gallery.filters.bedrooms": "Camere",
    "gallery.filters.bedroom": "Camera",
    "gallery.filters.bath": "Bagno",
    "gallery.filters.livingKitchen": "Soggiorno e cucina",
    "gallery.filters.living": "Soggiorno",
    "gallery.filters.kitchen": "Cucina",
    "gallery.filters.baths": "Bagni",
    "gallery.filters.outdoor": "Esterni",
    "gallery.rooms.livingLabel": "Zona giorno",
    "gallery.rooms.livingTitle": "Soggiorno, cucina e tavolo da pranzo",
    "gallery.rooms.kitchenLabel": "Cucina",
    "gallery.rooms.kitchenTitle": "Cucina attrezzata e area pranzo",
    "gallery.rooms.doubleLabel": "Camera matrimoniale",
    "gallery.rooms.doubleTitle": "Camera principale",
    "gallery.rooms.singleLabel": "Camera singola",
    "gallery.rooms.singleTitle": "Letto singolo e angolo studio",
    "gallery.rooms.bathsLabel": "Bagni",
    "gallery.rooms.bathsTitle": "Due bagni con doccia e bidet",
    "gallery.rooms.serviceLabel": "Spazi di servizio",
    "gallery.rooms.serviceTitle": "Disimpegno e ripostiglio",
    "gallery.rooms.outdoorLabel": "Esterni",
    "gallery.rooms.outdoorTitle": "Veranda, ingresso e spazi esterni",
    "gallery.rooms.blueCurrentLabel": "Foto disponibili",
    "gallery.rooms.blueCurrentTitle": "Camera ed esterni condivisi",
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
    "location.seaTitle": "Spiaggia di Capaci a 8 minuti",
    "location.seaText": "Il mare di Capaci si raggiunge in circa 8 minuti in auto, ideale per giornate semplici tra spiaggia e rientro comodo.",
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
    "direct.b1.text": "Risposte dirette da chi gestisce la casa, senza passaggi inutili.",
    "direct.b2.title": "Disponibilità più chiare",
    "direct.b2.text": "Ti aiutiamo a verificare date, ospiti e durata del soggiorno.",
    "direct.b3.title": "Scelta della dimora",
    "direct.b3.text": "Supporto per capire se è meglio Dimora Verde o Dimora Blu.",
    "direct.b4.title": "Dettagli prima dell'arrivo",
    "direct.b4.text": "Informazioni precise su posizione, servizi e organizzazione.",
    "direct.b5.title": "Sconti personalizzati",
    "direct.b5.text": "Per soggiorni più lunghi o richieste particolari possiamo valutare soluzioni dedicate.",
    "faq.eyebrow": "Domande rapide",
    "faq.title": "Le risposte che aiutano a prenotare con serenità.",
    "faq.q1": "Quale dimora devo scegliere?",
    "faq.a1": "La Dimora Verde è più grande, 105 mq e fino a 7 ospiti, con massimo 5 adulti. La Dimora Blu è più raccolta, 40 mq e fino a 4 ospiti, con massimo 2 adulti.",
    "faq.q2": "Quanto dista l'aeroporto?",
    "faq.a2": "L'aeroporto Falcone Borsellino dista circa 12 minuti in auto.",
    "faq.q3": "La stazione è vicina?",
    "faq.a3": "Sì, la stazione più vicina si trova a circa 600 metri dalla dimora.",
    "faq.q4": "Come verifico la disponibilità?",
    "faq.a4": "Consulta il calendario nella sezione Prenota: le date con eventi risultano occupate. Per confermare, puoi scriverci dal form o da WhatsApp.",
    "faq.q5": "La casa è adatta a famiglie con bambini?",
    "faq.a5": "Sì, le dimore sono pensate per soggiorni familiari. È disponibile una culla su richiesta e consigliamo di indicare eventuali esigenze prima dell'arrivo.",
    "faq.q6": "Serve l'auto durante il soggiorno?",
    "faq.a6": "L'auto è consigliata per muoversi con massima libertà tra mare, aeroporto e dintorni. La stazione più vicina resta raggiungibile anche a piedi.",
    "faq.q7": "Come funziona il check-in?",
    "faq.a7": "Il check-in è disponibile dalle 15:00. Prima dell'arrivo riceverai le indicazioni necessarie per organizzare ingresso, orari e dettagli pratici.",
    "faq.q8": "Sono possibili affitti transitori?",
    "faq.a8": "Dal 16 settembre al 15 giugno è possibile affittare le dimore anche ad uso transitorio, con contratto di 9 mesi.",
    "booking.eyebrow": "Prenota o chiedi informazioni",
    "booking.title": "Raccontaci quando vorresti arrivare.",
    "booking.copy": "Scrivici per disponibilità, dettagli sulle due dimore e condizioni di soggiorno. Puoi contattarci direttamente o aprire i nostri canali ufficiali.",
    "booking.home": "Dimora",
    "booking.homeAny": "Da valutare insieme",
    "booking.checkin": "Check-in",
    "booking.checkout": "Check-out",
    "booking.guests": "Ospiti",
    "booking.checkoutError": "Il check-out deve essere successivo al check-in.",
    "booking.transitoryNote": "Dal 16 settembre al 15 giugno è possibile affittare le dimore anche ad uso transitorio, con contratto di 9 mesi.",
    "booking.availabilityLabel": "Disponibilità",
    "booking.availabilityEmpty": "Calendari iCal pronti per il collegamento. Puoi usare due calendari separati oppure un solo calendario con eventi nominati La Dimora Verde e La Dimora Blu.",
    "booking.availabilityStep1": "Crea due calendari Google separati, oppure un unico calendario dedicato.",
    "booking.availabilityStep2": "Aggiungi eventi solo nei giorni non disponibili, indicando Verde o Blu nel titolo.",
    "booking.availabilityStep3": "Copia i link iCal e impostali nei feed del sito.",
    "booking.availabilityLoading": "Caricamento disponibilità...",
    "booking.availabilityOpen": "Disponibile",
    "booking.availabilityBusy": "Occupato",
    "booking.availabilityGreen": "Verde non disponibile",
    "booking.availabilityBlue": "Blu non disponibile",
    "booking.availabilityBoth": "Entrambe non disponibili",
    "booking.availabilityError": "Calendario non raggiungibile. Contattaci per verificare le date.",
    "booking.availabilitySource": "Aggiornato da Google Calendar",
    "booking.availabilityWindow": "Prossimi mesi",
    "booking.availabilityEmbed": "Calendario ufficiale",
    "booking.channels": "Canali ufficiali",
    "booking.channelsCopy": "Scegli dove prenotare o contattaci via social.",
    "links.booking": "Prenota su Booking",
    "links.bookingText": "Canale esterno",
    "links.airbnbGreen": "Prenota Dimora Verde",
    "links.airbnbBlue": "Prenota Dimora Blu",
    "links.greenText": "Fino a 7 ospiti · max 5 adulti",
    "links.blueText": "Fino a 4 ospiti · max 2 adulti",
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
    "quick.groupText": "Dimora Verde up to 7 guests, Dimora Blu up to 4, with dedicated adult limits.",
    "homes.eyebrow": "The two homes",
    "homes.title": "Choose the home that fits your way of traveling.",
    "homes.copy": "La Dimora di Icaro welcomes families, couples and small groups with a simple feeling: arrive, leave your bags and find a real, cared-for home ready for you.",
    "homes.green.name": "La Dimora Verde",
    "homes.green.meta": "105 sqm · up to 7 guests · max 5 adults",
    "homes.green.title": "The larger home, ideal for families and groups.",
    "homes.green.copy": "Two main bedrooms, two bathrooms and a sofa bed in the living area: 3 separate sleeping options without counting the sofa as a bedroom.",
    "homes.green.feature1": "Max 7 guests",
    "homes.green.feature2": "105 sqm",
    "homes.green.feature3": "2 bedrooms",
    "homes.green.feature4": "2 bathrooms",
    "homes.green.feature5": "2 double beds",
    "homes.green.feature6": "1 sofa bed",
    "homes.blue.name": "La Dimora Blu",
    "homes.blue.meta": "40 sqm · up to 4 guests · max 2 adults",
    "homes.blue.title": "A more intimate and practical home, perfect for couples or small groups.",
    "homes.blue.copy": "One double bed, one sofa bed and one bathroom: a simple, bright home that is easy to live in.",
    "homes.blue.feature1": "Max 4 guests",
    "homes.blue.feature2": "40 sqm",
    "homes.blue.feature3": "1 bedroom",
    "homes.blue.feature4": "1 sofa bed",
    "homes.blue.feature5": "1 bathroom",
    "gallery.green": "La Dimora Verde",
    "gallery.greenEyebrow": "Full gallery",
    "gallery.blue": "La Dimora Blu",
    "gallery.blueEyebrow": "Full gallery",
    "gallery.filters.bedrooms": "Bedrooms",
    "gallery.filters.bedroom": "Bedroom",
    "gallery.filters.bath": "Bathroom",
    "gallery.filters.livingKitchen": "Living room & kitchen",
    "gallery.filters.living": "Living room",
    "gallery.filters.kitchen": "Kitchen",
    "gallery.filters.baths": "Bathrooms",
    "gallery.filters.outdoor": "Outdoor",
    "gallery.rooms.livingLabel": "Living area",
    "gallery.rooms.livingTitle": "Sofa, kitchen and dining table",
    "gallery.rooms.kitchenLabel": "Kitchen",
    "gallery.rooms.kitchenTitle": "Equipped kitchen and dining area",
    "gallery.rooms.doubleLabel": "Double bedroom",
    "gallery.rooms.doubleTitle": "Main bedroom",
    "gallery.rooms.singleLabel": "Single bedroom",
    "gallery.rooms.singleTitle": "Single bed and desk corner",
    "gallery.rooms.bathsLabel": "Bathrooms",
    "gallery.rooms.bathsTitle": "Two bathrooms with shower and bidet",
    "gallery.rooms.serviceLabel": "Service spaces",
    "gallery.rooms.serviceTitle": "Service spaces",
    "gallery.rooms.outdoorLabel": "Outdoor areas",
    "gallery.rooms.outdoorTitle": "Veranda, entrance and garden spaces",
    "gallery.rooms.blueCurrentLabel": "Available photos",
    "gallery.rooms.blueCurrentTitle": "Bedroom and shared outdoor areas",
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
    "location.seaTitle": "Capaci beach in 8 minutes",
    "location.seaText": "Capaci beach is about 8 minutes away by car, ideal for easy seaside days and a comfortable return home.",
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
    "direct.b1.text": "Direct answers from the people who manage the home, with no unnecessary steps.",
    "direct.b2.title": "Clearer availability",
    "direct.b2.text": "We help you check dates, guests and length of stay.",
    "direct.b3.title": "Help choosing",
    "direct.b3.text": "Support to understand whether Dimora Verde or Dimora Blu is better for you.",
    "direct.b4.title": "Details before arrival",
    "direct.b4.text": "Precise information about location, amenities and organization.",
    "direct.b5.title": "Personalized discounts",
    "direct.b5.text": "For longer stays or specific requests, we can evaluate dedicated solutions.",
    "faq.eyebrow": "Quick questions",
    "faq.title": "Answers that help you book with peace of mind.",
    "faq.q1": "Which home should I choose?",
    "faq.a1": "La Dimora Verde is larger, 105 sqm and up to 7 guests, with a maximum of 5 adults. La Dimora Blu is more compact, 40 sqm and up to 4 guests, with a maximum of 2 adults.",
    "faq.q2": "How far is the airport?",
    "faq.a2": "Falcone Borsellino Airport is about 12 minutes away by car.",
    "faq.q3": "Is the station nearby?",
    "faq.a3": "Yes, the nearest station is about 600 meters from the house.",
    "faq.q4": "How do I check availability?",
    "faq.a4": "Check the calendar in the Book section: dates with events are booked. To confirm, you can write to us through the form or WhatsApp.",
    "faq.q5": "Are the homes suitable for families with children?",
    "faq.a5": "Yes, the homes are designed for family stays. A crib is available on request, and we recommend sharing any specific needs before arrival.",
    "faq.q6": "Do I need a car during the stay?",
    "faq.a6": "A car is recommended for maximum freedom between the sea, airport and nearby places. The closest station is still reachable on foot.",
    "faq.q7": "How does check-in work?",
    "faq.a7": "Check-in is available from 3:00 PM. Before arrival you will receive the information needed to organize access, timing and practical details.",
    "faq.q8": "Are medium-term stays possible?",
    "faq.a8": "From September 16 to June 15, the homes can also be rented for temporary stays with a 9-month contract.",
    "booking.eyebrow": "Book or ask for info",
    "booking.title": "Tell us when you would like to arrive.",
    "booking.copy": "Write to us for availability, details about the two homes and stay conditions. You can contact us directly or open our official channels.",
    "booking.home": "Home",
    "booking.homeAny": "Let's choose together",
    "booking.checkin": "Check-in",
    "booking.checkout": "Check-out",
    "booking.guests": "Guests",
    "booking.checkoutError": "Check-out must be after check-in.",
    "booking.transitoryNote": "From September 16 to June 15, the homes can also be rented for temporary stays with a 9-month contract.",
    "booking.availabilityLabel": "Availability",
    "booking.availabilityEmpty": "The iCal calendars are ready to connect. You can use two separate calendars or one dedicated calendar with events named La Dimora Verde and La Dimora Blu.",
    "booking.availabilityStep1": "Create two separate Google Calendars, or one dedicated calendar.",
    "booking.availabilityStep2": "Add events only on unavailable dates, including Verde or Blu in the title.",
    "booking.availabilityStep3": "Copy the iCal links and set them as website feeds.",
    "booking.availabilityLoading": "Loading availability...",
    "booking.availabilityOpen": "Available",
    "booking.availabilityBusy": "Booked",
    "booking.availabilityGreen": "Verde unavailable",
    "booking.availabilityBlue": "Blu unavailable",
    "booking.availabilityBoth": "Both unavailable",
    "booking.availabilityError": "Calendar unavailable. Contact us to check your dates.",
    "booking.availabilitySource": "Updated from Google Calendar",
    "booking.availabilityWindow": "Upcoming months",
    "booking.availabilityEmbed": "Official calendar",
    "booking.channels": "Official channels",
    "booking.channelsCopy": "Choose where to book or contact us via social media.",
    "links.booking": "Book on Booking",
    "links.bookingText": "External channel",
    "links.airbnbGreen": "Book Dimora Verde",
    "links.airbnbBlue": "Book Dimora Blu",
    "links.greenText": "Up to 7 guests · max 5 adults",
    "links.blueText": "Up to 4 guests · max 2 adults",
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

const animateLanguageSwitch = (clickX) => {
  window.clearTimeout(languageAnimationTimer);
  document.body.classList.remove("language-transition");
  languageSwitcher?.classList.remove("is-switching");

  if (languageSwitcher) {
    const rect = languageSwitcher.getBoundingClientRect();
    const x = clickX != null ? clickX - rect.left : rect.width / 2;
    const pct = Math.round((x / rect.width) * 100);
    const drop = document.createElement("span");
    drop.className = "lang-drop";
    drop.style.setProperty("--drop-x", `${pct}%`);
    languageSwitcher.appendChild(drop);
    window.setTimeout(() => drop.remove(), 720);
  }

  requestAnimationFrame(() => {
    document.body.classList.add("language-transition");
    languageSwitcher?.classList.add("is-switching");
  });

  languageAnimationTimer = window.setTimeout(() => {
    document.body.classList.remove("language-transition");
    languageSwitcher?.classList.remove("is-switching");
  }, 1040);
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
  button.addEventListener("click", (e) => {
    const nextLanguage = button.dataset.lang;
    if (nextLanguage === currentLanguage) {
      return;
    }

    animateLanguageSwitch(e.clientX);
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

      if (shouldShow) {
        figure.style.setProperty("--gallery-delay", `${Math.min(visibleIndex, 12) * 26}ms`);
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
