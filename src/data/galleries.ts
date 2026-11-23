// Photos for the two gallery pages. Each file has WebP versions at
// /assets/gallery/<file>-800.webp and -1600.webp (originals stay in /assets/<file>.jpeg).
export type Category = "living-kitchen" | "bedrooms" | "baths" | "outdoor";
export interface Photo { category: Category; file: string; alt: string }
export type HomeId = "green" | "blue";

/** Gallery label keys in src/i18n. */
export const labelKeys = {
  all: "gallery.all",
  "living-kitchen": "gallery.livingKitchen",
  bedrooms: "gallery.bedrooms",
  bedroom: "gallery.bedroom",
  baths: "gallery.baths",
  bath: "gallery.bath",
  outdoor: "gallery.outdoor",
} as const;

/** Filter chips per home: the Blu has one bedroom and one bathroom, so its labels are singular. */
export const filters: Record<HomeId, { id: Category; label: keyof typeof labelKeys }[]> = {
  green: [
    { id: "living-kitchen", label: "living-kitchen" },
    { id: "bedrooms", label: "bedrooms" },
    { id: "baths", label: "baths" },
    { id: "outdoor", label: "outdoor" },
  ],
  blue: [
    { id: "living-kitchen", label: "living-kitchen" },
    { id: "bedrooms", label: "bedroom" },
    { id: "baths", label: "bath" },
    { id: "outdoor", label: "outdoor" },
  ],
};

export const galleries: Record<HomeId, Photo[]> = {
  "green": [
    {
      "category": "living-kitchen",
      "file": "verde-soggiorno-cucina-01",
      "alt": "Soggiorno e cucina della Dimora Verde visti dal divano"
    },
    {
      "category": "living-kitchen",
      "file": "verde-soggiorno-cucina-02",
      "alt": "Divano, tavolo da pranzo e cucina della Dimora Verde"
    },
    {
      "category": "living-kitchen",
      "file": "verde-soggiorno-cucina-03",
      "alt": "Soggiorno con cucina a vista della Dimora Verde"
    },
    {
      "category": "living-kitchen",
      "file": "verde-soggiorno-cucina-04",
      "alt": "Zona pranzo e divano della Dimora Verde con luce naturale"
    },
    {
      "category": "living-kitchen",
      "file": "verde-soggiorno-cucina-05",
      "alt": "Tavolo da pranzo e cucina attrezzata della Dimora Verde"
    },
    {
      "category": "living-kitchen",
      "file": "verde-soggiorno-cucina-06",
      "alt": "Cucina della Dimora Verde con luce dalla finestra"
    },
    {
      "category": "living-kitchen",
      "file": "verde-soggiorno-cucina-07",
      "alt": "Cucina attrezzata della Dimora Verde con pensili verdi"
    },
    {
      "category": "living-kitchen",
      "file": "verde-soggiorno-cucina-08",
      "alt": "Zona pranzo della Dimora Verde con tavolo e sedie"
    },
    {
      "category": "living-kitchen",
      "file": "verde-soggiorno-cucina-09",
      "alt": "Credenza e zona pranzo della Dimora Verde"
    },
    {
      "category": "living-kitchen",
      "file": "verde-soggiorno-cucina-10",
      "alt": "Tavolo da pranzo e soggiorno della Dimora Verde"
    },
    {
      "category": "living-kitchen",
      "file": "verde-soggiorno-cucina-12",
      "alt": "Dettaglio del tavolo da pranzo e cucina della Dimora Verde"
    },
    {
      "category": "living-kitchen",
      "file": "verde-soggiorno-cucina-13",
      "alt": "Passaggio verso la zona soggiorno e cucina della Dimora Verde"
    },
    {
      "category": "living-kitchen",
      "file": "verde-soggiorno-cucina-14",
      "alt": "Ingresso alla zona soggiorno e cucina della Dimora Verde"
    },
    {
      "category": "bedrooms",
      "file": "verde-camere-01",
      "alt": "Camera singola della Dimora Verde con armadio a ponte azzurro"
    },
    {
      "category": "bedrooms",
      "file": "verde-camere-02",
      "alt": "Camera singola della Dimora Verde con letto, finestra e scrivania"
    },
    {
      "category": "bedrooms",
      "file": "verde-camere-03",
      "alt": "Letto singolo della Dimora Verde con armadio a ponte"
    },
    {
      "category": "bedrooms",
      "file": "verde-camere-04",
      "alt": "Camera singola della Dimora Verde vista verso il corridoio"
    },
    {
      "category": "bedrooms",
      "file": "verde-camere-05",
      "alt": "Camera singola della Dimora Verde con letto e arredi azzurri"
    },
    {
      "category": "bedrooms",
      "file": "verde-camere-06",
      "alt": "Camera matrimoniale della Dimora Verde con armadio e finestra aperta"
    },
    {
      "category": "bedrooms",
      "file": "verde-camere-07",
      "alt": "Camera matrimoniale luminosa della Dimora Verde"
    },
    {
      "category": "bedrooms",
      "file": "verde-camere-08",
      "alt": "Letto matrimoniale della Dimora Verde con comodino e decorazioni"
    },
    {
      "category": "bedrooms",
      "file": "verde-camere-09",
      "alt": "Camera matrimoniale della Dimora Verde vista dal letto"
    },
    {
      "category": "bedrooms",
      "file": "verde-camere-10",
      "alt": "Letto matrimoniale della Dimora Verde con due comodini"
    },
    {
      "category": "bedrooms",
      "file": "verde-camere-11",
      "alt": "Divano letto della Dimora Verde preparato per il soggiorno"
    },
    {
      "category": "baths",
      "file": "verde-bagni-01",
      "alt": "Bagno della Dimora Verde con doccia, lavabo, wc e bidet"
    },
    {
      "category": "baths",
      "file": "verde-bagni-02",
      "alt": "Bagno della Dimora Verde visto dall'ingresso con doccia e sanitari"
    },
    {
      "category": "baths",
      "file": "verde-bagni-03",
      "alt": "Secondo bagno della Dimora Verde con doccia e finestra"
    },
    {
      "category": "baths",
      "file": "verde-bagni-04",
      "alt": "Bagno della Dimora Verde con lavatrice e mobile lavabo"
    },
    {
      "category": "baths",
      "file": "verde-bagni-05",
      "alt": "Secondo bagno della Dimora Verde con wc, bidet e doccia"
    },
    {
      "category": "baths",
      "file": "verde-bagni-06",
      "alt": "Mobile lavabo e bidet del secondo bagno della Dimora Verde"
    },
    {
      "category": "outdoor",
      "file": "verde-esterni-03",
      "alt": "Spazio esterno della Dimora Verde con zona pavimentata"
    },
    {
      "category": "outdoor",
      "file": "verde-esterni-04",
      "alt": "Vista degli esterni della Dimora Verde e dell'ingresso"
    },
    {
      "category": "outdoor",
      "file": "verde-esterni-05",
      "alt": "Esterni della Dimora Verde con area all'aperto"
    },
    {
      "category": "outdoor",
      "file": "verde-esterni-06",
      "alt": "Dettaglio degli spazi esterni della Dimora Verde"
    }
  ],
  "blue": [
    {
      "category": "living-kitchen",
      "file": "blu-soggiorno-cucina-01",
      "alt": "Cucina e sala da pranzo della Dimora Blu con piano in legno e piastrelle decorate"
    },
    {
      "category": "living-kitchen",
      "file": "blu-soggiorno-cucina-02",
      "alt": "Soggiorno della Dimora Blu con parete turchese, divano e tavolo da pranzo"
    },
    {
      "category": "living-kitchen",
      "file": "blu-soggiorno-cucina-03",
      "alt": "Vista d'insieme del soggiorno e cucina della Dimora Blu"
    },
    {
      "category": "living-kitchen",
      "file": "blu-soggiorno-cucina-04",
      "alt": "Zona divano e tavolo da pranzo della Dimora Blu con porta aperta sul terrazzo"
    },
    {
      "category": "living-kitchen",
      "file": "blu-soggiorno-cucina-05",
      "alt": "Tavolo da pranzo della Dimora Blu con vista sulla porta d'ingresso"
    },
    {
      "category": "living-kitchen",
      "file": "blu-soggiorno-cucina-06",
      "alt": "Ingresso e zona giorno della Dimora Blu"
    },
    {
      "category": "living-kitchen",
      "file": "blu-soggiorno-cucina-07",
      "alt": "Vista laterale della cucina attrezzata della Dimora Blu con luce naturale"
    },
    {
      "category": "living-kitchen",
      "file": "blu-soggiorno-cucina-08",
      "alt": "Piano cottura e lavello della cucina della Dimora Blu con parete in maioliche"
    },
    {
      "category": "living-kitchen",
      "file": "blu-soggiorno-cucina-09",
      "alt": "Dettaglio della cucina e del piano lavoro della Dimora Blu"
    },
    {
      "category": "living-kitchen",
      "file": "blu-soggiorno-cucina-10",
      "alt": "Zona giorno luminosa della Dimora Blu"
    },
    {
      "category": "living-kitchen",
      "file": "blu-soggiorno-cucina-11",
      "alt": "Soggiorno e cucina della Dimora Blu con arredi chiari"
    },
    {
      "category": "bedrooms",
      "file": "blu-camere-01",
      "alt": "Camera matrimoniale della Dimora Blu con copriletto blu e uscita sul soggiorno"
    },
    {
      "category": "bedrooms",
      "file": "blu-camere-02",
      "alt": "Camera della Dimora Blu con armadio a specchio e vista sul soggiorno"
    },
    {
      "category": "bedrooms",
      "file": "blu-camere-03",
      "alt": "Letto matrimoniale della Dimora Blu con asciugamani arrotolati e testata in legno"
    },
    {
      "category": "bedrooms",
      "file": "blu-camere-04",
      "alt": "Camera della Dimora Blu vista frontalmente con comodini illuminati e finestra"
    },
    {
      "category": "bedrooms",
      "file": "blu-camere-05",
      "alt": "Camera della Dimora Blu con parete turchese, climatizzatore e armadio a specchio"
    },
    {
      "category": "bedrooms",
      "file": "blu-camere-06",
      "alt": "Armadio a specchio scorrevole della camera della Dimora Blu"
    },
    {
      "category": "bedrooms",
      "file": "blu-camere-07",
      "alt": "Dettaglio degli asciugamani arrotolati sul letto blu della Dimora Blu con lampada accesa"
    },
    {
      "category": "baths",
      "file": "blu-bagni-01",
      "alt": "Bagno della Dimora Blu con doccia rivestita di maioliche decorate"
    },
    {
      "category": "baths",
      "file": "blu-bagni-02",
      "alt": "Bagno della Dimora Blu con wc, bidet e box doccia piastrellato"
    },
    {
      "category": "baths",
      "file": "blu-bagni-03",
      "alt": "Lavabo e lavatrice del bagno della Dimora Blu con vista sul soggiorno turchese"
    },
    {
      "category": "outdoor",
      "file": "blu-esterni-01",
      "alt": "Terrazzo della Dimora Blu con tavolino e sedie in ferro battuto"
    },
    {
      "category": "outdoor",
      "file": "blu-esterni-02",
      "alt": "Ingresso esterno della Dimora Blu con persiane in legno e facciata bianca"
    },
    {
      "category": "outdoor",
      "file": "blu-esterni-03",
      "alt": "Pigna di ceramica sul tavolo in mosaico del terrazzo della Dimora Blu"
    }
  ]
};
